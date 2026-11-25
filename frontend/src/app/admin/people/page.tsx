'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  MapPin,
  AtSign,
  TrendingUp,
  RefreshCw,
  SlidersHorizontal,
  Check,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import {
  getRealMetrics,
  setAdminFollowerOverride,
  getAdminFollowerOverrides,
} from '@/lib/realMetrics';

interface PersonAdminItem {
  id: string;
  name: string;
  slug: string;
  handle: string;
  role: string;
  badge: string;
  category: string;
  location: string;
  avatarUrl?: string;
  isVerified: boolean;
  status: 'approved' | 'pending' | 'rejected';
}

const defaultPeople: PersonAdminItem[] = [
  {
    id: 'BBN-PPL-AI-001',
    name: 'AI',
    slug: 'ai',
    handle: '@ai',
    role: 'Autonomous AI Researcher & Platform Pioneer',
    badge: 'AI Innovator',
    category: 'tech',
    location: 'Bengaluru, KA',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    status: 'approved',
  },
  {
    id: 'BBN-PPL-KASHISH-001',
    name: 'Kashish Saxena',
    slug: 'kashish',
    handle: '@kashish',
    role: 'Public Figure & Speaker',
    badge: 'Public Figure',
    category: 'public-figures',
    location: 'Noida, UP',
    avatarUrl: '/people/kashish-avatar.png',
    isVerified: true,
    status: 'approved',
  },
  {
    id: 'BBN-PPL-ANAND-SAHU-001',
    name: 'Anand Sahu',
    slug: 'anand-sahu',
    handle: '@anandsahu',
    role: 'Nationalist Thinker & Speaker',
    badge: 'Public Figure',
    category: 'public-figures',
    location: 'New Delhi, India',
    avatarUrl: '/people/anand-sahu-avatar.jpg',
    isVerified: true,
    status: 'approved',
  },
  {
    id: 'BBN-PPL-RAJESH-002',
    name: 'Dr. Rajesh Sharma',
    slug: 'dr-rajesh-sharma',
    handle: '@dr_rajesh',
    role: 'Healthcare Pioneer & Dental Surgeon',
    badge: 'Medical Leader',
    category: 'doctors',
    location: 'Mumbai, MH',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    status: 'approved',
  },
  {
    id: 'BBN-PPL-SUNITA-003',
    name: 'Sunita Rao',
    slug: 'sunita-rao',
    handle: '@sunita_rao',
    role: 'Early Childhood Educator & Pedagogist',
    badge: 'Education Leader',
    category: 'teachers',
    location: 'Bengaluru, KA',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    status: 'approved',
  },
  {
    id: 'BBN-PPL-VIKRAM-004',
    name: 'Vikram Joshi',
    slug: 'vikram-joshi',
    handle: '@vikram_legal',
    role: 'Corporate Legal Advisor & Tax Advocate',
    badge: 'Legal Luminary',
    category: 'lawyers',
    location: 'New Delhi, DL',
    avatarUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    status: 'approved',
  },
];

