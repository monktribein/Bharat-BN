'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  MessageSquare,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle,
  ShieldCheck,
  LogIn,
  Edit,
  ExternalLink,
  Sparkles,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import BusinessLoginModal from '@/components/BusinessLoginModal';

interface OwnerSession {
  businessId: string;
  businessName: string;
  businessSlug: string;
  ownerName: string;
  phone?: string;
  email?: string;
  city?: string;
  category?: string;
  status?: string;
}

export default function DashboardOverviewPage() {
  const [session, setSession] = useState<OwnerSession | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const syncSession = () => {
      try {
        const stored = localStorage.getItem('bharatbn_owner_session');
        if (stored) {
          setSession(JSON.parse(stored));
        } else {
          setSession(null);
        }
      } catch {
        setSession(null);
      }
    };

    syncSession();
    window.addEventListener('bharatbn_auth_changed', syncSession);
    return () => window.removeEventListener('bharatbn_auth_changed', syncSession);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Logged in Owner Banner vs Guest Banner */}
      {session ? (
        <div className="p-6 bg-gradient-to-r from-[#07213A] to-[#0D3861] rounded-2xl text-white shadow-lg border border-navy-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Active Owner Session
              </span>
              <span className="text-xs text-slate-300 font-mono">ID: {session.businessId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {session.businessName} Operations Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Welcome back, <strong className="text-white">{session.ownerName}</strong> &bull; {session.city || 'Noida, UP'} &bull; {session.category || 'Automobile & EV'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={`/biz/${session.businessSlug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition cursor-pointer"
            >
              <span>View Public Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href={`/claim/${session.businessId || session.businessSlug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition shadow-sm cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5 text-[#F95700]" />
              <span>Edit Listing</span>
            </Link>

            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
            >
              <span>Switch Business</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F95700] uppercase tracking-wider">
                Business Owner Access
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Already listed your business on BharatBN?
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Log in to your business account (e.g. <strong>Apple</strong>, <strong>Choco Delights</strong>, or your registered brand) to manage branches, respond to direct customer leads, and track Google rankings under Pay-As-You-Rank™.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#F95700]/20 transition flex-shrink-0 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Log In to Your Business</span>
          </button>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Operations &amp; Portal Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Unified control center for Business Owners, Franchise HQ &amp; SEO Managers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/branches"
            className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 transition shadow-xs"
          >
            Manage Branches
          </Link>
          <Link
            href="/dashboard/seo-campaigns"
            className="text-xs font-semibold bg-[#F95700] hover:bg-[#d94a00] text-white px-4 py-2 rounded-xl shadow-xs transition"
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
            <MessageSquare className="w-4 h-4 text-[#F95700]" />
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
            <span>Ownership Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {session?.status === 'approved' ? 'Verified' : 'Active'}
          </div>
          <div className="text-[11px] text-slate-500">
            {session ? 'Admin Audited & Verified' : 'Standard Directory Account'}
          </div>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/branches"
          className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#F95700] transition space-y-3 shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Franchise Network</h3>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#F95700] transition" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Bulk import branch master records, assign outlet managers, and track geographic branch distribution.
          </p>
        </Link>

        <Link
          href="/dashboard/leads"
          className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#F95700] transition space-y-3 shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Leads &amp; Inquiries</h3>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#F95700] transition" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Real-time lead log with verified consent timestamps, source URL, UTM parameters, and WhatsApp delivery.
          </p>
        </Link>

        <Link
          href="/dashboard/seo-campaigns"
          className="group bg-white p-6 rounded-2xl border border-[#F95700]/40 bg-gradient-to-br from-white to-[#F95700]/5 hover:border-[#F95700] transition space-y-3 shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-900 text-base">Pay-As-You-Rank™ Tracker</h3>
              <Sparkles className="w-4 h-4 text-[#F95700]" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#F95700] transition" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Inspect live Google SERP rankings, dual-proof validation records, and milestone payout escrow invoices.
          </p>
        </Link>
      </div>

      {/* Business Login Modal */}
      <BusinessLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
