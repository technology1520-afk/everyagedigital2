export type ProductType = 
  | 'physical'
  | 'digital'
  | 'book'
  | 'course'
  | 'template'
  | 'pdf_guide';

export type MerchantName = 
  | 'Amazon'
  | 'Gumroad'
  | 'Lemon Squeezy'
  | 'Paddle'
  | 'Direct Brand'
  | 'ClickBank'
  | 'Impact'
  | 'CJ'
  | 'ShareASale';

export type PriceStatus = 'current' | 'stale' | 'on_request' | 'free';
export type AvailabilityStatus = 'in_stock' | 'digital_instant' | 'low_stock' | 'preorder' | 'unknown';

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  productType: ProductType;
  category: string;
  subcategory: string;
  useCases: string[];
  bestFor: string;
  notFor: string;
  features: string[];
  benefits: string[];
  limitations: string[];
  officialUrl?: string;
  sourceProvider: string;
  sourceProductId?: string;
  imageUrl: string;
  imageSource: string;
  imageLicense: 'Official Affiliate Feed' | 'Merchant Press Kit' | 'Creator Authorized' | 'Original Photography' | 'Public Domain / Open';
  altText: string;
  region: string[];
  language: string;
  status: 'active' | 'archived' | 'draft' | 'paused';
  editorialNotes: string;
  handsOnTested: boolean;
  editorialConfidence: 'High' | 'Verified' | 'Community Reviewed';
  editorialBadge?: 'Editor’s Choice' | 'Best Value' | 'Top Practical Pick' | 'Creator Favorite';
  isSponsored?: boolean;
  priceMin?: number;
  priceMax?: number;
  currency?: string;
  badges?: string[];
  editorialStance?: string;
  editorial_stance?: string;
  testedInHouse?: boolean;
  tested_in_house?: boolean;
  lastPriceCheckedAt?: string;
  last_price_checked_at?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MerchantOffer {
  id: string;
  productId: string;
  merchantName: MerchantName;
  providerName: string;
  affiliateProgram: string;
  originalUrl: string;
  affiliateUrl: string;
  currency: string;
  price: number;
  originalPrice?: number;
  priceType: 'fixed' | 'starting_at' | 'subscription' | 'free';
  availability: AvailabilityStatus;
  region: string[];
  shippingNote?: string;
  lastCheckedAt: string; // ISO Date string
  staleAfterDays: number; // e.g. 7 days
  complianceNotes?: string;
  active: boolean;
}

export interface OwnedProduct {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  productType: ProductType;
  price: number;
  currency: string;
  coverImage: string;
  includedItems: string[];
  previewUrl?: string;
  fileFormat: string;
  pageCountOrModules: string;
  checkoutUrl: string;
  paymentProvider: 'Lemon Squeezy' | 'Paddle' | 'Demo';
  refundPolicy: string;
  targetAudience: string;
  status: 'active' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  introduction: string;
  selectionCriteria: string[];
  productIds: string[];
  bookIds?: string[];
  coverImage: string;
  lastReviewedAt: string;
  status: 'published' | 'draft';
  activeProductCount?: number;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  creator?: string;
  format: 'Paperback / Hardcover' | 'Ebook / Kindle' | 'PDF Digital' | 'Audiobook';
  description: string;
  coverImage: string;
  imageLicense: string;
  merchant: MerchantName;
  affiliateUrl: string;
  owned: boolean;
  price: number;
  currency: string;
  lastCheckedAt: string;
  disclosureRequired: boolean;
  status: 'active' | 'archived';
  difficulty: 'Beginner' | 'Intermediate' | 'Comprehensive';
  targetAudience: string;
  keyLearnings: string[];
  relatedProductIds?: string[];
}

export interface AffiliateProgram {
  id: string;
  providerName: string;
  programName: string;
  region: string[];
  termsUrl: string;
  disclosureText: string;
  imageRules: string;
  priceRules: string;
  linkRules: string;
  active: boolean;
}

export interface SourceEvidence {
  id: string;
  productId: string;
  sourceUrl: string;
  sourceType: 'Official Manual' | 'Manufacturer Specs' | 'Direct Verification' | 'Editorial Testing';
  quote: string;
  retrievedAt: string;
  confidence: 'High' | 'Medium';
  notes?: string;
}

export interface FilterParams {
  query?: string;
  category?: string;
  subcategory?: string;
  merchant?: string;
  productType?: string;
  minPrice?: number;
  maxPrice?: number;
  editorialPickOnly?: boolean;
  sponsoredOnly?: boolean;
  region?: string;
  format?: string;
  sortBy?: SortOption;
}

export type SortOption = 
  | 'relevance'
  | 'editorial_picks'
  | 'price_low_high'
  | 'price_high_low'
  | 'newest_review'
  | 'recently_added';

export interface AssistantRecommendationItem {
  product: Product;
  offer: MerchantOffer;
  fitReason: string;
  limitations: string;
  isSponsored?: boolean;
}

export interface AssistantMessage {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  recommendations?: AssistantRecommendationItem[];
  suggestedPrompts?: string[];
  timestamp: string;
}