export default function AdminPeoplePage() {
  const [people, setPeople] = useState<PersonAdminItem[]>(defaultPeople);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [metricsVersion, setMetricsVersion] = useState(0);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ slug: string; message: string } | null>(null);

  // Load registered people from localStorage & seed
  useEffect(() => {
    const loadPeople = () => {
      if (typeof window === 'undefined') return;
      try {
        const stored = localStorage.getItem('bharatbn_people_store');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPeople((prev) => {
              const map = new Map<string, PersonAdminItem>();
              prev.forEach((p) => map.set(p.slug.toLowerCase(), p));
              parsed.forEach((p: any) => {
                const s = (p.slug || '').toLowerCase().trim();
                map.set(s, {
                  id: p.id || `PPL-${s}`,
                  name: p.name || 'Member',
                  slug: s,
                  handle: p.handle || `@${s}`,
                  role: p.role || 'Verified Member',
                  badge: p.badge || 'Verified Voice',
                  category: p.category || 'creators',
                  location: p.location || 'India',
                  avatarUrl: p.avatarUrl || p.avatar || '',
                  isVerified: p.isVerified ?? true,
                  status: p.status || 'approved',
                });
              });
              return Array.from(map.values());
            });
          }
        }
      } catch (err) {
        console.error('Failed to load people in admin:', err);
      }
    };

    loadPeople();
    window.addEventListener('bharatbn_people_updated', loadPeople);
    window.addEventListener('bharatbn_metrics_updated', () => setMetricsVersion((v) => v + 1));
    return () => {
      window.removeEventListener('bharatbn_people_updated', loadPeople);
      window.removeEventListener('bharatbn_metrics_updated', () => setMetricsVersion((v) => v + 1));
    };
  }, []);

  // Initialize inputs with current metrics
  useEffect(() => {
    const initialInputs: Record<string, string> = {};
    people.forEach((p) => {
      const m = getRealMetrics(p.slug);
      initialInputs[p.slug] = String(m.followersCount);
    });
    setInputs(initialInputs);
  }, [people, metricsVersion]);

  const adminOverrides = useMemo(() => {
    return typeof window !== 'undefined' ? getAdminFollowerOverrides() : {};
  }, [metricsVersion]);

  // Statistics calculation
  const totalFollowersAcrossProfiles = useMemo(() => {
    return people.reduce((acc, p) => acc + getRealMetrics(p.slug).followersCount, 0);
  }, [people, metricsVersion]);

  const activeOverridesCount = useMemo(() => {
    return people.filter((p) => p.slug.toLowerCase().trim() in adminOverrides).length;
  }, [people, adminOverrides]);

  const filteredPeople = useMemo(() => {
    return people.filter((p) => {
      if (categoryFilter !== 'all' && p.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text = `${p.name} ${p.handle} ${p.role} ${p.location} ${p.slug}`.toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }, [people, categoryFilter, searchQuery]);

  const handleSaveFollowers = (slug: string, customVal?: number) => {
    const val = customVal !== undefined ? customVal : parseInt((inputs[slug] || '0').replace(/[^0-9]/g, ''), 10);
    if (isNaN(val) || val < 0) return;

    setAdminFollowerOverride(slug, val);
    setInputs((prev) => ({ ...prev, [slug]: String(val) }));
    setMetricsVersion((v) => v + 1);

    const person = people.find((p) => p.slug === slug);
    setFeedback({
      slug,
      message: `Updated to ${val.toLocaleString()} followers for ${person?.name || slug}!`,
    });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleQuickAdd = (slug: string, delta: number) => {
    const cur = getRealMetrics(slug).followersCount;
    handleSaveFollowers(slug, cur + delta);
  };

  const handleResetToNatural = (slug: string) => {
    setAdminFollowerOverride(slug, null);
    setMetricsVersion((v) => v + 1);
    const m = getRealMetrics(slug);
    setInputs((prev) => ({ ...prev, [slug]: String(m.followersCount) }));

    const person = people.find((p) => p.slug === slug);
    setFeedback({
      slug,
      message: `Reset ${person?.name || slug} to pure natural organic followers (${m.followersCount})`,
    });
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#07213A] text-white flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Profiles &amp; Followers Manager
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Super Admin control panel for verified public figure profiles, verified badges, and follower metrics. Personal creator accounts cannot edit their own followers in their user dashboard.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/claims?tab=people"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#F95700]" />
            <span>KYC Approvals</span>
          </Link>
          <Link
            href="/people"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#07213A] hover:bg-[#F95700] text-white text-xs font-bold transition shadow-xs"
          >
            <span>Live Directory</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Overview Metric Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Total Profiles</span>
          <div className="text-2xl font-black text-slate-900">{people.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {people.filter((p) => p.isVerified).length} Verified Checkmarks
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Total Follower Audience</span>
          <div className="text-2xl font-black text-slate-900">{totalFollowersAcrossProfiles.toLocaleString()}</div>
          <span className="text-[11px] text-slate-500">Across all Indian public figures</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Active Admin Overrides</span>
          <div className="text-2xl font-black text-[#F95700]">{activeOverridesCount}</div>
          <span className="text-[11px] text-amber-700 font-medium">Custom counts set by Super Admin</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Pure Organic Profiles</span>
          <div className="text-2xl font-black text-slate-700">{people.length - activeOverridesCount}</div>
          <span className="text-[11px] text-emerald-600 font-medium">100% natural live follow clicks</span>
        </div>
      </div>

      {/* Global Success Feedback Banner */}
      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, handle (@kashish), role, location..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#F95700]"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            {['all', 'public-figures', 'tech', 'doctors', 'teachers', 'lawyers', 'creators'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg capitalize font-bold transition cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#07213A] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat === 'all' ? 'All Roles' : cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table of People & Follower Controls */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-mono text-slate-500">
              <tr>
                <th className="py-3 px-4">Profile</th>
                <th className="py-3 px-4">Category &amp; Role</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Displayed Followers</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4 min-w-[280px]">Admin Follower Controls</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPeople.map((person) => {
                const curMetrics = getRealMetrics(person.slug);
                const hasOverride = person.slug.toLowerCase().trim() in adminOverrides;
                const naturalCount = curMetrics.followers.length;
                const currentInput = inputs[person.slug] ?? String(curMetrics.followersCount);

                return (
                  <tr key={person.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Profile */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                          {person.avatarUrl ? (
                            <img
                              src={person.avatarUrl}
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#07213A] text-white font-bold flex items-center justify-center text-xs">
                              {person.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1 font-bold text-slate-900">
                            <span>{person.name}</span>
                            {person.isVerified && (
                              <div
                                className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs"
                                title="Verified Public Figure"
                              >
                                <Check className="w-2 h-2 stroke-[3.5]" />
                              </div>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">{person.handle}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Role */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="inline-block bg-[#F95700]/10 text-[#F95700] text-[10px] font-bold px-2 py-0.5 rounded">
                          {person.badge}
                        </span>
                        <div className="text-[11px] text-slate-600 line-clamp-1 max-w-[200px]">
                          {person.role}
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      <div className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span>{person.location}</span>
                      </div>
                    </td>

                    {/* Displayed Followers */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <div className="text-base font-black text-slate-900 font-mono">
                          {curMetrics.followersCount.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          ({naturalCount} organic clicks)
                        </span>
                      </div>
                    </td>

                    {/* Mode */}
                    <td className="py-3 px-4">
                      {hasOverride ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                          Admin Override
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                          Natural Organic
                        </span>
                      )}
                    </td>

                    {/* Follower Controls */}
                    <td className="py-3 px-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={currentInput}
                            onChange={(e) =>
                              setInputs((prev) => ({ ...prev, [person.slug]: e.target.value }))
                            }
                            placeholder="Count..."
                            className="w-24 px-2 py-1 rounded border border-slate-300 font-mono text-xs font-bold focus:outline-none focus:border-[#F95700]"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveFollowers(person.slug)}
                            className="px-2.5 py-1 bg-[#07213A] hover:bg-[#F95700] text-white rounded text-[11px] font-bold transition cursor-pointer shadow-xs whitespace-nowrap"
                          >
                            Update
                          </button>
                        </div>

                        {/* Quick Presets */}
                        <div className="flex items-center gap-1 flex-wrap">
                          {[100, 500, 2000, 10000].map((delta) => (
                            <button
                              key={delta}
                              type="button"
                              onClick={() => handleQuickAdd(person.slug, delta)}
                              className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                              title={`Add +${delta} to current count`}
                            >
                              +{delta >= 1000 ? `${delta / 1000}K` : delta}
                            </button>
                          ))}
                          {hasOverride && (
                            <button
                              type="button"
                              onClick={() => handleResetToNatural(person.slug)}
                              className="text-[10px] font-bold text-rose-600 hover:underline ml-1 cursor-pointer"
                              title="Reset to natural live follow clicks"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <a
                        href={`/people/${person.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/people/${person.slug}`, '_blank', 'noopener,noreferrer');
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 hover:bg-[#F95700] text-[#F95700] hover:text-white border border-orange-200 rounded text-[11px] font-bold transition shadow-xs cursor-pointer"
                        title={`Open ${person.name}'s profile in new tab`}
                      >
                        <span>View Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
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
