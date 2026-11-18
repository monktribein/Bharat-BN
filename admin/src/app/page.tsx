'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Building2,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileCheck,
  AlertCircle,
  ExternalLink,
  Download,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  FileText,
  Activity,
  Layers,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Database,
} from 'lucide-react';

interface ClaimItem {
  id: string;
  businessName: string;
  city: string;
  category: string;
  claimant: string;
  email: string;
  phone: string;
  docType: string;
  fileName: string;
  confidenceScore: number;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const defaultClaims: ClaimItem[] = [
  {
    id: 'BBN-CLM-799760',
    businessName: 'Apple',
    city: 'Noida, UP',
    category: 'Automobile & EV',
    claimant: 'Kashish Saxena (CEO)',
    email: 'kashish.saxena.123056@gmail.com',
    phone: '+91 97170 56860',
    docType: 'GST Registration Certificate',
    fileName: 'Apple_GST_Certificate_Noida.pdf',
    confidenceScore: 98,
    submittedAt: 'Today, 10:50 IST (New)',
    status: 'pending',
  },
  {
    id: 'BBN-CLM-982104',
    businessName: 'Choco Delights & Confectionery (Cadboury)',
    city: 'Mumbai, MH',
    category: 'Food, Bakeries & Confectionery',
    claimant: 'Cadboury Admin',
    email: 'cad@gmail.com',
    phone: '+91 89653 26578',
    docType: 'Commercial Electricity Bill',
    fileName: 'Cadboury_Commercial_Bill.pdf',
    confidenceScore: 98,
    submittedAt: 'Just now (New)',
    status: 'pending',
  },
  {
    id: 'BBN-CLM-849102',
    businessName: 'Apex Super Speciality Dental Clinic',
    city: 'Mumbai, MH',
    category: 'Healthcare',
    claimant: 'Dr. Rajesh Sharma',
    email: 'rajesh@apexclinic.com',
    phone: '+91 98200 12345',
    docType: 'GSTIN Certificate',
    fileName: 'Apex_GST_Certificate_2026.pdf',
    confidenceScore: 99,
    submittedAt: '12m ago',
    status: 'pending',
  },
  {
    id: 'BBN-CLM-623194',
    businessName: 'Little Elly Preschool & Daycare',
    city: 'Bengaluru, KA',
    category: 'Education',
    claimant: 'Sunita Rao',
    email: 'director@littleellyindiranagar.com',
    phone: '+91 98450 67890',
    docType: 'Shop & Est. License',
    fileName: 'LittleElly_Govt_License_KA.pdf',
    confidenceScore: 94,
    submittedAt: '45m ago',
    status: 'pending',
  },
  {
    id: 'BBN-CLM-419082',
    businessName: 'Greenfield EV Motors & Spares',
    city: 'Pune, MH',
    category: 'Automobile',
    claimant: 'Anil Deshmukh',
    email: 'anil@greenfieldev.in',
    phone: '+91 97654 32100',
    docType: 'Commercial Power Bill',
    fileName: 'MSEDCL_Power_Bill_Jan2026.jpg',
    confidenceScore: 88,
    submittedAt: '2h ago',
    status: 'pending',
  },
  {
    id: 'BBN-CLM-310928',
    businessName: 'Dr Batra’s Positive Health Clinic',
    city: 'Mumbai, MH',
    category: 'Healthcare',
    claimant: 'Dr. Neha Kapoor',
    email: 'dr.neha@drbatras.com',
    phone: '+91 98200 99999',
    docType: 'Corporate GST Master',
    fileName: 'DrBatras_Corporate_GST.pdf',
    confidenceScore: 100,
    submittedAt: '4h ago',
    status: 'approved',
  },
];

interface ActivityItem {
  id?: string;
  claimId?: string;
  time: string;
  title: string;
  description: string;
  badge: string;
  badgeVariant: 'amber' | 'emerald' | 'blue' | 'slate';
}

const initialActivities: ActivityItem[] = [
  {
    id: 'act-apple',
    claimId: 'BBN-CLM-799760',
    time: '5m ago',
    title: 'New Claim Submitted',
    description: 'Apple (Noida) submitted GST registration certificate for ownership audit.',
    badge: 'Pending Review',
    badgeVariant: 'amber',
  },
  {
    id: 'act-choco',
    claimId: 'BBN-CLM-982104',
    time: '18m ago',
    title: 'New Claim Submitted',
    description: 'Choco Delights & Confectionery uploaded commercial verification proof.',
    badge: 'Pending Review',
    badgeVariant: 'amber',
  },
  {
    id: 'act-apex',
    time: '45m ago',
    title: 'Document Verified',
    description: 'Apex Dental verified against GST registry (99% name match).',
    badge: 'Verified',
    badgeVariant: 'emerald',
  },
  {
    id: 'act-elly',
    time: '2h ago',
    title: 'Google Top 5 Milestone',
    description: 'Little Elly Preschool reached Rank #1 on Google in Indiranagar.',
    badge: 'Payout Due',
    badgeVariant: 'blue',
  },
  {
    id: 'act-batra',
    time: '4h ago',
    title: 'Chain Outlets Updated',
    description: 'Dr Batra’s updated addresses for 215 clinic branches.',
    badge: 'Directory',
    badgeVariant: 'slate',
  },
];

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [claimsList, setClaimsList] = useState<ClaimItem[]>(defaultClaims);
  const [activitiesList, setActivitiesList] = useState<ActivityItem[]>(initialActivities);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const stored = localStorage.getItem('bharatbn_claims_store');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const formatted: ClaimItem[] = parsed.map((p: any) => ({
              id: p.id,
              businessName: p.businessName,
              city: p.city,
              category: p.category,
              claimant: p.claimantName || p.claimant,
              email: p.workEmail || p.email,
              phone: p.phone,
              docType: p.docType,
              fileName: p.fileName,
              confidenceScore: p.gstinMatch || 96,
              submittedAt: p.submittedAt,
              status: p.status,
            }));

