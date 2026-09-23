import { cookies } from 'next/headers';
import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'everyage_admin_session';

const isProduction = process.env.NODE_ENV === 'production';

// Default owner credentials (fallback passwords are prohibited in production)
export const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || (isProduction ? '' : 'admin@everyagedigital.com');
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (isProduction ? '' : 'admin12345');

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (isProduction) {
      throw new Error('SESSION_SECRET environment variable is required in production.');
    }
    return 'everyage-digital-secret-token-key-2026';
  }
  return secret;
}

export function createSessionToken(email: string): string {
  const payload = {
    email,
    role: 'owner',
    timestamp: Date.now()
  };
  const payloadBase64 = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
  const secret = getSessionSecret();
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadBase64)
    .digest('hex');

  return `${payloadBase64}.${signature}`;
}

export function verifySessionToken(token?: string): { email: string; role: string } | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadBase64, signature] = parts;
  if (!payloadBase64 || !signature) return null;

  // HMAC-SHA256 hex signature must be exactly 64 hexadecimal characters
  if (signature.length !== 64 || !/^[0-9a-fA-F]{64}$/.test(signature)) {
    return null;
  }

  try {
    const secret = getSessionSecret();
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payloadBase64)
      .digest('hex');

    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expectedBuffer.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    const jsonStr = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    const parsed = JSON.parse(jsonStr);
    if (parsed && typeof parsed.email === 'string' && parsed.role === 'owner') {
      return { email: parsed.email, role: parsed.role };
    }
    return null;
  } catch {
    return null;
  }
}

export async function checkAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return Boolean(verifySessionToken(token));
  } catch {
    return false;
  }
}
