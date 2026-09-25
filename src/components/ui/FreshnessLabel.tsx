import React from 'react';
import { FreshnessResult } from '../../lib/affiliate/adapters';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FreshnessLabelProps {
  freshness?: FreshnessResult;
  className?: string;
}

export function FreshnessLabel({ freshness, className = '' }: FreshnessLabelProps) {
  if (!freshness) return null;

  if (freshness.isStale) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 backdrop-blur-md ${className}`}>
        <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
        Checked {freshness.checkedDateFormatted} ({freshness.daysAgo}d ago) • Live verification recommended
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 backdrop-blur-md ${className}`}>
      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
      Verified {freshness.checkedDateFormatted}
    </span>
  );
}