            setClaimsList((prev) => {
              const map = new Map<string, ClaimItem>();
              formatted.forEach((c) => map.set(c.id, c));
              prev.forEach((c) => {
                if (!map.has(c.id)) map.set(c.id, c);
              });
              return Array.from(map.values());
            });

            // Update activities list with any approved/rejected stored statuses
            setActivitiesList((prev) =>
              prev.map((act) => {
                const matched = parsed.find(
                  (p: any) => p.id === act.claimId || (p.businessName && act.description.includes(p.businessName))
                );
                if (matched && matched.status === 'approved') {
                  return {
                    ...act,
                    title: 'Claim Approved & Verified',
                    description: `${matched.businessName} verified against GST registry. Verified badge granted.`,
                    badge: 'Approved',
                    badgeVariant: 'emerald' as const,
                  };
                } else if (matched && matched.status === 'rejected') {
                  return {
                    ...act,
                    title: 'Claim Rejected',
                    description: `${matched.businessName} ownership claim was rejected.`,
                    badge: 'Rejected',
                    badgeVariant: 'slate' as const,
                  };
                }
                return act;
              })
            );
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    syncFromStorage();
    window.addEventListener('bharatbn_claims_updated', syncFromStorage);
    return () => window.removeEventListener('bharatbn_claims_updated', syncFromStorage);
  }, []);

  const handleAction = (id: string, decision: 'approved' | 'rejected') => {
    let targetName = '';
    setClaimsList((prev) => {
      const updated = prev.map((c) => {
        if (c.id === id) {
          targetName = c.businessName;
          return { ...c, status: decision };
        }
        return c;
      });
      try {
        localStorage.setItem('bharatbn_claims_store', JSON.stringify(updated));
        window.dispatchEvent(new Event('bharatbn_claims_updated'));
      } catch (e) {}
      return updated;
    });

    // Reactively update the Recent Activity side card
    setActivitiesList((prev) =>
      prev.map((act) => {
        const isTarget = act.claimId === id || (targetName && act.description.includes(targetName));
        if (isTarget) {
          if (decision === 'approved') {
            return {
              ...act,
              time: 'Just now',
              title: 'Claim Approved & Verified',
              description: `${targetName || 'Business'} verified against GST registry. Verified badge granted.`,
              badge: 'Approved',
              badgeVariant: 'emerald' as const,
            };
          } else {
            return {
              ...act,
              time: 'Just now',
              title: 'Claim Rejected',
              description: `${targetName || 'Business'} ownership claim was rejected.`,
              badge: 'Rejected',
              badgeVariant: 'slate' as const,
            };
          }
        }
        return act;
      })
    );

    setToastMessage(`Claim ${id} marked as ${decision.toUpperCase()}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setToastMessage('Dashboard data refreshed.');
      setTimeout(() => setToastMessage(null), 3000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#07213A] text-white text-xs px-4 py-3 rounded-lg shadow-xl border border-navy-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Admin Dashboard
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Overview
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage business listings, review ownership claims, and monitor search ranking milestones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time range selector */}
          <div className="bg-slate-100 p-0.5 rounded-md border border-slate-200 flex items-center text-xs">
            {[
              { id: '24h', label: 'Today' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '3 Months' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setTimeRange(r.id as any)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                  timeRange === r.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => alert('Exporting directory listings CSV...')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#07213A] hover:bg-[#0C2D4E] rounded-md transition shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Verified Listings</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {claimsList.filter((c) => c.status === 'approved').length + 5}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <span>↑ 12.4%</span>
            <span className="text-slate-400 font-normal">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Pending Approvals</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600">
            {claimsList.filter((c) => c.status === 'pending').length}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">Requires review</span>
            <span className="text-slate-400">&bull; Avg SLA: 3 hrs</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Franchise Outlets</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">2,490</div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span className="text-emerald-600 font-semibold">38 National Brands</span>
            <span className="text-slate-400 font-normal">&bull; Verified</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Top 10 Rankings</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600">42 Keywords</div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-800">₹8,45,000</span>
            <span className="text-slate-400">billed this cycle</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Customer Inquiries</span>
            <Activity className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">64,280</div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span className="text-emerald-600 font-semibold">99.2%</span>
            <span className="text-slate-400">WhatsApp delivered</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Approvals & Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Pending Business Approvals (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            {/* Table Header */}
            <div className="p-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">
                    Pending Business Approvals
                  </h2>
                  <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                    {claimsList.filter((c) => c.status === 'pending').length} Needs Review
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Review submitted proof documents to verify and approve business ownership.
                </p>
              </div>

              <Link
                href="/claims"
                className="text-xs font-semibold text-[#F95700] hover:text-[#d94a00] flex items-center gap-1 self-start sm:self-auto"
              >
                <span>View all claims</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Business</th>
                    <th className="py-2.5 px-4 font-semibold">Applicant &amp; Contact</th>
                    <th className="py-2.5 px-4 font-semibold">Uploaded Document</th>
                    <th className="py-2.5 px-4 font-semibold">Verification Match</th>
                    <th className="py-2.5 px-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {claimsList.map((claim) => (
                    <tr
                      key={claim.id}
                      className={`hover:bg-slate-50/80 transition ${
                        claim.status === 'approved' ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 text-xs">{claim.businessName}</div>
                        <div className="text-[11px] text-slate-500">{claim.city} &bull; {claim.category}</div>
                        <div className="font-mono text-[10px] text-slate-400 mt-0.5">{claim.id}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{claim.claimant}</div>
                        <div className="text-[11px] text-slate-500">{claim.email}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{claim.phone}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded">
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span className="truncate max-w-[130px]" title={claim.fileName}>{claim.fileName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{claim.docType}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full ${
                                claim.confidenceScore >= 95
                                  ? 'bg-emerald-500'
                                  : claim.confidenceScore >= 85
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${claim.confidenceScore}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-semibold text-slate-700">
                            {claim.confidenceScore}%
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">GSTIN Match</span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {claim.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleAction(claim.id, 'approved')}
                              className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition flex items-center gap-1 cursor-pointer"
                              title="Approve and grant verified badge"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleAction(claim.id, 'rejected')}
                              className="px-2 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded transition cursor-pointer"
                              title="Reject claim"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-semibold capitalize px-2 py-0.5 rounded ${
                              claim.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {claim.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Showing {claimsList.length} business claims</span>
            <span className="text-slate-400 text-[10px]">Verified against Govt Trade Registry &amp; GSTIN</span>
          </div>
        </div>

        {/* Right Column: Search Rankings & Recent Activity (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search Rankings Card */}
          <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google Search Rankings</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">120 Tracked Keywords</span>
            </div>

            {/* Custom Progress Distribution Bar */}
            <div className="space-y-1.5">
              <div className="h-2 w-full bg-slate-100 rounded-full flex overflow-hidden">
                <div style={{ width: '35%' }} className="bg-emerald-500" title="Rank 1-10: 42 (35%)" />
                <div style={{ width: '30%' }} className="bg-blue-500" title="Rank 11-20: 36 (30%)" />
                <div style={{ width: '25%' }} className="bg-amber-400" title="Rank 21-50: 30 (25%)" />
                <div style={{ width: '10%' }} className="bg-slate-300" title="Beyond 50: 12 (10%)" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="flex items-center justify-between border-l-2 border-emerald-500 pl-2">
                  <span className="text-[11px] text-slate-500">Rank 1 – 10</span>
                  <span className="font-mono font-bold text-slate-900">42 (35%)</span>
                </div>
                <div className="flex items-center justify-between border-l-2 border-blue-500 pl-2">
                  <span className="text-[11px] text-slate-500">Rank 11 – 20</span>
                  <span className="font-mono font-bold text-slate-900">36 (30%)</span>
                </div>
                <div className="flex items-center justify-between border-l-2 border-amber-400 pl-2">
                  <span className="text-[11px] text-slate-500">Rank 21 – 50</span>
                  <span className="font-mono font-bold text-slate-900">30 (25%)</span>
                </div>
                <div className="flex items-center justify-between border-l-2 border-slate-300 pl-2">
                  <span className="text-[11px] text-slate-500">Beyond 50</span>
                  <span className="font-mono font-bold text-slate-900">12 (10%)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Earned This Billing Cycle:</span>
              <span className="font-mono font-bold text-emerald-600">₹1,85,000</span>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#F95700]" />
                <span>Recent Activity</span>
              </h3>
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {activitiesList.map((act, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-xs">{act.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{act.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {act.description}
                  </p>
                  <div className="pt-0.5">
                    <span
                      className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        act.badgeVariant === 'amber'
                          ? 'bg-amber-100 text-amber-800'
                          : act.badgeVariant === 'emerald'
                          ? 'bg-emerald-100 text-emerald-800'
                          : act.badgeVariant === 'blue'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {act.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/claims"
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 pt-1"
            >
              <span>View full claim queue</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
