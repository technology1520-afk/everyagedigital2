import { describe, it, expect } from 'vitest';
import { 
  AmazonAdapter, 
  GumroadAdapter, 
  getAffiliateAdapter 
} from '../src/lib/affiliate/adapters';

describe('Affiliate Adapters & Compliance', () => {
  const amazon = new AmazonAdapter();
  const gumroad = new GumroadAdapter();

  it('provides the mandatory Amazon Associates exact disclosure', () => {
    expect(amazon.getDisclosureText()).toBe('As an Amazon Associate I earn from qualifying purchases.');
    expect(gumroad.validateDestination('https://creator.gumroad.com/l/item')).toBe(true);
  });

  it('validates official Amazon destinations and rejects suspicious domains', () => {
    expect(amazon.validateDestination('https://www.amazon.com/dp/B07DP7RYXV')).toBe(true);
    expect(amazon.validateDestination('https://amazon.co.uk/dp/B07DP7RYXV')).toBe(true);
    expect(amazon.validateDestination('https://fake-phishing-amazon.com/item')).toBe(false);
    expect(amazon.validateDestination('javascript:alert(1)')).toBe(false);
  });

  it('properly builds direct Amazon affiliate URLs with tracking tag', () => {
    const original = 'https://www.amazon.com/dp/B07DP7RYXV';
    const built = amazon.buildAffiliateUrl(original, { tag: 'everyagedigital-20' });
    const parsed = new URL(built);
    expect(parsed.searchParams.get('tag')).toBe('everyagedigital-20');
  });

  it('accurately flags stale prices when lastCheckedAt is past expiration window', () => {
    // 60 days ago
    const staleDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
    const freshness = amazon.checkFreshness(staleDate, 7);
    expect(freshness.isStale).toBe(true);
    expect(freshness.shouldShowPrice).toBe(false);
    expect(freshness.statusLabel).toBe('Price Check Overdue');
  });

  it('validates fresh prices when lastCheckedAt is recent', () => {
    // 2 hours ago
    const freshDate = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const freshness = amazon.checkFreshness(freshDate, 7);
    expect(freshness.isStale).toBe(false);
    expect(freshness.shouldShowPrice).toBe(true);
    expect(freshness.statusLabel).toBe('Current');
  });

  it('resolves correct adapter from registry', () => {
    const resolved = getAffiliateAdapter('Amazon Associates');
    expect(resolved.providerName).toBe('Amazon Associates');

    const gumroadResolved = getAffiliateAdapter('Gumroad');
    expect(gumroadResolved.providerName).toBe('Gumroad');
  });
});
