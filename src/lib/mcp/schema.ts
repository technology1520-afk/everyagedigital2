import { z } from 'zod';
import { ProductStatusSchema } from '../db/schema';

// 1. list_products
export const ListProductsInputSchema = z.object({
  status: ProductStatusSchema.optional(),
  category: z.string().optional()
});
export type ListProductsInput = z.infer<typeof ListProductsInputSchema>;

// 2. add_product (Enforces https protocol on affiliate_url and draft status)
export const AddProductInputSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  merchant: z.string().min(1, 'Merchant is required'),
  affiliate_url: z.string()
    .url('Affiliate URL must be a valid URL')
    .refine((val) => val.startsWith('https://'), {
      message: 'Affiliate URL must use https:// protocol'
    }),
  price_min: z.number().nonnegative('Price min cannot be negative').optional(),
  price_max: z.number().nonnegative('Price max cannot be negative').optional(),
  currency: z.string().default('USD'),
  image_url: z.string().url('Image URL must be valid').optional(),
  // Optional editorial overrides
  badges: z.array(z.string()).optional(),
  editorial_stance: z.string().optional(),
  tested_in_house: z.boolean().default(false).optional()
});
export type AddProductInput = z.infer<typeof AddProductInputSchema>;

// 3. update_product
export const UpdateProductInputSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  price_min: z.number().nonnegative().optional(),
  price_max: z.number().nonnegative().optional(),
  image_url: z.string().url().optional(),
  category: z.string().optional(),
  // Optional editorial overrides
  badges: z.array(z.string()).optional(),
  editorial_stance: z.string().optional(),
  tested_in_house: z.boolean().optional()
});
export type UpdateProductInput = z.infer<typeof UpdateProductInputSchema>;

// 4. set_product_status
export const SetProductStatusInputSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  status: ProductStatusSchema
});
export type SetProductStatusInput = z.infer<typeof SetProductStatusInputSchema>;

// 5. get_clicks
export const GetClicksInputSchema = z.object({
  days: z.number().int().positive('Days must be a positive integer').default(7).optional()
});
export type GetClicksInput = z.infer<typeof GetClicksInputSchema>;

// 6. mark_price_checked
export const MarkPriceCheckedInputSchema = z.object({
  product_id: z.string().min(1, 'Product ID is required')
});
export type MarkPriceCheckedInput = z.infer<typeof MarkPriceCheckedInputSchema>;

// 7. get_stale_prices
export const GetStalePricesInputSchema = z.object({});
export type GetStalePricesInput = z.infer<typeof GetStalePricesInputSchema>;

// 8. store_stats
export const StoreStatsInputSchema = z.object({});
export type StoreStatsInput = z.infer<typeof StoreStatsInputSchema>;

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export const MCP_TOOLS: McpToolDefinition[] = [
  {
    name: 'list_products',
    description: 'List products in the catalog filtered optionally by publishing status or category.',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['draft', 'active', 'paused', 'archived'],
          description: 'Filter by publishing status'
        },
        category: {
          type: 'string',
          description: 'Filter by category name (case-insensitive)'
        }
      }
    }
  },
  {
    name: 'add_product',
    description: 'Add a new product to the catalog as draft. Requires an https affiliate URL. Humans review and activate via admin.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Product title (min 2 chars)' },
        description: { type: 'string', description: 'Editorial description (min 10 chars)' },
        category: { type: 'string', description: 'Category name' },
        merchant: { type: 'string', description: 'Merchant partner name (e.g. Amazon, Gumroad)' },
        affiliate_url: { type: 'string', description: 'Secure outbound merchant URL (must start with https://)' },
        price_min: { type: 'number', description: 'Minimum price in USD' },
        price_max: { type: 'number', description: 'Maximum price in USD' },
        currency: { type: 'string', default: 'USD', description: '3-letter currency code' },
        image_url: { type: 'string', description: 'Image CDN URL' },
        badges: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional editorial badges or tags'
        },
        editorial_stance: {
          type: 'string',
          description: 'Optional editorial opinion or stance'
        },
        tested_in_house: {
          type: 'boolean',
          default: false,
          description: 'Whether the product was tested in-house (defaults to false)'
        }
      },
      required: ['title', 'description', 'category', 'merchant', 'affiliate_url']
    }
  },
  {
    name: 'update_product',
    description: 'Partially update an existing product in the catalog with Zod validation.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Target product ID' },
        title: { type: 'string', description: 'Updated title' },
        description: { type: 'string', description: 'Updated description' },
        price_min: { type: 'number', description: 'Updated minimum price' },
        price_max: { type: 'number', description: 'Updated maximum price' },
        image_url: { type: 'string', description: 'Updated image URL' },
        category: { type: 'string', description: 'Updated category' },
        badges: {
          type: 'array',
          items: { type: 'string' },
          description: 'Updated editorial badges or tags'
        },
        editorial_stance: {
          type: 'string',
          description: 'Updated editorial opinion or stance'
        },
        tested_in_house: {
          type: 'boolean',
          description: 'Updated in-house testing status'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'set_product_status',
    description: 'Change the publishing status of a product (draft, active, paused, archived).',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Product ID' },
        status: {
          type: 'string',
          enum: ['draft', 'active', 'paused', 'archived'],
          description: 'New product status'
        }
      },
      required: ['id', 'status']
    }
  },
  {
    name: 'get_clicks',
    description: 'Get click telemetry report: total clicks, daily counts, and top 10 products by clicks for the specified window.',
    inputSchema: {
      type: 'object',
      properties: {
        days: {
          type: 'number',
          default: 7,
          description: 'Number of past days to query (default: 7)'
        }
      }
    }
  },
  {
    name: 'mark_price_checked',
    description: 'Update the lastCheckedAt price freshness timestamp for a product to the current time.',
    inputSchema: {
      type: 'object',
      properties: {
        product_id: { type: 'string', description: 'Product ID whose affiliate offer was verified' }
      },
      required: ['product_id']
    }
  },
  {
    name: 'get_stale_prices',
    description: 'Retrieve all catalog products where lastCheckedAt + staleAfter exceeds the current time.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'store_stats',
    description: 'Get high-level store statistics: product count by status, 7d/30d clicks, and 7d assistant conversation count.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];
