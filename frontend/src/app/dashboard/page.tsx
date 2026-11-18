import Link from 'next/link';
import {
  Building2,
  Users,
  MessageSquare,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Operations & Portal Overview
          </h1>
          <p className="text-sm text-slate-500">
            Unified control center for Business Owners, Franchise HQ & SEO Managers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/branches"
            className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 transition"
          >
            Manage Branches
          </Link>
          <Link
            href="/dashboard/seo-campaigns"
            className="text-xs font-semibold bg-brand-600 text-white px-4 py-2 rounded-xl hover:bg-brand-700 transition"
          >
            SEO Campaigns
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Verified Inquiries</span>
            <MessageSquare className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">128</div>
          <div className="text-[11px] text-emerald-600 font-medium">
            +18% from last week
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Active Outlets</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">185</div>
          <div className="text-[11px] text-slate-500">Across 14 Tier-1/2 cities</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Top-10 Keywords</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">14</div>
          <div className="text-[11px] text-emerald-600 font-medium">
            Dual-verified milestones
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Pending Claim Queue</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">3</div>
          <div className="text-[11px] text-amber-600 font-medium">
            Requires admin decision
          </div>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/branches"
          className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-500 transition space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Franchise Network</h3>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Bulk import branch master records, assign outlet managers, and track geographic branch distribution.
          </p>
        </Link>

        <Link
          href="/dashboard/leads"
          className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-500 transition space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Leads & Inquiries</h3>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Real-time lead log with verified consent timestamps, source URL, UTM parameters, and WhatsApp delivery.
          </p>
        </Link>

        <Link
          href="/dashboard/seo-campaigns"
          className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-500 transition space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Pay-As-You-Rank™ Tracker</h3>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Inspect live SERP rankings, dual-proof validation records (24h spacing), and milestone payout invoices.
          </p>
        </Link>
      </div>
    </div>
  );
}

