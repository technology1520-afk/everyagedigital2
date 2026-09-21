import { describe, it, expect } from 'vitest';
import { DemoPaymentProvider, LemonSqueezyProvider } from '../src/lib/payment/provider';

describe('Payment Provider Abstraction & Demo Checkout', () => {
  it('creates demo session with explicit simulation notice', async () => {
    const demo = new DemoPaymentProvider();
    const session = await demo.createCheckoutSession({
      productId: 'own-1',
      productTitle: 'The Solo Creator Operating System',
      price: 39.00,
      currency: 'USD'
    });

    expect(session.isDemo).toBe(true);
    expect(session.notice).toContain('Demo checkout—not connected to a real payment provider');
    expect(session.sessionId).toContain('demo_sess_');
  });

  it('Lemon Squeezy provider falls back to demo mode when unconfigured', async () => {
    const ls = new LemonSqueezyProvider();
    expect(ls.isConfigured()).toBe(false);

    const session = await ls.createCheckoutSession({
      productId: 'own-2',
      productTitle: 'Freelance Pricing Kit',
      price: 29.00,
      currency: 'USD'
    });

    expect(session.isDemo).toBe(true);
    expect(session.notice).toContain('Demo Checkout mode');
  });
});
