import { describe, it, expect } from 'vitest';
import { generateAssistantResponse } from '../src/lib/assistant/receptionist';
import { PRODUCTS } from '../src/data/seedCatalog';

describe('AI Shopping Receptionist (Catalog Grounding)', () => {
  it('returns recommendations strictly sourced from catalog products', () => {
    const response = generateAssistantResponse({ userMessage: 'desk light' });
    expect(response.recommendations).toBeDefined();
    expect(response.recommendations!.length).toBeGreaterThan(0);

    for (const rec of response.recommendations!) {
      const match = PRODUCTS.find(p => p.id === rec.product.id);
      expect(match).toBeDefined();
    }
  });

  it('respects maximum budget constraints in recommendations', () => {
    const response = generateAssistantResponse({
      userMessage: 'portable charger',
      maxBudget: 35
    });

    for (const rec of response.recommendations!) {
      expect(rec.offer.price).toBeLessThanOrEqual(35);
    }
  });

  it('transparently includes product trade-offs / limitations', () => {
    const response = generateAssistantResponse({ userMessage: 'headphones' });
    for (const rec of response.recommendations!) {
      expect(rec.limitations).toBeDefined();
      expect(rec.limitations.length).toBeGreaterThan(5);
    }
  });

  it('handles unmatched queries gracefully with suggestion chips', () => {
    const response = generateAssistantResponse({
      userMessage: 'unobtanium starship fuel drive'
    });
    expect(response.recommendations?.length).toBe(0);
    expect(response.content).toContain('could not verify a suitable match');
    expect(response.suggestedPrompts?.length).toBeGreaterThan(0);
  });
});
