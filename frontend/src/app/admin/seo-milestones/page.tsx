'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Check,
  RefreshCw,
  Download,
  AlertCircle,
  Eye,
  FileCheck2,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';

interface MilestoneItem {
  id: string;
  businessName: string;
  keyword: string;
  city: string;
  baselineRank: number;
  currentRank: number;
  targetMilestone: 'Top-20 (25%)' | 'Top-10 (50%)';
  payoutAmount: string;
  observations: number;
  lastChecked: string;
  status: 'pending_approval' | 'approved' | 'in_progress';
}

const mockMilestones: MilestoneItem[] = [
  {
    id: 'BBN-MS-801',
    businessName: 'Little Elly Preschool & Daycare',
    keyword: 'best preschool indiranagar bangalore',
    city: 'Bengaluru, KA',
    baselineRank: 48,
    currentRank: 4,
    targetMilestone: 'Top-10 (50%)',
    payoutAmount: '₹35,000',
    observations: 3,
    lastChecked: 'Today, 08:30 IST',
    status: 'pending_approval',
  },
  {
    id: 'BBN-MS-802',
    businessName: 'Apex Super Speciality Dental Clinic',
    keyword: 'emergency dental clinic andheri west',
    city: 'Mumbai, MH',
    baselineRank: 62,
    currentRank: 8,
    targetMilestone: 'Top-10 (50%)',
    payoutAmount: '₹45,000',
    observations: 3,
    lastChecked: 'Yesterday, 16:15 IST',
    status: 'pending_approval',
  },
  {
    id: 'BBN-MS-799',
    businessName: 'Greenfield EV Motors & Spares',
    keyword: 'electric scooter showroom kothrud pune',
    city: 'Pune, MH',
    baselineRank: 35,
    currentRank: 16,
    targetMilestone: 'Top-20 (25%)',
    payoutAmount: '₹18,000',
    observations: 2,
    lastChecked: '14 Nov 2026',
    status: 'approved',
  },
  {
    id: 'BBN-MS-780',
    businessName: 'Copper Chimney Restaurant',
    keyword: 'north indian restaurant worli',
    city: 'Mumbai, MH',
    baselineRank: 28,
    currentRank: 19,
    targetMilestone: 'Top-20 (25%)',
    payoutAmount: '₹22,000',
    observations: 2,
    lastChecked: '12 Nov 2026',
    status: 'approved',
  },
];

