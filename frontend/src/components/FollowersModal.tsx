'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check, Users, Compass, UserPlus, UserCheck, ShieldCheck } from 'lucide-react';
import {
  getStoredFollowerMap,
  getStoredFollowingList,
  getProfileFollowingList,
  toggleRealFollow,
  getCurrentUserHandle,
} from '@/lib/realMetrics';

export interface FollowProfileItem {
  id: string;
  name: string;
  handle: string;
  slug: string;
  role: string;
  badge: string;
  avatarUrl: string;
  isVerified: boolean;
}

// Pre-seeded verified BharatBN leadership figures
const CURATED_PROFILES: Record<string, FollowProfileItem> = {
  'anand-sahu': {
    id: 'BBN-PPL-ANAND-SAHU-001',
    name: 'Anand Sahu',
    handle: '@anandsahu',
    slug: 'anand-sahu',
    role: 'Nationalist Thinker & Speaker',
    badge: 'Public Figure',
    avatarUrl: '/people/anand-sahu-avatar.jpg',
    isVerified: true,
  },
  kashish: {
    id: 'BBN-PPL-KASHISH-001',
    name: 'Kashish Saxena',
    handle: '@kashish',
    slug: 'kashish',
    role: 'Public Figure & Speaker',
    badge: 'Public Figure',
    avatarUrl: '/people/kashish-avatar.png',
    isVerified: true,
  },
  ai: {
    id: 'BBN-PPL-AI-001',
    name: 'AI',
    handle: '@ai',
    slug: 'ai',
    role: 'Autonomous AI Researcher & Platform Pioneer',
    badge: 'AI Innovator',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3hEgLT9ydPe-iOHF398fMJVnm1uzTONhg_QOIdUI2uP9_uAzy9s2Kx_I_vCL1VKGcriHuGeSVJCWeON9JvPqcVeFBpbAPuVEnCtDyLBvmixloh9FSU2lFkMbq0JLuRRhkRrwvARsAF20IB_RytUQmF4OquaihJpOVa-E-lJdrtePNSAWffnmdmjlc3asHGZpx8bIX656Xb3kNa-lUWpr5oZsYcHYyiOJdyz7kjJ7H',
    isVerified: true,
  },
  'dr-sweta-gupta': {
    id: 'BBN-PPL-SWETA-GUPTA-001',
    name: 'Dr. Sweta Gupta',
    handle: '@drswetagupta',
    slug: 'dr-sweta-gupta',
    role: 'Medical Director & Senior IVF Specialist | MBBS, MD, DNB, MRCOG (UK)',
    badge: 'Medical Leader',
    avatarUrl: '/people/dr-sweta-gupta.png',
    isVerified: true,
  },
  'dr-sanjay-gupta': {
    id: 'BBN-PPL-SANJAY-GUPTA-001',
    name: 'Dr. Sanjay Gupta',
    handle: '@drsanjaygupta',
    slug: 'dr-sanjay-gupta',
    role: 'Chief Robotic Knee Replacement Surgeon | MS Orthopedics, MCh Orth (UK), FRCS',
    badge: 'Medical Leader',
    avatarUrl: '/people/dr-sanjay-gupta.png',
    isVerified: true,
  },
  'dr-rajesh-sharma': {
    id: 'BBN-PPL-RAJESH-002',
    name: 'Dr. Rajesh Sharma',
    handle: '@dr_rajesh',
    slug: 'dr-rajesh-sharma',
    role: 'Healthcare Pioneer & Dental Surgeon',
    badge: 'Medical Leader',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
  },
  'priya-menon': {
    id: 'BBN-PPL-PRIYA-003',
    name: 'Priya Menon',
    handle: '@priyamenon_ev',
    slug: 'priya-menon',
    role: 'Clean Tech & EV Policy Advocate',
    badge: 'Policy Voice',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
  },
  'vikram-singhania': {
    id: 'BBN-PPL-VIKRAM-004',
    name: 'Vikram Singhania',
    handle: '@vikram_singhania',
    slug: 'vikram-singhania',
    role: 'Franchise Enterprise Strategist',
    badge: 'Advisor',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
  },
  'adv-rajeshwar-sen': {
    id: 'BBN-PPL-LAW-005',
    name: 'Adv. Rajeshwar Sen',
    handle: '@adv_rajeshwar',
    slug: 'adv-rajeshwar-sen',
    role: 'Senior Advocate & Constitutional Jurist',
    badge: 'Senior Counsel',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
  },
  'shreya-kapoor': {
    id: 'BBN-PPL-D2C-006',
    name: 'Shreya Kapoor',
    handle: '@shreya_ventures',
    slug: 'shreya-kapoor',
    role: 'D2C Brand Builder & Founder',
    badge: 'Founder',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
  },
  'arjun-mehta': {
    id: 'BBN-PPL-AGRI-007',
    name: 'Arjun Mehta',
    handle: '@arjun_mehta',
    slug: 'arjun-mehta',
    role: 'AgriTech Innovator & Organic Farmer',
    badge: 'Agri Pioneer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
  },
  'deepika-iyer': {
    id: 'BBN-PPL-WEAVE-008',
    name: 'Deepika Iyer',
    handle: '@deepika_iyer',
    slug: 'deepika-iyer',
    role: 'Handloom Revivalist & Textile Historian',
    badge: 'Cultural Voice',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
  },
};

