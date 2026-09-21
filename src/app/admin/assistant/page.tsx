import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  PackageCheck, 
  ExternalLink 
} from 'lucide-react';
import { catalogRepository } from '../../../lib/db/repository';

export const dynamic = 'force-dynamic';

export default function AdminAssistantLogsPage() {
  const logs = catalogRepository.getAssistantLogs();
  const hallucinationCount = logs.filter(l => l.isHallucination).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            AI Shopping Receptionist Audit & Hallucination Guard
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time verification of Sage recommendations against active catalog inventory.
          </p>
        </div>

        <Link
          href="/assistant"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 text-xs font-semibold shadow-xs"
        >
          <span>Open Sage Assistant</span>
          <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
        </Link>
      </div>

      {/* Hallucination Alarm Status Banner */}
      <div className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
        hallucinationCount === 0
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
          : 'bg-rose-50 border-rose-300 text-rose-900'
      }`}>
        <div className="flex items-start gap-3">
          {hallucinationCount === 0 ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 text-xs">
            <div className="font-bold text-sm">
              {hallucinationCount === 0
                ? 'Hallucination Guard: 100% Catalog-Grounded'
                : `ALERT: ${hallucinationCount} Ungrounded Reference(s) Detected!`}
            </div>
            <p className="leading-relaxed opacity-90">
              The AI receptionist is strictly constrained to query existing catalog products via <code className="bg-white/60 px-1 py-0.5 rounded font-mono">catalogSearch</code> and never invents unlisted models, unverified prices, or deceptive claims.
            </p>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold shrink-0 ${
          hallucinationCount === 0
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-rose-200 text-rose-800'
        }`}>
          {hallucinationCount} ALARMS
        </span>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
            Recorded Conversations ({logs.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-[#F7F7F4] text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Shopper Query</th>
                <th className="py-3 px-4">Sage Grounded Response</th>
                <th className="py-3 px-4">Referenced Items</th>
                <th className="py-3 px-4 text-right">Grounding Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-neutral-50/80 transition-colors">
                  {/* Timestamp */}
                  <td className="py-3 px-4 text-neutral-400 font-mono text-[11px] whitespace-nowrap">
                    {new Date(log.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>

                  {/* User Query */}
                  <td className="py-3 px-4 font-semibold text-neutral-900 max-w-xs">
                    &ldquo;{log.userMessage}&rdquo;
                  </td>

                  {/* Sage Response Preview */}
                  <td className="py-3 px-4 text-neutral-600 max-w-md line-clamp-2">
                    {log.assistantReply}
                  </td>

                  {/* Referenced Items */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {log.productsReferenced.length === 0 ? (
                        <span className="text-neutral-400 italic">None</span>
                      ) : (
                        log.productsReferenced.map(pid => (
                          <span
                            key={pid}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-[#234F9E] text-[10px] font-mono font-semibold"
                          >
                            <PackageCheck className="w-3 h-3" />
                            <span>{pid}</span>
                          </span>
                        ))
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {log.isHallucination ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
                        <AlertOctagon className="w-3 h-3" />
                        <span>Hallucination</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Grounded</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
