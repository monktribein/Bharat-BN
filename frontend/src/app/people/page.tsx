'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Sparkles,
  Heart,
  UserPlus,
  UserCheck,
  ArrowRight,
  Filter,
  Flame,
  Award,
  MessageSquare,
} from 'lucide-react';

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
    coverUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    followersCount: '28.4K',
    postsCount: 286,
    category: 'Public Figures & Speakers',
    isVerified: true,
  },
  {
    id: 'BBN-PPL-KASHISH-001',
    name: 'Kashish Saxena',
    slug: 'kashish',
    handle: '@kashish',
    role: 'Creator & Platform Pioneer',
    badge: 'Creator',
    location: 'Noida, UP',
    quote: 'Empowering local businesses and creators across Bharat.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    followersCount: '1.2K',
    postsCount: 14,
    category: 'Creators & Influencers',
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
    followersCount: '18.9K',
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
    followersCount: '12.5K',
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
    followersCount: '34.1K',
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
            parsed.forEach((p: any) => {
              const slug = p.slug || p.handle?.replace(/^@/, '') || 'profile';
              map.set(slug, {
                id: p.id || `BBN-PPL-${Date.now()}`,
                name: p.name,
                slug,
                handle: p.handle?.startsWith('@') ? p.handle : `@${p.handle || slug}`,
                role: p.role || 'Public Figure & Speaker',
                badge: p.badge || 'Public Figure',
                location: p.location || 'India',
                quote: p.quote || 'Building a stronger connected community across India.',
                avatarUrl: p.avatarUrl || '',
                coverUrl: p.coverUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
                followersCount: p.followersCount || '1',
                postsCount: p.updates?.length || 1,
                category: p.role?.toLowerCase().includes('creator') ? 'Creators & Influencers' : 'Public Figures & Speakers',
                isVerified: (p.status === 'approved') || Boolean(p.isVerified),
              });
            });
          }
        }

        // Also merge active person session if present
        if (sessionStr) {
          try {
            const sess = JSON.parse(sessionStr);
            if (sess && sess.accountType === 'person' && sess.name) {
              const sessSlug = sess.slug || sess.handle?.replace(/^@/, '') || 'profile';
              const existing = map.get(sessSlug);
              map.set(sessSlug, {
                id: sess.personId || existing?.id || `BBN-PPL-${Date.now()}`,
                name: sess.name,
                slug: sessSlug,
                handle: sess.handle?.startsWith('@') ? sess.handle : `@${sess.handle || sessSlug}`,
                role: sess.role || existing?.role || 'Creator & Platform Pioneer',
                badge: sess.badge || existing?.badge || 'Creator',
                location: sess.location || existing?.location || 'India',
                quote: sess.quote || existing?.quote || 'Building a stronger connected community across India.',
                avatarUrl: sess.avatarUrl || existing?.avatarUrl || '',
                coverUrl: sess.coverUrl || existing?.coverUrl || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
                followersCount: sess.followersCount || existing?.followersCount || '1.2K',
                postsCount: sess.postsCount || existing?.postsCount || 1,
                category: existing?.category || (sess.role?.toLowerCase().includes('creator') ? 'Creators & Influencers' : 'Public Figures & Speakers'),
                isVerified: sess.isVerified !== undefined ? sess.isVerified : (existing?.isVerified || false),
              });
            }
          } catch { }
        }

        // Add default curated figures if not overwritten
        defaultPeopleList.forEach((dp) => {
          if (!map.has(dp.slug)) {
            map.set(dp.slug, dp);
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
    window.addEventListener('storage', loadStoredPeople);
    return () => {
      window.removeEventListener('bharatbn_people_updated', loadStoredPeople);
      window.removeEventListener('bharatbn_auth_changed', loadStoredPeople);
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

  const handleToggleFollow = (person: PersonCard) => {
    try {
      const stored = localStorage.getItem('bharatbn_people_follows');
      let follows: string[] = stored ? JSON.parse(stored) : [];

      if (follows.includes(person.slug)) {
        follows = follows.filter((s) => s !== person.slug);
        setFollowToast(`You unfollowed ${person.name}`);
      } else {
        follows.push(person.slug);
        setFollowToast(`Following ${person.name}! You will receive their latest updates.`);
      }

      localStorage.setItem('bharatbn_people_follows', JSON.stringify(follows));
      setFollowedSlugs(follows);
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
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
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

      {/* Hero Banner Section */}
      <div className="bg-gradient-to-b from-[#07213A] to-[#0A2E52] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>India&apos;s Business &amp; People Network</span>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Discover &amp; Follow Voices of Bharat
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Connect with verified public figures, leaders, creators, policy thinkers, and industry pioneers building a stronger, self-reliant nation.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl bg-white rounded-2xl p-2 shadow-xl flex items-center gap-2 border border-slate-200">
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people by name (e.g. Anand Sahu, Kashish), handle, or role..."
              className="w-full py-2 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl p-2 shadow-md border border-slate-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${selectedCategory === cat
                ? 'bg-[#07213A] text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* People Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>Verified Profiles</span>
              <span className="text-xs font-bold text-slate-400 font-mono">({filteredPeople.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              Click &quot;View Profile&quot; on any card to explore their full articles, speeches, and video gallery
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
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No profiles found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn&apos;t find anyone matching &quot;{searchQuery}&quot;. Try searching for &quot;Anand Sahu&quot; or &quot;Kashish&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPeople.map((person) => {
              const isFollowed = followedSlugs.includes(person.slug);

              return (
                <div
                  key={person.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col group"
                >
                  {/* Top Cover Banner */}
                  <div className="relative h-28 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={person.coverUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80'}
                      alt={person.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80';
                      }}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                    {/* Category Tag on top-right */}
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950/70 text-white backdrop-blur-md border border-white/20 shadow-xs">
                      {person.badge}
                    </span>
                  </div>

                  {/* Profile Info Block */}
                  <div className="p-5 pt-0 relative flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Avatar with White Border (Negative Margin to overlap cover) */}
                      <div className="relative -mt-10 mb-3 w-16 h-16 rounded-full bg-white border-3 border-white shadow-lg overflow-hidden flex items-center justify-center">
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
                      </div>

                      {/* Name & Handle */}
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#F95700] transition">
                            {person.name}
                          </h3>
                          {person.isVerified && (
                            <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-50 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs font-mono text-slate-400 font-medium">{person.handle}</p>
                      </div>

                      {/* Role & Location */}
                      <div className="pt-2 space-y-1">
                        <p className="text-xs font-semibold text-slate-700 line-clamp-1">{person.role}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{person.location}</span>
                        </p>
                      </div>

                      {/* Quote / Headline */}
                      {person.quote && (
                        <p className="mt-3 text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                          &ldquo;{person.quote}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Stat Badges & Bottom Actions */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold">
                          <strong className="text-slate-900">{person.followersCount}</strong> Followers
                        </span>
                        <span className="font-semibold">
                          <strong className="text-slate-900">{person.postsCount}</strong> Updates
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Follow Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleFollow(person)}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${isFollowed
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-[#07213A] text-white hover:bg-[#0C2D4E]'
                            }`}
                        >
                          {isFollowed ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Following</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5 text-orange-400" />
                              <span>+ Follow</span>
                            </>
                          )}
                        </button>

                        {/* View Profile Button (Opens full public page!) */}
                        <Link
                          href={`/people/${person.slug}`}
                          className="py-2 px-3.5 rounded-xl text-xs font-bold text-white bg-[#F95700] hover:bg-[#d94a00] shadow-sm transition flex items-center justify-center gap-1 cursor-pointer flex-shrink-0"
                          title={`View ${person.name}'s complete profile`}
                        >
                          <span>View Profile</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