function resolveProfileItem(rawIdentifier: string): FollowProfileItem {
  const clean = (rawIdentifier || '').replace(/^@/, '').toLowerCase().trim();
  if (!clean) {
    return {
      id: `gen-${Date.now()}`,
      name: 'BharatBN Member',
      handle: '@member',
      slug: 'member',
      role: 'Verified Community Member',
      badge: 'Member',
      avatarUrl: '',
      isVerified: false,
    };
  }

  // 1. Check logged-in owner session if matching
  try {
    const sessStr = typeof window !== 'undefined' ? localStorage.getItem('bharatbn_owner_session') : null;
    if (sessStr) {
      const sess = JSON.parse(sessStr);
      const sessSlug = (sess.slug || sess.handle?.replace(/^@/, '') || '').toLowerCase().trim();
      const sessName = (sess.name || '').toLowerCase().trim();
      if (sessSlug === clean || sessName.includes(clean)) {
        return {
          id: sess.personId || `BBN-PPL-${clean}`,
          name: sess.name || 'Personal Member',
          handle: sess.handle?.startsWith('@') ? sess.handle : `@${sess.handle || clean}`,
          slug: sessSlug || clean,
          role: sess.role || 'Public Figure & Speaker',
          badge: sess.badge || 'Public Figure',
          avatarUrl: sess.avatarUrl || '',
          isVerified: sess.isVerified !== undefined ? sess.isVerified : true,
        };
      }
    }
  } catch {}

  // 2. Check bharatbn_people_store
  try {
    const storeStr = typeof window !== 'undefined' ? localStorage.getItem('bharatbn_people_store') : null;
    if (storeStr) {
      const list = JSON.parse(storeStr);
      if (Array.isArray(list)) {
        const found = list.find((p: any) => {
          const s = (p.slug || p.handle?.replace(/^@/, '') || '').toLowerCase().trim();
          const n = (p.name || '').toLowerCase().trim();
          return s === clean || n.includes(clean);
        });
        if (found) {
          return {
            id: found.id || `BBN-PPL-${clean}`,
            name: found.name,
            handle: found.handle?.startsWith('@') ? found.handle : `@${found.handle || found.slug || clean}`,
            slug: found.slug || clean,
            role: found.role || 'Public Figure & Speaker',
            badge: found.badge || 'Public Figure',
            avatarUrl: found.avatarUrl || '',
            isVerified: Boolean(found.isVerified),
          };
        }
      }
    }
  } catch {}

  // 3. Check CURATED_PROFILES
  if (CURATED_PROFILES[clean]) {
    return CURATED_PROFILES[clean];
  }

  // Match by handle variant
  const byHandle = Object.values(CURATED_PROFILES).find(
    (p) => p.handle.replace(/^@/, '').toLowerCase() === clean
  );
  if (byHandle) {
    return byHandle;
  }

  // Fallback nicely formatted item
  const capitalName = clean.charAt(0).toUpperCase() + clean.slice(1);
  return {
    id: `BBN-USR-${clean}`,
    name: capitalName,
    handle: `@${clean}`,
    slug: clean,
    role: 'BharatBN Sovereign Voice',
    badge: 'Member',
    avatarUrl: '',
    isVerified: false,
  };
}

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSlug: string;
  targetName: string;
  targetHandle: string;
  initialTab?: 'followers' | 'following';
  onFollowToggle?: (targetSlug: string, isFollowing: boolean) => void;
  onRequireLogin?: () => void;
}

