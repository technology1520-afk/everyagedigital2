import { NextRequest, NextResponse } from 'next/server';
import { catalogRepository } from '../../../../lib/db/repository';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const referrer = request.headers.get('referer') || undefined;
  const country = request.headers.get('x-vercel-ip-country') || 'US';

  // 1. Record click and obtain target destination URL
  let targetUrl = catalogRepository.recordClick(id, referrer, country);

  // 2. If not directly found via links, look up via offer or product
  if (!targetUrl) {
    const offer = catalogRepository.getOfferForProduct(id);
    if (offer && offer.affiliateUrl) {
      targetUrl = catalogRepository.recordClick(offer.id, referrer, country) || offer.affiliateUrl;
    }
  }

  // 3. Fallback if link not found
  if (!targetUrl) {
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(`${origin}/shop?utm_source=redirect_missing&id=${encodeURIComponent(id)}`, 302);
  }

  // 4. Sanitize Redirection Protocol: strictly enforce http: or https:
  try {
    const parsedUrl = new URL(targetUrl);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      const origin = request.nextUrl.origin;
      return NextResponse.redirect(`${origin}/shop?utm_source=unsafe_protocol&id=${encodeURIComponent(id)}`, 302);
    }
  } catch {
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(`${origin}/shop?utm_source=invalid_url&id=${encodeURIComponent(id)}`, 302);
  }

  // 5. Return compliant 302 redirect with no-cache headers to prevent caching clicks
  const response = NextResponse.redirect(targetUrl, 302);
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}
