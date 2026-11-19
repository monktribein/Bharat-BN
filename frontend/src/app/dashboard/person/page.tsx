'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Camera,
  CheckCircle2,
  ExternalLink,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  Sparkles,
  Eye,
  Users,
  MessageSquare,
  Globe,
  Mail,
  Phone,
  MapPin,
  AtSign,
  Award,
  GraduationCap,
  Briefcase,
  Heart,
  Send,
  Check,
  Copy,
  LogIn,
  Video,
  Newspaper,
  Trophy,
  Play,
  ThumbsUp,
  Upload,
  Calendar,
  FileText,
  HeartHandshake,
  ShieldCheck,
  Link as LinkIcon,
  X,
} from 'lucide-react';
import BusinessLoginModal from '@/components/BusinessLoginModal';
import {
  peopleDatabase,
  type EducationItem,
  type ExperienceItem,
  type AchievementItem,
  type NewsItem,
  type VideoItem,
  type CommunityStoryItem,
} from '@/app/people/[slug]/peopleData';

interface PersonSession {
  accountType?: 'person' | 'business';
  personId?: string;
  name?: string;
  slug?: string;
  role?: string;
  badge?: string;
  handle?: string;
  email?: string;
  phone?: string;
  location?: string;
  quote?: string;
  website?: string;
  aboutText?: string;
  avatarUrl?: string;
  coverUrl?: string;
  followersCount?: string | number;
  followingCount?: string | number;
  viewsCount?: string | number;
  engagementsCount?: string | number;
  storiesCount?: string | number;
  status?: string;
  isVerified?: boolean;
}

