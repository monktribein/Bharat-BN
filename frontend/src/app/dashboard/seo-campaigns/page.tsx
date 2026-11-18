import { TrendingUp, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SeoCampaignsDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Pay-As-You-Rank™ Campaign Engine
        </h1>
        <p className="text-sm text-slate-500">
          Milestone-verified Google visibility contracts. Dual observations (≥ 24h apart) required before milestone unlocks.
        </p>
      </div>

      {/* Active Campaign Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="text-xs text-brand-600 font-bold uppercase tracking-wider">
              Campaign ID: CAMP-001 • Apex Dental Care
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              "best dental clinic in andheri west"
            </h2>
            <div className="text-xs text-slate-500 mt-1">
              Target City: Mumbai (Mobile) • Language: EN • SERP Provider: DataForSEO
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400">Current SERP Rank</div>
              <div className="text-3xl font-black text-emerald-600">#8</div>
            </div>
            <div className="text-right border-l border-slate-200 pl-4">
              <div className="text-xs text-slate-400">Baseline</div>
              <div className="text-xl font-bold text-slate-500">#48</div>
            </div>
          </div>
        </div>

        {/* 3 Milestones Progress Bar (BN-072) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Contract Milestones (₹20,000 Total Value)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Milestone 1: 25% Advance */}
            <div className="bg-emerald-50/60 border border-emerald-200 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">1. Advance (25%)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-lg font-bold text-slate-900">₹5,000</div>
              <div className="text-[11px] text-emerald-700 font-medium">
                Paid on campaign activation
              </div>
            </div>

            {/* Milestone 2: 25% Top 20 */}
            <div className="bg-emerald-50/60 border border-emerald-200 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">2. Top-20 Verified (25%)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-lg font-bold text-slate-900">₹5,000</div>
              <div className="text-[11px] text-emerald-700 font-medium">
                Verified at position #14 & paid
              </div>
            </div>

            {/* Milestone 3: 50% Top 10 */}
            <div className="bg-amber-50/60 border border-amber-200 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800">3. Top-10 Verified (50%)</span>
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
              </div>
              <div className="text-lg font-bold text-slate-900">₹10,000</div>
              <div className="text-[11px] text-amber-700 font-medium">
                Eligible! 2 observations ≥ 24h verified (Awaiting SEO Manager Sign-off)
              </div>
            </div>
          </div>
        </div>

        {/* Dual Verification Audit Log (BN-073) */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Dual-Proof Audit Trail (BN-073 Standard)
          </div>
          <div className="text-xs text-slate-600 space-y-1 font-mono">
            <div>✓ Observation 1: Position #8 recorded at 2026-11-13 02:00:00 UTC (Provider: DataForSEO)</div>
            <div>✓ Observation 2: Position #7 recorded at 2026-11-14 14:00:00 UTC (Provider: DataForSEO)</div>
            <div className="text-emerald-700 font-sans font-medium text-[11px] pt-1">
              Time separation: 36 hours (&gt; 24h statutory rule satisfied). Milestone approved for invoicing.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

