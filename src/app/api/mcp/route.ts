import { NextRequest, NextResponse } from 'next/server';
import { verifyMcpAuth, checkMcpRateLimit, sanitizeErrorMessage } from '../../../lib/mcp/auth';
import { MCP_TOOLS } from '../../../lib/mcp/tools';
import { executeMcpTool } from '../../../lib/mcp/handlers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/mcp
 * StreamableHTTP / Server Info probe
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const auth = verifyMcpAuth(authHeader);

  if (!auth.authenticated || !auth.token) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const rateCheck = checkMcpRateLimit(auth.token);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { ok: false, error: 'rate limit exceeded: max 60 requests per minute' },
      { status: 429 }
    );
  }

  return NextResponse.json({
    ok: true,
    data: {
      server: 'EveryAge Digital MCP Server',
      version: '1.0.0',
      transport: 'StreamableHTTP',
      toolsCount: MCP_TOOLS.length
    }
  });
}

/**
 * POST /api/mcp
 * MCP JSON-RPC & StreamableHTTP handler for initialize, tools/list, and tools/call
 */
export async function POST(request: NextRequest) {
  // 1. Bearer Token Authentication
  const authHeader = request.headers.get('authorization');
  const auth = verifyMcpAuth(authHeader);

  if (!auth.authenticated || !auth.token) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  // 2. Sliding Rate Limiter (60 req/min)
  const rateCheck = checkMcpRateLimit(auth.token);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { ok: false, error: 'rate limit exceeded: max 60 requests per minute' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const id = body.id ?? null;
    const method = body.method;
    const params = body.params || {};

    // 3. MCP initialize
    if (method === 'initialize') {
      const initResult = {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {
            listChanged: false
          }
        },
        serverInfo: {
          name: 'everyage-digital-mcp',
          version: '1.0.0'
        }
      };

      return NextResponse.json({
        ok: true,
        data: initResult,
        result: initResult,
        id,
        jsonrpc: '2.0'
      });
    }

    // 4. MCP tools/list
    if (method === 'tools/list' || method === 'list_tools') {
      const listResult = { tools: MCP_TOOLS };
      return NextResponse.json({
        ok: true,
        data: listResult,
        result: listResult,
        id,
        jsonrpc: '2.0'
      });
    }

    // 5. MCP tools/call
    let toolName: string | undefined;
    let toolArgs: unknown = {};

    if (method === 'tools/call') {
      toolName = params.name;
      toolArgs = params.arguments || {};
    } else if (method && MCP_TOOLS.some(t => t.name === method)) {
      // Direct method invocation fallback
      toolName = method;
      toolArgs = params;
    } else if (body.name && MCP_TOOLS.some(t => t.name === body.name)) {
      // Body invocation fallback
      toolName = body.name;
      toolArgs = body.arguments || body.args || {};
    }

    if (!toolName) {
      return NextResponse.json({
        ok: false,
        error: sanitizeErrorMessage(`Unknown or missing MCP method: "${method}"`),
        id,
        jsonrpc: '2.0'
      });
    }

    // 6. Execute tool through validated handlers
    const toolResult = await executeMcpTool(toolName, toolArgs);

    if (!toolResult.ok) {
      return NextResponse.json({
        ok: false,
        error: sanitizeErrorMessage(toolResult.error),
        isError: true,
        content: [{ type: 'text', text: sanitizeErrorMessage(toolResult.error) }],
        result: {
          ok: false,
          error: sanitizeErrorMessage(toolResult.error),
          isError: true
        },
        id,
        jsonrpc: '2.0'
      });
    }

    // 7. Successful Tool Response
    const formattedContent = [{ type: 'text', text: JSON.stringify(toolResult.data, null, 2) }];

    return NextResponse.json({
      ok: true,
      data: toolResult.data,
      content: formattedContent,
      result: {
        ok: true,
        data: toolResult.data,
        content: formattedContent
      },
      id,
      jsonrpc: '2.0'
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal MCP request processing error';
    return NextResponse.json(
      {
        ok: false,
        error: sanitizeErrorMessage(message)
      },
      { status: 500 }
    );
  }
}