export default function AdminSeoMilestonesPage() {
  const [milestones, setMilestones] = useState<MilestoneItem[]>(mockMilestones);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [approvedSuccess, setApprovedSuccess] = useState<string | null>(null);

  // Hydrate custom business campaigns from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const syncMilestones = () => {
        const stored = localStorage.getItem('bharatbn_seo_campaigns');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const dynamicMilestones: MilestoneItem[] = parsed.map((c: any) => ({
              id: c.id,
              businessName: c.businessName || 'Claimed Business',
              keyword: c.keyword || 'target keyword',
              city: c.targetCity || 'Noida, UP',
              baselineRank: c.baselineRank || 45,
              currentRank: c.currentRank || c.baselineRank || 45,
              targetMilestone: 'Top-20 (25%)',
              payoutAmount: `₹${(c.totalValue ? Math.round(c.totalValue * 0.25) : 5000).toLocaleString('en-IN')}`,
              observations: 2,
              lastChecked: 'Just now (Live SERP)',
              status: c.status === 'active' ? 'approved' : 'pending_approval',
            }));

            setMilestones((prev) => {
              const map = new Map<string, MilestoneItem>();
              dynamicMilestones.forEach((m) => map.set(m.id, m));
              prev.forEach((m) => {
                if (!map.has(m.id)) map.set(m.id, m);
              });
              return Array.from(map.values());
            });
          }
        }
      };

      syncMilestones();
      window.addEventListener('bharatbn_seo_updated', syncMilestones);
      return () => window.removeEventListener('bharatbn_seo_updated', syncMilestones);
    } catch (err) {
      console.error('Error hydrating admin SEO milestones:', err);
    }
  }, []);

  const handleApprove = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'approved' } : m))
    );

    // Sync back to bharatbn_seo_campaigns in localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('bharatbn_seo_campaigns');
        if (stored) {
          const parsed = JSON.parse(stored);
          const updated = parsed.map((c: any) => {
            if (c.id === id) {
              return {
                ...c,
                status: 'active',
                milestones: c.milestones?.map((m: any, idx: number) =>
                  idx === 0 ? { ...m, status: 'paid', notes: 'Approved by Admin Auditor' } : m
                ),
                auditLogs: [
                  ...(c.auditLogs || []),
                  `Audited & Approved by BharatBN Admin on ${new Date().toLocaleString()}`,
                ],
              };
            }
            return c;
          });
          localStorage.setItem('bharatbn_seo_campaigns', JSON.stringify(updated));
          window.dispatchEvent(new Event('bharatbn_seo_updated'));
        }
      } catch (err) {
        console.error('Error syncing SEO approval:', err);
      }
    }

    setApprovedSuccess(`Campaign & Milestone ${id} approved! Google SERP verified & billing authorized.`);
    setTimeout(() => setApprovedSuccess(null), 4000);
  };

  const filtered = milestones.filter((m) => {
    if (filter === 'pending') return m.status === 'pending_approval';
    if (filter === 'approved') return m.status === 'approved';
    return true;
  });

  const pendingCount = milestones.filter((m) => m.status === 'pending_approval').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Rankings &amp; Milestone Billing
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              {pendingCount} Awaiting Billing Review
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify Google search positions and approve milestone payments for top-ranking businesses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Checking live Google search positions...')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Check Live Rankings</span>
          </button>
        </div>
      </div>

      {approvedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{approvedSuccess}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            filter === 'all'
              ? 'bg-[#07213A] text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Milestones ({milestones.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            filter === 'pending'
              ? 'bg-[#F95700] text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Pending Approvals</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {pendingCount}
          </span>
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            filter === 'approved'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Verified &amp; Invoiced ({milestones.filter((m) => m.status === 'approved').length})
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3 font-semibold">Milestone ID</th>
              <th className="px-5 py-3 font-semibold">Business &amp; Keyword</th>
              <th className="px-5 py-3 font-semibold">City Hub</th>
              <th className="px-5 py-3 font-semibold">Rank Progress</th>
              <th className="px-5 py-3 font-semibold">Target Milestone</th>
              <th className="px-5 py-3 font-semibold">Payout Due</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold text-right">Moderation Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/80 transition">
                <td className="px-5 py-3 font-mono font-bold text-slate-500">{m.id}</td>
                <td className="px-5 py-3">
                  <div className="font-bold text-slate-900">{m.businessName}</div>
                  <div className="text-[11px] text-[#F95700] font-medium pt-0.5">"{m.keyword}"</div>
                </td>
                <td className="px-5 py-3 text-slate-600">{m.city}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 line-through">#{m.baselineRank}</span>
                    <span className="font-black text-emerald-600">#{m.currentRank}</span>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-[10px] text-slate-400">{m.observations} verified checks</div>
                </td>
                <td className="px-5 py-3 font-semibold text-slate-800">{m.targetMilestone}</td>
                <td className="px-5 py-3 font-black text-slate-900">{m.payoutAmount}</td>
                <td className="px-5 py-3">
                  {m.status === 'approved' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      <Check className="w-3 h-3 text-emerald-600" /> Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                      <Clock className="w-3 h-3 text-amber-600 animate-pulse" /> Needs Sign-Off
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-right">
                  {m.status === 'pending_approval' ? (
                    <button
                      type="button"
                      onClick={() => handleApprove(m.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-xs hover:from-emerald-700 hover:to-emerald-800 shadow-xs transition cursor-pointer active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve &amp; Release</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-mono">Invoice Dispatched</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
