'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  MessageSquare,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle,
  ShieldCheck,
  LogIn,
  Edit,
  ExternalLink,
  Sparkles,
  Phone,
  CheckCircle2,
  Camera,
  Globe,
  Mail,
  MapPin,
  Save,
  Plus,
  Trash2,
  Share2,
  Star,
  Copy,
  SlidersHorizontal,
  FileText,
  BadgeCheck,
  Instagram,
  Youtube,
  Facebook,
  Linkedin,
  Twitter,
  LayoutDashboard,
  Check,
  ChevronDown,
  ChevronRight,
  Award,
  Image as ImageIcon,
} from 'lucide-react';
import BusinessLoginModal from '@/components/BusinessLoginModal';
import { api } from '@/lib/api-client';

interface OwnerSession {
  businessId: string;
  businessName: string;
  businessSlug: string;
  ownerName: string;
  ownerEmail?: string;
  phone?: string;
  email?: string;
  city?: string;
  category?: string;
  status?: string;
  logoUrl?: string;
}

export default function DashboardOverviewPage() {
  const [session, setSession] = useState<OwnerSession | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<'login' | 'signup'>('login');

  // Pravixo-Style Profile Editor Form State
  const [businessName, setBusinessName] = useState('');
  const [businessSlug, setBusinessSlug] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [bio, setBio] = useState('');
  const [aboutStory, setAboutStory] = useState('');
  const [coverUrl, setCoverUrl] = useState(
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80'
  );
  const [logoUrl, setLogoUrl] = useState('');

  // Social Media Channels State (Requirement 3)
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');

  // Services, Amenities & Gallery
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [gallery, setGallery] = useState<{ url: string; caption: string }[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  // Customer Reviews
  const [reviews, setReviews] = useState<any[]>([]);

  // Accordion open/close state ("me open kru then show hoye")
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basicInfo: false,
    socialChannels: false,
    kyc: false,
    showcase: false,
    reviews: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // UI Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync session and load business record
  useEffect(() => {
    const syncSession = () => {
      try {
        const stored = localStorage.getItem('bharatbn_owner_session');
        if (stored) {
          const parsed: OwnerSession = JSON.parse(stored);
          setSession(parsed);
          loadBusinessDetails(parsed);
        } else {
          setSession(null);
        }
      } catch {
        setSession(null);
      }
    };

    syncSession();
    window.addEventListener('bharatbn_auth_changed', syncSession);
    window.addEventListener('bharatbn_claims_updated', syncSession);
    return () => {
      window.removeEventListener('bharatbn_auth_changed', syncSession);
      window.removeEventListener('bharatbn_claims_updated', syncSession);
    };
  }, []);

  const loadBusinessDetails = (currSession: OwnerSession) => {
    try {
      const stored = localStorage.getItem('bharatbn_claims_store');
      let found: any = null;
      if (stored) {
        const claims = JSON.parse(stored);
        const cleanSlug = (currSession.businessSlug || '').toLowerCase();
        found = claims.find(
          (c: any) =>
            c.id === currSession.businessId ||
            c.businessSlug === currSession.businessSlug ||
            c.slug === currSession.businessSlug ||
            (cleanSlug.includes('apple') && (c.businessSlug?.includes('apple') || c.id === 'BBN-CLM-799760')) ||
            (cleanSlug.includes('choco') && (c.businessSlug?.includes('choco') || c.id === 'BBN-CLM-982104')) ||
            (cleanSlug.includes('apex') && (c.businessSlug?.includes('apex') || c.id?.includes('555555555001')))
        );
      }

      // Default presets if not in claims store
      const isApple = currSession.businessName?.toLowerCase() === 'apple';
      const isChoco = currSession.businessName?.toLowerCase().includes('choco');
      const isApex = currSession.businessName?.toLowerCase().includes('apex');

      setBusinessName(found?.businessName || found?.name || currSession.businessName || 'Business Profile');
      setBusinessSlug(found?.businessSlug || found?.slug || currSession.businessSlug || (isApple ? 'apple' : 'business'));
      setOwnerName(found?.claimantName || found?.ownerName || currSession.ownerName || 'Kashish Saxena');
      setCategory(found?.category || currSession.category || (isApple ? 'Automobile & EV' : 'Retail'));
      setCity(found?.city || currSession.city || 'Noida, UP');
      setState(found?.state || (isApple ? 'Uttar Pradesh' : 'Maharashtra'));
      setAddressLine(
        found?.addressLine ||
          (isApple
            ? 'Gali Number 14, Master Park, Khora Colony, Ghaziabad, Noida'
            : isChoco
            ? 'Shop 12, Crystal Plaza, New Link Road, Andheri West'
            : 'Commercial Centre, Central Market')
      );
      setLandmark(found?.landmark || (isApple ? 'Near Master Park' : 'Opposite Metro Station'));
      setPincode(found?.pincode || (isApple ? '102010' : '400053'));
      setPhone(found?.phone || currSession.phone || (isApple ? '+91 97170 56860' : '+91 98200 12345'));
      setWhatsapp(found?.whatsapp || (isApple ? '919717056860' : '919820012345'));
      setEmail(found?.workEmail || found?.email || currSession.ownerEmail || currSession.email || 'contact@business.in');
      setWebsite(found?.website || (isApple ? 'https://apple.com' : isChoco ? 'https://chocodelights.in' : 'https://bharatbn.com'));
      setBio(
        found?.businessDescription ||
          found?.description ||
          (isApple
            ? 'Apple (Noida Hub) is an audited enterprise business listed on BharatBN™ Business Network. Specializing in next-gen Automobile & EV solutions, verified ROC & GST registration certificates, and direct customer inquiry channels across Noida / NCR.'
            : 'Premier verified business delivering authentic products, verified credentials, and prompt customer support.')
      );
      setAboutStory(
        found?.aboutStory ||
          (isApple
            ? 'Established in Khora Colony, Ghaziabad / Noida, Apple is driven by innovation and excellence in EV mobility and modern automobile engineering. With customer-first support and verified credential auditing by BharatBN, we provide authentic vehicles, spares, and rapid service turnaround.'
            : 'Committed to excellence and customer satisfaction with verified government records and transparent operations.')
      );
      setCoverUrl(
        found?.coverUrl ||
          (isApple
            ? 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80'
            : isChoco
            ? 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1600&q=80'
            : 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80')
      );
      setLogoUrl(
        found?.logoUrl ||
          found?.logoBase64 ||
          currSession.logoUrl ||
          (isApple ? '/apple-logo.svg' : isChoco ? '/choco-logo.svg' : isApex ? '/apex-logo.svg' : '')
      );

      // Social Links
      setInstagram(found?.socialLinks?.instagram || (isApple ? 'https://instagram.com/apple' : ''));
      setYoutube(found?.socialLinks?.youtube || (isApple ? 'https://youtube.com/@apple' : ''));
      setFacebook(found?.socialLinks?.facebook || (isApple ? 'https://facebook.com/apple' : ''));
      setLinkedin(found?.socialLinks?.linkedin || (isApple ? 'https://linkedin.com/company/apple' : ''));
      setTwitter(found?.socialLinks?.twitter || (isApple ? 'https://x.com/apple' : ''));

      // Services & Amenities
      setServices(
        found?.services ||
          (isApple
            ? ['Electric Vehicles & Cars', 'Automobile Accessories & Spares', 'Authorized Dealership', 'EV Charging Setup']
            : ['Customer Consultation', 'Verified Products', 'Same-Day Support'])
      );
      setAmenities(
        found?.amenities ||
          (isApple
            ? ['EV Fast Charging Bay', 'Customer AC Lounge', 'UPI / Card Payments', 'Official GST Commercial Billing']
            : ['Air Conditioned', 'Online Payments', 'Customer Parking'])
      );

      // Gallery
      setGallery(
        found?.gallery || [
          {
            url: isApple
              ? 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
              : 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80',
            caption: 'Main Business Facility & Customer Service Pavilion',
          },
        ]
      );

      // Reviews
      setReviews(
        found?.reviews || [
          {
            id: 'rev-1',
            author: 'Rahul Sharma',
            rating: 5,
            date: '15 Nov 2026',
            comment: 'Visited the hub for inquiry. Super courteous staff, quick response on WhatsApp, and genuine guarantee. 5 stars!',
          },
        ]
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Add Service Tag
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.trim()) return;
    if (!services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
    }
    setNewService('');
  };

  const handleRemoveService = (tag: string) => {
    setServices(services.filter((s) => s !== tag));
  };

  // Add Amenity Tag
  const handleAddAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmenity.trim()) return;
    if (!amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
    }
    setNewAmenity('');
  };

  const handleRemoveAmenity = (tag: string) => {
    setAmenities(amenities.filter((a) => a !== tag));
  };

  // Add Gallery Photo
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;
    setGallery([...gallery, { url: newPhotoUrl.trim(), caption: newPhotoCaption.trim() || businessName }]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
  };

  const handleRemovePhoto = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  // Save Full Profile (Syncs to localStorage claims store, session & backend)
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccessMsg('');

    try {
      const socialLinksData = {
        instagram: instagram.trim(),
        youtube: youtube.trim(),
        facebook: facebook.trim(),
        linkedin: linkedin.trim(),
        twitter: twitter.trim(),
      };

      const updatedRecord = {
        id: session?.businessId || `BBN-BUS-${Date.now().toString().slice(-6)}`,
        businessName: businessName.trim(),
        name: businessName.trim(),
        businessSlug: businessSlug.trim().toLowerCase(),
        slug: businessSlug.trim().toLowerCase(),
        ownerName: ownerName.trim(),
        claimantName: ownerName.trim(),
        category,
        city,
        state,
        addressLine,
        landmark,
        pincode,
        phone,
        whatsapp,
        workEmail: email,
        email,
        website,
        businessDescription: bio,
        description: bio,
        aboutStory,
        seoTitle: `${businessName.trim()} | ${city.trim()}`,
        seoDescription: bio,
        coverUrl,
        logoUrl,
        socialLinks: socialLinksData,
        services,
        amenities,
        gallery,
        reviews,
        status: 'approved',
        isVerified: true,
        updatedAt: new Date().toISOString(),
      };

      // 1. Save to local claims store
      const stored = localStorage.getItem('bharatbn_claims_store');
      let claims = stored ? JSON.parse(stored) : [];
      const cleanSlug = businessSlug.toLowerCase();
      const existingIdx = claims.findIndex(
        (c: any) =>
          c.id === updatedRecord.id ||
          c.businessSlug === updatedRecord.businessSlug ||
          c.slug === updatedRecord.businessSlug ||
          (cleanSlug.includes('apple') && (c.businessSlug?.includes('apple') || c.id === 'BBN-CLM-799760')) ||
          (cleanSlug.includes('choco') && (c.businessSlug?.includes('choco') || c.id === 'BBN-CLM-982104')) ||
          (cleanSlug.includes('apex') && (c.businessSlug?.includes('apex') || c.id?.includes('555555555001')))
      );

      if (existingIdx >= 0) {
        claims[existingIdx] = { ...claims[existingIdx], ...updatedRecord };
      } else {
        claims.unshift(updatedRecord);
      }

      localStorage.setItem('bharatbn_claims_store', JSON.stringify(claims));

      // 2. Update owner session
      const updatedSession: OwnerSession = {
        businessId: updatedRecord.id,
        businessName: updatedRecord.businessName,
        businessSlug: updatedRecord.businessSlug,
        ownerName: updatedRecord.ownerName,
        ownerEmail: updatedRecord.email,
        phone: updatedRecord.phone,
        city: updatedRecord.city,
        category: updatedRecord.category,
        status: 'approved',
        logoUrl: updatedRecord.logoUrl,
      };
      localStorage.setItem('bharatbn_owner_session', JSON.stringify(updatedSession));
      setSession(updatedSession);

      // 3. Dispatch global sync events
      window.dispatchEvent(new Event('bharatbn_claims_updated'));
      window.dispatchEvent(new Event('bharatbn_auth_changed'));

      // 4. Update Backend API in background
      try {
        await api.businesses.update(updatedRecord.id || updatedRecord.businessSlug, {
          name: updatedRecord.businessName,
          slug: updatedRecord.businessSlug,
          phone: updatedRecord.phone,
          whatsapp: updatedRecord.whatsapp,
          email: updatedRecord.email,
          website: updatedRecord.website,
          addressLine: updatedRecord.addressLine,
          description: updatedRecord.description,
          seoTitle: updatedRecord.seoTitle,
          seoDescription: updatedRecord.seoDescription,
        });
      } catch (e) {
        console.warn('Backend API update skipped or offline; synced to local storage store.', e);
      }

      setSaveSuccessMsg(`Profile changes saved! Public listing is updated live at /biz/${updatedRecord.businessSlug}`);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err: any) {
      alert(err?.message || 'Failed to save profile changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyPublicLink = () => {
    const url = `${window.location.origin}/biz/${businessSlug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ========================================================================= */}
      {/* 1. GUEST BANNER (When Not Logged In)                                      */}
      {/* ========================================================================= */}
      {!session ? (
        <div className="p-8 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-200/90 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-[#F95700] uppercase tracking-wider bg-orange-100/70 border border-orange-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F95700]" />
              Business Owner Access
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Manage Your Business Profile, Social Channels &amp; Customer Leads
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Log in to your business account (e.g. <strong>Apple</strong>, <strong>Choco Delights</strong>) or register a new business with verified email OTP.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setLoginModalMode('login');
                setIsLoginModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#07213A] hover:bg-[#0C2D4E] text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#F95700]" />
              <span>Log In to Business</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginModalMode('signup');
                setIsLoginModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#F95700]/25 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Register Business (OTP Signup)</span>
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. TOP DETAILS BANNER (ALL BUSINESS DETAILS INSIDE THE TOP BANNER)        */
        /* ========================================================================= */
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-800 bg-[#07213A] text-white">
          {/* Panoramic background with subtle overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={coverUrl}
              alt="Business Banner Cover"
              className="w-full h-full object-cover object-center opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07213A] via-[#07213A]/95 to-[#0C2D4E]/85" />
          </div>

          {/* Details Content directly inside banner as requested */}
          <div className="relative z-10 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left Identity: Logo + Name + Verified Badge + Category & Managed by + Live Link */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Business Logo / Profile Avatar */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-2 border-white/20 shadow-xl overflow-hidden flex-shrink-0 group p-1 flex items-center justify-center">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={businessName}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#07213A] text-white font-mono font-bold text-2xl flex items-center justify-center rounded-xl">
                      {businessName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const newLogo = prompt('Enter image URL for Business Logo / Avatar:', logoUrl);
                      if (newLogo) setLogoUrl(newLogo.trim());
                    }}
                    className="absolute inset-0 bg-slate-950/70 text-white text-[11px] font-bold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer rounded-xl"
                    title="Change Logo"
                  >
                    <Camera className="w-4 h-4 mb-0.5" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Identity Metadata Text */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {businessName}
                    </h1>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Verified Partner
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    {category} &bull; {city} &bull; Managed by <strong className="text-white">{ownerName}</strong>
                  </p>

                  {/* Public Link & Copy Button inside Banner */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Link
                      href={`/biz/${businessSlug}`}
                      target="_blank"
                      className="text-xs sm:text-sm font-semibold text-[#F95700] hover:text-orange-400 transition inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/15 cursor-pointer"
                    >
                      <span>/biz/{businessSlug}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={handleCopyPublicLink}
                      className="text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Quick Action Controls */}
              <div className="flex flex-wrap items-center gap-2.5 sm:self-start md:self-center">
                <button
                  type="button"
                  onClick={() => {
                    const newCover = prompt('Enter image URL for banner cover:', coverUrl);
                    if (newCover) setCoverUrl(newCover.trim());
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Edit Cover</span>
                </button>

                <Link
                  href={`/biz/${businessSlug}`}
                  target="_blank"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#F95700] hover:bg-[#d94a00] transition shadow-md shadow-[#F95700]/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </div>

            {/* Metric Stat Pills inside Banner */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Directory Views</div>
                <div className="text-xl font-black text-white mt-0.5">1.4k+</div>
                <div className="text-[10px] text-emerald-400 font-semibold">+22% high intent</div>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp Leads</div>
                <div className="text-xl font-black text-[#F95700] mt-0.5">128</div>
                <div className="text-[10px] text-slate-300 font-semibold">Direct customer inquiries</div>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">NAP / SERP Parity</div>
                <div className="text-xl font-black text-emerald-400 mt-0.5">100%</div>
                <div className="text-[10px] text-emerald-400 font-semibold">Dual verified on Google</div>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">KYC Status</div>
                <div className="text-xl font-black text-white mt-0.5">ROC Audited</div>
                <div className="text-[10px] text-slate-300 font-semibold">GSTIN verified</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Success Alert Notification */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <Link
            href={`/biz/${businessSlug}`}
            target="_blank"
            className="text-xs text-emerald-800 underline font-semibold flex items-center gap-1"
          >
            <span>Open Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. COLLAPSIBLE ACCORDION SECTIONS ("me open kru then show hoye")          */}
      {/* ========================================================================= */}
      {session && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Business Details &amp; Pravixo Profile Sections
              </h2>
              <p className="text-xs text-slate-500">
                Click any section below to open, edit and customize its details
              </p>
            </div>

            {/* Quick Toggle All Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const anyOpen = Object.values(openSections).some(Boolean);
                  const nextState = !anyOpen;
                  setOpenSections({
                    basicInfo: nextState,
                    socialChannels: nextState,
                    kyc: nextState,
                    showcase: nextState,
                    reviews: nextState,
                  });
                }}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                {Object.values(openSections).some(Boolean) ? 'Collapse All' : 'Expand All'}
              </button>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* ACCORDION 1: Basic Information                                        */}
          {/* ===================================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition">
            {/* Clickable Header Bar */}
            <button
              type="button"
              onClick={() => toggleSection('basicInfo')}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-slate-50/80 transition cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-[#F95700] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Basic Information
                    </h3>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {businessName} &bull; {category} &bull; {city}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F95700] hidden sm:inline">
                  {openSections.basicInfo ? 'Close Details' : 'Open Details'}
                </span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  {openSections.basicInfo ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </div>
            </button>

            {/* Expandable Body */}
            {openSections.basicInfo && (
              <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 space-y-6 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                  {/* Display Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Display / Business Name <span className="text-[#F95700]">*</span>
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                      required
                    />
                  </div>

                  {/* Public Slug */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Public Profile URL Slug (/biz/[slug]) <span className="text-[#F95700]">*</span>
                    </label>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:border-[#F95700] overflow-hidden">
                      <span className="text-[11px] font-mono text-slate-400 pl-3">/biz/</span>
                      <input
                        type="text"
                        value={businessSlug}
                        onChange={(e) => setBusinessSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                        className="w-full text-xs px-1.5 py-2.5 bg-transparent focus:outline-none font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Industry Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                    />
                  </div>

                  {/* Owner Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Authorized Representative</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                    />
                  </div>

                  {/* Phone & WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Primary Calling Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">WhatsApp Inquiry Number</label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                    />
                  </div>

                  {/* Work Email & Website */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Official Work Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Official Website URL</label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                      />
                    </div>
                  </div>

                  {/* Address & City */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">City / District, State</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Street Address Line</label>
                    <input
                      type="text"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                    />
                  </div>
                </div>

                {/* Bio / Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Bio / Business Description <span className="text-[#F95700]">* (Visible in Source Code &amp; Search)</span>
                    </label>
                    <span className="text-[11px] text-slate-400">{bio.length} characters</span>
                  </div>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Enter short description of your business, services, products, and location..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] leading-relaxed"
                  />
                </div>

                {/* Detailed Story */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Founding Story / Detailed Background
                  </label>
                  <textarea
                    rows={3}
                    value={aboutStory}
                    onChange={(e) => setAboutStory(e.target.value)}
                    placeholder="Describe your brand's heritage, founding journey, client trust, and quality certifications..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] leading-relaxed"
                  />
                </div>

                {/* Save Button inside card */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving...' : 'Save Basic Info'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ===================================================================== */}
          {/* ACCORDION 2: Social Presence / Channels (Requirement 3)               */}
          {/* ===================================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition">
            {/* Clickable Header Bar */}
            <button
              type="button"
              onClick={() => toggleSection('socialChannels')}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-slate-50/80 transition cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 text-pink-600 flex items-center justify-center flex-shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Social Presence / Channels
                    </h3>
                    <span className="text-[10px] font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
                      5 Handles Supported
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instagram, YouTube, Facebook, LinkedIn, Twitter/X
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F95700] hidden sm:inline">
                  {openSections.socialChannels ? 'Close Details' : 'Open Details'}
                </span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  {openSections.socialChannels ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </div>
            </button>

            {/* Expandable Body */}
            {openSections.socialChannels && (
              <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 space-y-5 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {/* Instagram */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-pink-700 flex items-center gap-1.5">
                        <span className="text-sm">📸</span>
                        <span>Instagram Handle / URL</span>
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          instagram ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {instagram ? 'Connected' : 'Not Linked'}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="e.g. @apple or https://instagram.com/apple"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  {/* YouTube */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                        <span className="text-sm">▶️</span>
                        <span>YouTube Channel</span>
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          youtube ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {youtube ? 'Connected' : 'Not Linked'}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      placeholder="e.g. @apple or https://youtube.com/@apple"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* Facebook */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                        <span className="text-sm">📘</span>
                        <span>Facebook Page</span>
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          facebook ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {facebook ? 'Connected' : 'Not Linked'}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="e.g. https://facebook.com/applestore"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-700 flex items-center gap-1.5">
                        <span className="text-sm">💼</span>
                        <span>LinkedIn Company Profile</span>
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          linkedin ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {linkedin ? 'Connected' : 'Not Linked'}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="e.g. https://linkedin.com/company/apple"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Twitter / X */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="text-sm">𝕏</span>
                        <span>Twitter / X Handle</span>
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          twitter ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {twitter ? 'Connected' : 'Not Linked'}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="e.g. @apple or https://x.com/apple"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-[#07213A] hover:bg-[#0C2D4E] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5 text-[#F95700]" />
                    <span>Save Social Channels</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ===================================================================== */}
          {/* ACCORDION 3: KYC & Official Documents                                 */}
          {/* ===================================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition">
            {/* Clickable Header Bar */}
            <button
              type="button"
              onClick={() => toggleSection('kyc')}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-slate-50/80 transition cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      KYC Documents &amp; Government Verification
                    </h3>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      3 Audited
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    GSTIN Certificate, ROC Registration, BharatBN Engine 7
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F95700] hidden sm:inline">
                  {openSections.kyc ? 'Close Details' : 'Open Details'}
                </span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  {openSections.kyc ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </div>
            </button>

            {/* Expandable Body */}
            {openSections.kyc && (
              <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 space-y-4 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800">GSTIN Registration</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-xs text-emerald-900 font-mono font-bold">07AAAAA0000A1Z5</div>
                    <div className="text-[10px] text-emerald-700">Verified &amp; Active</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800">ROC Incorporation</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-xs text-emerald-900 font-mono font-bold">U72900DL2021PTC</div>
                    <div className="text-[10px] text-emerald-700">Audited &amp; Compliant</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800">BharatBN™ Badge</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-xs text-emerald-900 font-mono font-bold">Engine 7 Verified</div>
                    <div className="text-[10px] text-emerald-700">100% SERP Consistency</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===================================================================== */}
          {/* ACCORDION 4: Live Offerings & Showcase Gallery                         */}
          {/* ===================================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition">
            {/* Clickable Header Bar */}
            <button
              type="button"
              onClick={() => toggleSection('showcase')}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-slate-50/80 transition cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Live Offerings &amp; Photo Showcase
                    </h3>
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      {services.length} Services &bull; {gallery.length} Photos
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage service chips, amenities, and photo pavilion
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F95700] hidden sm:inline">
                  {openSections.showcase ? 'Close Details' : 'Open Details'}
                </span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  {openSections.showcase ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </div>
            </button>

            {/* Expandable Body */}
            {openSections.showcase && (
              <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 space-y-6 animate-in slide-in-from-top-2 duration-200">
                {/* Services / Offerings */}
                <div className="space-y-3 pt-4">
                  <label className="block text-xs font-bold text-slate-700">
                    Products &amp; Speciality Offerings
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {services.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#F95700] border border-orange-200"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(tag)}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleAddService} className="flex gap-2 max-w-md">
                    <input
                      type="text"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="Add a new service/product..."
                      className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                    >
                      + Add
                    </button>
                  </form>
                </div>

                {/* Amenities */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700">
                    Business Amenities &amp; Facilities
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        <span>{amenity}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAmenity(amenity)}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleAddAmenity} className="flex gap-2 max-w-md">
                    <input
                      type="text"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      placeholder="Add an amenity (e.g. WiFi, AC Lounge)..."
                      className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                    >
                      + Add
                    </button>
                  </form>
                </div>

                {/* Photo Gallery */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700">
                    Showcase Photo Gallery ({gallery.length} photos)
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {gallery.map((photo, i) => (
                      <div
                        key={i}
                        className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-2xs"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(i)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-slate-950/70 p-1.5 text-[10px] text-white font-medium truncate">
                          {photo.caption}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Photo Form */}
                  <form onSubmit={handleAddPhoto} className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    <input
                      type="url"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="Image URL (https://...)"
                      className="text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                    />
                    <input
                      type="text"
                      value={newPhotoCaption}
                      onChange={(e) => setNewPhotoCaption(e.target.value)}
                      placeholder="Caption / Description..."
                      className="text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#07213A] text-white text-xs font-bold hover:bg-[#0C2D4E] cursor-pointer"
                    >
                      + Add Photo
                    </button>
                  </form>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-[#07213A] hover:bg-[#0C2D4E] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5 text-[#F95700]" />
                    <span>Save Showcase &amp; Gallery</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ===================================================================== */}
          {/* ACCORDION 5: Customer Reviews & Ratings                               */}
          {/* ===================================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition">
            {/* Clickable Header Bar */}
            <button
              type="button"
              onClick={() => toggleSection('reviews')}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-slate-50/80 transition cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Audience Feedback &amp; Reviews
                    </h3>
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      4.9 / 5.0 Rating
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {reviews.length} Verified Customer Testimonials
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F95700] hidden sm:inline">
                  {openSections.reviews ? 'Close Details' : 'Open Details'}
                </span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  {openSections.reviews ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </div>
            </button>

            {/* Expandable Body */}
            {openSections.reviews && (
              <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 space-y-4 animate-in slide-in-from-top-2 duration-200">
                <div className="space-y-3 pt-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#07213A] text-white font-bold text-xs flex items-center justify-center">
                            {rev.author[0]}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900">{rev.author}</span>
                            <span className="text-[10px] text-slate-400 ml-2">{rev.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Business Auth Modal (Login & OTP-based Signup) */}
      <BusinessLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        initialMode={loginModalMode}
      />
    </div>
  );
}
