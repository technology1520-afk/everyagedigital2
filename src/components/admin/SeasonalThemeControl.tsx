'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, 
  Flame, 
  ExternalLink, 
  CheckCircle2, 
  Loader2,
  Bot
} from 'lucide-react';
import { getSupabaseBrowserClient } from '../../lib/supabase/client';
import { setSeasonalThemeAction } from '../../app/actions/admin';

interface SeasonalThemeControlProps {
  initialTheme?: {
    active: boolean;
    theme: string;
  };
}

export function SeasonalThemeControl({ initialTheme }: SeasonalThemeControlProps) {
  const router = useRouter();
  const [isHalloween, setIsHalloween] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)seasonal_theme=([^;]+)/);
      if (match) return match[1] === 'halloween';
    }
    return Boolean(initialTheme?.active);
  });
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  // 1. On component mount (useEffect), fetch the current value from Supabase:
  useEffect(() => {
    async function loadSettings() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'seasonal_theme')
          .single();
        if (data?.value) {
          const val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          setIsHalloween(Boolean(val.active));
        }
      } catch (err) {
        console.error('Failed to load settings from Supabase:', err);
      }
    }
    loadSettings();
  }, []);

  // 2. In the toggle switch handler:
  const handleToggle = async () => {
    const nextState = !isHalloween;
    setIsHalloween(nextState);
    setFeedback(null);

    // Set a persistent cookie so Server Components and refreshes know the state instantly
    document.cookie = `seasonal_theme=${nextState ? 'halloween' : 'default'}; path=/; max-age=2592000; SameSite=Lax`;

    startTransition(async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        // Await the database write:
        const { error } = await supabase
          .from('site_settings')
          .upsert({
            key: 'seasonal_theme',
            value: { active: nextState, theme: 'halloween' },
            updated_at: new Date().toISOString()
          });
        if (error) console.error('Failed to update theme in Supabase:', error);

        // Synchronize with server actions for cache invalidation & in-memory repo fallback
        try {
          await setSeasonalThemeAction(nextState, 'halloween');
        } catch (actionErr) {
          console.warn('Server action fallback warning:', actionErr);
        }

        setFeedback(
          nextState
            ? 'Spooky Halloween mode active! Persistent cookie & Supabase synced.'
            : 'Halloween mode disabled. Standard glass theme active.'
        );

        // Trigger a server revalidation call
        router.refresh();
      } catch (err: unknown) {
        console.error('Failed to update theme:', err);
        setFeedback(err instanceof Error ? err.message : 'Error updating theme');
      }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Seasonal Campaign Control
            </h2>
            <p className="text-[11px] text-neutral-500">
              Instant skinning &amp; atmosphere toggle for storefront visitors.
            </p>
          </div>
        </div>

        {/* Live Preview Button */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 transition-colors"
        >
          <span>Preview Storefront</span>
          <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
        </Link>
      </div>

      {/* Main Switch & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200/70">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-neutral-900">
              Spooky Halloween Mode (Storefront)
            </span>
            {isHalloween ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-500/15 text-orange-700 border border-orange-300">
                <Flame className="w-3 h-3 text-orange-600 animate-pulse" />
                Active (Orange Ember Theme)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-200 text-neutral-600">
                <Sparkles className="w-3 h-3 text-neutral-400" />
                Standard Glass Theme
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed max-w-xl">
            Flips storefront buttons, badges, and filters to vibrant pumpkin orange, surrounds cards with warm amber drop shadows, renders corner web accents, and activates the smoky purple-black canvas.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-3 shrink-0">
          {isPending && <Loader2 className="w-4 h-4 animate-spin text-orange-600" />}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isHalloween}
              disabled={isPending}
              onChange={handleToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>
      </div>

      {/* Dynamic Feedback Alert */}
      {feedback && (
        <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-lg border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Hermes AI Agent Info */}
      <div className="flex items-start gap-2.5 text-[11px] text-neutral-600 bg-white p-3 rounded-lg border border-neutral-200/60">
        <Bot className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-neutral-800">Hermes AI Agent Support: </span>
          The AI agent can query and toggle this campaign anytime via MCP tools{' '}
          <code className="px-1.5 py-0.5 rounded bg-neutral-100 text-purple-700 font-mono text-[10px]">
            get_seasonal_theme
          </code>{' '}
          and{' '}
          <code className="px-1.5 py-0.5 rounded bg-neutral-100 text-purple-700 font-mono text-[10px]">
            set_seasonal_theme({'{ active: true, theme: "halloween" }'})
          </code>
          .
        </div>
      </div>
    </div>
  );
}
