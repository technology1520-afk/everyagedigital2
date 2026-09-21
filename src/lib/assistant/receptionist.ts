import { AssistantMessage, AssistantRecommendationItem } from '../../types';
import { searchCatalog } from '../search/catalogSearch';

export interface AssistantQueryOptions {
  userMessage: string;
  category?: string;
  maxBudget?: number;
  productType?: 'physical' | 'digital' | 'all';
  preferredMerchant?: string;
  region?: string;
}

export function generateAssistantResponse(options: AssistantQueryOptions): AssistantMessage {
  const { userMessage, category, maxBudget, productType, preferredMerchant } = options;
  const msgLower = userMessage.toLowerCase();

  // Catalog tool execution: filter candidates deterministically
  let searchResults = searchCatalog({
    query: userMessage,
    category: category && category !== 'all' ? category : undefined,
    maxPrice: maxBudget,
    productType: productType && productType !== 'all' ? productType : undefined,
    merchant: preferredMerchant && preferredMerchant !== 'all' ? preferredMerchant : undefined,
    sortBy: 'editorial_picks'
  });

  // If strict query produced 0 results, fall back to keyword matching or category heuristics
  if (searchResults.items.length === 0) {
    if (msgLower.includes('desk') || msgLower.includes('office') || msgLower.includes('light') || msgLower.includes('monitor')) {
      searchResults = searchCatalog({ category: 'Home Office', maxPrice: maxBudget });
    } else if (msgLower.includes('book') || msgLower.includes('read') || msgLower.includes('learn') || msgLower.includes('business')) {
      searchResults = searchCatalog({ query: 'business', maxPrice: maxBudget });
    } else if (msgLower.includes('digital') || msgLower.includes('template') || msgLower.includes('freelance') || msgLower.includes('notion')) {
      searchResults = searchCatalog({ productType: 'digital', maxPrice: maxBudget });
    } else if (msgLower.includes('budget') || msgLower.includes('cheap') || msgLower.includes('affordable') || msgLower.includes('under $50')) {
      searchResults = searchCatalog({ maxPrice: 50, sortBy: 'price_low_high' });
    } else if (msgLower.includes('audio') || msgLower.includes('headphone') || msgLower.includes('focus') || msgLower.includes('quiet')) {
      searchResults = searchCatalog({ category: 'Electronics', maxPrice: maxBudget });
    }
  }

  // Generate transparent recommendation items
  const recommendations: AssistantRecommendationItem[] = [];

  for (const item of searchResults.items.slice(0, 3)) {
    if (!item.offer) continue;

    // Reason synthesis based on verifiable attributes
    const reasons: string[] = [];
    if (maxBudget && item.offer.price <= maxBudget) {
      reasons.push(`Within your $${maxBudget} budget target ($${item.offer.price})`);
    }
    if (item.product.editorialBadge) {
      reasons.push(`Verified as our editorial ${item.product.editorialBadge}`);
    }
    if (preferredMerchant && item.offer.merchantName.toLowerCase() === preferredMerchant.toLowerCase()) {
      reasons.push(`Sold directly by your preferred merchant (${item.offer.merchantName})`);
    }
    if (reasons.length === 0) {
      reasons.push(item.product.bestFor);
    }

    const limitationText = item.product.limitations.length > 0
      ? item.product.limitations[0]
      : item.product.notFor;

    recommendations.push({
      product: item.product,
      offer: item.offer,
      fitReason: reasons.join(' • '),
      limitations: limitationText,
      isSponsored: item.product.isSponsored
    });
  }

  let replyContent = '';
  let suggestedPrompts: string[] = [];

  if (recommendations.length > 0) {
    replyContent = `I looked through our verified catalog. Here are ${recommendations.length} grounded recommendation${recommendations.length > 1 ? 's' : ''} matching your criteria, complete with direct merchant links and key trade-offs to keep in mind:`;
    suggestedPrompts = [
      'Show cheaper alternatives',
      'Show only digital downloads',
      'Filter for Home Office only',
      'How are these products tested?'
    ];
  } else {
    replyContent = `I could not verify a suitable match from the current catalog for "${userMessage}". To protect recommendation integrity, I only suggest items directly vetted in our database. Try adjusting your budget, expanding your category, or selecting one of our starter guides below:`;
    suggestedPrompts = [
      'Best home office essentials',
      'Digital products under $50',
      'Curated books on business and habits',
      'Everyday carry chargers'
    ];
  }

  return {
    id: `msg_${Date.now()}`,
    role: 'assistant',
    content: replyContent,
    recommendations,
    suggestedPrompts,
    timestamp: new Date().toISOString()
  };
}
