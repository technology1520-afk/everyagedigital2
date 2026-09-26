'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
}

export function ShareButton({
  title,
  text,
  url,
  className = ''
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = typeof window !== 'undefined' ? (url || window.location.href) : (url || '');
    const shareData = {
      title: title || (typeof document !== 'undefined' ? document.title : 'EveryAge Digital'),
      text: text || 'Check out this curated bundle on EveryAge Digital',
      url: shareUrl
    };

    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // Fallback: Copy to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Silently fail if clipboard denied
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? 'Link copied to clipboard' : 'Share this bundle'}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-all cursor-pointer ${
        copied
          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 shadow-xs'
          : 'bg-white/80 dark:bg-slate-800/60 border-purple-200/60 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white shadow-xs'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Share</span>
        </>
      )}
    </button>
  );
}
