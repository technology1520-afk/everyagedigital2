import { z } from 'zod';

export const ProductStatusSchema = z.enum(['draft', 'active', 'paused', 'archived']);
export type ProductStatus = z.infer<typeof ProductStatusSchema>;

export const MerchantNetworkSchema = z.enum([
  'amazon', 'gumroad', 'clickbank', 'impact', 'cj', 'awin', 
  'shareasale', 'partnerstack', 'direct', 'owned'
]);
export type MerchantNetwork = z.infer<typeof MerchantNetworkSchema>;

export const ProductInputSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(256),
  slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  brand: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  merchantId: z.string().min(1, 'Merchant is required'),
  priceMin: z.number().nonnegative().optional(),
  priceMax: z.number().nonnegative().optional(),
  currency: z.string().default('USD'),
  imageUrl: z.string().url('Must be a valid image URL').optional().or(z.literal('')),
  affiliateUrl: z.string().url('Must be a valid URL'),
  status: ProductStatusSchema.default('active'),
  isOwned: z.boolean().default(false),
  bestFor: z.string().optional(),
  notFor: z.string().optional(),
  editorialBadge: z.string().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  badges: z.array(z.string()).optional(),
  editorialStance: z.string().optional(),
  editorial_stance: z.string().optional(),
  testedInHouse: z.boolean().optional(),
  tested_in_house: z.boolean().optional(),
  lastPriceCheckedAt: z.string().optional(),
  last_price_checked_at: z.string().optional()
});

export type ProductInput = z.infer<typeof ProductInputSchema>;

export const CategoryInputSchema = z.object({
  name: z.string().min(2).max(128),
  slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  parentId: z.string().optional(),
  sortOrder: z.number().default(0)
});

export type CategoryInput = z.infer<typeof CategoryInputSchema>;

export const OwnProductInputSchema = z.object({
  title: z.string().min(2).max(256),
  slug: z.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  price: z.number().positive('Price must be greater than zero'),
  currency: z.string().default('USD'),
  deliveryInfo: z.string().min(5),
  refundPolicy: z.string().min(10),
  checkoutProvider: z.enum(['lemonsqueezy', 'paddle', 'demo']).default('demo'),
  checkoutUrl: z.string().optional(),
  fileFormat: z.string().default('PDF + Notion'),
  includedItems: z.array(z.string()).default([])
});

export type OwnProductInput = z.infer<typeof OwnProductInputSchema>;

export const AffiliateUrlValidationMap: Record<MerchantNetwork, RegExp> = {
  amazon: /^https?:\/\/(([a-zA-Z0-9-]+\.)?amazon\.[a-z.]+|amzn\.to)/i,
  gumroad: /^https?:\/\/([a-zA-Z0-9-]+\.)?gumroad\.com/i,
  clickbank: /^https?:\/\/([a-zA-Z0-9-]+\.)?clickbank\.net/i,
  impact: /^https?:\/\//i,
  cj: /^https?:\/\//i,
  awin: /^https?:\/\//i,
  shareasale: /^https?:\/\//i,
  partnerstack: /^https?:\/\//i,
  direct: /^https?:\/\//i,
  owned: /^\//i // internal checkout path or url
};

export function validateAffiliateUrlForNetwork(url: string, network: MerchantNetwork): boolean {
  const pattern = AffiliateUrlValidationMap[network];
  if (!pattern) return /^https?:\/\//i.test(url);
  return pattern.test(url);
}
