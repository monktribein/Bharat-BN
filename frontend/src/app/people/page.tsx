'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  CheckCircle2,
  Check,
  ExternalLink,
  MapPin,
  Sparkles,
  UserPlus,
  UserCheck,
  ArrowRight,
  Flame,
  X,
  Lock,
  LogIn,
} from 'lucide-react';
import { toggleRealFollow, parseFollowerCount, getRealMetrics } from '@/lib/realMetrics';

interface PersonCard {
  id: string;
  name: string;
  slug: string;
  handle: string;
  role: string;
  badge: string;
  location: string;
  quote: string;
  avatarUrl?: string;
  coverUrl?: string;
  followersCount: string | number;
  postsCount: number;
  category: string;
  isVerified: boolean;
}

const defaultPeopleList: PersonCard[] = [
  {
    id: 'BBN-PPL-ANAND-SAHU-001',
    name: 'Anand Sahu',
    slug: 'anand-sahu',
    handle: '@anandsahu',
    role: 'Nationalist Thinker & Speaker',
    badge: 'Public Figure',
    location: 'New Delhi, India',
    quote: 'Thoughts for Nation Building and a Stronger India.',
    avatarUrl: '/people/anand-sahu-avatar.jpg',
    coverUrl: '/people/anand-sahu-cover.jpg',
    followersCount: '0',
    postsCount: 286,
    category: 'Public Figures & Speakers',
    isVerified: true,
  },
  {
    id: 'BBN-PPL-KASHISH-001',
    name: 'Kashish Saxena',
    slug: 'kashish',
    handle: '@kashish',
    role: 'Public Figure & Speaker',
    badge: 'Public Figure',
    location: 'noida',
    quote: 'hi',
    avatarUrl: '/people/kashish-avatar.png',
    coverUrl: '/people/kashish-cover.jpg',
    followersCount: '0',
    postsCount: 14,
    category: 'Public Figures & Speakers',
    isVerified: true,
  },
  {
    id: 'BBN-PPL-AI-001',
    name: 'AI',
    slug: 'ai',
    handle: '@ai',
    role: 'Autonomous AI Researcher & Platform Pioneer',
    badge: 'AI Innovator',
    location: 'Bengaluru, KA',
    quote: 'Empowering 1.4 Billion Indians with sovereign AI innovation and smart discovery.',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    followersCount: '0',
    postsCount: 18,
    category: 'Creators & Influencers',
    isVerified: true,
  },
  {
    id: 'BBN-PPL-RAJESH-002',
    name: 'Dr. Rajesh Sharma',
    slug: 'dr-rajesh-sharma',
    handle: '@dr_rajesh',
    role: 'Healthcare Pioneer & Dental Surgeon',
    badge: 'Medical Leader',
    location: 'Mumbai, MH',
    quote: 'Making world-class preventive dental healthcare accessible for every Indian.',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    followersCount: '0',
    postsCount: 94,
    category: 'Industry Leaders',
    isVerified: true,
  },
  {
    id: 'BBN-PPL-PRIYA-003',
    name: 'Priya Menon',
    slug: 'priya-menon',
    handle: '@priyamenon_ev',
    role: 'Clean Tech & EV Policy Advocate',
    badge: 'Policy Voice',
    location: 'Bengaluru, KA',
    quote: 'Sustainable green mobility and public EV infrastructure for modern India.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80',
    followersCount: '0',
    postsCount: 68,
    category: 'Community & Thinkers',
    isVerified: true,
  },
  {
    id: 'BBN-PPL-VIKRAM-004',
    name: 'Vikram Singhania',
    slug: 'vikram-singhania',
    handle: '@vikram_singhania',
    role: 'Franchise Enterprise Strategist',
    badge: 'Author & Advisor',
    location: 'Gurugram, HR',
    quote: 'Scaling Bharat homegrown brands into nationwide consumer powerhouses.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    followersCount: '0',
    postsCount: 152,
    category: 'Industry Leaders',
    isVerified: true,
  },
];

const categories = [
  'All',
  'Public Figures & Speakers',
  'Creators & Influencers',
  'Industry Leaders',
  'Community & Thinkers',
];

