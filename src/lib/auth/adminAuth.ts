import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'everyage_admin_session';

// Default owner credentials (can be customized via environment variables)
export const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@everyagedigital.com';
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin12345';

export function createSessionToken(email: string): string {
  const payload = {
    email,
    role: 'owner',
    timestamp: Date.now()
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function verifySessionToken(token?: string): { email: string; role: string } | null {
  if (!token) return null;
  try {
    const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(jsonStr);
    if (parsed && parsed.email && parsed.role === 'owner') {
      return { email: parsed.email, role: parsed.role };
    }
    return null;
  } catch {
    return null;
  }
}

export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return Boolean(verifySessionToken(token));
}
