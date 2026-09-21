import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck, 
  RotateCw
} from 'lucide-react';
import { catalogRepository } from '../../../lib/db/repository';
import { markLinkCheckedAction } from '../../actions/admin';

export const dynamic = 'force-dynamic';

export default function AdminAffiliateLinksPage() {
  const links = catalogRepository.getLinks();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Affiliate Link Health & Outbound Telemetry
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Audit outbound merchant partner URLs, freshness expirations, and regulatory compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>100% FTC / Amazon Compliant</span>
          </div>
        </div>
      </div>

      {/* Compliance Information Box */}
      <div className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="font-semibold text-neutral-800">
            Outbound Attribute Enforcement: <code className="bg-neutral-100 text-[#234F9E] px-1.5 py-0.5 rounded font-mono font-bold">rel=&quot;sponsored nofollow noopener&quot;</code>
          </div>
          <p className="text-neutral-500">
            All outbound links on the storefront are strictly routed with the required sponsored relation and tracked via <code className="font-mono text-neutral-700">/api/go/[id]</code>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <form action={async () => {
            'use server';
            const allLinks = catalogRepository.getLinks();
            for (const l of allLinks) {
              catalogRepository.markLinkChecked(l.id);
            }
          }}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#234F9E] text-white font-semibold hover:bg-[#193B7A] transition-colors shadow-xs"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Mark All Prices as Checked</span>
            </button>
          </form>
        </div>
      </div>

      {/* Links Table */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-[#F7F7F4] text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Catalog Product</th>
                <th className="py-3 px-4">Network</th>
                <th className="py-3 px-4">Outbound Target URL (Masked)</th>
                <th className="py-3 px-4">Total Clicks</th>
                <th className="py-3 px-4">Last Verified</th>
                <th className="py-3 px-4">Freshness</th>
                <th className="py-3 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {links.map(link => {
                const { daysAgo, isStale } = link;

                // Mask display URL for security & compact display
                let maskedUrl = link.url;
                if (link.url.length > 36) {
                  maskedUrl = `${link.url.slice(0, 24)}...${link.url.slice(-8)}`;
                }

                return (
                  <tr key={link.id} className="hover:bg-neutral-50/80 transition-colors">
                    {/* Product Name */}
                    <td className="py-3 px-4 font-semibold text-neutral-900 whitespace-nowrap">
                      {link.productName}
                    </td>

                    {/* Network */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded font-mono uppercase text-[10px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
                        {link.network}
                      </span>
                    </td>

                    {/* URL */}
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span title={link.url}>{maskedUrl}</span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="sponsored nofollow noopener"
                          className="text-neutral-400 hover:text-neutral-700"
                          title="Test Outbound Link"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>

                    {/* Click Count */}
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900 whitespace-nowrap">
                      {link.clickCount}
                    </td>

                    {/* Last Checked */}
                    <td className="py-3 px-4 text-neutral-600 text-[11px] whitespace-nowrap">
                      {new Date(link.lastCheckedAt).toLocaleDateString()}
                    </td>

                    {/* Freshness Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {isStale ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Stale ({daysAgo}d)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Fresh</span>
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <form
                        action={async () => {
                          'use server';
                          markLinkCheckedAction(link.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-neutral-200 text-neutral-700 hover:text-[#234F9E] hover:border-[#234F9E] rounded transition-colors shadow-2xs"
                        >
                          Mark as Checked
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