export default function PersonDashboardPage() {
  const [session, setSession] = useState<PersonSession | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // 1. Profile Identity & Bio States
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [slug, setSlug] = useState('');
  const [role, setRole] = useState('Public Figure & Speaker');
  const [badge, setBadge] = useState('Public Figure');
  const [location, setLocation] = useState('');
  const [quote, setQuote] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState(
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80'
  );

  // 2. Education & Academic Background
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [newDegree, setNewDegree] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newEduYear, setNewEduYear] = useState('');
  const [newEduDesc, setNewEduDesc] = useState('');

  // 3. Professional & Public Experience
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([]);
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpOrg, setNewExpOrg] = useState('');
  const [newExpPeriod, setNewExpPeriod] = useState('');
  const [newExpDesc, setNewExpDesc] = useState('');

  // 4. Key Achievements & Recognitions
  const [achievementsList, setAchievementsList] = useState<AchievementItem[]>([]);
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchOrg, setNewAchOrg] = useState('');
  const [newAchYear, setNewAchYear] = useState('');
  const [newAchDesc, setNewAchDesc] = useState('');

  // 5. News & Media Coverage
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsSource, setNewNewsSource] = useState('');
  const [newNewsDate, setNewNewsDate] = useState('');
  const [newNewsUrl, setNewNewsUrl] = useState('');
  const [newNewsDesc, setNewNewsDesc] = useState('');

  // 6. Photo Gallery Manager
  const [gallery, setGallery] = useState<{ url: string; caption: string }[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  // 7. Video Gallery & Featured Video
  const [featuredVideoTitle, setFeaturedVideoTitle] = useState('');
  const [featuredVideoSubtitle, setFeaturedVideoSubtitle] = useState('');
  const [featuredVideoUrl, setFeaturedVideoUrl] = useState('');
  const [featuredVideoThumb, setFeaturedVideoThumb] = useState('');
  const [videoList, setVideoList] = useState<VideoItem[]>([]);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoThumb, setNewVideoThumb] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('');

  // 8. Posts & Updates Feed
  const [updates, setUpdates] = useState<any[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostType, setNewPostType] = useState<'Posts' | 'News' | 'Events'>('Posts');
  const [newPostDesc, setNewPostDesc] = useState('');
  const [newPostImage, setNewPostImage] = useState('');

  // 9. Community Stories & Collabs
  const [communityStoriesList, setCommunityStoriesList] = useState<CommunityStoryItem[]>([]);

  // 10. Official Social Media Channels
  const [socialYoutube, setSocialYoutube] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialTwitter, setSocialTwitter] = useState('');
  const [socialFacebook, setSocialFacebook] = useState('');
  const [socialLinkedin, setSocialLinkedin] = useState('');

  // 11. Audience & Creator Metrics
  const [followersCount, setFollowersCount] = useState('0');
  const [followingCount, setFollowingCount] = useState('12');
  const [viewsCount, setViewsCount] = useState('0');
  const [engagementsCount, setEngagementsCount] = useState('0');
  const [storiesCount, setStoriesCount] = useState('0');

  // Accordion Expand/Collapse States (All 11 Modules from Image 1)
  const [openSections, setOpenSections] = useState({
    basicInfo: true,
    education: true,
    experience: true,
    achievements: true,
    news: false,
    gallery: false,
    videos: false,
    posts: true,
    stories: false,
    social: true,
    stats: false,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const scrollToModule = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: true }));
    const el = document.getElementById(`section-${key}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Load Person Details dynamically based on who is logged in
  const loadPersonDetails = (currSession: PersonSession) => {
    const isAnand =
      currSession.slug === 'anand-sahu' ||
      currSession.email?.toLowerCase().includes('anand@') ||
      currSession.name?.trim().toLowerCase() === 'anand sahu';

    // 1. Check custom stored record in bharatbn_people_store
    let found: any = null;
    try {
      const stored = localStorage.getItem('bharatbn_people_store');
      if (stored) {
        const people = JSON.parse(stored);
        if (Array.isArray(people)) {
          found = people.find(
            (p: any) =>
              p.id === currSession.personId ||
              p.slug === currSession.slug ||
              (p.email && p.email.toLowerCase() === currSession.email?.toLowerCase()) ||
              (p.handle && p.handle.toLowerCase() === currSession.handle?.toLowerCase())
          );
        }
      }
    } catch (err) {
      console.error(err);
    }

    // 2. Fallback to pre-seeded profiles in peopleDatabase if not in localStorage store
    if (!found) {
      const slugKey = currSession.slug || currSession.handle?.replace(/^@/, '').toLowerCase() || '';
      if (slugKey && peopleDatabase[slugKey]) {
        found = peopleDatabase[slugKey];
      }
    }

    // Set Profile Identity
    const resolvedName = found?.name || currSession.name || (isAnand ? 'Anand Sahu' : 'Profile Member');
    setName(resolvedName);

    const cleanHandle = (
      found?.handle ||
      currSession.handle ||
      (isAnand ? '@anandsahu' : `@${resolvedName.toLowerCase().replace(/[^a-z0-9]+/g, '')}`)
    ).trim();
    setHandle(cleanHandle.startsWith('@') ? cleanHandle : `@${cleanHandle}`);

    setSlug(
      found?.slug ||
        currSession.slug ||
        (isAnand ? 'anand-sahu' : resolvedName.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
    );
    setRole(found?.role || currSession.role || (isAnand ? 'Nationalist Thinker & Speaker' : 'Public Figure & Speaker'));
    setBadge(found?.badge || currSession.badge || 'Public Figure');
    setLocation(found?.location || currSession.location || (isAnand ? 'New Delhi, India' : ''));
    setQuote(
      found?.quote !== undefined
        ? found.quote
        : currSession.quote !== undefined
        ? currSession.quote
        : isAnand
        ? 'Thoughts for Nation Building and a Stronger India.'
        : ''
    );
    setEmail(found?.email || currSession.email || '');
    setPhone(found?.phone || currSession.phone || '');

    // Website & Bio (Strictly isolate Anand Sahu data from any other user!)
    if (isAnand) {
      setWebsite(found?.website || 'https://anandsahu.com');
      setAboutText(
        found?.aboutText ||
          'Anand Sahu publishes commentary, event updates, and photographs related to public life, social work, and political activities. He is known for his nationalist perspective and active engagement in public discourse and youth initiatives.'
      );
      setAvatarUrl(found?.avatarUrl || currSession.avatarUrl || '/people/anand-sahu-avatar.jpg');
      setCoverUrl(found?.coverUrl || currSession.coverUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80');
      setSocialYoutube(found?.socialLinks?.youtube || 'https://youtube.com/@anandsahu');
      setSocialInstagram(found?.socialLinks?.instagram || 'https://instagram.com/anandsahuindia');
      setSocialTwitter(found?.socialLinks?.twitter || 'https://twitter.com/anandsahu');
      setSocialFacebook(found?.socialLinks?.facebook || 'https://facebook.com/anandsahubppage');
      setSocialLinkedin(found?.socialLinks?.linkedin || 'https://linkedin.com/in/anandsahu');
    } else {
      // Clean isolated attributes for AI, Kashish, or any user
      const userWebsite =
        found?.website && !found.website.includes('anandsahu.com')
          ? found.website
          : currSession.website && !currSession.website.includes('anandsahu.com')
          ? currSession.website
          : '';
      setWebsite(userWebsite);

      const userAbout =
        found?.aboutText && !found.aboutText.includes('Anand Sahu')
          ? found.aboutText
          : currSession.aboutText && !currSession.aboutText.includes('Anand Sahu')
          ? currSession.aboutText
          : '';
      setAboutText(userAbout);

      const userAvatar =
        found?.avatarUrl && !found.avatarUrl.includes('534528741775')
          ? found.avatarUrl
          : currSession.avatarUrl && !currSession.avatarUrl.includes('534528741775')
          ? currSession.avatarUrl
          : '';
      setAvatarUrl(userAvatar);

      const userCover =
        found?.coverUrl ||
        currSession.coverUrl ||
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80';
      setCoverUrl(userCover);

      setSocialYoutube(found?.socialLinks?.youtube || '');
      setSocialInstagram(found?.socialLinks?.instagram || '');
      setSocialTwitter(found?.socialLinks?.twitter || '');
      setSocialFacebook(found?.socialLinks?.facebook || '');
      setSocialLinkedin(found?.socialLinks?.linkedin || '');

      if (currSession.website?.includes('anandsahu.com') || currSession.aboutText?.includes('Anand Sahu')) {
        const cleanedSession = {
          ...currSession,
          website: userWebsite,
          aboutText: userAbout,
          avatarUrl: userAvatar,
        };
        localStorage.setItem('bharatbn_owner_session', JSON.stringify(cleanedSession));
      }
    }

    // 2. Education List
    const loadedEdu = Array.isArray(found?.educationList) && found.educationList.length > 0
      ? found.educationList
      : (found?.education ? [{ id: 'edu-1', degree: found.education, institution: 'Academic Institution', year: 'Verified', description: 'Academic degree and qualification' }] : []);
    setEducationList(loadedEdu);

    // 3. Experience List
    const loadedExp = Array.isArray(found?.experienceList) && found.experienceList.length > 0
      ? found.experienceList
      : (found?.experience ? [{ id: 'exp-1', role: found.experience, organization: 'Organization / Institution', period: 'Ongoing', description: 'Public initiatives & leadership responsibilities' }] : []);
    setExperienceList(loadedExp);

    // 4. Achievements List
    const loadedAch = Array.isArray(found?.achievementsList) && found.achievementsList.length > 0
      ? found.achievementsList
      : (found?.achievements ? [{ id: 'ach-1', title: found.achievements, organization: 'Recognizing Committee', year: 'Awarded', description: 'Recognized achievement and contributions' }] : []);
    setAchievementsList(loadedAch);

    // 5. News & Media Coverage List
    setNewsList(Array.isArray(found?.newsList) ? found.newsList : []);

    // 6. Photo Gallery List
    setGallery(Array.isArray(found?.gallery) ? found.gallery : []);

    // 7. Video Gallery & Featured Video
    setFeaturedVideoTitle(found?.featuredVideo?.title || 'Featured Video');
    setFeaturedVideoSubtitle(found?.featuredVideo?.subtitle || 'Public Address & Keynote');
    setFeaturedVideoUrl(found?.featuredVideo?.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    setFeaturedVideoThumb(
      found?.featuredVideo?.thumbnailUrl ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
    );
    setVideoList(Array.isArray(found?.videoList) ? found.videoList : []);

    // 8. Posts & Updates Feed
    setUpdates(Array.isArray(found?.updates) ? found.updates : []);

    // 9. Community Stories List
    setCommunityStoriesList(Array.isArray(found?.communityStoriesList) ? found.communityStoriesList : []);

    // 11. Audience Stats
    setFollowersCount(found?.followersCount ? String(found.followersCount) : (currSession.followersCount ? String(currSession.followersCount) : '0'));
    setFollowingCount(found?.followingCount ? String(found.followingCount) : (currSession.followingCount ? String(currSession.followingCount) : '12'));
    setViewsCount(found?.viewsCount || currSession.viewsCount || '0');
    setEngagementsCount(found?.engagementsCount || currSession.engagementsCount || '0');
    setStoriesCount(
      found?.communityStoriesList
        ? String(found.communityStoriesList.length)
        : (found?.communityStoriesCount ? String(found.communityStoriesCount) : (currSession.storiesCount ? String(currSession.storiesCount) : '0'))
    );
  };

  // Sync Session on mount and storage events
  useEffect(() => {
    const sync = () => {
      try {
        const stored = localStorage.getItem('bharatbn_owner_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSession(parsed);
          loadPersonDetails(parsed);
        } else {
          setSession(null);
          setName('Personal Profile');
          setHandle('@user');
          setRole('Creator & Public Voice');
          setLocation('India');
          setQuote('');
          setWebsite('');
          setAboutText('');
          setAvatarUrl('');
          setUpdates([]);
        }
      } catch {
        setSession(null);
      }
    };

    sync();
    window.addEventListener('bharatbn_auth_changed', sync);
    return () => window.removeEventListener('bharatbn_auth_changed', sync);
  }, []);

  // Direct Person Cover Upload from Device
  const handlePersonCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCoverUrl(dataUrl);

        try {
          const stored = localStorage.getItem('bharatbn_people_store');
          let people = stored ? JSON.parse(stored) : [];
          const idx = people.findIndex((p: any) => p.slug === slug || p.id === session?.personId);
          if (idx !== -1) {
            people[idx].coverUrl = dataUrl;
          }
          localStorage.setItem('bharatbn_people_store', JSON.stringify(people));

          if (session) {
            const updated = { ...session, coverUrl: dataUrl };
            localStorage.setItem('bharatbn_owner_session', JSON.stringify(updated));
            window.dispatchEvent(new Event('bharatbn_auth_changed'));
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Direct Person Avatar Upload from Device
  const handlePersonAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setAvatarUrl(dataUrl);

        try {
          const stored = localStorage.getItem('bharatbn_people_store');
          let people = stored ? JSON.parse(stored) : [];
          const idx = people.findIndex((p: any) => p.slug === slug || p.id === session?.personId);
          if (idx !== -1) {
            people[idx].avatarUrl = dataUrl;
          }
          localStorage.setItem('bharatbn_people_store', JSON.stringify(people));

          if (session) {
            const updated = { ...session, avatarUrl: dataUrl };
            localStorage.setItem('bharatbn_owner_session', JSON.stringify(updated));
            window.dispatchEvent(new Event('bharatbn_auth_changed'));
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Direct Photo Gallery Upload from Device
  const handleGalleryDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const newPhoto = {
          url: dataUrl,
          caption: newPhotoCaption.trim() || 'Uploaded Photo',
        };
        const nextGallery = [newPhoto, ...gallery];
        setGallery(nextGallery);
        setNewPhotoCaption('');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddPhotoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;
    const newPhoto = {
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || 'Photo',
    };
    setGallery([newPhoto, ...gallery]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
  };

  const handleDeletePhoto = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  // Education Handlers
  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDegree.trim() || !newInstitution.trim()) return;
    const item: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: newDegree.trim(),
      institution: newInstitution.trim(),
      year: newEduYear.trim() || undefined,
      description: newEduDesc.trim() || undefined,
    };
    setEducationList([...educationList, item]);
    setNewDegree('');
    setNewInstitution('');
    setNewEduYear('');
    setNewEduDesc('');
  };

  const handleDeleteEducation = (id: string) => {
    setEducationList(educationList.filter((item) => item.id !== id));
  };

  // Experience Handlers
  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpRole.trim() || !newExpOrg.trim()) return;
    const item: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: newExpRole.trim(),
      organization: newExpOrg.trim(),
      period: newExpPeriod.trim() || undefined,
      description: newExpDesc.trim() || undefined,
    };
    setExperienceList([...experienceList, item]);
    setNewExpRole('');
    setNewExpOrg('');
    setNewExpPeriod('');
    setNewExpDesc('');
  };

  const handleDeleteExperience = (id: string) => {
    setExperienceList(experienceList.filter((item) => item.id !== id));
  };

  // Achievement Handlers
  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchTitle.trim()) return;
    const item: AchievementItem = {
      id: `ach-${Date.now()}`,
      title: newAchTitle.trim(),
      organization: newAchOrg.trim() || undefined,
      year: newAchYear.trim() || undefined,
      description: newAchDesc.trim() || undefined,
    };
    setAchievementsList([...achievementsList, item]);
    setNewAchTitle('');
    setNewAchOrg('');
    setNewAchYear('');
    setNewAchDesc('');
  };

  const handleDeleteAchievement = (id: string) => {
    setAchievementsList(achievementsList.filter((item) => item.id !== id));
  };

  // News Handlers
  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle.trim() || !newNewsSource.trim()) return;
    const item: NewsItem = {
      id: `news-${Date.now()}`,
      title: newNewsTitle.trim(),
      source: newNewsSource.trim(),
      date: newNewsDate.trim() || 'Recently',
      url: newNewsUrl.trim() || undefined,
      description: newNewsDesc.trim() || undefined,
    };
    setNewsList([...newsList, item]);
    setNewNewsTitle('');
    setNewNewsSource('');
    setNewNewsDate('');
    setNewNewsUrl('');
    setNewNewsDesc('');
  };

  const handleDeleteNews = (id: string) => {
    setNewsList(newsList.filter((item) => item.id !== id));
  };

  // Video Playlist Handlers
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle.trim() || !newVideoUrl.trim()) return;
    const item: VideoItem = {
      id: `vid-${Date.now()}`,
      title: newVideoTitle.trim(),
      videoUrl: newVideoUrl.trim(),
      thumbnailUrl:
        newVideoThumb.trim() ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      duration: newVideoDuration.trim() || undefined,
    };
    setVideoList([...videoList, item]);
    setNewVideoTitle('');
    setNewVideoUrl('');
    setNewVideoThumb('');
    setNewVideoDuration('');
  };

  const handleDeleteVideo = (id: string) => {
    setVideoList(videoList.filter((item) => item.id !== id));
  };

  // Posts Handlers
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      type: newPostType,
      title: newPostTitle.trim(),
      desc: newPostDesc.trim(),
      imageUrl: newPostImage.trim() || undefined,
      date: 'Just now',
      likes: 1,
      comments: 0,
      shares: 0,
    };

    setUpdates([newPost, ...updates]);
    setNewPostTitle('');
    setNewPostDesc('');
    setNewPostImage('');
  };

  const handleDeletePost = (id: string) => {
    setUpdates(updates.filter((p) => p.id !== id));
  };

  // Story Handlers
  const handleDeleteStory = (id: string) => {
    setCommunityStoriesList(communityStoriesList.filter((s) => s.id !== id));
  };

  const handleCopyPublicLink = () => {
    const url = `${window.location.origin}/people/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Master Save: Persists all 11 modules to localStorage
  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      const cleanSlug = (
        slug ||
        handle.replace(/^@/, '') ||
        name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') ||
        'profile'
      )
        .toLowerCase()
        .trim();

      const updatedSession: PersonSession = {
        accountType: 'person',
        personId: session?.personId || `BBN-PPL-${Date.now().toString().slice(-6)}`,
        name,
        handle,
        slug: cleanSlug,
        role,
        badge,
        location,
        quote,
        website,
        email,
        phone,
        aboutText,
        avatarUrl,
        coverUrl,
        followersCount,
        followingCount,
        viewsCount,
        engagementsCount,
        storiesCount: String(communityStoriesList.length),
        status: session?.status || 'pending',
        isVerified: session?.isVerified || false,
      };

      try {
        localStorage.setItem('bharatbn_owner_session', JSON.stringify(updatedSession));
        window.dispatchEvent(new Event('bharatbn_auth_changed'));

        // Save into people store with all 11 modules
        const stored = localStorage.getItem('bharatbn_people_store');
        let people = stored ? JSON.parse(stored) : [];
        const idx = people.findIndex((p: any) => p.slug === cleanSlug || p.id === updatedSession.personId);

        const fullRecord = {
          ...updatedSession,
          slug: cleanSlug,
          socialLinks: {
            youtube: socialYoutube.trim(),
            instagram: socialInstagram.trim(),
            twitter: socialTwitter.trim(),
            facebook: socialFacebook.trim(),
            linkedin: socialLinkedin.trim(),
          },
          educationList,
          experienceList,
          achievementsList,
          newsList,
          gallery,
          featuredVideo: {
            title: featuredVideoTitle || 'Featured Video',
            subtitle: featuredVideoSubtitle || 'Public Address & Keynote',
            videoUrl: featuredVideoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            thumbnailUrl:
              featuredVideoThumb ||
              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
          },
          videoList,
          updates,
          communityStoriesList,
          communityStoriesCount: communityStoriesList.length,
          followingCount: Number(followingCount) || 12,
          status: session?.status || 'pending',
          isVerified: session?.isVerified || false,
        };

        if (idx !== -1) {
          people[idx] = { ...people[idx], ...fullRecord };
        } else {
          people.unshift(fullRecord);
        }
        localStorage.setItem('bharatbn_people_store', JSON.stringify(people));
        window.dispatchEvent(new Event('bharatbn_people_updated'));
      } catch (err) {
        console.error(err);
      }

      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 space-y-6">
      {/* Toast Notification when saved */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-emerald-400"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Profile and all 11 modules saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Status Banner for Logged-In Person (Approved status delivered via Notification bell) */}
      {session && session.accountType === 'person' && !session.isVerified && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Profile Under Review:</strong> Your account is submitted for verification in the Admin Console. Once approved, you will receive an instant notification with your Official Blue Checkmark!
            </span>
          </div>
          <Link
            href="/admin/claims?tab=people"
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1"
          >
            <span>Check Admin Queue</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Guest Notice if Not Logged In */}
      {!session && (
        <div className="p-6 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-200 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider bg-orange-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#F95700]" />
              Personal &amp; Public Figure Profile Dashboard
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Manage Your Personal Brand, Thoughts, Posts &amp; Followers
            </h2>
            <p className="text-xs text-slate-600">
              Log in to manage your public figure or personal creator profile on BharatBN™ People Network.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#07213A] hover:bg-[#0C2D4E] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-[#F95700]" />
              <span>Log In as Person</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO BANNER: PERSONAL PROFILE DETAILS OVERLAY                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4">
        <div className="relative h-64 sm:h-72 lg:h-80 w-full bg-slate-900 group overflow-hidden">
          <img
            src={coverUrl}
            alt="Personal Cover Banner"
            className="w-full h-full object-cover object-center transition duration-500 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent pointer-events-none" />

          {/* Top-Right: Upload Cover Button */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <label
              className="px-3.5 py-1.5 rounded-xl bg-slate-950/70 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-md transition cursor-pointer"
              title="Upload Cover Photo from Device"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
              <span>Upload Cover</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePersonCoverUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Bottom-Left: Personal Identity Overlay */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-6 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              {/* Profile Avatar with white ring (Fallback to initial badge if no image) */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-3 sm:border-4 border-white shadow-2xl p-0.5 flex-shrink-0 flex items-center justify-center group/logo overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name || 'Profile'}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-orange-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center rounded-full shadow-inner">
                    {(name || 'U').slice(0, 1).toUpperCase()}
                  </div>
                )}
                <label
                  className="absolute inset-0 bg-slate-950/75 text-white text-[10px] font-bold flex flex-col items-center justify-center opacity-0 group-hover/logo:opacity-100 transition cursor-pointer rounded-full"
                  title="Upload Profile Photo from Device"
                >
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePersonAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Personal Details */}
              <div className="space-y-1 drop-shadow-md min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-md">
                    {name || 'Your Name'}
                  </h1>
                  {session?.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-300 bg-sky-950/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-sky-500/40">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                      <span>{badge} &bull; Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-500/40">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{badge} &bull; Pending Verification</span>
                    </span>
                  )}
                  {handle && <span className="text-xs font-mono text-slate-300 font-semibold">{handle}</span>}
                </div>

                <p className="text-xs sm:text-sm text-slate-200 font-medium drop-shadow-sm">
                  {role} {location ? `• ${location}` : ''}
                </p>

                {/* Public Link + Copy Link */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                  <Link
                    href={`/people/${slug}`}
                    target="_blank"
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 hover:underline inline-flex items-center gap-1 font-mono"
                  >
                    <span>/people/{slug || 'profile'}</span>
                    <ExternalLink className="w-3 h-3 text-orange-400" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleCopyPublicLink}
                    className="text-[11px] text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-medium border border-white/20"
                  >
                    {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Actions: View Live & Save */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 self-center sm:self-end flex-shrink-0">
              <Link
                href={`/people/${slug}`}
                target="_blank"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 transition flex items-center gap-1.5 shadow-sm"
              >
                <span>View Public Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#F95700] hover:bg-[#d94a00] transition shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : saveSuccess ? 'Profile Saved!' : 'Save Profile'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Creator Metric Stat Cards */}
        <div className="px-6 sm:px-8 pb-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 leading-tight">{followersCount}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Followers</div>
            </div>
          </div>

          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 leading-tight">{viewsCount}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Profile Views</div>
            </div>
          </div>

          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 leading-tight">{engagementsCount}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Engagements</div>
            </div>
          </div>

          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 leading-tight">{communityStoriesList.length || storiesCount}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Stories &amp; Collabs</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* QUICK MODULE JUMP NAVIGATION (Matching Image 1's 11 Profile Modules)      */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 space-y-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
          Quick Jump to Profile Modules (Fill in to reflect on your live profile)
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'basicInfo' as const, label: '1. About & Bio', icon: FileText },
            { id: 'education' as const, label: '2. Education', icon: GraduationCap },
            { id: 'experience' as const, label: '3. Experience', icon: Briefcase },
            { id: 'achievements' as const, label: '4. Achievements', icon: Trophy },
            { id: 'news' as const, label: '5. News & Media', icon: Newspaper },
            { id: 'gallery' as const, label: '6. Photo Gallery', icon: Camera },
            { id: 'videos' as const, label: '7. Video Gallery', icon: Video },
            { id: 'posts' as const, label: '8. Posts & Updates', icon: Send },
            { id: 'stories' as const, label: '9. Community Stories', icon: MessageSquare },
            { id: 'social' as const, label: '10. Social Links', icon: Globe },
            { id: 'stats' as const, label: '11. Audience Stats', icon: Users },
          ].map((mod) => (
            <button
              key={mod.id}
              type="button"
              onClick={() => scrollToModule(mod.id)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 text-slate-700 hover:text-[#F95700] text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            >
              <mod.icon className="w-3.5 h-3.5 text-[#F95700]" />
              <span>{mod.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODULE 1: BASIC INFORMATION & BIO (Populates 'About')                     */}
      {/* ========================================================================= */}
      <div id="section-basicInfo" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('basicInfo')}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#F95700] flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">1. Basic Information &amp; Bio Story</h3>
              <p className="text-xs text-slate-500">Public figure display name, handle, role, location, website &amp; story</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveProfile();
              }}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Save Basic Info"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}</span>
            </button>
            <ChevronDown
              className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
                openSections.basicInfo ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {openSections.basicInfo && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. AI / Kashish Saxena"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Handle / Username</label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="e.g. @ai"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Public Role / Category</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Autonomous AI Researcher & Platform Pioneer"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, KA"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Official Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://bharatbn.com/ai"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Badge Label</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. AI Innovator / Public Figure"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">National Quote / Personal Headline</label>
              <input
                type="text"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Share your personal philosophy, motto, or mission headline..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">About Story &amp; Bio</label>
              <textarea
                rows={4}
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                placeholder="Write your story, background, mission, or introduction for followers..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
              />
            </div>

            {/* Bottom Save Action for Basic Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2">
              <span className="text-xs text-slate-500 font-medium">
                Save name, handle, role, location, website, quote &amp; bio story
              </span>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved to Profile!' : 'Save Basic Info & Bio'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODULE 2: EDUCATION & ACADEMIC QUALIFICATIONS                             */}
      {/* ========================================================================= */}
      <div id="section-education" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('education')}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                2. Education &amp; Academic Qualifications ({educationList.length})
              </h3>
              <p className="text-xs text-slate-500">Add degrees, colleges, certifications, and academic background</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveProfile();
              }}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Save Education"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}</span>
            </button>
            <ChevronDown
              className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
                openSections.education ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {openSections.education && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 space-y-6">
            {/* Add Education Form */}
            <form onSubmit={handleAddEducation} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 mt-4">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Add Education Qualification</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={newDegree}
                  onChange={(e) => setNewDegree(e.target.value)}
                  placeholder="Degree (e.g. Neural Architecture / M.A.)"
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
                <input
                  type="text"
                  required
                  value={newInstitution}
                  onChange={(e) => setNewInstitution(e.target.value)}
                  placeholder="Institution / University (e.g. Delhi University / IIT)"
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
                <input
                  type="text"
                  value={newEduYear}
                  onChange={(e) => setNewEduYear(e.target.value)}
                  placeholder="Year / Period (e.g. 2022 - 2024)"
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
              </div>
              <input
                type="text"
                value={newEduDesc}
                onChange={(e) => setNewEduDesc(e.target.value)}
                placeholder="Details, specialization or key achievements..."
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F95700]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Qualification</span>
                </button>
              </div>
            </form>

            {/* List of Added Education Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Qualifications</h4>
              {educationList.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No education records added yet. Use the form above to add your degrees!
                </div>
              ) : (
                educationList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.degree}</h5>
                        {item.year && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                            {item.year}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">{item.institution}</p>
                      {item.description && <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteEducation(item.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Save Action for Education */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2">
              <span className="text-xs text-slate-500 font-medium">
                {educationList.length} qualification(s) saved on public profile
              </span>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved to Profile!' : 'Save Education Qualifications'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODULE 3: PROFESSIONAL & PUBLIC EXPERIENCE                                */}
      {/* ========================================================================= */}
      <div id="section-experience" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('experience')}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                3. Professional &amp; Public Experience ({experienceList.length})
              </h3>
              <p className="text-xs text-slate-500">Add career roles, organizations, periods, and leadership accomplishments</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveProfile();
              }}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Save Experience"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}</span>
            </button>
            <ChevronDown
              className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
                openSections.experience ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {openSections.experience && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 space-y-6">
            {/* Add Experience Form */}
            <form onSubmit={handleAddExperience} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 mt-4">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-600" />
                <span>Add Professional Role</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={newExpRole}
                  onChange={(e) => setNewExpRole(e.target.value)}
                  placeholder="Role / Title (e.g. Lead Architect / Speaker)"
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
                <input
                  type="text"
                  required
                  value={newExpOrg}
                  onChange={(e) => setNewExpOrg(e.target.value)}
                  placeholder="Organization / Entity (e.g. BharatBN Core)"
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
                <input
                  type="text"
                  value={newExpPeriod}
                  onChange={(e) => setNewExpPeriod(e.target.value)}
                  placeholder="Duration (e.g. 2024 - Present)"
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
              </div>
              <input
                type="text"
                value={newExpDesc}
                onChange={(e) => setNewExpDesc(e.target.value)}
                placeholder="Scope of work, key initiatives, and leadership impacts..."
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F95700]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>
            </form>

            {/* List of Added Experience Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Career &amp; Public Work</h4>
              {experienceList.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No experience records added yet. Add your professional roles above!
                </div>
              ) : (
                experienceList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.role}</h5>
                        {item.period && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                            {item.period}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">{item.organization}</p>
                      {item.description && <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteExperience(item.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Save Action for Experience */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2">
              <span className="text-xs text-slate-500 font-medium">
                {experienceList.length} professional experience record(s) listed
              </span>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved to Profile!' : 'Save Professional Experience'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODULE 4: KEY ACHIEVEMENTS & RECOGNITIONS                                  */}
      {/* ========================================================================= */}
      <div id="section-achievements" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('achievements')}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                4. Key Achievements &amp; Recognitions ({achievementsList.length})
              </h3>
              <p className="text-xs text-slate-500">Add awards, state/national honors, milestones, and recognitions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveProfile();
              }}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Save Achievements"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}</span>
            </button>
            <ChevronDown
              className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
                openSections.achievements ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {openSections.achievements && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 space-y-6">
            {/* Add Achievement Form */}
            <form onSubmit={handleAddAchievement} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 mt-4">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-purple-600" />
                <span>Add Achievement / Award</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={newAchTitle}
                  onChange={(e) => setNewAchTitle(e.target.value)}
                  placeholder="Award / Honor Title"
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
                <input
                  type="text"
                  value={newAchOrg}
                  onChange={(e) => setNewAchOrg(e.target.value)}
                  placeholder="Conferred by / Committee"
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
                <input
                  type="text"
                  value={newAchYear}
                  onChange={(e) => setNewAchYear(e.target.value)}
                  placeholder="Year (e.g. 2026)"
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
              </div>
              <input
                type="text"
                value={newAchDesc}
                onChange={(e) => setNewAchDesc(e.target.value)}
                placeholder="Description of the recognition or impact..."
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F95700]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Achievement</span>
                </button>
              </div>
            </form>

            {/* List of Added Achievements */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Recognitions</h4>
              {achievementsList.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No achievements added yet. Highlight your awards above!
                </div>
              ) : (
                achievementsList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">🏆 {item.title}</h5>
                        {item.year && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                            {item.year}
                          </span>
                        )}
                      </div>
                      {item.organization && <p className="text-xs text-slate-600">By: {item.organization}</p>}
                      {item.description && <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteAchievement(item.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Save Action for Achievements */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2">
              <span className="text-xs text-slate-500 font-medium">
                {achievementsList.length} achievement(s) and award(s) highlighted
              </span>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved to Profile!' : 'Save Achievements & Recognitions'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODULE 5: NEWS & MEDIA COVERAGE                                           */}
      {/* ========================================================================= */}
      <div id="section-news" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('news')}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                5. News &amp; Media Coverage ({newsList.length})
              </h3>
              <p className="text-xs text-slate-500">Add press releases, articles, interviews, and public media mentions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveProfile();
              }}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Save News & Media"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}</span>
            </button>
            <ChevronDown
              className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
                openSections.news ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {openSections.news && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 space-y-6">
            {/* Add News Form */}
            <form onSubmit={handleAddNews} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 mt-4">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-rose-600" />
                <span>Add Media Article / Press Release</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={newNewsTitle}
                  onChange={(e) => setNewNewsTitle(e.target.value)}
                  placeholder="Article Headline"
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
                <input
                  type="text"
                  required
                  value={newNewsSource}
                  onChange={(e) => setNewNewsSource(e.target.value)}
                  placeholder="Publication Source (e.g. Economic Times)"
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
                <input
                  type="text"
                  value={newNewsDate}
                  onChange={(e) => setNewNewsDate(e.target.value)}
                  placeholder="Date (e.g. Today / June 2026)"
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="url"
                  value={newNewsUrl}
                  onChange={(e) => setNewNewsUrl(e.target.value)}
                  placeholder="Article Link / External URL"
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
                <input
                  type="text"
                  value={newNewsDesc}
                  onChange={(e) => setNewNewsDesc(e.target.value)}
                  placeholder="Short summary of the news story..."
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Article</span>
                </button>
              </div>
            </form>

            {/* List of News Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Media Coverage</h4>
              {newsList.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No press mentions added yet. Use the form above to add your articles!
                </div>
              ) : (
                newsList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                          {item.source}
                        </span>
                        <span className="text-[11px] text-slate-400">{item.date}</span>
                      </div>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate pt-1">{item.title}</h5>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[#F95700] hover:underline inline-flex items-center gap-1"
                        >
                          <span>{item.url}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteNews(item.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Save Action for News */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2">
              <span className="text-xs text-slate-500 font-medium">
                {newsList.length} media article(s) and press coverage
              </span>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved to Profile!' : 'Save News & Media'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODULE 6: PHOTO GALLERY MANAGER                                           */}
      {/* ========================================================================= */}
      <div id="section-gallery" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('gallery')}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                6. Photo Gallery Manager ({gallery.length})
              </h3>
              <p className="text-xs text-slate-500">Upload high-resolution photographs, event moments, and gallery images</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveProfile();
              }}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Save Photo Gallery"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}</span>
            </button>
            <ChevronDown
              className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
                openSections.gallery ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {openSections.gallery && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 space-y-6">
            {/* Add Photo Form (Supports direct device file upload or URL) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 mt-4">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-teal-600" />
                <span>Add Photos to Gallery</span>
              </span>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Upload from Device */}
                <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer flex-shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>Upload from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryDeviceUpload}
                    className="hidden"
                  />
                </label>

                <span className="text-xs text-slate-400 font-bold uppercase">or via URL</span>

                {/* Photo URL */}
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F95700]"
                />

                <input
                  type="text"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="Caption / Description"
                  className="w-full sm:w-48 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F95700]"
                />

                <button
                  type="button"
                  onClick={handleAddPhotoUrl}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                >
                  Add URL
                </button>
              </div>
            </div>

            {/* Gallery Grid Preview */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Photo Gallery</h4>
              {gallery.length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No photos added yet. Upload your first gallery photo above!
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {gallery.map((photo, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-2xs"
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition p-2 flex flex-col justify-between">
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(idx)}
                          className="self-end p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] text-white font-medium truncate">
                          {photo.caption}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Save Action for Gallery */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2">
              <span className="text-xs text-slate-500 font-medium">
                {gallery.length} photo(s) in personal gallery
              </span>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved to Profile!' : 'Save Photo Gallery'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODULE 7: VIDEO GALLERY & FEATURED VIDEO                                   */}
      {/* ========================================================================= */}
      <div id="section-videos" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('videos')}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                7. Video Gallery &amp; Featured Video ({videoList.length + 1})
              </h3>
              <p className="text-xs text-slate-500">Configure your primary featured video and playlist of keynote speeches</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveProfile();
              }}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Save Video Gallery"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}</span>
            </button>
            <ChevronDown
              className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
                openSections.videos ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {openSections.videos && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 space-y-6">
            {/* Primary Featured Video Settings */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 mt-4">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Play className="w-4 h-4 text-red-600 fill-red-600" />
                <span>Primary Featured Video Card</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Video Headline</label>
                  <input
                    type="text"
                    value={featuredVideoTitle}
                    onChange={(e) => setFeaturedVideoTitle(e.target.value)}
                    placeholder="e.g. Keynote on Nation Building 2026"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F95700]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Subtitle / Event Name</label>
                  <input
                    type="text"
                    value={featuredVideoSubtitle}
                    onChange={(e) => setFeaturedVideoSubtitle(e.target.value)}
                    placeholder="e.g. National Youth Conclave"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F95700]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Video URL (YouTube or stream)</label>
                  <input
                    type="url"
                    value={featuredVideoUrl}
                    onChange={(e) => setFeaturedVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F95700]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Thumbnail Cover Image URL</label>
                  <input
                    type="url"
                    value={featuredVideoThumb}
                    onChange={(e) => setFeaturedVideoThumb(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F95700]"
                  />
                </div>
              </div>
            </div>

            {/* Add to Playlist Form */}
            <form onSubmit={handleAddVideo} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-red-600" />
                <span>Add Additional Video to Playlist</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  placeholder="Video Title"
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
                <input
                  type="url"
                  required
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="YouTube Video URL"
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
                <input
                  type="url"
                  value={newVideoThumb}
                  onChange={(e) => setNewVideoThumb(e.target.value)}
                  placeholder="Thumbnail URL (optional)"
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
                <input
                  type="text"
                  value={newVideoDuration}
                  onChange={(e) => setNewVideoDuration(e.target.value)}
                  placeholder="Duration (e.g. 15:30)"
                  className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F95700]"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Video</span>
                </button>
              </div>
            </form>

            {/* Video List */}
            {videoList.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Video Playlist</h4>
                <div className="space-y-2">
                  {videoList.map((vid) => (
                    <div
                      key={vid.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-16 h-10 rounded-lg bg-slate-900 overflow-hidden relative flex-shrink-0">
                          <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-slate-900 truncate">{vid.title}</h5>
                          {vid.duration && <span className="text-[10px] text-slate-400">{vid.duration}</span>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteVideo(vid.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                        title="Delete Video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Save Action for Videos */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2">
              <span className="text-xs text-slate-500 font-medium">
                Featured keynote video + {videoList.length} video(s) in playlist
              </span>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved to Profile!' : 'Save Video Gallery'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODULE 8: POSTS & UPDATES PUBLISHER                                       */}
      {/* ========================================================================= */}
      <div id="section-posts" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('posts')}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                8. Posts &amp; Updates Publisher ({updates.length})
              </h3>
              <p className="text-xs text-slate-500">Publish articles, announcements, news, and event updates to your feed</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveProfile();
              }}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Save Posts & Updates"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}</span>
            </button>
            <ChevronDown
              className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
                openSections.posts ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {openSections.posts && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 space-y-6">
            {/* Create Post Form */}
            <form onSubmit={handleCreatePost} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#F95700]" />
                  <span>Create New Post / Update</span>
                </span>
                <div className="flex items-center gap-1">
                  {(['Posts', 'News', 'Events'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewPostType(t)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        newPostType === t
                          ? 'bg-[#07213A] text-white'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                required
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Post title or headline..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#F95700]"
              />

              <textarea
                rows={2}
                value={newPostDesc}
                onChange={(e) => setNewPostDesc(e.target.value)}
                placeholder="Write your update description, key takeaways or announcement..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#F95700]"
              />

              <input
                type="url"
                value={newPostImage}
                onChange={(e) => setNewPostImage(e.target.value)}
                placeholder="Optional image URL for this update (https://images.unsplash.com/...)"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#F95700]"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Update</span>
                </button>
              </div>
            </form>

            {/* Live Updates Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Published Posts</h4>
              {updates.length === 0 ? (
                <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No posts published yet. Use the form above to share your first announcement or article!
                </div>
              ) : (
                updates.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-orange-100 text-[#F95700] uppercase">
                          {item.type}
                        </span>
                        <span className="text-xs text-slate-400">{item.date}</span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">{item.title}</h5>
                      <p className="text-xs text-slate-600 line-clamp-2">{item.desc}</p>
                      <div className="flex items-center gap-4 pt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> {item.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" /> {item.comments}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeletePost(item.id)}
                      className="self-end sm:self-center p-2 rounded-xl text-red-500 hover:bg-red-50 transition cursor-pointer"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Save Action for Posts */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2">
              <span className="text-xs text-slate-500 font-medium">
                {updates.length} update(s) and announcements published on your feed
              </span>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved to Profile!' : 'Save Posts & Updates'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODULE 9: COMMUNITY STORIES & COLLABS                                     */}
      {/* ========================================================================= */}
      <div id="section-stories" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('stories')}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                9. Community Stories &amp; Collabs ({communityStoriesList.length})
              </h3>
              <p className="text-xs text-slate-500">Stories, interactions, and testimonials submitted by citizens and followers</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveProfile();
              }}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Save Stories"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}</span>
            </button>
            <ChevronDown
              className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
                openSections.stories ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {openSections.stories && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 space-y-4 pt-4">
            {communityStoriesList.length === 0 ? (
              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center text-xs text-slate-400">
                No community stories received yet. When visitors submit stories on your public profile, they will appear here!
              </div>
            ) : (
              <div className="space-y-3">
                {communityStoriesList.map((st) => (
                  <div
                    key={st.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900">{st.author}</span>
                        {st.role && <span className="text-[10px] text-slate-400">&bull; {st.role}</span>}
                        <span className="text-[10px] text-slate-400">&bull; {st.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 italic leading-relaxed">&ldquo;{st.content}&rdquo;</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteStory(st.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer flex-shrink-0"
                      title="Remove Story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Save Action for Stories */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2">
              <span className="text-xs text-slate-500 font-medium">
                {communityStoriesList.length} community story(ies) displayed on profile
              </span>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved to Profile!' : 'Save Community Stories'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODULE 10: OFFICIAL SOCIAL MEDIA & CHANNELS                               */}
      {/* ========================================================================= */}
      <div id="section-social" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('social')}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">10. Official Social Media &amp; Channels</h3>
              <p className="text-xs text-slate-500">Connect YouTube, Instagram, X (Twitter), Facebook &amp; LinkedIn</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveProfile();
              }}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Save Social Media"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}</span>
            </button>
            <ChevronDown
              className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
                openSections.social ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {openSections.social && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">YouTube Channel URL</label>
              <input
                type="url"
                value={socialYoutube}
                onChange={(e) => setSocialYoutube(e.target.value)}
                placeholder="https://youtube.com/@..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Instagram Profile URL</label>
              <input
                type="url"
                value={socialInstagram}
                onChange={(e) => setSocialInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">X (Twitter) Profile URL</label>
              <input
                type="url"
                value={socialTwitter}
                onChange={(e) => setSocialTwitter(e.target.value)}
                placeholder="https://twitter.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Facebook Page URL</label>
              <input
                type="url"
                value={socialFacebook}
                onChange={(e) => setSocialFacebook(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">LinkedIn Profile URL</label>
              <input
                type="url"
                value={socialLinkedin}
                onChange={(e) => setSocialLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
              />
            </div>

            {/* Bottom Save Action for Social Media */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2 col-span-full">
              <span className="text-xs text-slate-500 font-medium">
                Saves YouTube, Instagram, X (Twitter), Facebook &amp; LinkedIn profile links
              </span>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved to Profile!' : 'Save Social Media Channels'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODULE 11: AUDIENCE & CREATOR METRICS (Populates Followers Tab)           */}
      {/* ========================================================================= */}
      <div id="section-stats" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('stats')}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                11. Followers &amp; Audience Metrics
              </h3>
              <p className="text-xs text-slate-500">Configure public display metrics for followers, following, and views</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveProfile();
              }}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Save Audience Metrics"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}</span>
            </button>
            <ChevronDown
              className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
                openSections.stats ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {openSections.stats && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Followers Count</label>
              <input
                type="text"
                value={followersCount}
                onChange={(e) => setFollowersCount(e.target.value)}
                placeholder="e.g. 5.8K"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Following Count</label>
              <input
                type="text"
                value={followingCount}
                onChange={(e) => setFollowingCount(e.target.value)}
                placeholder="e.g. 12"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Profile Views</label>
              <input
                type="text"
                value={viewsCount}
                onChange={(e) => setViewsCount(e.target.value)}
                placeholder="e.g. 128K+"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Engagements Count</label>
              <input
                type="text"
                value={engagementsCount}
                onChange={(e) => setEngagementsCount(e.target.value)}
                placeholder="e.g. 2.4K"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
              />
            </div>

            {/* Bottom Save Action for Audience Metrics */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2 col-span-full">
              <span className="text-xs text-slate-500 font-medium">
                Saves public follower count, following, profile views, and engagement metrics
              </span>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved to Profile!' : 'Save Audience Metrics'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Save Action Bar - Always visible across entire page */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl z-50 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-300 shadow-2xl p-3.5 sm:p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
            ✓
          </div>
          <span className="text-xs font-semibold text-slate-700 truncate">
            Editing Profile: <strong>{name || 'Personal Profile'}</strong> ({handle || '@user'})
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href={`/people/${slug || 'profile'}`}
            target="_blank"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            Preview Live
          </Link>

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#F95700] hover:bg-[#d94a00] shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved All Modules!' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Auth Modal if guest clicks Log In */}
      <BusinessLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        initialMode="login"
      />
    </div>
  );
}
