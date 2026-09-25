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
    <div className={`bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="w-4 h-4 text-blue-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-white">
          Source Verification & Evidence Log
        </h4>
      </div>
      <p className="text-xs text-slate-300 mb-4 leading-relaxed">
        We independently verify technical claims and specifications directly against manufacturer documentation or lab audits.
      </p>

      <div className="space-y-3">
        {evidences.map(ev => (
          <div
            key={ev.id}
            className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-xl p-3.5 text-xs text-slate-300 shadow-md"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span className="font-semibold text-slate-200">{ev.sourceType}</span>
              <span>Audited {new Date(ev.retrievedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="flex items-start gap-2 italic text-slate-200 border-l-2 border-blue-400/60 pl-2.5 my-2">
              <Quote className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5 not-italic" />
              <span>&ldquo;{ev.quote}&rdquo;</span>
            </div>
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-medium">Confidence: {ev.confidence}</span>
              <a
                href={ev.sourceUrl}
                target="_blank"
                rel="nofollow noopener"
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
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
