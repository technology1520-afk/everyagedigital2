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
      <span className={`inline-flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200/70 ${className}`}>
        <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
        Checked {freshness.checkedDateFormatted} ({freshness.daysAgo}d ago) • Live verification recommended
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200/70 ${className}`}>
      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
      Verified {freshness.checkedDateFormatted}
    </span>
  );
}
