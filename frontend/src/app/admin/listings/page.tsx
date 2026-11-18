'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Search,
  ExternalLink,
  ShieldCheck,
  Star,
  MoreVertical,
  PlusCircle,
  Filter,
  Download,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface ListingItem {
  id: string;
  name: string;
  slug: string;
  city: string;
  category: string;
  phone: string;
  status: 'published' | 'pending_review' | 'draft';
  isVerified: boolean;
  isSponsor: boolean;
  napScore: number;
  lastCrawled: string;
}

const mockListings: ListingItem[] = [
  {
    id: 'BBN-CLM-799760',
    name: 'Apple',
    slug: 'apple',
    city: 'Noida, UP',
    category: 'Automobile & EV',
    phone: '+91 97170 56860',
    status: 'published',
    isVerified: true,
    isSponsor: true,
    napScore: 100,
    lastCrawled: 'Today, 10:50 IST',
  },
  {
    id: 'BBN-CLM-982104',
    name: 'Choco Delights & Confectionery (Cadboury)',
    slug: 'choco-delights-confectionery-cadboury',
    city: 'Mumbai, MH',
    category: 'Food, Bakeries & Confectionery',
    phone: '+91 89653 26578',
    status: 'pending_review',
    isVerified: false,
    isSponsor: false,
    napScore: 92,
    lastCrawled: 'Today, 10:45 IST',
  },
  {
    id: 'BBN-DIR-001',
    name: 'Apex Super Speciality Dental Clinic',
    slug: 'apex-super-speciality-dental-clinic',
    city: 'Mumbai, MH',
    category: 'Healthcare & Clinics',
    phone: '+91 98200 12345',
    status: 'published',
    isVerified: true,
    isSponsor: true,
    napScore: 100,
    lastCrawled: 'Today, 06:12 IST',
  },
  {
    id: 'BBN-DIR-002',
    name: 'Little Elly Preschool & Daycare',
    slug: 'little-elly-international-preschool',
    city: 'Bengaluru, KA',
    category: 'Preschools & Education',
    phone: '+91 98450 67890',
    status: 'published',
    isVerified: true,
    isSponsor: false,
    napScore: 98,
    lastCrawled: 'Today, 05:40 IST',
  },
  {
    id: 'BBN-DIR-003',
    name: 'Greenfield EV Motors & Spares',
    slug: 'greenfield-ev-motors-kothrud-pune',
    city: 'Pune, MH',
    category: 'Automobile & EV',
    phone: '+91 97654 32100',
    status: 'pending_review',
    isVerified: false,
    isSponsor: false,
    napScore: 84,
    lastCrawled: 'Yesterday, 19:20 IST',
  },
  {
    id: 'BBN-DIR-004',
    name: 'Copper Chimney Fine Dining',
    slug: 'copper-chimney-worli-mumbai',
    city: 'Mumbai, MH',
    category: 'Restaurants & Cafes',
    phone: '+91 98210 55555',
    status: 'published',
    isVerified: true,
    isSponsor: true,
    napScore: 95,
    lastCrawled: '14 Nov 2026',
  },
  {
    id: 'BBN-DIR-005',
    name: 'Lodha Park Real Estate Hub',
    slug: 'lodha-park-lower-parel-mumbai',
    city: 'Mumbai, MH',
    category: 'Real Estate & Builders',
    phone: '+91 98200 88888',
    status: 'published',
    isVerified: true,
    isSponsor: false,
    napScore: 100,
    lastCrawled: '13 Nov 2026',
  },
  {
    id: 'BBN-DIR-006',
    name: 'Singhania & Partners CA Firm',
    slug: 'singhania-partners-connaught-place-delhi',
    city: 'New Delhi, NCR',
    category: 'Legal & CA Services',
    phone: '+91 98110 22334',
    status: 'draft',
    isVerified: false,
    isSponsor: false,
    napScore: 70,
    lastCrawled: '12 Nov 2026',
  },
];

