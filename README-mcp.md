# Model Context Protocol (MCP) Server — EveryAge Digital

> This document details the production-ready Model Context Protocol (MCP) server built into **EveryAge Digital** (`/api/mcp`), enabling external AI agents (such as **Hermes Agent**, **Claude Desktop**, and **Cursor**) to inspect, audit, and manage catalog commerce through native tools.

---

## 1. Overview & Architectural Philosophy

The EveryAge Digital MCP server provides a standardized, secure bridge between autonomous AI agents and the store's operations.

### Single Source of Truth
- **Strict Repository Reuse**: The MCP layer communicates directly with `catalogRepository` and reuses the exact domain Zod schemas used by `/admin`.
- **Zero Direct SQL**: External agents cannot execute arbitrary SQL queries or bypass validation rules.
- **Safety by Design**:
  - **No Delete Tool**: Agents cannot delete catalog items or user data. Soft-delete and archival remain exclusively under owner manual control.
  - **Draft by Default**: `add_product` *always* creates products with status `"draft"`. Products can only be reviewed and published to the live storefront by a human operator in `/admin` (or via explicit `set_product_status` invocation following review).
  - **Credential Masking**: Error outputs automatically scrub credential-like patterns (`sk-...`, `ghp_...`, `Bearer ...`, `token=...`, `key=...`).

---

## 2. Authentication & Rate Limiting

All requests to `/api/mcp` require Bearer token authorization.

### Generate Your MCP Admin Token
Generate a 256-bit cryptographically secure token:
```bash
openssl rand -hex 32
```

Add the generated key to your `.env.local`:
```bash
ADMIN_MCP_TOKEN=e4b7c2938f6158d4a923f145b98dc652018274aefb3294025178639201fba45c
```

### Rate Limiting
- **Quota**: 60 requests per minute per token.
- Exceeding the quota triggers an HTTP `429` status code:
  ```json
  {
    "ok": false,
    "error": "rate limit exceeded: max 60 requests per minute"
  }
  ```

---

## 3. The 8 Native Tools

| Tool | Purpose | Key Parameters |
|---|---|---|
| `list_products` | List catalog items with status and category filtering | `status?: "draft"\|"active"\|"paused"\|"archived"`, `category?: string` |
| `add_product` | Add a vetted product as `draft` (enforces `https://` affiliate URL) | `title`, `description`, `category`, `merchant`, `affiliate_url`, `price_min?`, `price_max?`, `currency?`, `image_url?` |
| `update_product` | Partially update product metadata or pricing | `id`, `title?`, `description?`, `price_min?`, `price_max?`, `image_url?`, `category?` |
| `set_product_status` | Change publishing state (`draft`, `active`, `paused`, `archived`) | `id`, `status` |
| `get_clicks` | Telemetry report: total clicks, daily breakdown, top 10 products | `days?: number` (default: 7) |
| `mark_price_checked` | Record that a product's price was verified at the merchant | `product_id: string` |
| `get_stale_prices` | Retrieve products where `lastCheckedAt + staleAfter < now` | *None* |
| `store_stats` | High-level operations count (never reveals conversation text) | *None* |

---

## 4. Client Integration Guides

### A. Hermes Agent (`~/.hermes/config.yaml`)

Add the EveryAge Digital MCP server to your Hermes Agent configuration:

```yaml
# ~/.hermes/config.yaml
mcp_servers:
  everyage:
    url: "https://your-domain.com/api/mcp"
    headers:
      Authorization: "Bearer <YOUR_ADMIN_MCP_TOKEN>"
    timeout: 120
```

For local testing:
```yaml
mcp_servers:
  everyage:
    url: "http://localhost:3000/api/mcp"
    headers:
      Authorization: "Bearer test-mcp-token-2026-everyage-digital-secret"
    timeout: 120
```

> **Note**: Restart Hermes Agent after updating `config.yaml`. Tools will register as `mcp_everyage_list_products`, `mcp_everyage_add_product`, etc.

---

### B. Claude Desktop (`claude_desktop_config.json`)

On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`  
On Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "everyage": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "http://localhost:3000/api/mcp",
        "--header",
        "Authorization: Bearer <YOUR_ADMIN_MCP_TOKEN>"
      ]
    }
  }
}
```

---

### C. Cursor (`.cursor/mcp.json`)

Add to your project's Cursor MCP configuration:

```json
{
  "mcpServers": {
    "everyage-digital": {
      "url": "http://localhost:3000/api/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_ADMIN_MCP_TOKEN>"
      }
    }
  }
}
```

---

## 5. End-to-End Operator Workflow

1. **Agent Command**:
   > *"Add a product: Logitech MX Master 3S, $99, Ergonomics category, Amazon affiliate link https://www.amazon.com/dp/B09HM94VDS?tag=everyagedigital-20"*
2. **Execution**:
   - The agent invokes `add_product`.
   - The MCP server verifies the `https://` protocol and generates slug `logitech-mx-master-3s`.
   - The product is registered in the catalog with status `"draft"`.
3. **Owner Review**:
   - The store owner navigates to `/admin/products`.
   - Checks the description, affiliate tag, and clicks **Activate**.
4. **Telemetry Inquiries**:
   > *"How many outbound affiliate clicks did we receive over the last 7 days?"*
   - The agent invokes `get_clicks({ days: 7 })` and answers with accurate, grounded analytics.

---

## 6. Verification & Automated Tests

Run the full Vitest MCP test suite:
```bash
npm test tests/mcp.test.ts
```

All 11 automated test cases verify:
- Complete registration of the 8 MCP tools and input schemas
- 401 HTTP response upon missing or bad credentials
- 429 HTTP response upon hitting the 60 req/min rate limit
- Schema rejection of insecure `http://` affiliate URLs
- Automatic enforcement of `draft` status upon creation
- Storefront appearance upon `set_product_status("active")`
- Analytics report shape matching dashboard expectations
- Price freshness timestamp updates
- Stale price filtering
- Complete scrub of credentials from error strings
