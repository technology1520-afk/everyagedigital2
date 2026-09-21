export interface FreshnessResult {
  isStale: boolean;
  checkedDateFormatted: string;
  daysAgo: number;
  statusLabel: 'Current' | 'Price Check Overdue' | 'Instant Verification';
  shouldShowPrice: boolean;
}

export interface AffiliateProviderAdapter {
  providerName: string;
  getDisclosureText(): string;
  validateDestination(url: string): boolean;
  buildAffiliateUrl(originalUrl: string, customParams?: Record<string, string>): string;
  checkFreshness(lastCheckedAt: string, staleAfterDays: number): FreshnessResult;
}

export class AmazonAdapter implements AffiliateProviderAdapter {
  providerName = 'Amazon Associates';

  getDisclosureText(): string {
    return 'As an Amazon Associate I earn from qualifying purchases.';
  }

  validateDestination(url: string): boolean {
    try {
      const parsed = new URL(url);
      const allowedHostnames = ['amazon.com', 'www.amazon.com', 'amzn.to', 'amazon.co.uk', 'amazon.ca', 'amazon.de'];
      return allowedHostnames.some(h => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`));
    } catch {
      return false;
    }
  }

  buildAffiliateUrl(originalUrl: string, customParams?: { tag?: string }): string {
    if (!this.validateDestination(originalUrl)) {
      return originalUrl;
    }
    try {
      const parsed = new URL(originalUrl);
      const associateTag = customParams?.tag || process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || 'everyagedigital-20';
      parsed.searchParams.set('tag', associateTag);
      return parsed.toString();
    } catch {
      return originalUrl;
    }
  }

  checkFreshness(lastCheckedAt: string, staleAfterDays: number = 7): FreshnessResult {
    const checkedDate = new Date(lastCheckedAt);
    const now = new Date();
    const diffMs = now.getTime() - checkedDate.getTime();
    const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const isStale = daysAgo > staleAfterDays;

    return {
      isStale,
      checkedDateFormatted: checkedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      daysAgo: Math.max(0, daysAgo),
      statusLabel: isStale ? 'Price Check Overdue' : 'Current',
      shouldShowPrice: !isStale
    };
  }
}

export class GumroadAdapter implements AffiliateProviderAdapter {
  providerName = 'Gumroad';

  getDisclosureText(): string {
    return 'This recommendation contains an affiliate link. If you purchase, we may earn a commission at no extra cost to you.';
  }

  validateDestination(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.hostname.endsWith('gumroad.com');
    } catch {
      return false;
    }
  }

  buildAffiliateUrl(originalUrl: string): string {
    return originalUrl;
  }

  checkFreshness(lastCheckedAt: string, staleAfterDays: number = 30): FreshnessResult {
    const checkedDate = new Date(lastCheckedAt);
    const now = new Date();
    const diffMs = now.getTime() - checkedDate.getTime();
    const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const isStale = daysAgo > staleAfterDays;

    return {
      isStale,
      checkedDateFormatted: checkedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      daysAgo: Math.max(0, daysAgo),
      statusLabel: isStale ? 'Price Check Overdue' : 'Current',
      shouldShowPrice: !isStale
    };
  }
}

export class ImpactAdapter implements AffiliateProviderAdapter {
  providerName = 'Impact';

  getDisclosureText(): string {
    return 'Partner offer via Impact. We may earn a commission from qualifying purchases at no extra cost to you.';
  }

  validateDestination(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  buildAffiliateUrl(originalUrl: string): string {
    return originalUrl;
  }

  checkFreshness(lastCheckedAt: string, staleAfterDays: number = 14): FreshnessResult {
    const checkedDate = new Date(lastCheckedAt);
    const now = new Date();
    const diffMs = now.getTime() - checkedDate.getTime();
    const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const isStale = daysAgo > staleAfterDays;

    return {
      isStale,
      checkedDateFormatted: checkedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      daysAgo: Math.max(0, daysAgo),
      statusLabel: isStale ? 'Price Check Overdue' : 'Current',
      shouldShowPrice: !isStale
    };
  }
}

export class DirectBrandAdapter implements AffiliateProviderAdapter {
  providerName = 'Direct Brand';

  getDisclosureText(): string {
    return 'We partner directly with the manufacturer/brand. We may earn a referral fee if you purchase.';
  }

  validateDestination(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  buildAffiliateUrl(originalUrl: string): string {
    return originalUrl;
  }

  checkFreshness(lastCheckedAt: string, staleAfterDays: number = 14): FreshnessResult {
    const checkedDate = new Date(lastCheckedAt);
    const now = new Date();
    const diffMs = now.getTime() - checkedDate.getTime();
    const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const isStale = daysAgo > staleAfterDays;

    return {
      isStale,
      checkedDateFormatted: checkedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      daysAgo: Math.max(0, daysAgo),
      statusLabel: isStale ? 'Price Check Overdue' : 'Current',
      shouldShowPrice: !isStale
    };
  }
}

export class OwnedProductAdapter implements AffiliateProviderAdapter {
  providerName = 'EveryAge Digital (Direct)';

  getDisclosureText(): string {
    return 'Published directly by EveryAge Digital. Your purchase directly supports our independent editorial team.';
  }

  validateDestination(): boolean {
    return true;
  }

  buildAffiliateUrl(originalUrl: string): string {
    return originalUrl;
  }

  checkFreshness(): FreshnessResult {
    return {
      isStale: false,
      checkedDateFormatted: 'Direct Publisher Pricing',
      daysAgo: 0,
      statusLabel: 'Instant Verification',
      shouldShowPrice: true
    };
  }
}

const adapters: Record<string, AffiliateProviderAdapter> = {
  'Amazon Associates': new AmazonAdapter(),
  'Amazon': new AmazonAdapter(),
  'Gumroad': new GumroadAdapter(),
  'Impact': new ImpactAdapter(),
  'Direct Brand': new DirectBrandAdapter(),
  'Owned': new OwnedProductAdapter(),
  'EveryAge Digital': new OwnedProductAdapter()
};

export function getAffiliateAdapter(providerOrMerchant: string): AffiliateProviderAdapter {
  return adapters[providerOrMerchant] || new DirectBrandAdapter();
}
