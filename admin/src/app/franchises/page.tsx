'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  UploadCloud,
  CheckCircle2,
  ExternalLink,
  MapPin,
  ArrowRight,
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  PlusCircle,
  RefreshCw,
  MoreVertical,
  Check,
  X,
  FileText,
  Clock,
  Trash2,
  Phone,
} from 'lucide-react';

interface BranchApprovalItem {
  id: string;
  outletName: string;
  outletCode: string;
  city: string;
  phone: string;
  managerEmail: string;
  addressLine?: string;
  status?: 'active' | 'pending_approval' | 'maintenance';
}

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  hqCity: string;
  totalOutlets: number;
  statesCovered: number;
  activeManagers: number;
  lastCsvSync: string;
  status: 'active' | 'syncing' | 'paused';
}

const mockBrands: BrandItem[] = [
  {
    id: 'BRD-001',
    name: 'Dr Batra’s Positive Health Clinic',
    slug: 'dr-batras',
    category: 'Healthcare & Homeopathy',
    hqCity: 'Mumbai, MH',
    totalOutlets: 215,
    statesCovered: 18,
    activeManagers: 198,
    lastCsvSync: 'Today, 04:30 IST',
    status: 'active',
  },
  {
    id: 'BRD-002',
    name: 'Little Elly Preschool & Daycare',
    slug: 'little-elly',
    category: 'Early Education & Preschools',
    hqCity: 'Bengaluru, KA',
    totalOutlets: 140,
    statesCovered: 8,
    activeManagers: 125,
    lastCsvSync: '12 Nov 2026',
    status: 'active',
  },
  {
    id: 'BRD-003',
    name: 'Apollo Dental & Diagnostics',
    slug: 'apollo-dental',
    category: 'Dental & Diagnostics',
    hqCity: 'Chennai, TN',
    totalOutlets: 380,
    statesCovered: 24,
    activeManagers: 340,
    lastCsvSync: '14 Nov 2026',
    status: 'active',
  },
  {
    id: 'BRD-004',
    name: 'Ather Energy Experience Centers',
    slug: 'ather-energy',
    category: 'Automobile & EV Showrooms',
    hqCity: 'Bengaluru, KA',
    totalOutlets: 180,
    statesCovered: 16,
    activeManagers: 162,
    lastCsvSync: 'Yesterday, 23:20 IST',
    status: 'active',
  },
  {
    id: 'BRD-005',
    name: 'EuroKids International',
    slug: 'eurokids',
    category: 'Preschools & Education',
    hqCity: 'Mumbai, MH',
    totalOutlets: 1200,
    statesCovered: 28,
    activeManagers: 910,
    lastCsvSync: '10 Nov 2026',
    status: 'active',
  },
];

