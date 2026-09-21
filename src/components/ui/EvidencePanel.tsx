import React from 'react';
import { SourceEvidence } from '../../types';
import { ShieldCheck, ExternalLink, Quote } from 'lucide-react';

interface EvidencePanelProps {
  evidences: SourceEvidence[];
  className?: string;
}

export function EvidencePanel({ evidences, className = '' }: EvidencePanelProps) {
  if (evidences.length === 0) return null;

  return (
    <div className={`bg-[#F0F1ED] border border-[#E2E5EB] rounded-xl p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="w-4 h-4 text-[#1D438A]" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
          Source Verification & Evidence Log
        </h4>
      </div>
      <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
        We independently verify technical claims and specifications directly against manufacturer documentation or lab audits.
      </p>

      <div className="space-y-3">
        {evidences.map(ev => (
          <div
            key={ev.id}
            className="bg-white border border-[#E2E5EB] rounded-lg p-3.5 text-xs text-neutral-700 shadow-xs"
          >
            <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5">
              <span className="font-semibold text-neutral-700">{ev.sourceType}</span>
              <span>Audited {new Date(ev.retrievedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="flex items-start gap-2 italic text-neutral-600 border-l-2 border-[#1D438A]/40 pl-2.5 my-2">
              <Quote className="w-3.5 h-3.5 text-[#1D438A] shrink-0 mt-0.5 not-italic" />
              <span>&ldquo;{ev.quote}&rdquo;</span>
            </div>
            <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-medium">Confidence: {ev.confidence}</span>
              <a
                href={ev.sourceUrl}
                target="_blank"
                rel="nofollow noopener"
                className="text-[#1D438A] hover:underline flex items-center gap-1"
              >
                <span>Audit Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
