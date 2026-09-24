import { describe, it, expect } from 'vitest';
import { 
  createSessionToken, 
  verifySessionToken, 
  DEFAULT_ADMIN_EMAIL, 
  ADMIN_COOKIE_NAME,
  checkAdminAuth 
} from '../src/lib/auth/adminAuth';
import { createProductAction } from '../src/app/actions/admin';
import { proxy as middleware } from '../src/proxy';
import { NextRequest } from 'next/server';

describe('Master Prompt §3.1 & §13: Admin Auth & Route Protection', () => {
  it('creates and verifies valid owner session tokens', () => {
    const token = createSessionToken(DEFAULT_ADMIN_EMAIL);
    expect(typeof token).toBe('string');

    const session = verifySessionToken(token);
    expect(session).not.toBeNull();
    expect(session?.email).toBe(DEFAULT_ADMIN_EMAIL);
    expect(session?.role).toBe('owner');
  });

  it('rejects invalid or corrupted session tokens', () => {
    expect(verifySessionToken(undefined)).toBeNull();
    expect(verifySessionToken('')).toBeNull();
    expect(verifySessionToken('invalid-base64-random-string')).toBeNull();
  });

  it('middleware redirects unauthenticated requests to /admin/login', () => {
    const request = new NextRequest('http://localhost:3000/admin/products');
    const response = middleware(request);

    // Should redirect (307 or 302/308 in Next.js redirect)
    expect(response.status).toBe(307);
    const location = response.headers.get('location');
    expect(location).toContain('/admin/login');
    expect(location).toContain('from=%2Fadmin%2Fproducts');
  });

  it('middleware permits unauthenticated access to /admin/login', () => {
    const request = new NextRequest('http://localhost:3000/admin/login');
    const response = middleware(request);

    // NextResponse.next() returns 200 header flow
    expect(response.status).toBe(200);
  });

  it('middleware allows authenticated owner session into /admin routes', () => {
    const token = createSessionToken(DEFAULT_ADMIN_EMAIL);
    const request = new NextRequest('http://localhost:3000/admin/products', {
      headers: {
        cookie: `${ADMIN_COOKIE_NAME}=${token}`
      }
    });

    const response = middleware(request);
    expect(response.status).toBe(200);
  });

  it('rejects tampered session payload or signature (HMAC-SHA256 integrity)', () => {
    const validToken = createSessionToken(DEFAULT_ADMIN_EMAIL);
    const [payload, signature] = validToken.split('.');
    expect(payload).toBeDefined();
    expect(signature).toBeDefined();

    // 1. Tampering payload must fail verification
    const fakePayload = Buffer.from(JSON.stringify({ email: 'attacker@evil.com', role: 'owner', timestamp: Date.now() })).toString('base64url');
    expect(verifySessionToken(`${fakePayload}.${signature}`)).toBeNull();

    // 2. Tampering signature must fail verification
    const tamperedSig = signature.slice(0, -4) + 'abcd';
    expect(verifySessionToken(`${payload}.${tamperedSig}`)).toBeNull();

    // 3. Different length signature must fail cleanly (timingSafeEqual guard)
    expect(verifySessionToken(`${payload}.shortsig`)).toBeNull();
    expect(verifySessionToken(`${payload}.${signature}extralongstring`)).toBeNull();

    // 4. Invalid delimiters or parts count
    expect(verifySessionToken(`${payload}.${signature}.extrapart`)).toBeNull();
    expect(verifySessionToken(`${payload}`)).toBeNull();
  });

  it('checkAdminAuth returns false when unauthenticated', async () => {
    const isAuth = await checkAdminAuth();
    expect(isAuth).toBe(false);
  });

  it('server action rejects unauthorized mutations by throwing Error', async () => {
    await expect(
      createProductAction({
        title: 'Unauthorized Test Product',
        slug: 'unauthorized-test-product',
        description: 'Should fail authentication guard',
        categoryId: 'Smart Audio & Microphones',
        merchantId: 'Amazon',
        priceMin: 10,
        currency: 'USD',
        imageUrl: 'https://example.com/img.png',
        affiliateUrl: 'https://amazon.com/dp/test',
        status: 'draft',
        isOwned: false
      })
    ).rejects.toThrow('Unauthorized: Admin access required.');
  });

  it('loginAdminAction validates empty inputs gracefully', async () => {
    const { loginAdminAction } = await import('../src/app/actions/admin');
    const emptyForm = new FormData();
    const result = await loginAdminAction(emptyForm);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Email and password are required.');
  });

  it('loginAdminAction rejects incorrect credentials cleanly without crashing', async () => {
    const { loginAdminAction } = await import('../src/app/actions/admin');
    const form = new FormData();
    form.set('email', 'wrong@admin.com');
    form.set('password', 'wrongpass');
    const result = await loginAdminAction(form);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid owner credentials.');
  });
});