export default function PeopleDirectoryPage() {
  const [people, setPeople] = useState<PersonCard[]>(defaultPeopleList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [followedSlugs, setFollowedSlugs] = useState<string[]>([]);
  const [followToast, setFollowToast] = useState('');
  const [ownerSession, setOwnerSession] = useState<any>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Sync dynamically registered people from localStorage & active session
  useEffect(() => {
    const loadStoredPeople = () => {
      try {
        const stored = localStorage.getItem('bharatbn_people_store');
        const sessionStr = localStorage.getItem('bharatbn_owner_session');
        const map = new Map<string, PersonCard>();

        // Load custom registered profiles first
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            let hasRepairs = false;
            parsed.forEach((p: any) => {
              const slug = p.slug || p.handle?.replace(/^@/, '') || 'profile';
              const isKashish = slug === 'kashish' || p.name?.toLowerCase().includes('kashish');
              const isAi = slug === 'ai' || p.name?.toLowerCase() === 'ai';
              const isAnand = slug === 'anand-sahu' || slug === 'anand' || p.name?.toLowerCase().includes('anand sahu');

              let cleanRole = isKashish ? 'Public Figure & Speaker' : (p.role || 'Public Figure & Speaker');
              let cleanBadge = isKashish ? 'Public Figure' : (p.badge || 'Public Figure');
              let cleanLocation = isKashish ? 'noida' : (p.location || 'India');
              let cleanQuote = isKashish ? 'hi' : (p.quote || 'Building a stronger connected community across India.');
              let cleanAvatar = isKashish ? '/people/kashish-avatar.png' : (isAnand ? '/people/anand-sahu-avatar.jpg' : (p.avatarUrl || ''));
              let cleanCover = isKashish ? '/people/kashish-cover.jpg' : (isAnand ? '/people/anand-sahu-cover.jpg' : (p.coverUrl || '/people/anand-sahu-cover.jpg'));

              // Pure authentic BharatBN real followers only for ALL profiles
              const realCount = getRealMetrics(slug).followersCount;
              const cleanFollowers = String(realCount);
              if (p.followersCount !== cleanFollowers) {
                p.followersCount = cleanFollowers;
                hasRepairs = true;
              }

              if (isKashish) {
                if (p.coverUrl !== '/people/kashish-cover.jpg' || p.avatarUrl !== '/people/kashish-avatar.png' || p.role !== 'Public Figure & Speaker') {
                  p.coverUrl = cleanCover;
                  p.avatarUrl = cleanAvatar;
                  p.role = cleanRole;
                  p.badge = cleanBadge;
                  p.location = cleanLocation;
                  p.quote = cleanQuote;
                  hasRepairs = true;
                }
              }

              if (isAnand) {
                if (p.coverUrl !== '/people/anand-sahu-cover.jpg' || p.avatarUrl !== '/people/anand-sahu-avatar.jpg') {
                  p.coverUrl = cleanCover;
                  p.avatarUrl = cleanAvatar;
                  hasRepairs = true;
                }
              }

              map.set(slug, {
                id: p.id || `BBN-PPL-${Date.now()}`,
                name: p.name,
                slug,
                handle: p.handle?.startsWith('@') ? p.handle : `@${p.handle || slug}`,
                role: cleanRole,
                badge: cleanBadge,
                location: cleanLocation,
                quote: cleanQuote,
                avatarUrl: cleanAvatar,
                coverUrl: cleanCover,
                followersCount: cleanFollowers,
                postsCount: p.updates?.length || 1,
                category: isKashish ? 'Public Figures & Speakers' : (p.role?.toLowerCase().includes('creator') ? 'Creators & Influencers' : (p.category || 'Public Figures & Speakers')),
                isVerified: isKashish ? true : ((p.status === 'approved') || Boolean(p.isVerified)),
              });
            });

            if (hasRepairs) {
              try {
                localStorage.setItem('bharatbn_people_store', JSON.stringify(parsed));
              } catch {}
            }
          }
        }

        // Also merge active person session if present
        if (sessionStr) {
          try {
            const sess = JSON.parse(sessionStr);
            if (sess && sess.accountType === 'person' && sess.name) {
              const sessSlug = sess.slug || sess.handle?.replace(/^@/, '') || 'profile';
              const isKashish = sessSlug === 'kashish' || sess.name?.toLowerCase().includes('kashish');
              const isAi = sessSlug === 'ai' || sess.name?.toLowerCase() === 'ai';
              const existing = map.get(sessSlug);

              const cleanRole = isKashish ? 'Public Figure & Speaker' : (sess.role || existing?.role || 'Creator & Platform Pioneer');
              const cleanBadge = isKashish ? 'Public Figure' : (sess.badge || existing?.badge || 'Creator');
              const cleanLocation = isKashish ? 'noida' : (sess.location || existing?.location || 'India');
              const cleanQuote = isKashish ? 'hi' : (sess.quote || existing?.quote || 'Building a stronger connected community across India.');
              const cleanAvatar = isKashish ? '/people/kashish-avatar.png' : (sess.avatarUrl || existing?.avatarUrl || '');
              const cleanCover = isKashish ? '/people/kashish-cover.jpg' : (sess.coverUrl || existing?.coverUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80');
              const realSessFollowers = String(getRealMetrics(sessSlug).followersCount);
              if (sess.followersCount !== realSessFollowers) {
                sess.followersCount = realSessFollowers;
                try {
                  localStorage.setItem('bharatbn_owner_session', JSON.stringify(sess));
                } catch {}
              }

              map.set(sessSlug, {
                id: sess.personId || existing?.id || `BBN-PPL-${Date.now()}`,
                name: sess.name,
                slug: sessSlug,
                handle: sess.handle?.startsWith('@') ? sess.handle : `@${sess.handle || sessSlug}`,
                role: cleanRole,
                badge: cleanBadge,
                location: cleanLocation,
                quote: cleanQuote,
                avatarUrl: cleanAvatar,
                coverUrl: cleanCover,
                followersCount: realSessFollowers,
                postsCount: sess.postsCount || existing?.postsCount || 1,
                category: isKashish ? 'Public Figures & Speakers' : (existing?.category || (sess.role?.toLowerCase().includes('creator') ? 'Creators & Influencers' : 'Public Figures & Speakers')),
                isVerified: isKashish ? true : (sess.isVerified !== undefined ? sess.isVerified : (existing?.isVerified || false)),
              });
            }
          } catch { }
        }

        // Add default curated figures if not overwritten and enforce real followers count
        defaultPeopleList.forEach((dp) => {
          const realCount = String(getRealMetrics(dp.slug).followersCount);
          if (!map.has(dp.slug)) {
            map.set(dp.slug, { ...dp, followersCount: realCount });
          } else {
            const existing = map.get(dp.slug)!;
            map.set(dp.slug, { ...existing, followersCount: realCount });
          }
        });

        setPeople(Array.from(map.values()));
      } catch (err) {
        console.error(err);
      }
    };

    loadStoredPeople();
    window.addEventListener('bharatbn_people_updated', loadStoredPeople);
    window.addEventListener('bharatbn_auth_changed', loadStoredPeople);
    window.addEventListener('bharatbn_follow_changed', loadStoredPeople);
    window.addEventListener('bharatbn_metrics_updated', loadStoredPeople);
    window.addEventListener('storage', loadStoredPeople);
    return () => {
      window.removeEventListener('bharatbn_people_updated', loadStoredPeople);
      window.removeEventListener('bharatbn_auth_changed', loadStoredPeople);
      window.removeEventListener('bharatbn_follow_changed', loadStoredPeople);
      window.removeEventListener('bharatbn_metrics_updated', loadStoredPeople);
      window.removeEventListener('storage', loadStoredPeople);
    };
  }, []);

  // Sync follow state
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bharatbn_people_follows');
      if (stored) setFollowedSlugs(JSON.parse(stored));
    } catch { }
  }, []);

  // Sync owner session for auth checks
  useEffect(() => {
    const syncSession = () => {
      try {
        const sess = localStorage.getItem('bharatbn_owner_session');
        setOwnerSession(sess ? JSON.parse(sess) : null);
      } catch {
        setOwnerSession(null);
      }
    };
    syncSession();
    window.addEventListener('bharatbn_auth_changed', syncSession);
    return () => window.removeEventListener('bharatbn_auth_changed', syncSession);
  }, []);

  const handleToggleFollow = async (person: PersonCard) => {
    // Require login to follow
    if (!ownerSession) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      const isCurrentlyFollowing = followedSlugs.includes(person.slug);
      await toggleRealFollow(person.slug, isCurrentlyFollowing);

      const nextFollowed = isCurrentlyFollowing
        ? followedSlugs.filter((s) => s !== person.slug)
        : [...followedSlugs, person.slug];
      setFollowedSlugs(nextFollowed);

      // Update card followersCount dynamically using real count
      const updatedCount = String(getRealMetrics(person.slug).followersCount);
      setPeople((prev) =>
        prev.map((p) => {
          if (p.slug !== person.slug) return p;
          return {
            ...p,
            followersCount: updatedCount,
          };
        })
      );

      if (isCurrentlyFollowing) {
        setFollowToast(`You unfollowed ${person.name}`);
      } else {
        setFollowToast(`Following ${person.name}! You will receive their latest updates.`);
      }
      setTimeout(() => setFollowToast(''), 3000);
    } catch { }
  };

  const filteredPeople = people.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.handle.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-20">

      {/* Login Required Modal */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => setShowLoginPrompt(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center space-y-5 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#07213A] to-[#F95700] flex items-center justify-center mx-auto shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Sign In to Follow</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Only verified logged-in members can follow profiles and receive real-time updates on BharatBN.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="w-full py-3 px-6 rounded-xl bg-[#07213A] text-white font-bold text-sm hover:bg-[#0C2D4E] transition flex items-center justify-center gap-2 shadow-md"
                  onClick={() => setShowLoginPrompt(false)}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In to BharatBN</span>
                </Link>
                <Link
                  href="/signup"
                  className="w-full py-3 px-6 rounded-xl bg-[#F95700] text-white font-bold text-sm hover:bg-[#d94a00] transition flex items-center justify-center gap-2 shadow-md"
                  onClick={() => setShowLoginPrompt(false)}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Free Account</span>
                </Link>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  Continue browsing without account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {followToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-slate-700"
          >
            <Sparkles className="w-4 h-4 text-[#F95700]" />
            <span>{followToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== HERO + SEARCH + CATEGORIES UNIFIED SECTION ===== */}
      <div className="bg-gradient-to-br from-[#06192E] via-[#07213A] to-[#0A2E52] text-white relative overflow-hidden">
        {/* Background decorative pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #F95700 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0EA5E9 0%, transparent 50%)' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl translate-y-20 -translate-x-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          {/* Top Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[11px] font-black uppercase tracking-widest mb-6">
            <Flame className="w-3 h-3 text-orange-400" />
            <span>India&apos;s Business &amp; People Network</span>
          </div>

          {/* Title + Subtitle */}
          <div className="max-w-2xl mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black tracking-tight leading-tight mb-3">
              Discover &amp; Follow<br />
              <span className="text-[#F95700]">Voices of Bharat</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300/80 leading-relaxed">
              Connect with verified public figures, leaders, creators, and industry pioneers building a stronger, self-reliant nation.
            </p>
          </div>

          {/* ===== UNIFIED SEARCH + CATEGORY BAR ===== */}
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            {/* Search Row */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
              <Search className="w-5 h-5 text-[#F95700] flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name (e.g. Anand Sahu, Kashish), @handle, role, or location..."
                className="w-full text-[13.5px] text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none font-medium"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="flex-shrink-0 text-[11px] font-bold text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg transition cursor-pointer"
                >
                  Clear
                </button>
              ) : (
                <div className="flex-shrink-0 text-[11px] font-bold text-slate-300 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
                  ⌘ K
                </div>
              )}
            </div>

            {/* Category Pills Row */}
            <div className="flex items-center gap-1.5 px-3 py-3 overflow-x-auto no-scrollbar">
              {[
                { label: 'All', icon: '🌐' },
                { label: 'Public Figures & Speakers', icon: '🎙️' },
                { label: 'Creators & Influencers', icon: '✨' },
                { label: 'Industry Leaders', icon: '🏆' },
                { label: 'Community & Thinkers', icon: '💡' },
              ].map((cat) => {
                const isActive = selectedCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setSelectedCategory(cat.label)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[#07213A] text-white border-[#07213A] shadow-md'
                        : 'bg-transparent text-slate-600 border-slate-200 hover:border-[#07213A]/30 hover:text-[#07213A] hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* People Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>Verified Profiles</span>
              <span className="text-xs font-bold text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded-full">
                {filteredPeople.length}
              </span>
              {!ownerSession && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  Login to Follow
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click &quot;View Profile&quot; to explore articles, speeches, and video gallery
            </p>
          </div>

          <Link
            href="/dashboard/person"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#F95700] hover:underline"
          >
            <span>Manage Your Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {filteredPeople.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">No profiles found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                We couldn&apos;t find anyone matching &quot;{searchQuery}&quot;. Try searching for &quot;Anand Sahu&quot; or &quot;Kashish&quot;.
              </p>
            </div>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="text-xs font-bold text-[#F95700] hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPeople.map((person) => {
              const isFollowed = Boolean(ownerSession && followedSlugs.includes(person.slug));

              return (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  {/* Cover Banner */}
                  <div className="relative h-32 w-full bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                    <img
                      src={person.coverUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80'}
                      alt={person.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80';
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Badge top-right */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/25 shadow-sm">
                        {person.badge}
                      </span>
                    </div>

                    {/* Blue Verified Icon top-left */}
                    {person.isVerified && (
                      <div className="absolute top-3 left-3">
                        <div
                          className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md ring-2 ring-white/80"
                          title="Official Verified Profile"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile Body */}
                  <div className="px-5 pb-5 relative flex-1 flex flex-col">
                    {/* Avatar + Follow inline row */}
                    <div className="flex items-end justify-between -mt-8 mb-4">
                      <div className="relative flex-shrink-0">
                        <Link
                          href={`/people/${person.slug}`}
                          onClick={() => {
                            try { sessionStorage.setItem('bharatbn_viewed_person', JSON.stringify(person)); } catch {}
                          }}
                          className="relative w-16 h-16 rounded-2xl bg-white ring-4 ring-white shadow-xl overflow-hidden block hover:ring-[#F95700]/30 transition-all"
                          title={`View ${person.name}'s profile`}
                        >
                          {person.avatarUrl ? (
                            <img
                              src={person.avatarUrl}
                              alt={person.name}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  const fb = parent.querySelector('.avatar-fallback');
                                  if (fb) (fb as HTMLElement).style.display = 'flex';
                                }
                              }}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                          <div
                            className={`w-full h-full bg-gradient-to-tr from-[#07213A] to-[#F95700] text-white font-black text-xl flex items-center justify-center avatar-fallback ${
                              person.avatarUrl ? 'hidden' : 'flex'
                            }`}
                          >
                            {person.name.slice(0, 1).toUpperCase()}
                          </div>
                        </Link>
                        {person.isVerified && (
                          <div
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center ring-2 ring-white shadow-md z-10"
                            title="Official Verified Profile"
                          >
                            <Check className="w-3 h-3 stroke-[3.5]" />
                          </div>
                        )}
                      </div>

                      {/* Follow Button (top-right of avatar row) */}
                      <button
                        type="button"
                        onClick={() => handleToggleFollow(person)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                          isFollowed
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                            : ownerSession
                            ? 'bg-[#07213A] text-white border-transparent hover:bg-[#0A2E52] shadow-md'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
                        }`}
                        title={!ownerSession ? 'Login to follow' : undefined}
                      >
                        {isFollowed ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Following</span>
                          </>
                        ) : ownerSession ? (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Follow</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Name & Handle */}
                    <div className="mb-2">
                      <Link
                        href={`/people/${person.slug}`}
                        onClick={() => {
                          try { sessionStorage.setItem('bharatbn_viewed_person', JSON.stringify(person)); } catch {}
                        }}
                        className="group/name inline-flex items-center gap-1.5 max-w-full"
                      >
                        <h3 className="text-[15px] font-black text-slate-900 group-hover/name:text-[#F95700] transition leading-snug line-clamp-1">
                          {person.name}
                        </h3>
                        {person.isVerified && (
                          <div
                            className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs flex-shrink-0"
                            title="Official Verified Profile"
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                          </div>
                        )}
                      </Link>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">{person.handle}</p>
                    </div>

                    {/* Role & Location */}
                    <div className="space-y-1 mb-3">
                      <p className="text-xs font-semibold text-slate-700 line-clamp-1">{person.role}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate capitalize">{person.location}</span>
                      </p>
                    </div>

                    {/* Quote */}
                    {person.quote && (
                      <div className="flex-1 mb-4">
                        <p className="text-[11.5px] text-slate-500 italic bg-slate-50/80 border border-slate-100 px-3 py-2.5 rounded-xl line-clamp-2 leading-relaxed">
                          &ldquo;{person.quote}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Footer: Stats + View Profile */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          <strong className="text-slate-800 font-bold">{person.followersCount}</strong>
                          <span>{String(person.followersCount) === '1' ? 'follower' : 'followers'}</span>
                        </span>
                      </div>
                      <Link
                        href={`/people/${person.slug}`}
                        onClick={() => {
                          try { sessionStorage.setItem('bharatbn_viewed_person', JSON.stringify(person)); } catch {}
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-[11px] font-black transition-all shadow-sm hover:shadow-md"
                        title={`View ${person.name}'s complete profile`}
                      >
                        <span>View Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
