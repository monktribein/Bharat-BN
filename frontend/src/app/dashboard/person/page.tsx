'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Share2,
  Eye,
  Users,
  MessageSquare,
  Globe,
  Mail,
  Phone,
  MapPin,
  AtSign,
  Video,
  Image as ImageIcon,
  Award,
  GraduationCap,
  Briefcase,
  Heart,
  Send,
  MoreVertical,
  Check,
  Copy,
  LogIn,
} from 'lucide-react';
import BusinessLoginModal from '@/components/BusinessLoginModal';

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
  avatarUrl?: string;
  coverUrl?: string;
}

export default function PersonDashboardPage() {
  const [session, setSession] = useState<PersonSession | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Profile Form States
  const [name, setName] = useState('Anand Sahu');
  const [handle, setHandle] = useState('@anandsahu');
  const [slug, setSlug] = useState('anand-sahu');
  const [role, setRole] = useState('Nationalist Thinker & Speaker');
  const [badge, setBadge] = useState('Public Figure');
  const [location, setLocation] = useState('New Delhi, India');
  const [quote, setQuote] = useState('Thoughts for Nation Building and a Stronger India.');
  const [website, setWebsite] = useState('https://anandsahu.com');
  const [email, setEmail] = useState('anand@bharatbn.com');
  const [phone, setPhone] = useState('+91 98110 00000');
  const [aboutText, setAboutText] = useState(
    'Anand Sahu publishes commentary, event updates, and photographs related to public life, social work, and political activities. He is known for his nationalist perspective and active engagement in public discourse and youth initiatives.'
  );
  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  );
  const [coverUrl, setCoverUrl] = useState(
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80'
  );

  // Social Links
  const [socialYoutube, setSocialYoutube] = useState('https://youtube.com/@anandsahu');
  const [socialInstagram, setSocialInstagram] = useState('https://instagram.com/anandsahuindia');
  const [socialTwitter, setSocialTwitter] = useState('https://twitter.com/anandsahu');
  const [socialFacebook, setSocialFacebook] = useState('https://facebook.com/anandsahubppage');
  const [socialLinkedin, setSocialLinkedin] = useState('https://linkedin.com/in/anandsahu');

  // Highlights
  const [education, setEducation] = useState('Master of Arts (Political Science) & Public Administration');
  const [experience, setExperience] = useState('Social Work, Policy Thinker & BJP Youth Organization Leadership');
  const [achievements, setAchievements] = useState('Key State-Level Leadership Awards & Social Service Recognitions');

  // Posts & Updates Feed
  const [updates, setUpdates] = useState<any[]>([
    {
      id: 'post-1',
      type: 'News',
      title: 'Guest of Honour at infrastructure awards event in New Delhi',
      desc: 'Addressed the event and shared thoughts on infrastructure and economic development.',
      date: 'June 2026',
      likes: 1840,
      comments: 142,
    },
    {
      id: 'post-2',
      type: 'Events',
      title: 'Visit and meetings in Tashkent on India-Central Asia Cooperation',
      desc: 'Participated in key bilateral dialogues and discussed youth engagement across Eurasia.',
      date: 'May 2026',
      likes: 980,
      comments: 67,
    },
  ]);

  // New Post Form State
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostType, setNewPostType] = useState<'Posts' | 'News' | 'Events'>('Posts');
  const [newPostDesc, setNewPostDesc] = useState('');

  // Accordion Expand/Collapse States
  const [openSections, setOpenSections] = useState({
    basicInfo: true,
    social: true,
    posts: true,
    highlights: true,
    media: false,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Sync Session on mount and storage events
  useEffect(() => {
    const sync = () => {
      try {
        const stored = localStorage.getItem('bharatbn_owner_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSession(parsed);
          if (parsed.name) setName(parsed.name);
          if (parsed.handle) setHandle(parsed.handle);
          if (parsed.slug) setSlug(parsed.slug);
          if (parsed.role) setRole(parsed.role);
          if (parsed.badge) setBadge(parsed.badge);
          if (parsed.location) setLocation(parsed.location);
          if (parsed.quote) setQuote(parsed.quote);
          if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
          if (parsed.coverUrl) setCoverUrl(parsed.coverUrl);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.phone) setPhone(parsed.phone);
        } else {
          setSession(null);
        }
      } catch {
        setSession(null);
      }
    };

    sync();
    window.addEventListener('bharatbn_auth_changed', sync);
    return () => window.removeEventListener('bharatbn_auth_changed', sync);
  }, []);

  const handleCopyPublicLink = () => {
    const url = `${window.location.origin}/people/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      const updatedSession: PersonSession = {
        accountType: 'person',
        personId: session?.personId || 'BBN-PPL-ANAND-SAHU-001',
        name,
        handle,
        slug,
        role,
        badge,
        location,
        quote,
        email,
        phone,
        avatarUrl,
        coverUrl,
      };

      try {
        localStorage.setItem('bharatbn_owner_session', JSON.stringify(updatedSession));
        window.dispatchEvent(new Event('bharatbn_auth_changed'));

        // Also update people store
        const stored = localStorage.getItem('bharatbn_people_store');
        let people = stored ? JSON.parse(stored) : [];
        const idx = people.findIndex((p: any) => p.slug === slug || p.id === updatedSession.personId);
        if (idx !== -1) {
          people[idx] = { ...people[idx], ...updatedSession, website, aboutText };
        } else {
          people.unshift({ ...updatedSession, website, aboutText });
        }
        localStorage.setItem('bharatbn_people_store', JSON.stringify(people));
      } catch (err) {
        console.error(err);
      }

      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 400);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      type: newPostType,
      title: newPostTitle.trim(),
      desc: newPostDesc.trim(),
      date: 'Just now',
      likes: 1,
      comments: 0,
    };

    setUpdates([newPost, ...updates]);
    setNewPostTitle('');
    setNewPostDesc('');
  };

  const handleDeletePost = (id: string) => {
    setUpdates(updates.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Switcher Banner if Logged In as Business */}
      {session && session.accountType === 'business' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              You are currently logged in as a <strong>Business Account</strong>. Manage business operations or switch to personal profile.
            </span>
          </div>
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
          >
            Go to Business Dashboard &rarr;
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

          {/* Top-Right: Edit Cover Button */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const newCover = prompt('Enter image URL for Personal Cover Banner:', coverUrl);
                if (newCover) setCoverUrl(newCover.trim());
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950/70 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
              <span>Edit Cover</span>
            </button>
          </div>

          {/* Bottom-Left: Personal Identity Overlay */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-6 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              {/* Profile Avatar with white ring */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-3 sm:border-4 border-white shadow-2xl p-0.5 flex-shrink-0 flex items-center justify-center group/logo overflow-hidden">
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover rounded-full"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newAvatar = prompt('Enter image URL for Profile Photo / Avatar:', avatarUrl);
                    if (newAvatar) setAvatarUrl(newAvatar.trim());
                  }}
                  className="absolute inset-0 bg-slate-950/75 text-white text-[10px] font-bold flex flex-col items-center justify-center opacity-0 group-hover/logo:opacity-100 transition cursor-pointer rounded-full"
                >
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span>Edit</span>
                </button>
              </div>

              {/* Personal Details */}
              <div className="space-y-1 drop-shadow-md min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-md">
                    {name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-300 bg-sky-950/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-sky-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>{badge}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-300 font-semibold">{handle}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 font-medium drop-shadow-sm">
                  {role} &bull; {location}
                </p>

                {/* Public Link + Copy Link */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                  <Link
                    href={`/people/${slug}`}
                    target="_blank"
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 hover:underline inline-flex items-center gap-1 font-mono"
                  >
                    <span>/people/{slug}</span>
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
              <div className="text-xl font-black text-slate-900 leading-tight">28.4K</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Followers</div>
            </div>
          </div>

          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 leading-tight">1.2M+</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Profile Views</div>
            </div>
          </div>

          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 leading-tight">42.8K</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Engagements</div>
            </div>
          </div>

          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 leading-tight">52</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Stories &amp; Collabs</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MODULE 1: BASIC INFORMATION & BIO (Collapsible Accordion)              */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('basicInfo')}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#F95700] flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Basic Information &amp; Bio</h3>
              <p className="text-xs text-slate-500">Public figure display name, handle, role, location, and thoughts</p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
              openSections.basicInfo ? 'rotate-180' : ''
            }`}
          />
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Handle / Username</label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Public Role / Category</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Official Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Badge Label</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">National Quote / Headline</label>
              <input
                type="text"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">About Story &amp; Bio</label>
              <textarea
                rows={3}
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. MODULE 2: SOCIAL MEDIA & CHANNELS (Collapsible Accordion)              */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
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
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Official Social Media &amp; Channels</h3>
              <p className="text-xs text-slate-500">Connect YouTube, Instagram, X (Twitter), Facebook &amp; LinkedIn</p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
              openSections.social ? 'rotate-180' : ''
            }`}
          />
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
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MODULE 3: POSTS & UPDATES PUBLISHER (Collapsible Accordion)            */}
      {/* ========================================================================= */}
      <div id="new-post" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('posts')}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Publish Posts &amp; Updates ({updates.length})
              </h3>
              <p className="text-xs text-slate-500">Publish articles, event commentary, and public updates to followers</p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
              openSections.posts ? 'rotate-180' : ''
            }`}
          />
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
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Published Posts</h4>
              {updates.map((item) => (
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
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. MODULE 4: HIGHLIGHTS & CREDENTIALS (Collapsible Accordion)             */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('highlights')}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Highlights &amp; Key Credentials</h3>
              <p className="text-xs text-slate-500">Education, organizational experience, and recognized achievements</p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
              openSections.highlights ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openSections.highlights && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 space-y-4 pt-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-sky-600" />
                <span>Education &amp; Qualifications</span>
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-amber-600" />
                <span>Organizational Experience &amp; Roles</span>
              </label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600" />
                <span>Key Achievements &amp; Recognitions</span>
              </label>
              <input
                type="text"
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Save Action Bar */}
      <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
            ✓
          </div>
          <span className="text-xs font-semibold text-slate-700">
            Editing Profile: <strong>{name}</strong> ({handle})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/people/${slug}`}
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
            <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save All Changes'}</span>
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
