import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getSupabaseAdminClient } from '../../../lib/supabase/server';
import { isSupabaseConfigured } from '../../../lib/supabase/config';
import { catalogRepository } from '../../../lib/db/repository';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdminClient();
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'seasonal_theme')
        .maybeSingle();

      if (!error && data?.value) {
        const val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
        return NextResponse.json(
          {
            active: Boolean(val.active),
            theme: String(val.theme || 'halloween')
          },
          {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
          }
        );
      }
    }
  } catch (err) {
    console.warn('[API /api/theme GET] Supabase query warning:', err);
  }

  // Fallback to catalog repository singleton
  const repoTheme = await catalogRepository.getSeasonalTheme();
  return NextResponse.json(
    {
      active: Boolean(repoTheme.active),
      theme: String(repoTheme.theme || 'halloween')
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const active = Boolean(body.active);
    const theme = String(body.theme || 'halloween');

    // 1. Update live Supabase site_settings
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseAdminClient();
        const { error } = await supabase
          .from('site_settings')
          .upsert({
            key: 'seasonal_theme',
            value: { active, theme },
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.warn('[API /api/theme POST] Supabase upsert warning:', error.message);
        }
      } catch (dbErr) {
        console.warn('[API /api/theme POST] Supabase error:', dbErr);
      }
    }

    // 2. Synchronize with repository singleton
    await catalogRepository.setSeasonalTheme(active, theme);

    // 3. Invalidate Vercel cache immediately
    try {
      revalidateTag('site_settings', { expire: 0 });
      revalidateTag('site-settings', { expire: 0 });
    } catch {}
    revalidatePath('/', 'layout');
    revalidatePath('/admin/settings');

    return NextResponse.json({
      success: true,
      active,
      theme
    });
  } catch (err: unknown) {
    console.error('[API /api/theme POST] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update theme'
      },
      { status: 500 }
    );
  }
}
