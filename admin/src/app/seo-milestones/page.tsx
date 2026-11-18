'use client';

import { useState } from 'react';
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

  const handleApprove = (id: string) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, status: 'approved' } : m))
    );
    setApprovedSuccess(`Milestone ${id} authorized. Dual-witness audit logged and billing invoice dispatched.`);
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
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2.5 rounded-md flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">{approvedSuccess}</span>
          </div>
          <button onClick={() => setApprovedSuccess(null)} className="text-emerald-600 hover:text-emerald-900">
            &times;
          </button>
        </div>
      )}

      {/* KPI Tiles Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active PAYR Campaigns</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">42 Keywords</div>
          <div className="text-[11px] text-emerald-600 font-medium">
            35 achieving Top-10
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pending Authorizations</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600">₹80,000</div>
          <div className="text-[11px] text-slate-500 font-mono">
            2 milestones ready to bill
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Authorized YTD Settlements</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">₹8,45,000</div>
          <div className="text-[11px] text-slate-500 font-mono">
            Zero chargeback disputes
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Audit Verification Protocol</span>
            <FileCheck2 className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 pt-1">Dual-SERP Consensus</div>
          <div className="text-[11px] text-slate-500 font-mono">
            48h Rank Persistence Rule
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded text-[11px] font-medium transition ${
            filter === 'all'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Milestones ({milestones.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1 rounded text-[11px] font-medium transition ${
            filter === 'pending'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pending Authorization ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-3 py-1 rounded text-[11px] font-medium transition ${
            filter === 'approved'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Authorized ({milestones.length - pendingCount})
        </button>
      </div>

      {/* Milestones Data Table */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Milestone ID &amp; Business</th>
                <th className="py-2.5 px-4 font-semibold">Target Keyword &amp; City</th>
                <th className="py-2.5 px-4 font-semibold">SERP Movement</th>
                <th className="py-2.5 px-4 font-semibold">Milestone Target</th>
                <th className="py-2.5 px-4 font-semibold">Persistence (48h)</th>
                <th className="py-2.5 px-4 font-semibold">Payout Escrow</th>
                <th className="py-2.5 px-4 text-right font-semibold">Authorization Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.map((item) => {
                const rankGain = item.baselineRank - item.currentRank;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] font-bold text-slate-500">{item.id}</div>
                      <div className="font-semibold text-slate-900 text-xs mt-0.5">{item.businessName}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 font-mono text-[11px]">{item.keyword}</div>
                      <div className="text-[11px] text-slate-400">{item.city}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-slate-400 line-through">#{item.baselineRank}</span>
                        <span className="text-slate-400">&rarr;</span>
                        <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          #{item.currentRank}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                          (+{rankGain})
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-slate-700 text-[11px]">
                      {item.targetMilestone}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-1">
                          {[1, 2, 3].map((dot) => (
                            <span
                              key={dot}
                              className={`w-2 h-2 rounded-full ${
                                dot <= item.observations
                                  ? 'bg-emerald-500'
                                  : 'bg-slate-200'
                              }`}
                              title={`Check ${dot} of 3 verified`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          {item.observations}/3 Verified
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-xs">
                      {item.payoutAmount}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {item.status === 'pending_approval' ? (
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition shadow-xs inline-flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Authorize Settlement</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Authorized
                        </span>
                      )}
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
