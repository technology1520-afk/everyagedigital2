export interface CheckoutSessionRequest {
  productId: string;
  productTitle: string;
  price: number;
  currency: string;
  customerEmail?: string;
  returnUrl?: string;
}

export interface CheckoutSessionResponse {
  isDemo: boolean;
  checkoutUrl: string;
  notice: string;
  sessionId: string;
}

export interface PaymentProvider {
  providerName: string;
  isConfigured(): boolean;
  createCheckoutSession(req: CheckoutSessionRequest): Promise<CheckoutSessionResponse>;
}

export class DemoPaymentProvider implements PaymentProvider {
  providerName = 'Demo Payment Gateway';

  isConfigured(): boolean {
    return true;
  }

  async createCheckoutSession(req: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    const sessionId = `demo_sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    return {
      isDemo: true,
      sessionId,
      checkoutUrl: `/shop/own-products/checkout-demo?session=${sessionId}&product=${encodeURIComponent(req.productId)}`,
      notice: 'Demo checkout—not connected to a real payment provider. No credit card will be charged.'
    };
  }
}

export class LemonSqueezyProvider implements PaymentProvider {
  providerName = 'Lemon Squeezy';

  isConfigured(): boolean {
    return Boolean(process.env.LEMON_SQUEEZY_API_KEY && process.env.LEMON_SQUEEZY_STORE_ID);
  }

  async createCheckoutSession(req: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    if (!this.isConfigured()) {
      // Gracefully fall back to demo mode with clear explicit notice
      const demo = new DemoPaymentProvider();
      const res = await demo.createCheckoutSession(req);
      res.notice = 'Lemon Squeezy API keys are not configured. Running in Demo Checkout mode.';
      return res;
    }

    // In a live configured environment, would call Lemon Squeezy API
    return {
      isDemo: false,
      sessionId: `ls_${Date.now()}`,
      checkoutUrl: `https://everyagedigital.lemonsqueezy.com/checkout/buy/${req.productId}`,
      notice: 'Secured via Lemon Squeezy Merchant of Record.'
    };
  }
}

export function getPaymentProvider(): PaymentProvider {
  if (process.env.LEMON_SQUEEZY_API_KEY) {
    return new LemonSqueezyProvider();
  }
  return new DemoPaymentProvider();
}