export default function AdminListingsPage() {
  const [listings, setListings] = useState<ListingItem[]>(mockListings);
  const [query, setQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Synchronize submitted businesses (e.g. Apple) from localStorage claims store
  useEffect(() => {
    const syncDynamicListings = () => {
      if (typeof window === 'undefined') return;
      try {
        const stored = localStorage.getItem('bharatbn_claims_store');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const dynamicListings: ListingItem[] = parsed.map((c: any) => ({
              id: c.id,
              name: c.businessName,
              slug: c.businessSlug || 'business',
              city: `${c.city || 'Local'}${c.state ? `, ${c.state}` : ''}`,
              category: c.category || 'Automobile & EV',
              phone: c.phone || c.whatsapp || '+91 98200 12345',
              status: c.status === 'approved' ? 'published' : 'pending_review',
              isVerified: c.status === 'approved',
              isSponsor: false,
              napScore: c.status === 'approved' ? 100 : 88,
              lastCrawled: 'Just now (Live)',
            }));

            setListings((prev) => {
              const map = new Map<string, ListingItem>();
              // User-listed businesses at the top!
              dynamicListings.forEach((item) => map.set(item.id, item));
              // Existing mock directory records
              prev.forEach((item) => {
                if (!map.has(item.id)) map.set(item.id, item);
              });
              return Array.from(map.values());
            });
          }
        }
      } catch (err) {
        console.error('Error syncing dynamic listings:', err);
      }
    };

    syncDynamicListings();
    window.addEventListener('bharatbn_claims_updated', syncDynamicListings);
    return () => window.removeEventListener('bharatbn_claims_updated', syncDynamicListings);
  }, []);

  const filtered = listings.filter((item) => {
    if (cityFilter !== 'all' && !item.city.toLowerCase().includes(cityFilter.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((i) => i.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleVerify = (id: string) => {
    const updated = listings.map((l) => {
      if (l.id === id) {
        const nextVerified = !l.isVerified;
        return {
          ...l,
          isVerified: nextVerified,
          status: (nextVerified ? 'published' : 'pending_review') as 'published' | 'pending_review' | 'draft',
        };
      }
      return l;
    });
    setListings(updated);

    // Sync to claims store
    try {
      const stored = localStorage.getItem('bharatbn_claims_store');
      if (stored) {
        const claims = JSON.parse(stored);
        const updatedClaims = claims.map((c: any) => {
          if (c.id === id) {
            const nextStatus = c.status === 'approved' ? 'pending' : 'approved';
            return { ...c, status: nextStatus };
          }
          return c;
        });
        localStorage.setItem('bharatbn_claims_store', JSON.stringify(updatedClaims));
        window.dispatchEvent(new Event('bharatbn_claims_updated'));
      }
    } catch {}
  };

  const toggleSponsor = (id: string) => {
    setListings(
      listings.map((l) => (l.id === id ? { ...l, isSponsor: !l.isSponsor } : l))
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Operations Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              All Business Listings
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              {listings.length} Listings
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Search and manage verified directory listings, verification badges, and public status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(`Exporting directory records (${listings.length} rows)...`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/claim/new"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#07213A] hover:bg-[#0C2D4E] rounded-md transition shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Business</span>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="w-full sm:w-80 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search business name, ID, category..."
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-brand-500 bg-white text-slate-700"
          >
            <option value="all">All Hubs (India)</option>
            <option value="mumbai">Mumbai, MH</option>
            <option value="bengaluru">Bengaluru, KA</option>
            <option value="pune">Pune, MH</option>
            <option value="delhi">Delhi NCR</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-brand-500 bg-white text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="pending_review">Pending Review</option>
            <option value="draft">Draft</option>
          </select>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <span className="text-[11px] font-mono text-slate-500">{selectedIds.length} selected</span>
              <button
                onClick={() => alert(`Triggering bulk NAP audit for ${selectedIds.length} listings...`)}
                className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
              >
                Re-Audit NAP
              </button>
            </div>
          )}
        </div>
      </div>

      {/* High-Density Data Table */}
      <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filtered.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-brand-500 focus:ring-0"
                  />
                </th>
                <th className="py-2.5 px-3 font-semibold">Record ID &amp; Business</th>
                <th className="py-2.5 px-3 font-semibold">Category &amp; Hub</th>
                <th className="py-2.5 px-3 font-semibold">NAP Consistency</th>
                <th className="py-2.5 px-3 font-semibold">Listing State</th>
                <th className="py-2.5 px-3 font-semibold">Badges</th>
                <th className="py-2.5 px-3 font-semibold">Last Crawl</th>
                <th className="py-2.5 px-3 text-right font-semibold">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.map((item) => {
                const isChecked = selectedIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition ${
                      isChecked ? 'bg-slate-50' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectOne(item.id)}
                        className="rounded border-slate-300 text-brand-500 focus:ring-0"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-mono text-[11px] font-bold text-slate-500">{item.id}</div>
                      <Link
                        href={`/biz/${item.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-slate-900 text-xs mt-0.5 hover:text-[#F95700] hover:underline inline-flex items-center gap-1 group transition"
                        title="View live profile"
                      >
                        <span>{item.name}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#F95700] transition" />
                      </Link>
                      <div className="text-[11px] text-slate-400 font-mono">{item.phone}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-700">{item.category}</div>
                      <div className="text-[11px] text-slate-400">{item.city}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${
                              item.napScore >= 95
                                ? 'bg-emerald-500'
                                : item.napScore >= 80
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${item.napScore}%` }}
                          />
                        </div>
                        <span className="font-mono font-semibold text-slate-700 text-[11px]">
                          {item.napScore}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">SERP Parity</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          item.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'pending_review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleVerify(item.id)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium border transition flex items-center gap-1 ${
                            item.isVerified
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                          }`}
                          title="Toggle Verified Status"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified</span>
                        </button>
                        <button
                          onClick={() => toggleSponsor(item.id)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium border transition flex items-center gap-1 ${
                            item.isSponsor
                              ? 'bg-amber-50 border-amber-300 text-amber-700 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                          }`}
                          title="Toggle Sponsor Boost"
                        >
                          <Star className="w-3 h-3" />
                          <span>Sponsor</span>
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                      {item.lastCrawled}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        href={`/biz/${item.slug}`}
                        target="_blank"
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-0.5"
                      >
                        View Live <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-mono text-[11px]">
            Showing 1-{filtered.length} of {listings.length} records
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled
              className="p-1 rounded border border-slate-200 bg-white text-slate-300 cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 py-0.5 font-mono text-[11px] font-semibold bg-white border border-slate-200 rounded text-slate-800">
              Page 1 of 18,452
            </span>
            <button
              onClick={() => alert('Loading page 2...')}
              className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
