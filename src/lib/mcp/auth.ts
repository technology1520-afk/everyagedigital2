// Authentication, Rate Limiting, and Credential Sanitization for EveryAge Digital MCP Server

export const DEFAULT_MCP_TOKEN = process.env.ADMIN_MCP_TOKEN || 'test-mcp-token-2026-everyage-digital-secret';

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitBucket>();

/**
 * Strips credential-like patterns from error text to prevent secret leakage.
 * Patterns targeted: sk-..., ghp_..., Bearer ..., token=..., key=...
 */
export function sanitizeErrorMessage(errorText: string): string {
  if (!errorText) return errorText;
  return errorText
    .replace(/Bearer\s+[A-Za-z0-9_\-.~+/]+=*/gi, 'Bearer [REDACTED]')
    .replace(/(?:sk|ghp)[_-][A-Za-z0-9_\-.~]+/gi, '[REDACTED]')
    .replace(/(?:token|key|secret)\s*=\s*['"]?[A-Za-z0-9_\-.~]+['"]?/gi, 'token=[REDACTED]');
}

/**
 * Validates the Authorization: Bearer <ADMIN_MCP_TOKEN> header.
 */
export function verifyMcpAuth(authHeader?: string | null): { authenticated: boolean; token?: string; error?: string } {
  if (!authHeader) {
    return { authenticated: false, error: 'unauthorized' };
  }

  const parts = authHeader.trim().split(/\s+/);
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return { authenticated: false, error: 'unauthorized' };
  }

  const token = parts[1];
  const expectedToken = process.env.ADMIN_MCP_TOKEN || DEFAULT_MCP_TOKEN;

  if (token !== expectedToken) {
    return { authenticated: false, error: 'unauthorized' };
  }

  return { authenticated: true, token };
}

/**
 * In-memory sliding rate limiter: max 60 requests per minute per token.
 */
export function checkMcpRateLimit(
  token: string, 
  limit = 60, 
  windowMs = 60_000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const bucket = rateLimitMap.get(token);

  if (!bucket || now > bucket.resetAt) {
    rateLimitMap.set(token, {
      count: 1,
      resetAt: now + windowMs
    });
    return { allowed: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count };
}

/**
 * Resets the in-memory rate limiter (used in test setup).
 */
export function resetMcpRateLimits(): void {
  rateLimitMap.clear();
}