export default function AdminFranchisesPage() {
  const [brands, setBrands] = useState<BrandItem[]>(mockBrands);
  const [query, setQuery] = useState('');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<BrandItem | null>(null);

  // Business Submitted Outlets State
  const [branches, setBranches] = useState<BranchApprovalItem[]>([]);
  const [approvalMsg, setApprovalMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const syncBranches = () => {
        const stored = localStorage.getItem('bharatbn_franchise_branches');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setBranches(parsed);
          }
        }
      };
      syncBranches();
      window.addEventListener('bharatbn_branches_updated', syncBranches);
      return () => window.removeEventListener('bharatbn_branches_updated', syncBranches);
    } catch (err) {
      console.error('Error hydrating admin branches:', err);
    }
  }, []);

  const handleApproveBranch = (id: string) => {
    const updated = branches.map((b) =>
      b.id === id ? { ...b, status: 'active' as const } : b
    );
    setBranches(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bharatbn_franchise_branches', JSON.stringify(updated));
      window.dispatchEvent(new Event('bharatbn_branches_updated'));
    }
    setApprovalMsg('Outlet approved! Status is now Active & Verified on public discovery.');
    setTimeout(() => setApprovalMsg(null), 4000);
  };

  const handleRejectBranch = (id: string) => {
    const updated = branches.filter((b) => b.id !== id);
    setBranches(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bharatbn_franchise_branches', JSON.stringify(updated));
      window.dispatchEvent(new Event('bharatbn_branches_updated'));
    }
  };

  const filtered = brands.filter((b) => {
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.hqCity.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Franchise &amp; Multi-Location Brands
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              38 Active Brands
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage multi-location brand accounts, import branch locations, and oversee franchise profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#07213A] hover:bg-[#0C2D4E] rounded-md transition shadow-xs cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Import Branches CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Enterprise Brand Accounts</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">38 Brands</div>
          <div className="text-[11px] text-emerald-600 font-medium">
            +4 onboarding this month
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Operational Outlets</span>
            <MapPin className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">2,490 Outlets</div>
          <div className="text-[11px] text-slate-500 font-mono">
            100% NAP Verified
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Isolated Branch Logins</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">1,840 Logins</div>
          <div className="text-[11px] text-blue-600 font-medium">
            Strict tenant isolation
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Monthly Inquiries Dispatched</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">64,200+ Leads</div>
          <div className="text-[11px] text-emerald-600 font-medium">
            99.2% WhatsApp delivery
          </div>
        </div>
      </div>

      {/* Approval Alert */}
      {approvalMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{approvalMsg}</span>
        </div>
      )}

      {/* Outlet Moderation Desk (Business Submitted Branches) */}
      {branches.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-3 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Store &amp; Outlet Verification Desk
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {branches.filter((b) => b.status === 'pending_approval').length} Pending Audits
              </span>
            </div>
            <span className="text-xs text-slate-400">Submitted by Business Managers</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Outlet Code</th>
                  <th className="px-4 py-3">Outlet Name &amp; Address</th>
                  <th className="px-4 py-3">City Hub</th>
                  <th className="px-4 py-3">Direct Contact</th>
                  <th className="px-4 py-3">Manager Email</th>
                  <th className="px-4 py-3">Verification Status</th>
                  <th className="px-4 py-3 text-right">Moderator Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {branches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-[#F95700]">{b.outletCode}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{b.outletName}</div>
                      {b.addressLine && (
                        <div className="text-[11px] text-slate-400">{b.addressLine}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">{b.city}</td>
                    <td className="px-4 py-3 font-mono">{b.phone}</td>
                    <td className="px-4 py-3 text-slate-600">{b.managerEmail}</td>
                    <td className="px-4 py-3">
                      {b.status === 'pending_approval' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                          <Clock className="w-3 h-3 text-amber-600 animate-pulse" /> Pending Audit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                          <Check className="w-3 h-3 text-emerald-600" /> Active &amp; Verified
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {b.status === 'pending_approval' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleApproveBranch(b.id)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer"
                          >
                            Approve Outlet
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectBranch(b.id)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold text-[11px] transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Published Live</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-xs flex items-center justify-between gap-3 text-xs">
        <div className="w-full sm:w-80 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search enterprise brand, code, HQ city..."
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Syncing brand network metadata with Master Postgres...')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Sync Network</span>
          </button>
        </div>
      </div>

      {/* Enterprise Brands Table */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Brand ID &amp; Network Name</th>
                <th className="py-2.5 px-4 font-semibold">Category</th>
                <th className="py-2.5 px-4 font-semibold">Corporate HQ</th>
                <th className="py-2.5 px-4 font-semibold">Branch Outlets</th>
                <th className="py-2.5 px-4 font-semibold">Manager Accounts</th>
                <th className="py-2.5 px-4 font-semibold">Last CSV Batch</th>
                <th className="py-2.5 px-4 font-semibold">Network State</th>
                <th className="py-2.5 px-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.map((brand) => (
                <tr key={brand.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <div className="font-mono text-[11px] font-bold text-slate-500">{brand.id}</div>
                    <div className="font-semibold text-slate-900 text-xs mt-0.5">{brand.name}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {brand.category}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-800 font-medium">{brand.hqCity}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{brand.statesCovered} States</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {brand.totalOutlets.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">Branches</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-semibold text-slate-700 text-xs">
                      {brand.activeManagers}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">Logins active</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {brand.lastCsvSync}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {brand.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href="/dashboard/branches"
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                    >
                      <span>Manage Roster</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Bulk Upload Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Bulk CSV Branch Roster Ingestion
                </h3>
              </div>
              <button onClick={() => setIsCsvModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Ingest up to 5,000 branch outlets in a single atomic batch. The file must adhere to RFC 4180 standards with NAP columns.
              </p>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 font-mono text-[10px] text-slate-600 space-y-0.5">
                <div className="font-bold text-slate-700 uppercase">Required CSV Headers:</div>
                <div className="text-slate-500">branch_name, address_line1, locality, city, state, pincode, phone, manager_email</div>
              </div>

              {/* Dropzone */}
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-brand-500 transition cursor-pointer bg-slate-50/50">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="font-semibold text-slate-700">Click to select CSV roster or drag &amp; drop</div>
                <div className="text-[11px] text-slate-400 mt-1">Accepts .CSV files up to 25MB</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <a
                href="#download-template"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Downloading sample BharatBN franchise branch CSV template...');
                }}
                className="text-brand-600 hover:underline flex items-center gap-1 font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                Download Template CSV
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCsvModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Sample roster parsed. 215 branch records ready for validation.');
                    setIsCsvModalOpen(false);
                  }}
                  className="px-3.5 py-1.5 font-semibold text-white bg-[#07213A] hover:bg-[#0C2D4E] rounded transition"
                >
                  Validate &amp; Ingest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
