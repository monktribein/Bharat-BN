'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  MapPin,
  MessageSquare,
  Share2,
  ExternalLink,
  Users,
  FileText,
  Eye,
  Bell,
  Check,
  Play,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  GraduationCap,
  Briefcase,
  Trophy,
  Camera,
  Video,
  Newspaper,
  ShieldCheck,
  Send,
  X,
  Globe,
  Lock,
  Mail,
  Zap,
} from 'lucide-react';
import {
  YouTubeIcon,
  TwitterXIcon,
} from '@/components/SocialIcons';
import {
  getRealMetrics,
  toggleRealFollow,
  recordRealView,
  syncRealMetricsFromServer,
  getStoredFollowingList,
  getCurrentUserHandle,
  formatFollowerCount,
} from '@/lib/realMetrics';
import FollowersModal from '@/components/FollowersModal';
import DirectMessageModal from '@/components/DirectMessageModal';
import type { PersonProfile } from './peopleData';

interface Props {
  person: PersonProfile;
  slug?: string;
}

export default function PeopleProfileClient({ person: initialPerson, slug: propSlug }: Props) {
  const targetSlug = (propSlug || initialPerson.slug || '').toLowerCase().trim();
  const [person, setPerson] = useState<PersonProfile>(initialPerson);

  // Active module navigation tab
  const [activeTab, setActiveTab] = useState('overview');

  // Follow & Real Metrics state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState<number>(() => {
    const curSlug = (propSlug || initialPerson.slug || '').toLowerCase().trim();
    if (typeof window !== 'undefined' && curSlug) {
      try {
        const m = getRealMetrics(curSlug);
        if (m.followersCount > 0) return m.followersCount;
      } catch {}
    }
    return initialPerson.followersCount || 0;
  });
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [viewsCount, setViewsCount] = useState<number | string>(0);
  const [followToast, setFollowToast] = useState('');
  const [ownerSession, setOwnerSession] = useState<any>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Followers & Following Modal
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalTab, setFollowModalTab] = useState<'followers' | 'following'>('followers');

  const handleOpenFollowModal = (tab: 'followers' | 'following') => {
    setFollowModalTab(tab);
    setIsFollowModalOpen(true);
  };

  // Interactions
  const [likesCount, setLikesCount] = useState(initialPerson.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [dislikesCount, setDislikesCount] = useState(initialPerson.dislikesCount || 0);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals & Media State
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState({
    title: initialPerson.featuredVideo?.title || 'Featured Video',
    subtitle: initialPerson.featuredVideo?.subtitle || '',
    url: initialPerson.featuredVideo?.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  });
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; caption: string } | null>(null);

  // Sync owner session for follow permissions
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
    window.addEventListener('storage', syncSession);
    return () => {
      window.removeEventListener('bharatbn_auth_changed', syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  // Dynamically resolve custom registered person from localStorage
  useEffect(() => {
    const cleanTarget = (targetSlug || propSlug || initialPerson.slug || '').toLowerCase().trim();

    const matchCandidate = (p: any) => {
      if (!p) return false;
      const s = (p.slug || '').toLowerCase().trim();
      const h = (p.handle || '').toLowerCase().replace(/^@/, '').trim();
      const n = (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').trim();
      return s === cleanTarget || h === cleanTarget || n === cleanTarget;
    };

    const resolveAndSyncProfile = () => {
      try {
        const stored = localStorage.getItem('bharatbn_people_store');
        if (stored) {
          const people = JSON.parse(stored);
          if (Array.isArray(people)) {
            const storeRecord = people.find(matchCandidate);
            if (storeRecord) {
              const isAi = cleanTarget === 'ai';
              setPerson((prev) => ({
                ...prev,
                name: storeRecord.name || prev.name,
                role: storeRecord.role || prev.role,
                badge: storeRecord.badge || prev.badge,
                location: storeRecord.location || prev.location,
                quote: storeRecord.quote || prev.quote,
                avatarUrl: isAi ? prev.avatarUrl : (storeRecord.avatarUrl || prev.avatarUrl),
                coverUrl: isAi ? prev.coverUrl : (storeRecord.coverUrl || prev.coverUrl),
                aboutText: storeRecord.aboutText || prev.aboutText,
                website: storeRecord.website || prev.website,
              }));
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    resolveAndSyncProfile();
    window.addEventListener('bharatbn_people_updated', resolveAndSyncProfile);
    window.addEventListener('storage', resolveAndSyncProfile);
    return () => {
      window.removeEventListener('bharatbn_people_updated', resolveAndSyncProfile);
      window.removeEventListener('storage', resolveAndSyncProfile);
    };
  }, [targetSlug, propSlug, initialPerson]);

  // Sync Real Metrics, Views & Followers
  useEffect(() => {
    const curSlug = (person.slug || targetSlug || '').toLowerCase().trim();
    if (!curSlug) return;

    const viewCount = recordRealView(curSlug);
    setViewsCount(viewCount);

    const initialMetrics = getRealMetrics(curSlug);
    setFollowersCount(initialMetrics.followersCount);
    setFollowingCount(initialMetrics.followingCount);
    setPerson((prev) => ({
      ...prev,
      followersCount: initialMetrics.followersCount,
      followingCount: initialMetrics.followingCount,
    }));
    if (initialMetrics.viewsCount) {
      setViewsCount(initialMetrics.viewsCount);
    }

    const sessionActive = Boolean(localStorage.getItem('bharatbn_owner_session'));
    const myFollowing = getStoredFollowingList();
    const myHandle = getCurrentUserHandle();
    const isF = Boolean(
      sessionActive &&
      (myFollowing.includes(curSlug) ||
        initialMetrics.followers.some((f) => f.toLowerCase() === myHandle.toLowerCase()))
    );
    setIsFollowing(isF);

    syncRealMetricsFromServer(curSlug).then((remoteMetrics) => {
      if (remoteMetrics) {
        setFollowersCount(remoteMetrics.followersCount);
        if (remoteMetrics.followingCount !== undefined) {
          setFollowingCount(remoteMetrics.followingCount);
        }
        setPerson((prev) => ({
          ...prev,
          followersCount: remoteMetrics.followersCount,
          ...(remoteMetrics.followingCount !== undefined ? { followingCount: remoteMetrics.followingCount } : {}),
        }));
        if (remoteMetrics.viewsCount) {
          setViewsCount(remoteMetrics.viewsCount);
        }
      }
    });

    const onMetricsUpdated = () => {
      const updated = getRealMetrics(curSlug);
      setFollowersCount(updated.followersCount);
      setFollowingCount(updated.followingCount);
      setPerson((prev) => ({
        ...prev,
        followersCount: updated.followersCount,
        followingCount: updated.followingCount,
      }));
      if (updated.viewsCount) setViewsCount(updated.viewsCount);
      const active = Boolean(localStorage.getItem('bharatbn_owner_session'));
      const followingList = getStoredFollowingList();
      const userHandle = getCurrentUserHandle();
      setIsFollowing(
        Boolean(
          active &&
          (followingList.includes(curSlug) ||
            updated.followers.some((f) => f.toLowerCase() === userHandle.toLowerCase()))
        )
      );
    };

    window.addEventListener('bharatbn_metrics_updated', onMetricsUpdated);
    window.addEventListener('bharatbn_follow_changed', onMetricsUpdated);

    return () => {
      window.removeEventListener('bharatbn_metrics_updated', onMetricsUpdated);
      window.removeEventListener('bharatbn_follow_changed', onMetricsUpdated);
    };
  }, [person.slug, targetSlug]);

  const handleToggleFollow = async () => {
    if (!ownerSession) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      const curSlug = (person.slug || targetSlug || '').toLowerCase().trim();
      const updatedMetrics = await toggleRealFollow(curSlug, isFollowing);
      const nextFollowingState = !isFollowing;
      setIsFollowing(nextFollowingState);
      setFollowersCount(updatedMetrics.followersCount);
      setFollowingCount(updatedMetrics.followingCount);
      setPerson((prev) => ({
        ...prev,
        followersCount: updatedMetrics.followersCount,
        followingCount: updatedMetrics.followingCount,
      }));
      if (nextFollowingState) {
        setFollowToast(`Following ${person.name}! You will receive verified updates.`);
      } else {
        setFollowToast(`You unfollowed ${person.name}`);
      }
      setTimeout(() => setFollowToast(''), 3500);
    } catch (err) {
      console.error('Follow toggle failed', err);
    }
  };

  const handleToggleLike = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setHasLiked(true);
      setLikesCount((prev) => prev + 1);
      if (hasDisliked) {
        setHasDisliked(false);
        setDislikesCount((prev) => prev - 1);
      }
    }
  };

  const handleToggleDislike = () => {
    if (hasDisliked) {
      setHasDisliked(false);
      setDislikesCount((prev) => prev - 1);
    } else {
      setHasDisliked(true);
      setDislikesCount((prev) => prev + 1);
      if (hasLiked) {
        setHasLiked(false);
        setLikesCount((prev) => prev - 1);
      }
    }
  };

  const handleCopyShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const formattedFollowers = formatFollowerCount(followersCount);

  // Default highlights fallback
  const highlights = person.highlights && person.highlights.length > 0 ? person.highlights : [
    {
      key: 'neural-research',
      icon: 'Sparkles',
      title: 'Neural Architecture & Research',
      description: 'Foundation models & hyperlocal reasoning',
    },
    {
      key: 'core-platform',
      icon: 'ShieldCheck',
      title: 'Core Platform Intelligence',
      description: 'Autonomous directory indexing & real-time trust',
    },
    {
      key: 'ai-innovation',
      icon: 'Zap',
      title: 'BharatBN™ AI Innovation',
      description: 'Programmatic hyperlocal SEO & search engines',
    },
    {
      key: 'digital-sovereignty',
      icon: 'Globe',
      title: 'Digital Sovereignty',
      description: 'Democratic listing & discovery tools for 63M+ MSMEs',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0d1c2f] pb-16 font-sans">
      {/* Follow Toast Notification */}
      {followToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#07213A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{followToast}</span>
        </div>
      )}

      {/* Main Container - max-w-7xl matching Stitch */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* ========================================================================= */}
        {/* 1. HERO BANNER COVER & PROFILE IDENTITY (Exact Stitch 4272dec78e9b4ec2)  */}
        {/* ========================================================================= */}
        <section className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Panoramic Cover Banner */}
          <div className="relative w-full h-56 sm:h-64 md:h-72 bg-slate-900 overflow-hidden">
            <img
              src={person.coverUrl || '/people/anand-sahu-cover.jpg'}
              alt={`${person.name} Cover`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYSUhv8qFdTnnRGsNAMIodkXX0JD851DdEEFZidhiMf0IJI9fducFeP_AbYkdlDZhpIAIDfCFfWo1Ssb3e9sLiJNTBxiS42nk04eIPNYSWMZlvbkMlk1aWJvwnbCnlZeyQrxJSzs_M-nDOJ1-91icAzOhUDYGRxpOswczlXQXpB0bUMEcEQ0TpDljkflpRELm-yycCEdmicbcVubBtWZRKW9gkvD7RsRhrb5579quG';
              }}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

            {/* Top-Right Badge: Verified Voice • BharatBN™ */}
            <div className="absolute top-4 right-4 sm:top-5 sm:right-6 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[10.5px] font-bold tracking-wider border border-white/20 shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#006c4a] inline-block animate-pulse" />
              <span className="uppercase">Verified Voice • BharatBN™</span>
            </div>
          </div>

          {/* Profile Identity & Actions */}
          <div className="px-6 sm:px-8 pb-6 bg-white">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 -mt-14 sm:-mt-16 relative z-10">
              {/* Avatar + Main Details */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                {/* Rounded Square Avatar with border & shadow popping into the cover */}
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-white p-1.5 shadow-md flex-shrink-0 border-2 border-white">
                  <img
                    src={person.avatarUrl}
                    alt={person.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3hEgLT9ydPe-iOHF398fMJVnm1uzTONhg_QOIdUI2uP9_uAzy9s2Kx_I_vCL1VKGcriHuGeSVJCWeON9JvPqcVeFBpbAPuVEnCtDyLBvmixloh9FSU2lFkMbq0JLuRRhkRrwvARsAF20IB_RytUQmF4OquaihJpOVa-E-lJdrtePNSAWffnmdmjlc3asHGZpx8bIX656Xb3kNa-lUWpr5oZsYcHYyiOJdyz7kjJ7H';
                    }}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {/* Verified Emerald Badge */}
                  <span
                    className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#006c4a] text-white flex items-center justify-center shadow-sm border-2 border-white"
                    title="Verified Identity"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                </div>

                {/* Name, Badge, Role, Location */}
                <div className="flex flex-col gap-1.5 pb-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d1c2f] tracking-tight">
                      {person.name}
                    </h1>
                    <CheckCircle2 className="w-5 h-5 text-[#006c4a] fill-emerald-100 shrink-0" />
                    <span className="px-2.5 py-0.5 rounded bg-[#ffdbd0] text-[#9b2f00] text-xs font-bold uppercase tracking-wider">
                      {person.badge || 'AI INNOVATOR'}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 font-medium leading-snug">
                    {person.role}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{person.location}</span>
                    <span>•</span>
                    <span className="text-slate-600 font-semibold">@{person.slug}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Following Button */}
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer ${
                    isFollowing
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-[#0d1c2f] hover:bg-slate-800 text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </button>

                {/* Message Button */}
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>Message</span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleCopyShare}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{copiedLink ? 'Copied!' : 'Share'}</span>
                </button>

                {/* Website Link */}
                {person.website && (
                  <a
                    href={person.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}

                {/* LinkedIn Icon */}
                {person.socialLinks?.linkedin && (
                  <a
                    href={person.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold transition shadow-xs"
                    title="LinkedIn"
                  >
                    <span>in</span>
                  </a>
                )}

                {/* YouTube Icon */}
                {person.socialLinks?.youtube && (
                  <a
                    href={person.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center transition shadow-xs"
                    title="YouTube"
                  >
                    <YouTubeIcon className="w-3.5 h-3.5 text-[#FF0000] fill-current" />
                  </a>
                )}
              </div>
            </div>

            {/* Metrics Strip Container */}
            <div className="mt-6 bg-[#eff4ff] rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-4 border border-[#dde9ff]">
              <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                <button
                  type="button"
                  onClick={() => handleOpenFollowModal('followers')}
                  className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-blue-600 transition cursor-pointer font-medium"
                >
                  <strong className="font-extrabold text-sm text-[#0d1c2f]">{formattedFollowers}</strong>
                  <span>{followersCount === 1 ? 'Follower' : 'Followers'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenFollowModal('following')}
                  className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-blue-600 transition cursor-pointer font-medium"
                >
                  <strong className="font-extrabold text-sm text-[#0d1c2f]">{followingCount}</strong>
                  <span>Following</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                  <strong className="font-extrabold text-sm text-[#0d1c2f]">
                    {person.postsCount || (person.updates?.length || 1)}
                  </strong>
                  <span>Posts &amp; Updates</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                  <strong className="font-extrabold text-sm text-[#0d1c2f]">
                    {viewsCount !== undefined && viewsCount !== null ? viewsCount : (person.viewsCount || 4)}
                  </strong>
                  <span>Profile Views</span>
                </div>
              </div>

              {/* Right Badge: Updates Enabled */}
              <div className="px-3 py-1 rounded-full bg-emerald-100 text-[#006c4a] text-xs font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Updates Enabled</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. TWO-COLUMN SPLIT: LEFT RAIL (3 COLS) + RIGHT BODY (9 COLS)            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2">
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT RAIL: PROFILE MODULES NAV & CLAIM PROFILE CARD                     */}
          {/* ----------------------------------------------------------------------- */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-5">
            {/* Profile Modules Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 space-y-1">
              <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Profile Modules
              </div>

              <a
                href="#section-about"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>All Modules</span>
                </div>
              </a>

              <a
                href="#section-about"
                className="w-full px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-xs flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>About &amp; Bio</span>
                </div>
              </a>

              <a
                href="#section-education"
                className="w-full px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-xs flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>Education</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                  {person.educationList?.length || 1}
                </span>
              </a>

              <a
                href="#section-experience"
                className="w-full px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-xs flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Experience</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                  {person.experienceList?.length || 1}
                </span>
              </a>

              <a
                href="#section-achievements"
                className="w-full px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-xs flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Achievements</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                  {person.achievementsList?.length || 1}
                </span>
              </a>

              <a
                href="#section-news"
                className="w-full px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-xs flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <Newspaper className="w-3.5 h-3.5 text-slate-400" />
                  <span>News &amp; Media</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                  {person.newsList?.length || 1}
                </span>
              </a>

              <a
                href="#section-videos"
                className="w-full px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-xs flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <Video className="w-3.5 h-3.5 text-slate-400" />
                  <span>Featured Videos</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                  {(person.videoList?.length || 0) + (person.featuredVideo ? 1 : 0)}
                </span>
              </a>

              <a
                href="#section-gallery"
                className="w-full px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-xs flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-slate-400" />
                  <span>Photo Gallery</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                  {person.gallery?.length || 3}
                </span>
              </a>

              <a
                href="#section-posts"
                className="w-full px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-xs flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-slate-400" />
                  <span>Posts &amp; Updates</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                  {person.updates?.length || 1}
                </span>
              </a>

              <a
                href="#section-stories"
                className="w-full px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-xs flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>Community Stories</span>
                </div>
              </a>

              <a
                href="#section-channels"
                className="w-full px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-xs flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>Official Channels</span>
                </div>
              </a>
            </div>

            {/* Claim Profile Card */}
            <div
              id="claim-profile"
              className="bg-[#ffdbd0]/30 border border-[#ffdbd0] rounded-2xl p-5 text-center flex flex-col items-center gap-2.5 shadow-2xs"
            >
              <div className="w-10 h-10 rounded-full bg-[#ffdbd0] text-[#9b2f00] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0d1c2f]">Are you {person.name}?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Claim your official brand/public profile to manage credentials, media, and verified updates.
              </p>
              <Link
                href={`/claim/${person.slug}`}
                className="w-full py-2.5 px-4 rounded-xl bg-[#c2410c] hover:bg-[#ea580c] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
              >
                <span>Claim Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT BODY: SECTION MODULES                                             */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-9 flex flex-col gap-6 min-w-0">
            {/* Section 1: About Person */}
            <section
              id="section-about"
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-5 bg-[#c2410c] rounded-full inline-block" />
                <h2 className="text-lg font-bold text-[#0d1c2f]">About {person.name}</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {person.aboutText}
              </p>

              {/* 4 Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 pt-2">
                {highlights.map((h, idx) => (
                  <div
                    key={h.key || idx}
                    className="p-3.5 rounded-xl bg-[#f8f9ff] border border-[#e2e8f0] flex flex-col gap-2 hover:border-[#c2410c]/30 transition"
                  >
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#c2410c] flex items-center justify-center font-bold">
                      {idx % 2 === 0 ? <Sparkles className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#0d1c2f] leading-snug">{h.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">{h.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2: Education & Academic Qualifications */}
            <section
              id="section-education"
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-5 bg-[#006c4a] rounded-full inline-block" />
                <h2 className="text-lg font-bold text-[#0d1c2f]">
                  Education &amp; Academic Qualifications ({person.educationList?.length || 1})
                </h2>
              </div>

              {(person.educationList && person.educationList.length > 0
                ? person.educationList
                : [
                    {
                      id: 'edu-1',
                      degree: 'B.E. / B.Tech — Computer Science',
                      institution: 'Autonomous Systems & Distributed Computing',
                      year: '2020 — 2024',
                    },
                  ]
              ).map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 rounded-xl bg-[#f8f9ff] border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#006c4a] flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-[#0d1c2f] truncate">{edu.degree}</h4>
                      <p className="text-xs text-slate-500 truncate">{edu.institution}</p>
                    </div>
                  </div>
                  {edu.year && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 shrink-0">
                      {edu.year}
                    </span>
                  )}
                </div>
              ))}
            </section>

            {/* Section 3: Professional & Career Experience */}
            <section
              id="section-experience"
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-5 bg-[#c2410c] rounded-full inline-block" />
                <h2 className="text-lg font-bold text-[#0d1c2f]">
                  Professional &amp; Career Experience ({person.experienceList?.length || 1})
                </h2>
              </div>

              {(person.experienceList && person.experienceList.length > 0
                ? person.experienceList
                : [
                    {
                      id: 'exp-1',
                      role: 'AI Speaker • Representative',
                      organization: 'National Enterprise AI & Digital Public Infrastructure',
                      period: '2024',
                    },
                  ]
              ).map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-xl bg-[#f8f9ff] border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#c2410c] flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-[#0d1c2f] truncate">{exp.role}</h4>
                      <p className="text-xs text-slate-500 truncate">{exp.organization}</p>
                    </div>
                  </div>
                  {exp.period && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 shrink-0">
                      {exp.period}
                    </span>
                  )}
                </div>
              ))}
            </section>

            {/* Section 4: Key Achievements & Recognitions */}
            <section
              id="section-achievements"
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-5 bg-[#006c4a] rounded-full inline-block" />
                <h2 className="text-lg font-bold text-[#0d1c2f]">
                  Key Achievements &amp; Recognitions ({person.achievementsList?.length || 1})
                </h2>
              </div>

              {(person.achievementsList && person.achievementsList.length > 0
                ? person.achievementsList
                : [
                    {
                      id: 'ach-1',
                      title: 'Best Speaker Award',
                      organization: 'Conferred by Narendra Modi @ National Digital Innovation Summit',
                      year: '2024',
                    },
                  ]
              ).map((ach) => (
                <div
                  key={ach.id}
                  className="p-4 rounded-xl bg-[#f8f9ff] border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#006c4a] flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-[#0d1c2f] truncate">{ach.title}</h4>
                      <p className="text-xs text-slate-500 truncate">{ach.organization}</p>
                    </div>
                  </div>
                  {ach.year && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 shrink-0">
                      {ach.year}
                    </span>
                  )}
                </div>
              ))}
            </section>

            {/* Section 5: News & Media Coverage */}
            <section
              id="section-news"
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-5 bg-[#c2410c] rounded-full inline-block" />
                <h2 className="text-lg font-bold text-[#0d1c2f]">
                  News &amp; Media Coverage ({person.newsList?.length || 1})
                </h2>
              </div>

              {(person.newsList && person.newsList.length > 0
                ? person.newsList
                : [
                    {
                      id: 'news-1',
                      title: 'AI Speaker Media — Transforming Hyperlocal Commerce',
                      source: 'ECONOMIC TIMES',
                      date: 'Today',
                      description: 'Coverage on autonomous omnichannel business indexing and sovereign digital infrastructure across India.',
                    },
                  ]
              ).map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-xl bg-[#f8f9ff] border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-100 text-red-700">
                        {item.source}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#0d1c2f]">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <a
                    href={item.url || 'https://economictimes.indiatimes.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 shrink-0 shadow-xs transition"
                  >
                    <span>Read Full Coverage</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              ))}
            </section>

            {/* Section 6: Personal Video & Gallery */}
            <section
              id="section-videos"
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-5 bg-[#c2410c] rounded-full inline-block" />
                <h2 className="text-lg font-bold text-[#0d1c2f]">Personal Video &amp; Gallery</h2>
              </div>

              {/* 7:5 Video Player Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Main Featured Video Player (7 Cols) */}
                <div
                  onClick={() => {
                    setActiveVideo({
                      title: person.featuredVideo?.title || 'The AI Revolution in Indian Hyperlocal Commerce',
                      subtitle: person.featuredVideo?.subtitle || 'BharatBN Autonomous Intelligence Keynote',
                      url: person.featuredVideo?.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    });
                    setIsVideoModalOpen(true);
                  }}
                  className="lg:col-span-7 relative rounded-xl overflow-hidden aspect-video group cursor-pointer shadow-sm bg-slate-900"
                >
                  <img
                    src={person.featuredVideo?.thumbnailUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
                    alt={person.featuredVideo?.title || 'Video'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

                  {/* Top Badge: Duration */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono font-bold backdrop-blur-sm">
                    42 Mins, and 11 Secs
                  </div>

                  {/* Play Button & Title */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#c2410c] text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                    <div className="min-w-0 text-white">
                      <h4 className="font-bold text-xs sm:text-sm truncate drop-shadow-sm">
                        {person.featuredVideo?.title || 'The AI Revolution in Indian Hyperlocal Commerce'}
                      </h4>
                      <p className="text-[11px] text-slate-200 truncate">
                        {person.featuredVideo?.subtitle || 'BharatBN Autonomous Intelligence Keynote'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Playlist (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Video Playlist (2)
                  </div>

                  {(person.videoList && person.videoList.length > 0
                    ? person.videoList
                    : [
                        {
                          id: 'v-1',
                          title: 'The AI Revolution in Indian Hyperlocal Commerce',
                          subtitle: 'Keynote Hall 2024',
                          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                          thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80',
                          duration: '11:42',
                        },
                        {
                          id: 'v-2',
                          title: 'Autonomous Directory Indexing & Trust',
                          subtitle: 'Architecture Deep Dive',
                          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                          thumbnailUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80',
                          duration: '08:15',
                        },
                      ]
                  ).map((v) => (
                    <div
                      key={v.id}
                      onClick={() => {
                        setActiveVideo({
                          title: v.title,
                          subtitle: v.subtitle || '',
                          url: v.videoUrl,
                        });
                        setIsVideoModalOpen(true);
                      }}
                      className="p-2.5 rounded-xl bg-[#f8f9ff] hover:bg-slate-100 border border-slate-200 flex items-center gap-3 cursor-pointer transition"
                    >
                      <div className="relative w-20 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                        <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 right-1 px-1 rounded bg-black/70 text-white text-[9px] font-mono">
                          {v.duration || '10:00'}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-bold text-xs text-[#0d1c2f] truncate">{v.title}</h5>
                        <p className="text-[11px] text-slate-500 truncate">{v.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 7: Photo Gallery */}
            <section
              id="section-gallery"
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-5 bg-[#006c4a] rounded-full inline-block" />
                <h2 className="text-lg font-bold text-[#0d1c2f]">
                  Photo Gallery ({person.gallery?.length || 3})
                </h2>
              </div>

              {/* 3-Column Photo Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(person.gallery && person.gallery.length > 0
                  ? person.gallery
                  : [
                      {
                        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
                        caption: 'National Innovation Summit Keynote',
                      },
                      {
                        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
                        caption: 'AI Systems Whiteboard Session',
                      },
                      {
                        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
                        caption: 'Digital India Award Ceremony',
                      },
                    ]
                ).map((photo, pIdx) => (
                  <div
                    key={pIdx}
                    onClick={() => setSelectedPhoto(photo)}
                    className="relative rounded-xl overflow-hidden aspect-video sm:aspect-square group cursor-pointer shadow-xs bg-slate-100"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-white text-xs font-semibold line-clamp-1 drop-shadow-sm">
                        {photo.caption}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 8: Posts & Updates */}
            <section
              id="section-posts"
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-5 bg-[#c2410c] rounded-full inline-block" />
                <h2 className="text-lg font-bold text-[#0d1c2f]">
                  Posts &amp; Updates ({person.updates?.length || 1})
                </h2>
              </div>

              {(person.updates && person.updates.length > 0
                ? person.updates
                : [
                    {
                      id: 'post-1',
                      type: 'Posts' as const,
                      title: 'Introducing Next-Gen Autonomous AI Cataloging for BharatBN',
                      description: 'Hyperlocal discovery across 63 million MSMEs with real-time audit protocols and verified ranking.',
                      date: '2 hours ago',
                      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
                      likes: 42,
                      comments: 12,
                      shares: 8,
                    },
                  ]
              ).map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-xl bg-[#f8f9ff] border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={person.avatarUrl}
                        alt={person.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#0d1c2f]">{person.name}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#006c4a] fill-emerald-100" />
                        </div>
                        <span className="text-[11px] text-slate-400">{post.date}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      {post.type}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {post.description}
                  </p>

                  {post.imageUrl && (
                    <div className="rounded-xl overflow-hidden aspect-video bg-slate-900">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Likes, Comments, Shares */}
                  <div className="flex items-center gap-4 pt-2 border-t border-slate-200 text-xs text-slate-500 font-medium">
                    <button
                      type="button"
                      onClick={handleToggleLike}
                      className="flex items-center gap-1.5 hover:text-[#c2410c] transition cursor-pointer"
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'text-[#c2410c] fill-[#c2410c]' : ''} `} />
                      <span>{post.likes + (hasLiked ? 1 : 0)} Likes</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 hover:text-blue-600 transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.comments} Comments</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyShare}
                      className="flex items-center gap-1.5 hover:text-emerald-600 transition cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </section>

            {/* Section 9: Community Stories */}
            <section
              id="section-stories"
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-5 bg-[#006c4a] rounded-full inline-block" />
                <h2 className="text-lg font-bold text-[#0d1c2f]">Community Stories &amp; Testimonials</h2>
              </div>

              {(person.communityStoriesList && person.communityStoriesList.length > 0
                ? person.communityStoriesList
                : [
                    {
                      id: 'story-1',
                      author: 'Dr. Arvind K.',
                      role: 'Director, Dental Super Speciality',
                      content: 'The AI verification pipeline provided by BharatBN has significantly improved patient acquisition and verified booking credibility.',
                      date: 'Nov 2026',
                    },
                    {
                      id: 'story-2',
                      author: 'Suresh Mehta',
                      role: 'Founder, Precision Machine Works',
                      content: 'Sovereign discovery protocols ensure that genuine domestic MSMEs gain priority ranking without ransom paywalls.',
                      date: 'Nov 2026',
                    },
                  ]
              ).map((story) => (
                <div
                  key={story.id}
                  className="p-4 rounded-xl bg-[#f8f9ff] border border-slate-200 space-y-2"
                >
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    &ldquo;{story.content}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                    <span className="font-bold text-[#0d1c2f]">
                      {story.author} <span className="text-slate-400 font-normal">({story.role})</span>
                    </span>
                    <span className="text-slate-400 text-[11px]">{story.date}</span>
                  </div>
                </div>
              ))}
            </section>

            {/* Section 10: Official Channels */}
            <section
              id="section-channels"
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-5 bg-[#c2410c] rounded-full inline-block" />
                <h2 className="text-lg font-bold text-[#0d1c2f]">Official Channels</h2>
              </div>

              <div className="flex flex-wrap gap-3">
                {person.website && (
                  <a
                    href={person.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#f8f9ff] hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition shadow-xs"
                  >
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
                {person.socialLinks?.twitter && (
                  <a
                    href={person.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#f8f9ff] hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition shadow-xs"
                  >
                    <TwitterXIcon className="w-3.5 h-3.5 fill-current" />
                    <span>Twitter / X</span>
                  </a>
                )}
                {person.socialLinks?.linkedin && (
                  <a
                    href={person.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#f8f9ff] hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition shadow-xs"
                  >
                    <span className="font-black text-xs text-blue-700">in</span>
                    <span>LinkedIn</span>
                  </a>
                )}
                {person.socialLinks?.youtube && (
                  <a
                    href={person.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#f8f9ff] hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition shadow-xs"
                  >
                    <YouTubeIcon className="w-3.5 h-3.5 text-[#FF0000] fill-current" />
                    <span>YouTube Channel</span>
                  </a>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Followers & Following Modal */}
      <FollowersModal
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
        targetSlug={person.slug}
        targetName={person.name}
        targetHandle={`@${person.slug}`}
        initialTab={followModalTab}
        onFollowToggle={(slug, following) => {
          if (slug === person.slug) {
            setIsFollowing(following);
          }
        }}
      />

      {/* Direct Message Modal */}
      <DirectMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        recipient={{
          slug: person.slug,
          name: person.name,
          avatarUrl: person.avatarUrl,
          role: person.role,
          handle: `@${person.slug}`,
          isVerified: person.isVerified,
        }}
      />

      {/* Video Lightbox Modal */}
      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white">
              <div>
                <h4 className="font-bold text-sm">{activeVideo.title}</h4>
                <p className="text-xs text-slate-400">{activeVideo.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.url.includes('v=') ? activeVideo.url.split('v=')[1].split('&')[0] : 'dQw4w9WgXcQ'}?autoplay=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="max-w-4xl max-h-[90vh] flex flex-col items-center gap-3 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-orange-400 transition cursor-pointer p-1"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption}
              className="max-h-[80vh] w-auto object-contain rounded-xl shadow-2xl"
            />
            <p className="text-white font-medium text-xs sm:text-sm text-center drop-shadow-md">
              {selectedPhoto.caption}
            </p>
          </div>
        </div>
      )}

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
                type="button"
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

              <div className="space-y-2 pt-2">
                <Link
                  href="/claim/new"
                  className="w-full py-3 rounded-xl bg-[#F95700] hover:bg-[#EA4E00] text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Claim / Register Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowLoginPrompt(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
