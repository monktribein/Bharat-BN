'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Bookmark,
  Sparkles,
  GraduationCap,
  Briefcase,
  Trophy,
  HeartHandshake,
  Camera,
  Video,
  Newspaper,
  ShieldCheck,
  Send,
  X,
  Plus,
  Globe,
} from 'lucide-react';
import {
  InstagramIcon,
  YouTubePlayIcon,
  YouTubeIcon,
  FacebookFIcon,
  TwitterXIcon,
  LinkedInIcon,
} from '@/components/SocialIcons';
import type { PersonProfile } from './peopleData';

interface Props {
  person: PersonProfile;
  slug?: string;
}

export default function PeopleProfileClient({ person: initialPerson, slug: propSlug }: Props) {
  const targetSlug = (propSlug || initialPerson.slug || '').toLowerCase().trim();
  const [person, setPerson] = useState<PersonProfile>(initialPerson);

  // Navigation active tab
  const [activeTab, setActiveTab] = useState('overview');
  const [feedFilter, setFeedFilter] = useState<'All' | 'Posts' | 'News' | 'Events'>('All');

  // Follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(initialPerson.followersCount);
  const [followToast, setFollowToast] = useState('');

  // Floating Bar Interaction states
  const [likesCount, setLikesCount] = useState(initialPerson.likesCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [dislikesCount, setDislikesCount] = useState(initialPerson.dislikesCount);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals & Media State
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [storyAuthor, setStoryAuthor] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [storySubmitted, setStorySubmitted] = useState(false);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState({
    title: initialPerson.featuredVideo?.title || 'Featured Video',
    subtitle: initialPerson.featuredVideo?.subtitle || '',
    url: initialPerson.featuredVideo?.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  });
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; caption: string } | null>(null);

  // Dynamically resolve custom registered person from localStorage if visited
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bharatbn_people_store');
      let found: any = null;
      if (stored) {
        const people = JSON.parse(stored);
        if (Array.isArray(people)) {
          found = people.find(
            (p: any) =>
              p.slug?.toLowerCase() === targetSlug ||
              p.handle?.toLowerCase().replace(/^@/, '') === targetSlug
          );
        }
      }

      // Also check active owner session if matching
      if (!found) {
        const sessionStr = localStorage.getItem('bharatbn_owner_session');
        if (sessionStr) {
          const sess = JSON.parse(sessionStr);
          if (
            sess.accountType === 'person' &&
            (sess.slug?.toLowerCase() === targetSlug || sess.handle?.toLowerCase().replace(/^@/, '') === targetSlug)
          ) {
            found = sess;
          }
        }
      }

      if (found) {
        const isAnand =
          targetSlug === 'anand-sahu' ||
          targetSlug === 'anand' ||
          found.name?.toLowerCase().includes('anand sahu');

        const dynamicHighlights =
          Array.isArray(found.highlights) && found.highlights.length > 0
            ? found.highlights
            : [
                ...(found.education
                  ? [
                      {
                        key: 'education',
                        icon: 'GraduationCap',
                        title: 'Education & Qualifications',
                        description: found.education,
                      },
                    ]
                  : []),
                ...(found.experience
                  ? [
                      {
                        key: 'experience',
                        icon: 'Briefcase',
                        title: 'Organizational Experience & Roles',
                        description: found.experience,
                      },
                    ]
                  : []),
                ...(found.achievements
                  ? [
                      {
                        key: 'achievements',
                        icon: 'Trophy',
                        title: 'Key Achievements & Recognitions',
                        description: found.achievements,
                      },
                    ]
                  : []),
              ];

        setPerson((prev) => {
          const resolvedWebsite = isAnand
            ? (found.website || prev.website)
            : ((found.website && !found.website.includes('anandsahu.com')) ? found.website : (prev.website && !prev.website.includes('anandsahu.com') ? prev.website : ''));

          const resolvedAbout = isAnand
            ? (found.aboutText || prev.aboutText)
            : ((found.aboutText && !found.aboutText.includes('Anand Sahu')) ? found.aboutText : (prev.aboutText && !prev.aboutText.includes('Anand Sahu') ? prev.aboutText : ''));

          return {
            ...prev,
            id: found.id || prev.id,
            name: found.name || prev.name,
            slug: found.slug || targetSlug,
            role: found.role || prev.role,
            badge: found.badge || prev.badge,
            location: found.location || prev.location,
            quote: found.quote ?? prev.quote,
            avatarUrl: found.avatarUrl ?? prev.avatarUrl,
            coverUrl: found.coverUrl || prev.coverUrl,
            aboutText: resolvedAbout,
            website: resolvedWebsite,
            socialLinks: found.socialLinks || prev.socialLinks || {},
            highlights: dynamicHighlights.length > 0 ? dynamicHighlights : prev.highlights,
            educationList: Array.isArray(found.educationList) && found.educationList.length > 0 ? found.educationList : prev.educationList,
            experienceList: Array.isArray(found.experienceList) && found.experienceList.length > 0 ? found.experienceList : prev.experienceList,
            achievementsList: Array.isArray(found.achievementsList) && found.achievementsList.length > 0 ? found.achievementsList : prev.achievementsList,
            newsList: Array.isArray(found.newsList) && found.newsList.length > 0 ? found.newsList : prev.newsList,
            featuredVideo: found.featuredVideo || prev.featuredVideo,
            videoList: Array.isArray(found.videoList) && found.videoList.length > 0 ? found.videoList : prev.videoList,
            gallery: Array.isArray(found.gallery) && found.gallery.length > 0 ? found.gallery : prev.gallery,
            communityStoriesCount: found.communityStoriesCount !== undefined ? Number(found.communityStoriesCount) : (found.communityStoriesList ? found.communityStoriesList.length : prev.communityStoriesCount),
            communityStoriesList: Array.isArray(found.communityStoriesList) && found.communityStoriesList.length > 0 ? found.communityStoriesList : prev.communityStoriesList,
            updates: Array.isArray(found.updates) && found.updates.length > 0 ? found.updates : prev.updates,
            followersCount: found.followersCount !== undefined ? Number(found.followersCount) || prev.followersCount : prev.followersCount,
            followingCount: found.followingCount !== undefined ? Number(found.followingCount) : prev.followingCount,
            viewsCount: found.viewsCount || prev.viewsCount,
            isVerified: (found.status === 'approved') || Boolean(found.isVerified),
          };
        });
        if (found.featuredVideo) {
          setActiveVideo({
            title: found.featuredVideo.title || 'Featured Video',
            subtitle: found.featuredVideo.subtitle || '',
            url: found.featuredVideo.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          });
        }
        if (found.followersCount !== undefined) {
          setFollowersCount(Number(found.followersCount) || initialPerson.followersCount);
        }
      } else {
        setPerson(initialPerson);
        setFollowersCount(initialPerson.followersCount);
      }
    } catch { }
  }, [targetSlug, initialPerson]);

  // Sync follow state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bharatbn_people_follows');
      if (stored) {
        const follows: string[] = JSON.parse(stored);
        if (follows.includes(person.slug)) {
          setIsFollowing(true);
        }
      }
    } catch { }
  }, [person.slug]);

  // Handle Follow / Unfollow
  const handleToggleFollow = () => {
    try {
      const stored = localStorage.getItem('bharatbn_people_follows');
      let follows: string[] = stored ? JSON.parse(stored) : [];

      if (isFollowing) {
        follows = follows.filter((s) => s !== person.slug);
        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
        setFollowToast(`You unfollowed ${person.name}`);
      } else {
        follows.push(person.slug);
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
        setFollowToast(`Following ${person.name}! You will receive in-app updates.`);
      }

      localStorage.setItem('bharatbn_people_follows', JSON.stringify(follows));
      window.dispatchEvent(new Event('bharatbn_follow_changed'));
      setTimeout(() => setFollowToast(''), 3500);
    } catch { }
  };

  // Handle Likes
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

  // Filter updates
  const filteredUpdates =
    feedFilter === 'All' ? person.updates : person.updates.filter((u) => u.type === feedFilter);

  // Format follower count
  const formattedFollowers =
    followersCount >= 1000 ? `${(followersCount / 1000).toFixed(1)}K` : `${followersCount}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-800">
      {/* Follow Toast Notification */}
      {followToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#07213A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{followToast}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4">
        {/* ========================================================================= */}
        {/* 1. HERO BANNER CARD (Exact Image Reference)                               */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden relative">
          {/* Panoramic Cover Art */}
          <div className="relative h-44 sm:h-56 md:h-64 w-full bg-slate-900 overflow-hidden">
            <img
              src={person.coverUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=80'}
              alt={`${person.name} Cover`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=80';
              }}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/20 pointer-events-none" />

            {/* National Quote Overlay on Cover (as in mockup) */}
            <div className="absolute top-4 sm:top-6 right-6 sm:right-8 max-w-sm text-right hidden sm:block pointer-events-none">
              <span className="text-xl sm:text-2xl text-amber-400 font-serif leading-none">&ldquo;</span>
              <p className="text-white font-bold text-xs sm:text-sm tracking-wide drop-shadow-md italic">
                {person.quote}
              </p>
            </div>
          </div>

          {/* Profile Identity & Action Bar */}
          <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            {/* Cutout Portrait Avatar & Name Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              {/* Avatar Cutout with thick white border */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white border-4 border-white shadow-2xl overflow-hidden flex-shrink-0 z-10 flex items-center justify-center">
                {person.avatarUrl ? (
                  <img
                    src={person.avatarUrl}
                    alt={person.name}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fb = parent.querySelector('.profile-avatar-fallback');
                        if (fb) (fb as HTMLElement).style.display = 'flex';
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : null}
                <div
                  className={`w-full h-full bg-gradient-to-tr from-[#07213A] to-[#F95700] text-white font-black text-4xl sm:text-5xl flex items-center justify-center profile-avatar-fallback ${
                    person.avatarUrl ? 'hidden' : 'flex'
                  }`}
                >
                  {(person.name || 'P').slice(0, 1).toUpperCase()}
                </div>
              </div>

              {/* Name, Verified Badge, Role & Location */}
              <div className="space-y-1.5 pt-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-bold text-[#F95700] bg-orange-50 border border-orange-200 uppercase tracking-wide">
                    {person.badge}
                  </span>
                  {!person.isVerified && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200">
                      Pending Verification
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {person.name}
                  </h1>
                  {/* Verified Blue Checkmark */}
                  {person.isVerified && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs" title="Official Verified Profile">
                      <Check className="w-3 h-3 stroke-[3.5]" />
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  {person.role}
                </p>

                <p className="text-xs text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{person.location}</span>
                </p>
              </div>
            </div>

            {/* Action Buttons & Social Icons Row */}
            <div className="flex flex-col items-center sm:items-end gap-3 flex-shrink-0">
              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
                {/* Follow Button */}
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-xs cursor-pointer ${isFollowing
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-[#F95700] hover:bg-[#d94a00] text-white shadow-[#F95700]/25'
                    }`}
                >
                  {isFollowing ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Follow</span>
                    </>
                  )}
                </button>

                {/* Message Button */}
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <span>Message</span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleCopyShare}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Share Profile Link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-500" />}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>

                {/* Visit Website Button */}
                {person.website && (
                  <a
                    href={person.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}
              </div>

              {/* Social Media Circular Icons Row */}
              <div className="flex items-center gap-2 pt-1">
                {person.socialLinks.facebook && (
                  <a
                    href={person.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 transition shadow-2xs"
                    title="Facebook"
                  >
                    <FacebookFIcon className="w-3.5 h-3.5 fill-white" />
                  </a>
                )}
                {person.socialLinks.instagram && (
                  <a
                    href={person.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center hover:opacity-90 hover:scale-105 transition shadow-2xs"
                    title="Instagram"
                  >
                    <InstagramIcon className="w-4 h-4 text-white" />
                  </a>
                )}
                {person.socialLinks.youtube && (
                  <a
                    href={person.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 transition shadow-2xs"
                    title="YouTube"
                  >
                    <YouTubePlayIcon className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </a>
                )}
                {person.socialLinks.twitter && (
                  <a
                    href={person.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 hover:scale-105 transition shadow-2xs"
                    title="Twitter / X"
                  >
                    <TwitterXIcon className="w-3.5 h-3.5 fill-white" />
                  </a>
                )}
                {person.socialLinks.linkedin && (
                  <a
                    href={person.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-90 hover:scale-105 transition shadow-2xs"
                    title="LinkedIn"
                  >
                    <LinkedInIcon className="w-3.5 h-3.5 fill-white" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* 2. METRIC STAT BAR (Exact Image Reference)                              */}
          {/* ======================================================================= */}
          <div className="border-t border-slate-100 px-6 sm:px-8 py-3.5 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              {/* Followers */}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#F95700]" />
                <div>
                  <span className="font-extrabold text-sm sm:text-base text-slate-900">
                    {formattedFollowers}
                  </span>
                  <span className="text-xs text-slate-500 ml-1.5 font-medium">Followers</span>
                </div>
              </div>

              {/* Following */}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="font-extrabold text-sm sm:text-base text-slate-900">
                    {person.followingCount}
                  </span>
                  <span className="text-xs text-slate-500 ml-1.5 font-medium">Following</span>
                </div>
              </div>

              {/* Posts & Updates */}
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-extrabold text-sm sm:text-base text-slate-900">
                    {person.postsCount}
                  </span>
                  <span className="text-xs text-slate-500 ml-1.5 font-medium">Posts &amp; Updates</span>
                </div>
              </div>

              {/* Profile Views */}
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-600" />
                <div>
                  <span className="font-extrabold text-sm sm:text-base text-slate-900">
                    {person.viewsCount}
                  </span>
                  <span className="text-xs text-slate-500 ml-1.5 font-medium">Profile Views</span>
                </div>
              </div>
            </div>

            {/* Notification Follow Bell Reminder */}
            <button
              type="button"
              onClick={handleToggleFollow}
              className="px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span>{isFollowing ? 'Updates Enabled' : 'Follow to get latest updates'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. THREE-COLUMN BODY LAYOUT                                               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ======================================================================= */}
          {/* COLUMN 1 (3 Cols): Left Navigation Modules & Claim Profile             */}
          {/* ======================================================================= */}
          <div className="lg:col-span-3 space-y-4">
            {/* 11 Modules Navigation Menu */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-2 space-y-1">
              {[
                { id: 'overview', label: 'Profile Overview', icon: Sparkles },
                { id: 'about', label: 'About', icon: FileText },
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'experience', label: 'Experience', icon: Briefcase },
                { id: 'achievements', label: 'Achievements', icon: Trophy },
                { id: 'news', label: 'News & Media', icon: Newspaper },
                { id: 'photos', label: 'Photo Gallery', icon: Camera },
                { id: 'videos', label: 'Video Gallery', icon: Video },
                { id: 'posts', label: 'Posts & Updates', icon: Send },
                { id: 'stories', label: 'Community Stories', icon: MessageSquare },
                { id: 'followers', label: 'Followers & Following', icon: Users },
              ].map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 text-left cursor-pointer ${active
                      ? 'bg-[#07213A] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#F95700]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Unclaimed Profile / Claim CTA Card (Exact Image Reference) */}
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white rounded-2xl border border-orange-200/80 p-5 space-y-3 text-center shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#F95700] mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-slate-900">
                  Are You {person.name}?
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Claim &amp; Manage Your Official Profile, publish verified statements and interact with followers.
                </p>
              </div>
              <Link
                href={`/claim/${person.slug}`}
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-[#F95700] hover:bg-[#F95700] text-[#F95700] hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs block"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Claim This Profile</span>
              </Link>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* COLUMN 2 (6 Cols): Center Feed & Content                                */}
          {/* ======================================================================= */}
          <div className="lg:col-span-6 space-y-6">
            {/* Active Module Header if not in Overview */}
            {activeTab !== 'overview' && (
              <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Module:</span>
                  <span className="text-sm font-black text-slate-900 capitalize flex items-center gap-1.5">
                    {activeTab === 'about' && 'About & Bio'}
                    {activeTab === 'education' && 'Education & Qualifications'}
                    {activeTab === 'experience' && 'Professional & Public Experience'}
                    {activeTab === 'achievements' && 'Key Achievements & Recognitions'}
                    {activeTab === 'news' && 'News & Media Coverage'}
                    {activeTab === 'photos' && 'Photo Gallery'}
                    {activeTab === 'videos' && 'Video Gallery'}
                    {activeTab === 'posts' && 'Posts & Updates Timeline'}
                    {activeTab === 'stories' && 'Community Stories'}
                    {activeTab === 'followers' && 'Followers & Following Network'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="text-xs font-bold text-[#F95700] hover:text-[#d94a00] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>&larr; View Full Overview</span>
                </button>
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* 1. ABOUT SECTION (Shown in 'overview' or 'about')                   */}
            {/* ------------------------------------------------------------------- */}
            {(activeTab === 'overview' || activeTab === 'about') && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-[#F95700]" />
                    <span>About {person.name}</span>
                  </div>
                  {activeTab === 'overview' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('about')}
                      className="text-xs font-bold text-slate-400 hover:text-[#F95700] transition cursor-pointer"
                    >
                      Details &rarr;
                    </button>
                  )}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {person.aboutText}
                </p>

                {/* 4 Feature Sub-cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {person.highlights.map((hl) => (
                    <div
                      key={hl.key}
                      onClick={() => {
                        if (hl.key === 'education') setActiveTab('education');
                        if (hl.key === 'experience') setActiveTab('experience');
                        if (hl.key === 'achievements') setActiveTab('achievements');
                      }}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition space-y-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {hl.key === 'education' && <GraduationCap className="w-4 h-4 text-blue-600" />}
                        {hl.key === 'experience' && <Briefcase className="w-4 h-4 text-amber-600" />}
                        {hl.key === 'achievements' && <Trophy className="w-4 h-4 text-purple-600" />}
                        {hl.key === 'initiatives' && <HeartHandshake className="w-4 h-4 text-rose-600" />}
                        <h4 className="text-xs font-extrabold text-slate-900">{hl.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight line-clamp-2">
                        {hl.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* 2. EDUCATION SECTION (Shown in 'education' or overview preview)     */}
            {/* ------------------------------------------------------------------- */}
            {(activeTab === 'education' || (activeTab === 'overview' && (person.educationList?.length ?? 0) > 0)) && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <span>Education &amp; Academic Qualifications</span>
                  </h3>
                  {activeTab === 'overview' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('education')}
                      className="text-xs font-bold text-slate-400 hover:text-[#F95700] transition cursor-pointer"
                    >
                      View All &rarr;
                    </button>
                  )}
                </div>

                {!person.educationList || person.educationList.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No education credentials listed yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {person.educationList.map((edu, idx) => (
                      <div
                        key={edu.id || idx}
                        className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition space-y-1.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900">{edu.degree}</h4>
                          {edu.year && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                              {edu.year}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <span>🏛️</span>
                          <span>{edu.institution}</span>
                        </p>
                        {edu.description && (
                          <p className="text-xs text-slate-500 leading-relaxed pt-0.5">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* 3. EXPERIENCE SECTION (Shown in 'experience' or overview preview)    */}
            {/* ------------------------------------------------------------------- */}
            {(activeTab === 'experience' || (activeTab === 'overview' && (person.experienceList?.length ?? 0) > 0)) && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-amber-600" />
                    <span>Professional &amp; Public Experience</span>
                  </h3>
                  {activeTab === 'overview' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('experience')}
                      className="text-xs font-bold text-slate-400 hover:text-[#F95700] transition cursor-pointer"
                    >
                      View All &rarr;
                    </button>
                  )}
                </div>

                {!person.experienceList || person.experienceList.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No experience records listed yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {person.experienceList.map((exp, idx) => (
                      <div
                        key={exp.id || idx}
                        className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition space-y-1.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900">{exp.role}</h4>
                          {exp.period && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                              {exp.period}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <span>🏢</span>
                          <span>{exp.organization}</span>
                        </p>
                        {exp.description && (
                          <p className="text-xs text-slate-500 leading-relaxed pt-0.5">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* 4. ACHIEVEMENTS SECTION (Shown in 'achievements' or overview)       */}
            {/* ------------------------------------------------------------------- */}
            {(activeTab === 'achievements' || (activeTab === 'overview' && (person.achievementsList?.length ?? 0) > 0)) && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-purple-600" />
                    <span>Key Achievements &amp; Recognitions</span>
                  </h3>
                  {activeTab === 'overview' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('achievements')}
                      className="text-xs font-bold text-slate-400 hover:text-[#F95700] transition cursor-pointer"
                    >
                      View All &rarr;
                    </button>
                  )}
                </div>

                {!person.achievementsList || person.achievementsList.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No achievements listed yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {person.achievementsList.map((ach, idx) => (
                      <div
                        key={ach.id || idx}
                        className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition space-y-1.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                            <span>🏆</span>
                            <span>{ach.title}</span>
                          </h4>
                          {ach.year && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                              {ach.year}
                            </span>
                          )}
                        </div>
                        {ach.organization && (
                          <p className="text-xs font-semibold text-slate-700">
                            Conferred by: <strong>{ach.organization}</strong>
                          </p>
                        )}
                        {ach.description && (
                          <p className="text-xs text-slate-500 leading-relaxed pt-0.5">
                            {ach.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* 5. NEWS & MEDIA SECTION (Shown in 'news' or overview)               */}
            {/* ------------------------------------------------------------------- */}
            {(activeTab === 'news' || (activeTab === 'overview' && (person.newsList?.length ?? 0) > 0)) && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-rose-600" />
                    <span>News &amp; Media Coverage</span>
                  </h3>
                  {activeTab === 'overview' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('news')}
                      className="text-xs font-bold text-slate-400 hover:text-[#F95700] transition cursor-pointer"
                    >
                      View All &rarr;
                    </button>
                  )}
                </div>

                {!person.newsList || person.newsList.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No press articles or media coverage listed yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {person.newsList.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                            {item.source}
                          </span>
                          <span className="text-[11px] text-slate-400">{item.date}</span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-[#F95700] hover:underline inline-flex items-center gap-1 pt-1"
                          >
                            <span>Read Article / Media Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* 6. FEATURED & VIDEO GALLERY (Shown in 'videos' or 'overview')       */}
            {/* ------------------------------------------------------------------- */}
            {(activeTab === 'overview' || activeTab === 'videos') && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#F95700]" />
                    <span>Featured Video &amp; Gallery</span>
                  </h3>
                  {activeTab === 'overview' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('videos')}
                      className="text-xs font-bold text-slate-400 hover:text-[#F95700] transition cursor-pointer"
                    >
                      Gallery &rarr;
                    </button>
                  )}
                </div>

                {/* Main Video Player Card */}
                <div
                  onClick={() => {
                    setActiveVideo({
                      title: person.featuredVideo.title,
                      subtitle: person.featuredVideo.subtitle,
                      url: person.featuredVideo.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    });
                    setIsVideoModalOpen(true);
                  }}
                  className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group shadow-xs"
                >
                  <img
                    src={person.featuredVideo.thumbnailUrl}
                    alt={person.featuredVideo.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-between p-4">
                    <div className="self-end px-2.5 py-1 rounded-md bg-black/60 text-white text-[10px] font-bold">
                      HD Video
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#F95700] group-hover:bg-[#d94a00] text-white flex items-center justify-center shadow-lg transition">
                        <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-xs sm:text-sm drop-shadow-md">
                          {person.featuredVideo.title}
                        </h4>
                        <p className="text-slate-300 text-[11px] drop-shadow-sm">
                          {person.featuredVideo.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Video Playlist Cards if available */}
                {person.videoList && person.videoList.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {person.videoList.map((vid, idx) => (
                      <div
                        key={vid.id || idx}
                        onClick={() => {
                          setActiveVideo({
                            title: vid.title,
                            subtitle: vid.subtitle || '',
                            url: vid.videoUrl,
                          });
                          setIsVideoModalOpen(true);
                        }}
                        className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="w-20 h-14 rounded-lg bg-slate-900 overflow-hidden relative flex-shrink-0">
                          <img
                            src={vid.thumbnailUrl}
                            alt={vid.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play className="w-4 h-4 fill-white text-white group-hover:scale-110 transition" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold text-slate-900 truncate">{vid.title}</h5>
                          {vid.duration && <span className="text-[10px] text-slate-400">{vid.duration}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* 7. POSTS & UPDATES TIMELINE (Shown in 'posts' or 'overview')        */}
            {/* ------------------------------------------------------------------- */}
            {(activeTab === 'overview' || activeTab === 'posts') && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Send className="w-5 h-5 text-[#F95700]" />
                    <span>Posts &amp; Updates</span>
                  </h3>

                  {/* Filter Pills: All, Posts, News, Events */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    {(['All', 'Posts', 'News', 'Events'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setFeedFilter(tab)}
                        className={`px-3 py-1 rounded-lg transition cursor-pointer ${feedFilter === tab
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                          }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Updates List */}
                {filteredUpdates.length === 0 ? (
                  <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No updates published in this category yet.
                  </div>
                ) : (
                  <div className="space-y-4 divide-y divide-slate-100">
                    {filteredUpdates.map((upd) => (
                      <div key={upd.id} className="pt-4 first:pt-0 space-y-3">
                        <div className="flex gap-4 items-start">
                          {/* Update Thumbnail */}
                          {upd.imageUrl && (
                            <div className="w-24 h-18 sm:w-28 sm:h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                              <img
                                src={upd.imageUrl}
                                alt={upd.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Content */}
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-orange-50 text-[#F95700] border border-orange-200">
                                {upd.type}
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium">
                                {upd.date}
                              </span>
                            </div>

                            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                              {upd.title}
                            </h4>

                            <p className="text-xs text-slate-600 line-clamp-2">
                              {upd.description}
                            </p>

                            {/* Engagement Bar */}
                            <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-500 font-semibold">
                              <button
                                type="button"
                                className="flex items-center gap-1 hover:text-blue-600 transition cursor-pointer"
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>{upd.likes}</span>
                              </button>
                              <button
                                type="button"
                                className="flex items-center gap-1 hover:text-slate-900 transition cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{upd.comments}</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleCopyShare}
                                className="flex items-center gap-1 hover:text-[#F95700] transition cursor-pointer"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Share</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* 8. PHOTO GALLERY SECTION (Shown in 'photos' or overview preview)    */}
            {/* ------------------------------------------------------------------- */}
            {(activeTab === 'overview' || activeTab === 'photos') && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#F95700]" />
                    <span>Photo Gallery ({person.gallery.length})</span>
                  </h3>
                  {activeTab === 'overview' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('photos')}
                      className="text-xs font-bold text-slate-400 hover:text-[#F95700] transition cursor-pointer"
                    >
                      View All ({person.gallery.length}) &rarr;
                    </button>
                  )}
                </div>

                {person.gallery.length === 0 ? (
                  <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No photos added to gallery yet.
                  </div>
                ) : (
                  <div className={`grid gap-3 ${activeTab === 'photos' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
                    {person.gallery.map((photo, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedPhoto(photo)}
                        className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-2xs cursor-pointer"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover transition duration-200 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-slate-950/75 p-1.5 text-[10px] text-white font-medium truncate">
                          {photo.caption}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* 9. COMMUNITY STORIES SECTION (Shown in 'stories' or overview)       */}
            {/* ------------------------------------------------------------------- */}
            {(activeTab === 'stories' || (activeTab === 'overview' && (person.communityStoriesList?.length ?? 0) > 0)) && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <h3 className="text-base font-black text-slate-900">
                      Community Stories &amp; Collabs ({person.communityStoriesList?.length || person.communityStoriesCount})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsStoryModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ Share Your Story</span>
                  </button>
                </div>

                {!person.communityStoriesList || person.communityStoriesList.length === 0 ? (
                  <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No community stories yet. Be the first to share your experience with {person.name}!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {person.communityStoriesList.map((st) => (
                      <div
                        key={st.id}
                        className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                              {st.author.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <h5 className="text-xs font-extrabold text-slate-900">{st.author}</h5>
                              {st.role && <span className="text-[10px] text-slate-400">{st.role}</span>}
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">{st.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic">
                          &ldquo;{st.content}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* 10. FOLLOWERS & AUDIENCE SECTION (Shown in 'followers')             */}
            {/* ------------------------------------------------------------------- */}
            {activeTab === 'followers' && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#F95700]" />
                    <span>Followers &amp; Following Network</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Audience, reach metrics, and verified members following {person.name}.
                  </p>
                </div>

                {/* 4 Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-center space-y-1">
                    <div className="text-xl font-black text-slate-900">{formattedFollowers}</div>
                    <div className="text-[10px] font-bold text-orange-800 uppercase">Followers</div>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center space-y-1">
                    <div className="text-xl font-black text-slate-900">{person.followingCount}</div>
                    <div className="text-[10px] font-bold text-blue-800 uppercase">Following</div>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center space-y-1">
                    <div className="text-xl font-black text-slate-900">{person.viewsCount}</div>
                    <div className="text-[10px] font-bold text-purple-800 uppercase">Profile Views</div>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                    <div className="text-xl font-black text-slate-900">{person.postsCount}</div>
                    <div className="text-[10px] font-bold text-emerald-800 uppercase">Published Posts</div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#F95700]" />
                    <h4 className="font-bold text-slate-900 text-sm">
                      {isFollowing ? 'You are following this profile' : `Follow ${person.name} on BharatBN™`}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Receive verified updates, speeches, announcements, and direct community notifications.
                  </p>
                  <button
                    type="button"
                    onClick={handleToggleFollow}
                    className="px-5 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    {isFollowing ? '✓ Already Following' : '+ Follow for Updates'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================================= */}
          {/* COLUMN 3 (3 Cols): Right Sidebar                                       */}
          {/* ======================================================================= */}
          <div className="lg:col-span-3 space-y-4">
            {/* Connect & Follow Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#F95700]" />
                <span>Connect &amp; Follow</span>
              </h3>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                  <Bell className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Follow {person.name}</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Get notified about their latest updates, events, videos and stories directly in your BharatBN feed.
                </p>
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {isFollowing ? '✓ Already Following' : '+ Follow for Updates'}
                </button>
              </div>
            </div>

            {/* Contact & Social Links */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Contact &amp; Social Links
              </h3>

              <div className="space-y-2 text-xs">
                {/* Website */}
                {person.website && (
                  <a
                    href={person.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Website</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
                          {person.website.replace(/^https?:\/\/(www\.)?/, '')}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}

                {/* Facebook */}
                {person.socialLinks.facebook && (
                  <a
                    href={person.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#1877F2] flex items-center justify-center text-white">
                        <FacebookFIcon className="w-3.5 h-3.5 fill-white" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Facebook</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
                          {person.socialLinks.facebook.replace(/^https?:\/\/(www\.)?facebook\.com\/?/, '/')}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}

                {/* Instagram */}
                {person.socialLinks.instagram && (
                  <a
                    href={person.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-2xs">
                        <InstagramIcon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Instagram</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
                          {person.socialLinks.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\/?/, '/')}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}

                {/* YouTube */}
                {person.socialLinks.youtube && (
                  <a
                    href={person.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#FF0000] flex items-center justify-center text-white shadow-2xs">
                        <YouTubeIcon className="w-3.5 h-3.5 fill-white" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">YouTube</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
                          {person.socialLinks.youtube.replace(/^https?:\/\/(www\.)?youtube\.com\/?/, '/')}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}

                {/* Twitter / X */}
                {person.socialLinks.twitter && (
                  <a
                    href={person.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white shadow-2xs">
                        <TwitterXIcon className="w-3.5 h-3.5 fill-white" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Twitter / X</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
                          {person.socialLinks.twitter.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\/?/, '@')}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}

                {/* LinkedIn */}
                {person.socialLinks.linkedin && (
                  <a
                    href={person.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#0A66C2] flex items-center justify-center text-white shadow-2xs">
                        <LinkedInIcon className="w-3.5 h-3.5 fill-white" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">LinkedIn</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
                          {person.socialLinks.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/(in|company)?\/?/, '/')}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}

                {/* Send a Message */}
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(true)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-[#F95700] hover:bg-orange-50/50 transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#F95700] flex items-center justify-center font-bold">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Send a Message</div>
                      <div className="text-[10px] text-slate-500">Directly connect via BharatBN</div>
                    </div>
                  </div>
                  <span className="text-slate-400">&rsaquo;</span>
                </button>
              </div>
            </div>

            {/* Community Stories Card (Exact Image Reference) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>Community Stories</span>
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {person.communityStoriesCount}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Share your views, experiences or stories related to {person.name}.
              </p>

              <button
                type="button"
                onClick={() => setIsStoryModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#F95700] hover:bg-slate-50 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>✏️</span>
                <span>Share Your Story</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM FLOATING ACTION BAR (Exact Image Reference)                     */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#07213A] text-white border-t border-slate-700/80 shadow-2xl py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* People's Response + Like & Dislike */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
              People&apos;s Response:
            </span>

            {/* Like */}
            <button
              type="button"
              onClick={handleToggleLike}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs ${hasLiked
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Like {(likesCount / 1000).toFixed(1)}K</span>
            </button>

            {/* Dislike */}
            <button
              type="button"
              onClick={handleToggleDislike}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs ${hasDisliked
                ? 'bg-red-600 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>Dislike {dislikesCount}</span>
            </button>
          </div>

          {/* Share, Save & Follower Proof */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyShare}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${isSaved ? 'bg-amber-500 text-slate-900' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 border-l border-slate-700 pl-3">
              <Users className="w-3.5 h-3.5 text-[#F95700]" />
              <span>
                Followed by <strong>{formattedFollowers}+</strong> members on BharatBN
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. MODALS (Message, Story & Video)                                        */}
      {/* ========================================================================= */}

      {/* Direct Message Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Message {person.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsMessageModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {messageSent ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-slate-900">Message Delivered!</h4>
                <p className="text-xs text-slate-500">
                  Your communication has been forwarded to {person.name}&apos;s verified communication desk.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMessageSent(false);
                    setIsMessageModalOpen(false);
                  }}
                  className="mt-4 px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!messageText.trim()) return;
                  setMessageSent(true);
                  setMessageText('');
                }}
                className="space-y-3"
              >
                <p className="text-xs text-slate-500">
                  Send a private message or inquiry. Profile representatives review incoming messages on BharatBN.
                </p>
                <textarea
                  rows={4}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsMessageModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Community Story Submission Modal */}
      {isStoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Share a Community Story
              </h3>
              <button
                type="button"
                onClick={() => setIsStoryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {storySubmitted ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-slate-900">Story Submitted for Review</h4>
                <p className="text-xs text-slate-500">
                  Per BharatBN Editorial Policy, community contributions undergo moderation before appearing in public feeds.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStorySubmitted(false);
                    setIsStoryModalOpen(false);
                  }}
                  className="mt-4 px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!storyAuthor.trim() || !storyContent.trim()) return;
                  const newStory = {
                    id: `story-${Date.now()}`,
                    author: storyAuthor.trim(),
                    role: 'Verified Community Contributor',
                    content: storyContent.trim(),
                    date: 'Just now',
                    verified: true,
                  };
                  const updatedStories = [newStory, ...(person.communityStoriesList || [])];
                  setPerson((prev) => ({
                    ...prev,
                    communityStoriesList: updatedStories,
                    communityStoriesCount: updatedStories.length,
                  }));

                  try {
                    const stored = localStorage.getItem('bharatbn_people_store');
                    let people = stored ? JSON.parse(stored) : [];
                    const idx = people.findIndex((p: any) => p.slug === targetSlug || p.id === person.id);
                    if (idx !== -1) {
                      people[idx].communityStoriesList = updatedStories;
                      people[idx].communityStoriesCount = updatedStories.length;
                      localStorage.setItem('bharatbn_people_store', JSON.stringify(people));
                      window.dispatchEvent(new Event('bharatbn_people_updated'));
                    }
                  } catch (err) {
                    console.error(err);
                  }

                  setStorySubmitted(true);
                  setStoryAuthor('');
                  setStoryContent('');
                }}
                className="space-y-3"
              >
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={storyAuthor}
                    onChange={(e) => setStoryAuthor(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Your Story / Experience</label>
                  <textarea
                    rows={4}
                    required
                    value={storyContent}
                    onChange={(e) => setStoryContent(e.target.value)}
                    placeholder={`Describe your interaction, public meeting or event experience with ${person.name}...`}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsStoryModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold"
                  >
                    Submit Story
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Video Play Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-3">
            <div className="flex items-center justify-between p-4 pb-0 text-white">
              <h3 className="font-bold text-sm sm:text-base truncate">
                {activeVideo.title || person.featuredVideo.title}
              </h3>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src={
                  activeVideo.url.includes('embed/')
                    ? activeVideo.url
                    : `https://www.youtube-nocookie.com/embed/${
                        activeVideo.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)?.[1] || 'dQw4w9WgXcQ'
                      }?autoplay=1`
                }
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Photo Preview Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full max-h-[90vh] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col cursor-default"
          >
            <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
              <span className="text-xs font-bold text-slate-300 truncate">
                {selectedPhoto.caption || `${person.name} Photo Gallery`}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden flex items-center justify-center bg-black p-2">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
