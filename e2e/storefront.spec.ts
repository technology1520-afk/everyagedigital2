import { test, expect } from '@playwright/test';

test.describe('EveryAge Digital Storefront & Admin E2E Tests', () => {
  test('homepage renders hero, value proposition, and editorial catalog', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/EveryAge Digital/);
    await expect(page.locator('h1')).toContainText('Curated Commerce');

    // Check presence of key navigation links
    await expect(page.locator('a[href="/shop"]')).toBeVisible();
    await expect(page.locator('a[href="/assistant"]')).toBeVisible();
  });

  test('shop page renders filters and catalog items', async ({ page }) => {
    await page.goto('/shop');
    await expect(page.locator('h1')).toContainText('Catalog');

    // Check category filter buttons
    await expect(page.locator('text=All Categories')).toBeVisible();
  });

  test('unauthenticated access to /admin redirects to /admin/login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/admin\/login/);
    await expect(page.locator('h1')).toContainText('Owner Control Center');
  });

  test('owner login flow grants access to admin dashboard', async ({ page }) => {
    await page.goto('/admin/login');

    // Fill login form
    await page.fill('input[name="email"]', 'admin@everyagedigital.com');
    await page.fill('input[name="password"]', 'admin12345');
    await page.click('button[type="submit"]');

    // Should redirect to /admin dashboard
    await expect(page).toHaveURL(/.*\/admin$/);
    await expect(page.locator('h1')).toContainText('Commerce Operations');
  });

  test('own digital product page displays demo checkout modal', async ({ page }) => {
    await page.goto('/shop/own-products/solo-creator-operating-system');
    await expect(page.locator('h1')).toContainText('Solo Creator');

    // Trigger demo checkout
    const checkoutBtn = page.locator('button:has-text("Instant Access")');
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      await expect(page.locator('text=Demo Sandbox Active')).toBeVisible();
    }
  });
});