export default function FollowersModal({
  isOpen,
  onClose,
  targetSlug,
  targetName,
  targetHandle,
  initialTab = 'followers',
  onFollowToggle,
  onRequireLogin,
}: FollowersModalProps) {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [followers, setFollowers] = useState<FollowProfileItem[]>([]);
  const [following, setFollowing] = useState<FollowProfileItem[]>([]);
  const [myFollowingSlugs, setMyFollowingSlugs] = useState<string[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null);

  const normTargetSlug = (targetSlug || '').toLowerCase().trim();

  // Reset tab when modal opens or initialTab changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSearchQuery('');
    }
  }, [isOpen, initialTab]);

  // Sync followers and following data
  const refreshData = () => {
    if (typeof window === 'undefined') return;

    // 1. Logged in session
    let sess: any = null;
    try {
      const sessStr = localStorage.getItem('bharatbn_owner_session');
      sess = sessStr ? JSON.parse(sessStr) : null;
      setCurrentSession(sess);
    } catch {
      setCurrentSession(null);
    }

    // 2. Currently logged-in user's follows
    const myFollows = getStoredFollowingList();
    setMyFollowingSlugs(myFollows);

    // 3. Target profile's Followers
    const followerMap = getStoredFollowerMap();
    const rawFollowersList = followerMap[normTargetSlug] || [];
    const cleanFollowers = rawFollowersList.filter((f) => f && f !== '@visitor' && f !== '@user');
    const resolvedFollowers = cleanFollowers.map(resolveProfileItem);
    setFollowers(resolvedFollowers);

    // 4. Target profile's Following (100% Real - No hardcoded/fake numbers)
    const targetFollowingSlugs = getProfileFollowingList(normTargetSlug).filter(
      (s) => s.toLowerCase() !== normTargetSlug
    );
    const resolvedFollowing = targetFollowingSlugs.map(resolveProfileItem);
    setFollowing(resolvedFollowing);
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen, normTargetSlug]);

  // Listen for external follow/metrics events
  useEffect(() => {
    const handleUpdate = () => {
      if (isOpen) refreshData();
    };
    window.addEventListener('bharatbn_follow_changed', handleUpdate);
    window.addEventListener('bharatbn_metrics_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('bharatbn_follow_changed', handleUpdate);
      window.removeEventListener('bharatbn_metrics_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [isOpen]);

  // Filter items by search query
  const filteredItems = useMemo(() => {
    const list = activeTab === 'followers' ? followers : following;
    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.handle.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q)
    );
  }, [activeTab, followers, following, searchQuery]);

  // Handle follow / unfollow toggle from within the modal
  const handleToggle = async (user: FollowProfileItem) => {
    if (!currentSession) {
      if (onRequireLogin) onRequireLogin();
      return;
    }

    const itemSlug = user.slug.toLowerCase().trim();
    const isCurrentlyFollowing = myFollowingSlugs.includes(itemSlug);

    setTogglingSlug(itemSlug);
    try {
      await toggleRealFollow(itemSlug, isCurrentlyFollowing);

      const next = isCurrentlyFollowing
        ? myFollowingSlugs.filter((s) => s !== itemSlug)
        : [...myFollowingSlugs, itemSlug];
      setMyFollowingSlugs(next);

      if (onFollowToggle) {
        onFollowToggle(itemSlug, !isCurrentlyFollowing);
      }
      refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingSlug(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Dialog (Instagram-Style) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] z-10"
        >
          {/* Header */}
          <div className="relative px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-black text-slate-900 truncate">
                {targetHandle || `@${targetSlug}`}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 truncate">
                ({targetName})
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Instagram-Style Tab Bar */}
          <div className="grid grid-cols-2 border-b border-slate-200 text-center text-xs font-bold bg-white">
            <button
              type="button"
              onClick={() => {
                setActiveTab('followers');
                setSearchQuery('');
              }}
              className={`py-3.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
                activeTab === 'followers'
                  ? 'text-[#F95700] font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Followers</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono text-slate-600">
                {followers.length}
              </span>
              {activeTab === 'followers' && (
                <motion.div
                  layoutId="followActiveTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F95700]"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('following');
                setSearchQuery('');
              }}
              className={`py-3.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
                activeTab === 'following'
                  ? 'text-blue-600 font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Following</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono text-slate-600">
                {following.length}
              </span>
              {activeTab === 'following' && (
                <motion.div
                  layoutId="followActiveTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                />
              )}
            </button>
          </div>

          {/* Search Box */}
          <div className="p-3 border-b border-slate-100 bg-white">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === 'followers'
                    ? `Search ${followers.length} followers...`
                    : `Search ${following.length} following...`
                }
                className="w-full pl-9 pr-8 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-[#F95700] rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 w-4 h-4 rounded-full bg-slate-300 hover:bg-slate-400 text-white flex items-center justify-center transition cursor-pointer text-[10px]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* User List Content */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-0.5 min-h-[260px] max-h-[380px]">
            {filteredItems.length > 0 ? (
              filteredItems.map((user) => {
                const isViewer =
                  currentSession &&
                  (currentSession.slug === user.slug ||
                    currentSession.handle?.replace(/^@/, '').toLowerCase() === user.slug.toLowerCase());
                const isFollowing = myFollowingSlugs.includes(user.slug.toLowerCase());
                const isToggling = togglingSlug === user.slug.toLowerCase();

                return (
                  <div
                    key={user.id || user.slug}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition gap-3 group"
                  >
                    {/* User DP + Info Link */}
                    <Link
                      href={`/people/${user.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 min-w-0 flex-1"
                    >
                      {/* Avatar */}
                      <div className="relative w-11 h-11 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const fb = parent.querySelector('.follow-modal-fallback');
                                if (fb) (fb as HTMLElement).style.display = 'flex';
                              }
                            }}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                        <div
                          className={`w-full h-full bg-gradient-to-tr from-[#07213A] to-[#F95700] text-white font-black text-sm flex items-center justify-center follow-modal-fallback ${
                            user.avatarUrl ? 'hidden' : 'flex'
                          }`}
                        >
                          {user.name.slice(0, 1).toUpperCase()}
                        </div>
                      </div>

                      {/* Name & Handle */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 leading-tight">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-[#F95700] transition truncate">
                            {user.name}
                          </span>
                          {user.isVerified && (
                            <div
                              className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0"
                              title="Official Verified Profile"
                            >
                              <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="text-[11px] font-mono text-slate-500 font-semibold truncate">
                            {user.handle}
                          </span>
                          {user.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 truncate border border-slate-200/60">
                              {user.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      {isViewer ? (
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-400 text-[11px] font-bold border border-slate-200/80">
                          You
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggle(user)}
                          disabled={isToggling}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50 ${
                            isFollowing
                              ? 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 hover:border-red-200'
                              : 'bg-[#07213A] hover:bg-[#0C2D4E] text-white shadow-xs'
                          }`}
                        >
                          {isFollowing ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Following</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5 text-[#F95700]" />
                              <span>Follow</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              // Empty State (Instagram-Style)
              <div className="py-12 px-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  {activeTab === 'followers' ? (
                    <Users className="w-7 h-7 text-slate-300" />
                  ) : (
                    <Compass className="w-7 h-7 text-slate-300" />
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800">
                    {searchQuery
                      ? 'No results found'
                      : activeTab === 'followers'
                      ? 'No Followers Yet'
                      : 'Not Following Anyone Yet'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    {searchQuery
                      ? `No accounts matching "${searchQuery}" in ${activeTab}.`
                      : activeTab === 'followers'
                      ? `When accounts follow ${targetHandle || `@${targetSlug}`}, they will appear here.`
                      : `Accounts that ${targetHandle || `@${targetSlug}`} follows will appear here.`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="px-4 py-2.5 bg-slate-50/90 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Authentic BharatBN Connections</span>
            </span>
            <span className="text-slate-400 font-mono">100% Real Follows</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
