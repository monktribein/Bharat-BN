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
  Lock,
  LogIn,
} from 'lucide-react';
import {
  InstagramIcon,
  YouTubePlayIcon,
  YouTubeIcon,
  FacebookFIcon,
  TwitterXIcon,
  LinkedInIcon,
} from '@/components/SocialIcons';
import {
  getRealMetrics,
  toggleRealFollow,
  recordRealView,
  syncRealMetricsFromServer,
  getStoredFollowingList,
  getCurrentUserHandle,
  parseFollowerCount,
  formatFollowerCount,
  getBaseFollowers,
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

  // Navigation active tab
  const [activeTab, setActiveTab] = useState('overview');
  const [feedFilter, setFeedFilter] = useState<'All' | 'Posts' | 'News' | 'Events'>('All');

  // Follow & Real Metrics state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [viewsCount, setViewsCount] = useState<number | string>(0);
  const [followToast, setFollowToast] = useState('');
  const [ownerSession, setOwnerSession] = useState<any>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Instagram-style Followers & Following Modal
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalTab, setFollowModalTab] = useState<'followers' | 'following'>('followers');

  const handleOpenFollowModal = (tab: 'followers' | 'following') => {
    setFollowModalTab(tab);
    setIsFollowModalOpen(true);
  };

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

  // Dynamically resolve custom registered person from localStorage & sync cache
  useEffect(() => {
    const cleanTarget = (targetSlug || propSlug || initialPerson.slug || '').toLowerCase().trim();

    const matchCandidate = (p: any) => {
      if (!p) return false;
      const s = (p.slug || '').toLowerCase().trim();
      const h = (p.handle || '').toLowerCase().replace(/^@/, '').trim();
      const n = (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').trim();
      const rawName = (p.name || '').toLowerCase().trim();
      const rawId = (p.id || p.personId || '').toLowerCase().trim();
      const em = (p.email || '').toLowerCase().trim();
      return (
        s === cleanTarget ||
        h === cleanTarget ||
        n === cleanTarget ||
        (cleanTarget.length > 2 && (rawName.includes(cleanTarget) || rawId.includes(cleanTarget) || em.includes(cleanTarget)))
      );
    };

    const resolveAndSyncProfile = () => {
      try {
        // 1. Check local people store
        let storeRecord: any = null;
        try {
          const stored = localStorage.getItem('bharatbn_people_store');
          if (stored) {
            const people = JSON.parse(stored);
            if (Array.isArray(people)) {
              storeRecord = people.find(matchCandidate);
            }
          }
        } catch {}

        // 2. Check direct navigation transfer bridge from card click
        let viewedPerson: any = null;
        try {
          const viewedStr = sessionStorage.getItem('bharatbn_viewed_person');
          if (viewedStr) {
            const parsed = JSON.parse(viewedStr);
            if (parsed && (matchCandidate(parsed) || (parsed.slug && parsed.slug.toLowerCase() === cleanTarget))) {
              viewedPerson = parsed;
            }
          }
        } catch {}

        // 3. Check active owner session (if matching target)
        let sessionRecord: any = null;
        try {
          const sessionStr = localStorage.getItem('bharatbn_owner_session');
          if (sessionStr) {
            const sess = JSON.parse(sessionStr);
            if (sess && sess.accountType === 'person') {
              if (matchCandidate(sess)) {
                sessionRecord = sess;
              }
            }
          }
        } catch {}

        // Source C: Combine sources with priority: sessionRecord (active edits) > viewedPerson > storeRecord > initialPerson
        const customData = {
          ...(storeRecord || {}),
          ...(viewedPerson || {}),
          ...(sessionRecord || {}),
        };

        const isKashish =
          cleanTarget === 'kashish' ||
          cleanTarget === 'kashish-saxena' ||
          (customData.name || initialPerson.name)?.toLowerCase().includes('kashish');

        const hasCustom = Boolean(sessionRecord || storeRecord || viewedPerson || isKashish);
        if (!hasCustom) {
          return;
        }

        // Auto-heal stale legacy browser localStorage (only if cover has Obama/stale photo or broken avatar)
        if (isKashish) {
          try {
            const rawStored = localStorage.getItem('bharatbn_people_store');
            if (rawStored) {
              const list = JSON.parse(rawStored);
              if (Array.isArray(list)) {
                let changed = false;
                const cleaned = list.map((item: any) => {
                  const s = (item.slug || item.handle?.replace(/^@/, '') || '').toLowerCase();
                  if (s === 'kashish' || item.name?.toLowerCase().includes('kashish')) {
                    const needsCoverHeal = !item.coverUrl || item.coverUrl.includes('photo-1541872703-74c5e44368f9') || item.coverUrl.includes('photo-1579546929518') || item.coverUrl.includes('photo-1598488035139');
                    const needsAvatarHeal = !item.avatarUrl || item.avatarUrl.includes('534528741775');
                    if (needsCoverHeal || needsAvatarHeal || item.followersCount !== '0') {
                      changed = true;
                      return {
                        ...item,
                        coverUrl: needsCoverHeal ? '/people/kashish-cover.jpg' : item.coverUrl,
                        avatarUrl: needsAvatarHeal ? '/people/kashish-avatar.png' : item.avatarUrl,
                        role: item.role || 'Public Figure & Speaker',
                        badge: item.badge || 'Public Figure',
                        location: item.location || 'noida',
                        quote: item.quote || 'hi',
                        followersCount: '0',
                      };
                    }
                  }
                  return item;
                });
                if (changed) {
                  localStorage.setItem('bharatbn_people_store', JSON.stringify(cleaned));
                }
              }
            }
          } catch {}

          try {
            const rawSess = localStorage.getItem('bharatbn_owner_session');
            if (rawSess) {
              const sess = JSON.parse(rawSess);
              if (sess && (sess.slug === 'kashish' || sess.name?.toLowerCase().includes('kashish'))) {
                let sessChanged = false;
                if (!sess.coverUrl || sess.coverUrl.includes('photo-1541872703-74c5e44368f9') || sess.coverUrl.includes('photo-1579546929518') || sess.coverUrl.includes('photo-1598488035139')) {
                  sess.coverUrl = '/people/kashish-cover.jpg';
                  sessChanged = true;
                }
                if (!sess.avatarUrl || sess.avatarUrl.includes('534528741775')) {
                  sess.avatarUrl = '/people/kashish-avatar.png';
                  sessChanged = true;
                }
                if (sess.followersCount !== '0') {
                  sess.followersCount = '0';
                  sessChanged = true;
                }
                if (sessChanged) {
                  localStorage.setItem('bharatbn_owner_session', JSON.stringify(sess));
                }
              }
            }
          } catch {}
        }

        if (cleanTarget === 'anand-sahu' || cleanTarget === 'anand') {
          try {
            const rawStore = localStorage.getItem('bharatbn_people_store');
            if (rawStore) {
              const arr = JSON.parse(rawStore);
              if (Array.isArray(arr)) {
                let changed = false;
                const cleaned = arr.map((item: any) => {
                  if (item.slug === 'anand-sahu' || item.name?.toLowerCase().includes('anand sahu')) {
                    const needsCoverHeal = !item.coverUrl || item.coverUrl.includes('photo-1541872703-74c5e44368f9');
                    const needsAvatarHeal = !item.avatarUrl || item.avatarUrl.includes('534528741775');
                    if (needsCoverHeal || needsAvatarHeal) {
                      changed = true;
                      return {
                        ...item,
                        avatarUrl: needsAvatarHeal ? '/people/anand-sahu-avatar.jpg' : item.avatarUrl,
                        coverUrl: needsCoverHeal ? '/people/anand-sahu-cover.jpg' : item.coverUrl,
                      };
                    }
                  }
                  return item;
                });
                if (changed) {
                  localStorage.setItem('bharatbn_people_store', JSON.stringify(cleaned));
                }
              }
            }
          } catch {}

          try {
            const rawSess = localStorage.getItem('bharatbn_owner_session');
            if (rawSess) {
              const sess = JSON.parse(rawSess);
              if (sess && (sess.slug === 'anand-sahu' || sess.name?.toLowerCase().includes('anand sahu'))) {
                let sessChanged = false;
                if (!sess.avatarUrl || sess.avatarUrl.includes('534528741775')) {
                  sess.avatarUrl = '/people/anand-sahu-avatar.jpg';
                  sessChanged = true;
                }
                if (!sess.coverUrl || sess.coverUrl.includes('photo-1541872703-74c5e44368f9')) {
                  sess.coverUrl = '/people/anand-sahu-cover.jpg';
                  sessChanged = true;
                }
                if (sessChanged) {
                  localStorage.setItem('bharatbn_owner_session', JSON.stringify(sess));
                }
              }
            }
          } catch {}
        }

        const realTargetFollowers = getRealMetrics(cleanTarget).followersCount;
        try {
          const rawStore = localStorage.getItem('bharatbn_people_store');
          if (rawStore) {
            const arr = JSON.parse(rawStore);
            if (Array.isArray(arr)) {
              let changed = false;
              const cleaned = arr.map((item: any) => {
                const itemSlug = (item.slug || item.handle?.replace(/^@/, '') || '').toLowerCase().trim();
                if (itemSlug === cleanTarget || (cleanTarget === 'anand-sahu' && item.name?.toLowerCase().includes('anand sahu')) || (cleanTarget === 'kashish' && item.name?.toLowerCase().includes('kashish'))) {
                  if (item.followersCount !== String(realTargetFollowers)) {
                    changed = true;
                    return { ...item, followersCount: String(realTargetFollowers) };
                  }
                }
                return item;
              });
              if (changed) {
                localStorage.setItem('bharatbn_people_store', JSON.stringify(cleaned));
              }
            }
          }
        } catch {}

        try {
          const rawSess = localStorage.getItem('bharatbn_owner_session');
          if (rawSess) {
            const sess = JSON.parse(rawSess);
            const sessSlug = (sess.slug || sess.handle?.replace(/^@/, '') || '').toLowerCase().trim();
            if (sess && (sessSlug === cleanTarget || (cleanTarget === 'anand-sahu' && sess.name?.toLowerCase().includes('anand sahu')) || (cleanTarget === 'kashish' && sess.name?.toLowerCase().includes('kashish')))) {
              if (sess.followersCount !== String(realTargetFollowers)) {
                sess.followersCount = String(realTargetFollowers);
                localStorage.setItem('bharatbn_owner_session', JSON.stringify(sess));
              }
            }
          }
        } catch {}

        setPerson((prev) => {
          const isKashish =
            cleanTarget === 'kashish' ||
            cleanTarget === 'kashish-saxena' ||
            (customData.name || prev.name)?.toLowerCase().includes('kashish');
          const isAnand =
            cleanTarget === 'anand-sahu' ||
            cleanTarget === 'anand' ||
            (customData.name || prev.name)?.toLowerCase().includes('anand sahu');

          // 1. Avatar: prioritize valid non-empty string with dedicated photo overrides
          let rawAvatar =
            sessionRecord?.avatarUrl && typeof sessionRecord.avatarUrl === 'string' && sessionRecord.avatarUrl.trim() !== ''
              ? sessionRecord.avatarUrl
              : viewedPerson?.avatarUrl && typeof viewedPerson.avatarUrl === 'string' && viewedPerson.avatarUrl.trim() !== ''
              ? viewedPerson.avatarUrl
              : storeRecord?.avatarUrl && typeof storeRecord.avatarUrl === 'string' && storeRecord.avatarUrl.trim() !== ''
              ? storeRecord.avatarUrl
              : customData.avatarUrl && typeof customData.avatarUrl === 'string' && customData.avatarUrl.trim() !== ''
              ? customData.avatarUrl
              : prev.avatarUrl;

          let validAvatar = '';
          if (isAnand) {
            validAvatar = (rawAvatar && (rawAvatar.startsWith('data:') || rawAvatar.startsWith('blob:')))
              ? rawAvatar
              : '/people/anand-sahu-avatar.jpg';
          } else if (rawAvatar && (rawAvatar.startsWith('data:') || rawAvatar.startsWith('blob:') || (!rawAvatar.includes('534528741775') && !rawAvatar.includes('photo-1541872703')))) {
            validAvatar = rawAvatar;
          } else if (isKashish) {
            validAvatar = '/people/kashish-avatar.png';
          } else {
            validAvatar = rawAvatar || prev.avatarUrl;
          }

          // 2. Cover: prioritize dedicated verified covers
          let rawCover =
            sessionRecord?.coverUrl && typeof sessionRecord.coverUrl === 'string' && sessionRecord.coverUrl.trim() !== ''
              ? sessionRecord.coverUrl
              : viewedPerson?.coverUrl && typeof viewedPerson.coverUrl === 'string' && viewedPerson.coverUrl.trim() !== ''
              ? viewedPerson.coverUrl
              : storeRecord?.coverUrl && typeof storeRecord.coverUrl === 'string' && storeRecord.coverUrl.trim() !== ''
              ? storeRecord.coverUrl
              : customData.coverUrl && typeof customData.coverUrl === 'string' && customData.coverUrl.trim() !== ''
              ? customData.coverUrl
              : prev.coverUrl;

          let validCover = '';
          if (isAnand) {
            validCover = (rawCover && (rawCover.startsWith('data:') || rawCover.startsWith('blob:')))
              ? rawCover
              : '/people/anand-sahu-cover.jpg';
          } else if (rawCover && (rawCover.startsWith('data:') || rawCover.startsWith('blob:') || (!rawCover.includes('photo-1541872703') && !rawCover.includes('photo-1579546929518') && !rawCover.includes('photo-1598488035139') && !rawCover.includes('photo-1598890777032')))) {
            validCover = rawCover;
          } else if (isKashish) {
            validCover = '/people/kashish-cover.jpg';
          } else {
            validCover = '/people/anand-sahu-cover.jpg';
          }

          // 3. Name, Role, Badge, Location, Quote
          const validName = sessionRecord?.name?.trim() || viewedPerson?.name?.trim() || storeRecord?.name?.trim() || customData.name?.trim() || prev.name;
          let validRole = sessionRecord?.role?.trim() || viewedPerson?.role?.trim() || storeRecord?.role?.trim() || customData.role?.trim() || prev.role;
          let validBadge = sessionRecord?.badge?.trim() || viewedPerson?.badge?.trim() || storeRecord?.badge?.trim() || customData.badge?.trim() || prev.badge;
          let validLocation = sessionRecord?.location?.trim() || viewedPerson?.location?.trim() || storeRecord?.location?.trim() || customData.location?.trim() || prev.location;
          let validQuote =
            sessionRecord?.quote !== undefined && sessionRecord.quote !== ''
              ? sessionRecord.quote
              : viewedPerson?.quote !== undefined && viewedPerson.quote !== ''
              ? viewedPerson.quote
              : storeRecord?.quote !== undefined && storeRecord.quote !== ''
              ? storeRecord.quote
              : customData.quote !== undefined && customData.quote !== ''
              ? customData.quote
              : prev.quote;

          if (isKashish) {
            if (!validRole || validRole === 'Creator & Platform Pioneer' || validRole === 'Creator & Voice of Bharat') {
              validRole = 'Public Figure & Speaker';
            }
            if (!validBadge || validBadge === 'Creator') {
              validBadge = 'Public Figure';
            }
            if (!validLocation || validLocation === 'Noida, UP' || validLocation === 'India') {
              validLocation = 'noida';
            }
            if (!validQuote || validQuote === 'Empowering local businesses and creators across Bharat.') {
              validQuote = 'hi';
            }
          }

          // 4. Bio / About & Website
          const resolvedWebsite = isAnand
            ? (customData.website || prev.website)
            : ((customData.website && !customData.website.includes('anandsahu.com')) ? customData.website : (prev.website && !prev.website.includes('anandsahu.com') ? prev.website : ''));

          const resolvedAbout = isAnand
            ? (customData.aboutText || prev.aboutText)
            : ((customData.aboutText && !customData.aboutText.includes('Anand Sahu')) ? customData.aboutText : (prev.aboutText && !prev.aboutText.includes('Anand Sahu') ? prev.aboutText : ''));

          // 5. Dynamic Lists
          const resolvedEdu =
            Array.isArray(sessionRecord?.educationList) && sessionRecord.educationList.length > 0
              ? sessionRecord.educationList
              : Array.isArray(storeRecord?.educationList) && storeRecord.educationList.length > 0
              ? storeRecord.educationList
              : prev.educationList;

          const resolvedExp =
            Array.isArray(sessionRecord?.experienceList) && sessionRecord.experienceList.length > 0
              ? sessionRecord.experienceList
              : Array.isArray(storeRecord?.experienceList) && storeRecord.experienceList.length > 0
              ? storeRecord.experienceList
              : prev.experienceList;

          const resolvedAch =
            Array.isArray(sessionRecord?.achievementsList) && sessionRecord.achievementsList.length > 0
              ? sessionRecord.achievementsList
              : Array.isArray(storeRecord?.achievementsList) && storeRecord.achievementsList.length > 0
              ? storeRecord.achievementsList
              : prev.achievementsList;

          const resolvedNews =
            Array.isArray(sessionRecord?.newsList) && sessionRecord.newsList.length > 0
              ? sessionRecord.newsList
              : Array.isArray(storeRecord?.newsList) && storeRecord.newsList.length > 0
              ? storeRecord.newsList
              : prev.newsList;

          const resolvedGallery =
            Array.isArray(sessionRecord?.gallery) && sessionRecord.gallery.length > 0
              ? sessionRecord.gallery
              : Array.isArray(storeRecord?.gallery) && storeRecord.gallery.length > 0
              ? storeRecord.gallery
              : prev.gallery;

          const resolvedVideos =
            Array.isArray(sessionRecord?.videoList) && sessionRecord.videoList.length > 0
              ? sessionRecord.videoList
              : Array.isArray(storeRecord?.videoList) && storeRecord.videoList.length > 0
              ? storeRecord.videoList
              : prev.videoList;

          const resolvedUpdates =
            Array.isArray(sessionRecord?.updates) && sessionRecord.updates.length > 0
              ? sessionRecord.updates
              : Array.isArray(storeRecord?.updates) && storeRecord.updates.length > 0
              ? storeRecord.updates
              : prev.updates;

          const resolvedStories =
            Array.isArray(sessionRecord?.communityStoriesList) && sessionRecord.communityStoriesList.length > 0
              ? sessionRecord.communityStoriesList
              : Array.isArray(storeRecord?.communityStoriesList) && storeRecord.communityStoriesList.length > 0
              ? storeRecord.communityStoriesList
              : prev.communityStoriesList;

          const resolvedSocial = sessionRecord?.socialLinks || storeRecord?.socialLinks || customData.socialLinks || prev.socialLinks;

          // 6. Followers Count Resolution - 100% Real Authentic BharatBN Followers
          const validFollowers = getRealMetrics(cleanTarget).followersCount;

          return {
            ...prev,
            id: customData.id || prev.id,
            name: validName,
            slug: customData.slug || prev.slug,
            role: validRole,
            badge: validBadge,
            location: validLocation,
            quote: validQuote,
            avatarUrl: validAvatar,
            coverUrl: validCover,
            followersCount: validFollowers,
            aboutText: resolvedAbout,
            website: resolvedWebsite,
            socialLinks: resolvedSocial,
            educationList: resolvedEdu,
            experienceList: resolvedExp,
            achievementsList: resolvedAch,
            newsList: resolvedNews,
            gallery: resolvedGallery,
            videoList: resolvedVideos,
            updates: resolvedUpdates,
            postsCount: resolvedUpdates?.length || prev.postsCount,
            communityStoriesList: resolvedStories,
            communityStoriesCount: resolvedStories?.length || prev.communityStoriesCount,
            isVerified: (customData.status === 'approved') || Boolean(customData.isVerified) || prev.isVerified,
          };
        });

        if (customData.featuredVideo) {
          setActiveVideo({
            title: customData.featuredVideo.title || 'Featured Video',
            subtitle: customData.featuredVideo.subtitle || '',
            url: customData.featuredVideo.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          });
        }
      } catch (err) {
        console.error('Error resolving profile data:', err);
      }
    };

    resolveAndSyncProfile();

    // Also fetch remote sync cache
    fetch('/api/sync')
      .then((r) => r.json())
      .then((data) => {
        if (data?.people && typeof data.people === 'object') {
          const remote = data.people[cleanTarget] || Object.values(data.people).find((p: any) => matchCandidate(p)) as any;
          if (remote) {
            // Check if local store or session already has custom attributes
            let localStore: any = null;
            let localSession: any = null;
            try {
              const stored = localStorage.getItem('bharatbn_people_store');
              if (stored) {
                const arr = JSON.parse(stored);
                if (Array.isArray(arr)) {
                  localStore = arr.find(matchCandidate);
                }
              }
            } catch {}

            try {
              const sessionStr = localStorage.getItem('bharatbn_owner_session');
              if (sessionStr) {
                const sess = JSON.parse(sessionStr);
                if (sess && sess.accountType === 'person' && matchCandidate(sess)) {
                  localSession = sess;
                }
              }
            } catch {}

            setPerson((prev) => {
              // Local user custom values ALWAYS take precedence over remote cache
              const customAvatar = (localSession?.avatarUrl && localSession.avatarUrl.trim() !== '')
                ? localSession.avatarUrl
                : (localStore?.avatarUrl && localStore.avatarUrl.trim() !== '')
                ? localStore.avatarUrl
                : null;

              const customCover = (localSession?.coverUrl && localSession.coverUrl.trim() !== '')
                ? localSession.coverUrl
                : (localStore?.coverUrl && localStore.coverUrl.trim() !== '')
                ? localStore.coverUrl
                : null;

              const customName = localSession?.name?.trim() || localStore?.name?.trim();
              const customRole = localSession?.role?.trim() || localStore?.role?.trim();
              const customBadge = localSession?.badge?.trim() || localStore?.badge?.trim();
              const customLocation = localSession?.location?.trim() || localStore?.location?.trim();
              const customQuote = (localSession?.quote !== undefined && localSession?.quote !== '')
                ? localSession.quote
                : ((localStore?.quote !== undefined && localStore?.quote !== '') ? localStore.quote : undefined);

              let rAvatar = customAvatar || (remote.avatarUrl && typeof remote.avatarUrl === 'string' && remote.avatarUrl.trim() !== '' ? remote.avatarUrl : prev.avatarUrl);
              let rCover = customCover || (remote.coverUrl && typeof remote.coverUrl === 'string' && remote.coverUrl.trim() !== '' ? remote.coverUrl : prev.coverUrl);

              if (cleanTarget === 'anand-sahu' || cleanTarget === 'anand') {
                if (!customAvatar && (!rAvatar || rAvatar.includes('unsplash') || rAvatar.includes('541872703'))) {
                  rAvatar = '/people/anand-sahu-avatar.jpg';
                }
                if (!customCover && (!rCover || rCover.includes('unsplash') || rCover.includes('598890777') || rCover.includes('541872703'))) {
                  rCover = '/people/anand-sahu-cover.jpg';
                }
              }
              const rName = customName || remote.name || prev.name;
              const rRole = customRole || remote.role || prev.role;
              const rBadge = customBadge || remote.badge || prev.badge;
              const rLocation = customLocation || remote.location || prev.location;
              const rQuote = customQuote !== undefined ? customQuote : (remote.quote !== undefined && remote.quote !== '' ? remote.quote : prev.quote);

              return {
                ...prev,
                name: rName,
                role: rRole,
                badge: rBadge,
                location: rLocation,
                quote: rQuote,
                avatarUrl: rAvatar,
                coverUrl: rCover,
                aboutText: localSession?.aboutText || localStore?.aboutText || remote.aboutText || prev.aboutText,
                website: localSession?.website || localStore?.website || remote.website || prev.website,
                isVerified: (remote.status === 'approved') || Boolean(remote.isVerified) || (localSession?.status === 'approved') || (localStore?.status === 'approved') || prev.isVerified,
              };
            });
          }
        }
      })
      .catch(() => null);

    window.addEventListener('bharatbn_people_updated', resolveAndSyncProfile);
    window.addEventListener('bharatbn_auth_changed', resolveAndSyncProfile);
    window.addEventListener('storage', resolveAndSyncProfile);

    return () => {
      window.removeEventListener('bharatbn_people_updated', resolveAndSyncProfile);
      window.removeEventListener('bharatbn_auth_changed', resolveAndSyncProfile);
      window.removeEventListener('storage', resolveAndSyncProfile);
    };
  }, [targetSlug, propSlug, initialPerson]);

  // Sync Real Metrics, Views & Followers
  useEffect(() => {
    const curSlug = (person.slug || targetSlug || '').toLowerCase().trim();
    if (!curSlug) return;

    // 1. Record authentic profile view
    const viewCount = recordRealView(curSlug);
    setViewsCount(viewCount);

    // 2. Load immediate local real metrics
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

    // 3. Determine if current user follows this profile
    const sessionActive = Boolean(localStorage.getItem('bharatbn_owner_session'));
    const myFollowing = getStoredFollowingList();
    const myHandle = getCurrentUserHandle();
    const isF = Boolean(
      sessionActive &&
      (myFollowing.includes(curSlug) ||
        initialMetrics.followers.some((f) => f.toLowerCase() === myHandle.toLowerCase()))
    );
    setIsFollowing(isF);

    // 4. Background sync with server cache
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

    // 5. Event listener for real-time changes across tabs & components
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

    const onPostCreated = (e: any) => {
      const newPost = e.detail;
      if (newPost) {
        setPerson((prev) => ({
          ...prev,
          updates: [newPost, ...((prev.updates || []).filter((p) => p.id !== newPost.id))],
          postsCount: (prev.postsCount || 0) + 1,
        }));
      }
    };

    window.addEventListener('bharatbn_metrics_updated', onMetricsUpdated);
    window.addEventListener('bharatbn_follow_changed', onMetricsUpdated);
    window.addEventListener('bharatbn_post_created', onPostCreated);

    return () => {
      window.removeEventListener('bharatbn_metrics_updated', onMetricsUpdated);
      window.removeEventListener('bharatbn_follow_changed', onMetricsUpdated);
      window.removeEventListener('bharatbn_post_created', onPostCreated);
    };
  }, [person.slug, targetSlug]);

  // Handle Follow / Unfollow Real Action
  const handleToggleFollow = async () => {
    // Require active login session to follow any profile
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
  const formattedFollowers = formatFollowerCount(followersCount);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 text-slate-800">
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
              src={person.coverUrl || '/people/anand-sahu-cover.jpg'}
              alt={`${person.name} Cover`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/people/anand-sahu-cover.jpg';
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
          <div className="px-6 sm:px-8 pb-6 pt-0 relative bg-white">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
              {/* Left Column: 50% Cut Avatar + Identity Info (Name, Verified Badge, Role, Location) */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                {/* Avatar Cutout: Exactly 50% in cover banner (-72px) and 50% in white body (+72px) */}
                <div className="relative -mt-16 sm:-mt-[72px] w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white border-4 border-white shadow-xl overflow-hidden flex-shrink-0 z-20 flex items-center justify-center">
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
                    className={`w-full h-full bg-gradient-to-tr from-[#07213A] to-[#F95700] text-white font-black text-3xl sm:text-4xl flex items-center justify-center profile-avatar-fallback ${
                      person.avatarUrl ? 'hidden' : 'flex'
                    }`}
                  >
                    {(person.name || 'P').slice(0, 1).toUpperCase()}
                  </div>
                </div>

                {/* Identity Details (Starts cleanly inside white card below banner) */}
                <div className="space-y-1.5 pt-1 sm:pt-3.5 pb-1">
                  {/* Category Badge & Verification Status */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    {person.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#F95700] bg-orange-50 border border-orange-200 uppercase tracking-wide">
                        {person.badge}
                      </span>
                    )}
                    {!person.isVerified && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200">
                        Pending Verification
                      </span>
                    )}
                  </div>

                  {/* Name + Verified Checkmark */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {person.name}
                    </h1>
                    {person.isVerified && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs" title="Official Verified Profile">
                        <Check className="w-3 h-3 stroke-[3.5]" />
                      </div>
                    )}
                  </div>

                  {/* Role */}
                  <p className="text-xs sm:text-base font-semibold text-slate-700">
                    {person.role}
                  </p>

                  {/* Location & Handle */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 font-medium pt-0.5">
                    {person.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{person.location}</span>
                      </span>
                    )}
                    {person.slug && (
                      <>
                        <span className="text-slate-300">&bull;</span>
                        <span className="font-mono text-slate-400">@{person.slug}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Action Buttons & Social Icons (Aligned cleanly in white area) */}
              <div className="flex flex-col items-center lg:items-end gap-2.5 pt-2 sm:pt-3.5 flex-shrink-0">
                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2">
                  {/* Follow Button */}
                  <button
                    type="button"
                    onClick={handleToggleFollow}
                    className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                      isFollowing
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : ownerSession
                        ? 'bg-[#F95700] hover:bg-[#d94a00] text-white shadow-[#F95700]/25'
                        : 'bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-orange-600 border border-slate-200'
                    }`}
                    title={!ownerSession ? 'Login to follow' : undefined}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                        <span>Following</span>
                      </>
                    ) : ownerSession ? (
                      <>
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Follow</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>

                  {/* Message Button */}
                  <button
                    type="button"
                    onClick={() => setIsMessageModalOpen(true)}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-500" />
                    <span>Message</span>
                  </button>

                  {/* Share Button */}
                  <button
                    type="button"
                    onClick={handleCopyShare}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
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
                      className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  )}
                </div>

                {/* Social Icons Row */}
                <div className="flex items-center justify-center lg:justify-end gap-2">
                  {person.socialLinks.instagram && (
                    <a
                      href={person.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center hover:opacity-90 hover:scale-105 transition shadow-2xs"
                      title="Instagram"
                    >
                      <InstagramIcon className="w-3.5 h-3.5 text-white" />
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
          </div>

          {/* ======================================================================= */}
          {/* 2. METRIC STAT BAR (Exact Image Reference)                              */}
          {/* ======================================================================= */}
          <div className="border-t border-slate-100 px-6 sm:px-8 py-3.5 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {/* Followers (Clickable Instagram-style) */}
              <button
                type="button"
                onClick={() => handleOpenFollowModal('followers')}
                className="flex items-center gap-2 px-3 py-1.5 -ml-1 rounded-xl hover:bg-orange-50 transition cursor-pointer group text-left border border-transparent hover:border-orange-200"
                title={`View ${person.name}'s followers`}
              >
                <Users className="w-4 h-4 text-[#F95700] group-hover:scale-110 transition-transform" />
                <div>
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#F95700] transition-colors">
                    {formattedFollowers}
                  </span>
                  <span className="text-xs text-slate-500 ml-1.5 font-medium group-hover:text-slate-700">
                    {followersCount === 1 ? 'Follower' : 'Followers'}
                  </span>
                </div>
              </button>

              {/* Following (Clickable Instagram-style) */}
              <button
                type="button"
                onClick={() => handleOpenFollowModal('following')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition cursor-pointer group text-left border border-transparent hover:border-blue-200"
                title={`View accounts ${person.name} is following`}
              >
                <Users className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    {followingCount}
                  </span>
                  <span className="text-xs text-slate-500 ml-1.5 font-medium group-hover:text-slate-700">Following</span>
                </div>
              </button>

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
                    {viewsCount !== undefined && viewsCount !== null ? viewsCount : (person.viewsCount || 0)}
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
        {/* 2. TWO-COLUMN LAYOUT: STICKY LEFT SIDEBAR NAVIGATION + EXPANDED BODY      */}
        {/* ========================================================================= */}
        {/* Mobile Horizontal Pill Scroll (< lg) */}
        <div className="lg:hidden sticky top-18 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xs p-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1">
            {[
              { id: 'overview', label: 'All Modules', icon: Sparkles },
              { id: 'about', label: 'About', icon: FileText },
              { id: 'education', label: `Education (${person.educationList?.length || 0})`, icon: GraduationCap },
              { id: 'experience', label: `Experience (${person.experienceList?.length || 0})`, icon: Briefcase },
              { id: 'achievements', label: `Achievements (${person.achievementsList?.length || 0})`, icon: Trophy },
              { id: 'news', label: `News (${person.newsList?.length || 0})`, icon: Newspaper },
              { id: 'videos', label: `Videos (${(person.videoList?.length || 0) + (person.featuredVideo ? 1 : 0)})`, icon: Video },
              { id: 'photos', label: `Photos (${person.gallery?.length || 0})`, icon: Camera },
              { id: 'posts', label: `Posts (${person.updates?.length || 0})`, icon: Send },
              { id: 'stories', label: `Stories (${person.communityStoriesList?.length || person.communityStoriesCount || 0})`, icon: MessageSquare },
              { id: 'social', label: 'Official Channels', icon: Globe },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === 'overview') {
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    } else {
                      const el = document.getElementById(`module-${item.id}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                    active
                      ? 'bg-[#07213A] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-slate-50 border border-slate-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#F95700]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Desktop Left Sidebar (3 Cols) + Right Main Content (9 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ----------------------------------------------------------------------- */}
          {/* COLUMN 1: STICKY LEFT SIDEBAR MODULE NAVIGATION (Exact User Request)     */}
          {/* ----------------------------------------------------------------------- */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-20 z-20">
            {/* 11 Modules Navigation Menu Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-2.5 space-y-1">
              <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-100 mb-1">
                <span>Profile Modules</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">11</span>
              </div>
              {[
                { id: 'overview', label: 'All Modules', icon: Sparkles, count: null },
                { id: 'about', label: 'About & Bio', icon: FileText, count: null },
                { id: 'education', label: 'Education', icon: GraduationCap, count: person.educationList?.length || 0 },
                { id: 'experience', label: 'Experience', icon: Briefcase, count: person.experienceList?.length || 0 },
                { id: 'achievements', label: 'Achievements', icon: Trophy, count: person.achievementsList?.length || 0 },
                { id: 'news', label: 'News & Media', icon: Newspaper, count: person.newsList?.length || 0 },
                { id: 'videos', label: 'Featured Videos', icon: Video, count: (person.videoList?.length || 0) + (person.featuredVideo ? 1 : 0) },
                { id: 'photos', label: 'Photo Gallery', icon: Camera, count: person.gallery?.length || 0 },
                { id: 'posts', label: 'Posts & Updates', icon: Send, count: person.updates?.length || 0 },
                { id: 'stories', label: 'Community Stories', icon: MessageSquare, count: person.communityStoriesList?.length || person.communityStoriesCount || 0 },
                { id: 'social', label: 'Official Channels', icon: Globe, count: null },
              ].map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      if (item.id === 'overview') {
                        window.scrollTo({ top: 380, behavior: 'smooth' });
                      } else {
                        const el = document.getElementById(`module-${item.id}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between text-left cursor-pointer ${
                      active
                        ? 'bg-[#07213A] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#F95700]' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.count !== null && item.count > 0 && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                          active
                            ? 'bg-[#F95700] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Profile Ownership / Claim Verification Card */}
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white rounded-2xl border border-orange-200/80 p-4 space-y-2.5 text-center shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#F95700] mx-auto flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-slate-900">Are you {person.name}?</h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Claim this official profile to manage credentials, bio, and audience feeds.
                </p>
              </div>
              <Link
                href={`/claim/${person.slug}`}
                className="w-full py-2 px-3 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Claim Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>

          {/* ----------------------------------------------------------------------- */}
          {/* COLUMN 2 (9 Cols): Spacious Content Area (No Cramping Column 3)         */}
          {/* ----------------------------------------------------------------------- */}
          <main className="lg:col-span-9 space-y-6 min-w-0">
            {/* Active Module Filter Notice if not in Overview */}
          {activeTab !== 'overview' && (
            <div className="flex items-center justify-between bg-white px-6 py-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Filtered View:</span>
                <span className="text-sm font-black text-slate-900 capitalize flex items-center gap-1.5">
                  {activeTab === 'about' && 'About & Bio'}
                  {activeTab === 'education' && 'Education & Academic Qualifications'}
                  {activeTab === 'experience' && 'Professional & Career Experience'}
                  {activeTab === 'achievements' && 'Key Achievements & Recognitions'}
                  {activeTab === 'news' && 'News & Media Coverage'}
                  {activeTab === 'photos' && 'Photo Gallery'}
                  {activeTab === 'videos' && 'Featured Video & Video Gallery'}
                  {activeTab === 'posts' && 'Posts & Updates Timeline'}
                  {activeTab === 'stories' && 'Community Stories & Collabs'}
                  {activeTab === 'social' && 'Official Social Media & Channels'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="text-xs font-bold text-[#F95700] hover:text-[#d94a00] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>&larr; View All Modules (Full Page)</span>
              </button>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* MODULE 1: ABOUT SECTION                                             */}
          {/* ------------------------------------------------------------------- */}
          {(activeTab === 'overview' || activeTab === 'about') && (
            <div id="module-about" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5 scroll-mt-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
                  <span className="w-1.5 h-5 rounded-full bg-[#F95700]" />
                  <FileText className="w-5 h-5 text-[#F95700]" />
                  <span>About {person.name}</span>
                </h2>
                {activeTab !== 'overview' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="text-xs font-bold text-slate-400 hover:text-[#F95700] transition cursor-pointer"
                  >
                    View All Modules &rarr;
                  </button>
                )}
              </div>

              <p className="text-sm text-slate-700 leading-relaxed max-w-5xl">
                {person.aboutText}
              </p>

              {/* 4 Feature Highlights Grid (Full Width) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {person.highlights.map((hl) => (
                  <div
                    key={hl.key}
                    onClick={() => {
                      if (hl.key === 'education') {
                        const el = document.getElementById('module-education');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                      if (hl.key === 'experience') {
                        const el = document.getElementById('module-experience');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                      if (hl.key === 'achievements') {
                        const el = document.getElementById('module-achievements');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-100/70 transition space-y-2 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      {hl.key === 'education' && <GraduationCap className="w-5 h-5 text-blue-600" />}
                      {hl.key === 'experience' && <Briefcase className="w-5 h-5 text-amber-600" />}
                      {hl.key === 'achievements' && <Trophy className="w-5 h-5 text-purple-600" />}
                      {hl.key === 'initiatives' && <HeartHandshake className="w-5 h-5 text-rose-600" />}
                      <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-[#F95700] transition">{hl.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {hl.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* MODULE 2: EDUCATION & QUALIFICATIONS                                */}
          {/* ------------------------------------------------------------------- */}
          {(activeTab === 'overview' || activeTab === 'education') && (
            <div id="module-education" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5 scroll-mt-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
                  <span className="w-1.5 h-5 rounded-full bg-blue-600" />
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <span>Education &amp; Academic Qualifications</span>
                  <span className="text-xs font-bold text-slate-400">({person.educationList?.length || 0})</span>
                </h3>
              </div>

              {!person.educationList || person.educationList.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No education credentials listed yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {person.educationList.map((edu, idx) => (
                    <div
                      key={edu.id || idx}
                      className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-200 transition space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{edu.degree}</h4>
                          {edu.year && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                              {edu.year}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>{edu.institution}</span>
                        </p>
                      </div>
                      {edu.description && (
                        <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2">
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
          {/* MODULE 3: PROFESSIONAL & PUBLIC EXPERIENCE                          */}
          {/* ------------------------------------------------------------------- */}
          {(activeTab === 'overview' || activeTab === 'experience') && (
            <div id="module-experience" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5 scroll-mt-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
                  <span className="w-1.5 h-5 rounded-full bg-amber-500" />
                  <Briefcase className="w-5 h-5 text-amber-600" />
                  <span>Professional &amp; Career Experience</span>
                  <span className="text-xs font-bold text-slate-400">({person.experienceList?.length || 0})</span>
                </h3>
              </div>

              {!person.experienceList || person.experienceList.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No experience records listed yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {person.experienceList.map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-amber-200 transition space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{exp.role}</h4>
                          {exp.period && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                              {exp.period}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{exp.organization}</span>
                        </p>
                      </div>
                      {exp.description && (
                        <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2">
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
          {/* MODULE 4: ACHIEVEMENTS & RECOGNITIONS                               */}
          {/* ------------------------------------------------------------------- */}
          {(activeTab === 'overview' || activeTab === 'achievements') && (
            <div id="module-achievements" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5 scroll-mt-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
                  <span className="w-1.5 h-5 rounded-full bg-purple-600" />
                  <Trophy className="w-5 h-5 text-purple-600" />
                  <span>Key Achievements &amp; Recognitions</span>
                  <span className="text-xs font-bold text-slate-400">({person.achievementsList?.length || 0})</span>
                </h3>
              </div>

              {!person.achievementsList || person.achievementsList.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No achievements listed yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {person.achievementsList.map((ach, idx) => (
                    <div
                      key={ach.id || idx}
                      className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-purple-200 transition space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                            <span>🏆</span>
                            <span>{ach.title}</span>
                          </h4>
                          {ach.year && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                              {ach.year}
                            </span>
                          )}
                        </div>
                        {ach.organization && (
                          <p className="text-xs font-semibold text-slate-600">
                            Conferred by: <strong className="text-slate-800">{ach.organization}</strong>
                          </p>
                        )}
                      </div>
                      {ach.description && (
                        <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2">
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
          {/* MODULE 5: NEWS & MEDIA COVERAGE                                     */}
          {/* ------------------------------------------------------------------- */}
          {(activeTab === 'overview' || activeTab === 'news') && (
            <div id="module-news" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5 scroll-mt-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
                  <span className="w-1.5 h-5 rounded-full bg-rose-600" />
                  <Newspaper className="w-5 h-5 text-rose-600" />
                  <span>News &amp; Media Coverage</span>
                  <span className="text-xs font-bold text-slate-400">({person.newsList?.length || 0})</span>
                </h3>
              </div>

              {!person.newsList || person.newsList.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No press articles or media coverage listed yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {person.newsList.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-rose-200 transition space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
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
                      </div>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-[#F95700] hover:underline inline-flex items-center gap-1.5 pt-1"
                        >
                          <span>Read Full Coverage</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* MODULE 6: FEATURED VIDEO & GALLERY                                  */}
          {/* ------------------------------------------------------------------- */}
          {(activeTab === 'overview' || activeTab === 'videos') && (
            <div id="module-videos" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5 scroll-mt-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
                  <span className="w-1.5 h-5 rounded-full bg-[#F95700]" />
                  <Video className="w-5 h-5 text-[#F95700]" />
                  <span>Personal Video &amp; Gallery</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Main Featured Video Player (8 cols) */}
                <div
                  onClick={() => {
                    setActiveVideo({
                      title: person.featuredVideo.title,
                      subtitle: person.featuredVideo.subtitle,
                      url: person.featuredVideo.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    });
                    setIsVideoModalOpen(true);
                  }}
                  className="lg:col-span-8 relative aspect-video rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group shadow-md"
                >
                  <img
                    src={person.featuredVideo.thumbnailUrl}
                    alt={person.featuredVideo.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex flex-col justify-between p-6">
                    <div className="self-end px-3 py-1 rounded-md bg-black/70 text-white text-[11px] font-bold">
                      HD Featured Video
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-[#F95700] group-hover:bg-[#d94a00] text-white flex items-center justify-center shadow-xl transition transform group-hover:scale-105">
                        <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                      </div>
                      <div>
                        <h4 className="text-white font-extrabold text-base sm:text-lg drop-shadow-md">
                          {person.featuredVideo.title}
                        </h4>
                        <p className="text-slate-300 text-xs sm:text-sm drop-shadow-sm">
                          {person.featuredVideo.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Video Playlist (4 cols) */}
                <div className="lg:col-span-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Video Playlist</h4>
                  {person.videoList && person.videoList.length > 0 ? (
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
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
                          className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-24 h-16 rounded-xl bg-slate-900 overflow-hidden relative flex-shrink-0">
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
                            <h5 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{vid.title}</h5>
                            {vid.duration && <span className="text-[10px] text-slate-400 font-mono mt-1 block">{vid.duration}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      Additional videos will appear here.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* MODULE 7: PHOTO GALLERY                                             */}
          {/* ------------------------------------------------------------------- */}
          {(activeTab === 'overview' || activeTab === 'photos') && (
            <div id="module-photos" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5 scroll-mt-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
                  <span className="w-1.5 h-5 rounded-full bg-[#F95700]" />
                  <Camera className="w-5 h-5 text-[#F95700]" />
                  <span>Photo Gallery ({person.gallery.length})</span>
                </h3>
              </div>

              {person.gallery.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No photos added to gallery yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {person.gallery.map((photo, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedPhoto(photo)}
                      className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-2xs hover:shadow-md transition cursor-pointer"
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-2 text-[11px] text-white font-medium truncate">
                        {photo.caption}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* MODULE 8: POSTS & UPDATES TIMELINE                                  */}
          {/* ------------------------------------------------------------------- */}
          {(activeTab === 'overview' || activeTab === 'posts') && (
            <div id="module-posts" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5 scroll-mt-24">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
                  <span className="w-1.5 h-5 rounded-full bg-[#F95700]" />
                  <Send className="w-5 h-5 text-[#F95700]" />
                  <span>Posts &amp; Public Updates</span>
                  <span className="text-xs font-bold text-slate-400">({filteredUpdates.length})</span>
                </h3>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
                  {(['All', 'Posts', 'News', 'Events'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setFeedFilter(tab)}
                      className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${feedFilter === tab
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {filteredUpdates.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No updates published in this category yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredUpdates.map((upd) => (
                    <div key={upd.id} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition space-y-3 flex flex-col justify-between">
                      <div className="flex gap-4 items-start">
                        {upd.imageUrl && (
                          <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                            <img
                              src={upd.imageUrl}
                              alt={upd.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-orange-50 text-[#F95700] border border-orange-200">
                              {upd.type}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {upd.date}
                            </span>
                          </div>
                          <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                            {upd.title}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {upd.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-2 border-t border-slate-200/60 text-xs text-slate-500 font-semibold">
                        <button
                          type="button"
                          className="flex items-center gap-1.5 hover:text-blue-600 transition cursor-pointer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{upd.likes}</span>
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1.5 hover:text-slate-900 transition cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{upd.comments}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleCopyShare}
                          className="flex items-center gap-1.5 hover:text-[#F95700] transition cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* MODULE 9: COMMUNITY STORIES & COLLABS                               */}
          {/* ------------------------------------------------------------------- */}
          {(activeTab === 'overview' || activeTab === 'stories') && (
            <div id="module-stories" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5 scroll-mt-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-5 rounded-full bg-blue-600" />
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    Community Stories &amp; Collabs ({person.communityStoriesList?.length || person.communityStoriesCount})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsStoryModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>+ Share Your Story</span>
                </button>
              </div>

              {!person.communityStoriesList || person.communityStoriesList.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No community stories yet. Be the first to share your experience with {person.name}!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {person.communityStoriesList.map((st) => (
                    <div
                      key={st.id}
                      className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition space-y-3 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                            {st.author.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <h5 className="text-xs font-extrabold text-slate-900">{st.author}</h5>
                            {st.role && <span className="text-[10px] text-slate-400">{st.role}</span>}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{st.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic border-t border-slate-100 pt-2">
                        &ldquo;{st.content}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* MODULE 10: OFFICIAL SOCIAL CHANNELS & DIRECT CONNECT                */}
          {/* ------------------------------------------------------------------- */}
          {(activeTab === 'overview' || activeTab === 'social') && (
            <div id="module-social" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5 scroll-mt-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5">
                  <span className="w-1.5 h-5 rounded-full bg-[#07213A]" />
                  <Globe className="w-5 h-5 text-slate-800" />
                  <span>Official Channels &amp; Direct Connect</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Website */}
                {person.website && (
                  <a
                    href={person.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">Official Website</div>
                        <div className="text-[11px] text-slate-500 font-mono truncate max-w-[180px]">
                          {person.website.replace(/^https?:\/\/(www\.)?/, '')}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                )}

                {/* Instagram */}
                {person.socialLinks.instagram && (
                  <a
                    href={person.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-2xl border border-pink-200 bg-pink-50/40 hover:bg-pink-100/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
                        <InstagramIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">Instagram</div>
                        <div className="text-[11px] text-pink-700 font-mono truncate max-w-[180px]">
                          {person.socialLinks.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\/?/, '@')}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-pink-400" />
                  </a>
                )}

                {/* YouTube */}
                {person.socialLinks.youtube && (
                  <a
                    href={person.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-2xl border border-red-200 bg-red-50/40 hover:bg-red-100/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FF0000] flex items-center justify-center text-white shadow-xs">
                        <YouTubeIcon className="w-4 h-4 fill-white" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">YouTube Channel</div>
                        <div className="text-[11px] text-red-700 font-mono truncate max-w-[180px]">
                          {person.socialLinks.youtube.replace(/^https?:\/\/(www\.)?youtube\.com\/?/, '')}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-red-400" />
                  </a>
                )}

                {/* Twitter / X */}
                {person.socialLinks.twitter && (
                  <a
                    href={person.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-2xl border border-slate-300 bg-slate-100/60 hover:bg-slate-200/60 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white shadow-xs">
                        <TwitterXIcon className="w-4 h-4 fill-white" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">X (Twitter)</div>
                        <div className="text-[11px] text-slate-700 font-mono truncate max-w-[180px]">
                          {person.socialLinks.twitter.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\/?/, '@')}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                )}

                {/* Facebook */}
                {person.socialLinks.facebook && (
                  <a
                    href={person.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-2xl border border-blue-200 bg-blue-50/40 hover:bg-blue-100/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shadow-xs">
                        <FacebookFIcon className="w-4 h-4 fill-white" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">Facebook Page</div>
                        <div className="text-[11px] text-blue-700 font-mono truncate max-w-[180px]">
                          {person.socialLinks.facebook.replace(/^https?:\/\/(www\.)?facebook\.com\/?/, '/')}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                  </a>
                )}

                {/* LinkedIn */}
                {person.socialLinks.linkedin && (
                  <a
                    href={person.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-2xl border border-sky-200 bg-sky-50/40 hover:bg-sky-100/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#0A66C2] flex items-center justify-center text-white shadow-xs">
                        <LinkedInIcon className="w-4 h-4 fill-white" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">LinkedIn Profile</div>
                        <div className="text-[11px] text-sky-700 font-mono truncate max-w-[180px]">
                          {person.socialLinks.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/(in|company)?\/?/, '/')}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-sky-400" />
                  </a>
                )}

                {/* Direct Message Inquiry */}
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(true)}
                  className="flex items-center justify-between p-4 rounded-2xl border border-orange-200 bg-orange-50/40 hover:bg-orange-100/50 transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F95700] text-white flex items-center justify-center shadow-xs">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Send Direct Message</div>
                      <div className="text-[11px] text-orange-700">Connect directly via BharatBN™</div>
                    </div>
                  </div>
                  <span className="text-orange-500 font-bold">&rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* MODULE 11: CLAIM & MANAGE PROFILE BANNER CARD                       */}
          {/* ------------------------------------------------------------------- */}
          <div className="bg-gradient-to-r from-[#07213A] via-[#0b2f52] to-[#07213A] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-700/60">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/20 text-[#F95700] border border-orange-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-black text-white">
                  Are You {person.name}?
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Claim and manage your official public profile, publish verified statements, sync credentials, and engage directly with your followers.
                </p>
              </div>
            </div>
            <Link
              href={`/claim/${person.slug}`}
              className="px-6 py-3 rounded-2xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-[#F95700]/25 shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Claim This Profile</span>
            </Link>
          </div>
          </main>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MODALS (Message, Story & Video)                                        */}
      {/* ========================================================================= */}

      {/* Direct Message Modal */}
      <DirectMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        recipient={{
          slug: person.slug,
          name: person.name,
          avatarUrl: person.avatarUrl,
          role: person.role,
          handle: (person as any).handle || `@${person.slug}`,
          isVerified: person.isVerified,
        }}
      />

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
      {/* Sign In to Follow Modal */}
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

              <div className="space-y-2.5 pt-2">
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
                  type="button"
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

      {/* Instagram-Style Followers & Following Modal */}
      <FollowersModal
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
        targetSlug={person.slug || targetSlug}
        targetName={person.name}
        targetHandle={(person as any).handle || `@${person.slug || targetSlug}`}
        initialTab={followModalTab}
        onRequireLogin={() => setShowLoginPrompt(true)}
        onFollowToggle={(tSlug, isNowFollowing) => {
          const currentViewingSlug = (person.slug || targetSlug || '').toLowerCase().trim();
          if (tSlug === currentViewingSlug) {
            setIsFollowing(isNowFollowing);
          }
          const m = getRealMetrics(currentViewingSlug);
          setFollowersCount(m.followersCount);
          setFollowingCount(m.followingCount);
          setPerson((prev) => ({
            ...prev,
            followersCount: m.followersCount,
            followingCount: m.followingCount,
          }));
        }}
      />
    </div>
  );
}
