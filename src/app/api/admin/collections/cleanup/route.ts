import { NextResponse } from 'next/server';
import { checkAdminAuth } from '../../../../../lib/auth/adminAuth';
import { catalogRepository } from '../../../../../lib/db/repository';

export const dynamic = 'force-dynamic';

export async function POST() {
  const isAuthorized = await checkAdminAuth();
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
  }

  try {
    const result = await catalogRepository.cleanupOrphanedBundleProducts();
    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal error during bundle cleanup';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
