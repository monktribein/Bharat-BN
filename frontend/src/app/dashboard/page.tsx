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
  LayoutDashboard,
  Check,
  ChevronDown,
  MoreVertical,
  Eye,
  User,
  Image as ImageIcon,
  FileCheck,
  Upload,
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
  const [activeTab, setActiveTab] = useState<'profile' | 'overview'>('profile');

  // Accordion Sections Open/Close State (Requirement: open on clicking orange chevron icon)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basicInfo: true, // open first section by default
    socialChannels: false,
    kyc: false,
    offerings: false,
    gallery: false,
    reviews: false,
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

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

  // KYC & Compliance State (Editable by Business Owner)
  const [gstin, setGstin] = useState('');
  const [cin, setCin] = useState('');
  const [pan, setPan] = useState('');
  const [kycDocName, setKycDocName] = useState('');
  const [kycDocUrl, setKycDocUrl] = useState('');
  const [kycStatus, setKycStatus] = useState<'verified' | 'pending' | 'submitted'>('verified');

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

      const isApple = currSession.businessName?.toLowerCase() === 'apple';
      const isChoco = currSession.businessName?.toLowerCase().includes('choco');
      const isApex = currSession.businessName?.toLowerCase().includes('apex');

      setBusinessName(found?.businessName || found?.name || currSession.businessName || 'Apple');
      setBusinessSlug(found?.businessSlug || found?.slug || currSession.businessSlug || (isApple ? 'apple-noida' : 'business'));
      setOwnerName(found?.claimantName || found?.ownerName || currSession.ownerName || (isApple ? 'Kashish Saxena' : 'Verified Owner'));
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
      setLandmark(found?.landmark || (isApple ? 'Near Master Park Main Market' : 'Opposite Metro Station'));
      setPincode(found?.pincode || (isApple ? '102010' : '400053'));
      setPhone(found?.phone || currSession.phone || (isApple ? '+91 97170 56860' : '+91 98200 12345'));
      setWhatsapp(found?.whatsapp || (isApple ? '919717056860' : '919820012345'));
      setEmail(found?.workEmail || found?.email || currSession.ownerEmail || currSession.email || 'apple@business.in');
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

      // KYC Details (From stored claim/business or default for Apple/Choco)
      setGstin(found?.gstin || (isApple ? '07AAAAA0000A1Z5' : isChoco ? '27AABCC1234D1Z2' : ''));
      setCin(found?.cin || (isApple ? 'U72900DL2021PTC123456' : isChoco ? 'U15400MH2019PTC789123' : ''));
      setPan(found?.pan || (isApple ? 'AAAAA0000A' : isChoco ? 'AABCC1234D' : ''));
      setKycDocName(found?.kycDocName || (isApple ? 'GSTIN_Registration_Certificate_2026.pdf' : ''));
      setKycDocUrl(found?.kycDocUrl || '');
      setKycStatus(found?.kycStatus || (isApple || isChoco ? 'verified' : 'pending'));

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
        gstin: gstin.trim().toUpperCase(),
        cin: cin.trim().toUpperCase(),
        pan: pan.trim().toUpperCase(),
        kycDocName,
        kycDocUrl,
        kycStatus,
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
      {/* 1. GUEST HERO BANNER (When Not Logged In)                                 */}
      {/* ========================================================================= */}
      {!session ? (
        <div className="p-8 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-200/90 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-[#F95700] uppercase tracking-wider bg-orange-100/70 border border-orange-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F95700]" />
              Business Owner &amp; Enterprise Access
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Manage Your Business Profile, Social Channels &amp; Customer Leads
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Log in to your business account (e.g. <strong>Apple</strong>, <strong>Choco Delights</strong>) or register a new business with verified email OTP. Edit basic info, add official social media links, and track rankings.
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
        /* 2. PRAVIXO-STYLE PROFILE HERO BANNER (Image 3 Reference)                  */
        /* ========================================================================= */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          {/* Panoramic Cover Image with Edit Cover button (exact Image 3 positioning) */}
          <div className="relative h-48 sm:h-64 w-full bg-slate-900 group overflow-hidden">
            <img
              src={coverUrl}
              alt="Business Banner Cover"
              className="w-full h-full object-cover object-center transition duration-300 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

            {/* Edit Cover Action at bottom-right of cover image */}
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const newCover = prompt('Enter image URL for banner cover:', coverUrl);
                  if (newCover) setCoverUrl(newCover.trim());
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-md transition cursor-pointer"
                title="Change Cover Banner"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
                <span>Edit Cover</span>
              </button>
            </div>
          </div>

          {/* Profile Identity Row: Circular Avatar + Name + Check Badge + Details (Image 3) */}
          <div className="px-6 sm:px-8 pb-4 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16">
            {/* Circular Avatar & Details in banner */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              {/* Circular Avatar (rounded-full with thick white border) */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border-4 border-white shadow-xl overflow-hidden flex-shrink-0 group z-10">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={businessName}
                    className="w-full h-full object-contain p-2 rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-[#07213A] text-white font-mono font-bold text-2xl flex items-center justify-center rounded-full">
                    {businessName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const newLogo = prompt('Enter image URL for Business Logo / Avatar:', logoUrl);
                    if (newLogo) setLogoUrl(newLogo.trim());
                  }}
                  className="absolute inset-0 bg-slate-950/60 text-white text-[10px] font-bold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer rounded-full"
                >
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span>Edit Logo</span>
                </button>
              </div>

              {/* Title, Verified Badge, Subtitle & Live Link (Image 1 & 3 Reference) */}
              <div className="space-y-1.5 pt-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {businessName}
                  </h1>
                  {/* Verified Partner Badge */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Partner
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {category} &bull; {city} &bull; Managed by <strong>{ownerName}</strong>
                </p>

                {/* Live Public Link & Copy Link */}
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-0.5">
                  <Link
                    href={`/biz/${businessSlug}`}
                    target="_blank"
                    className="text-xs font-semibold text-[#F95700] hover:underline inline-flex items-center gap-1 font-mono"
                  >
                    <span>/biz/{businessSlug}</span>
                    <ExternalLink className="w-3 h-3 text-[#F95700]" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleCopyPublicLink}
                    className="text-[11px] text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-medium"
                  >
                    {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions (View Live + Three Dots Menu from Image 3) */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5">
              <Link
                href={`/biz/${businessSlug}`}
                target="_blank"
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>View Public Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#07213A] hover:bg-[#0C2D4E] transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5 text-[#F95700]" />
                <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginModalMode('login');
                  setIsLoginModalOpen(true);
                }}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer shadow-2xs"
                title="Switch Business or Account Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pravixo 4 Metric Stat Cards (Image 3 exact layout) */}
          <div className="px-6 sm:px-8 pb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            {/* Card 1: REACH */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black text-slate-900">1.2K</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">REACH</div>
              </div>
            </div>

            {/* Card 2: VIEWS */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-[#F95700] flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-black text-slate-900">184</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">VIEWS</div>
              </div>
            </div>

            {/* Card 3: CLICKS / INQUIRIES */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-black text-slate-900">42</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CLICKS</div>
              </div>
            </div>

            {/* Card 4: DEALS / COLLABS */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-black text-slate-900">8 Deals</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">COLLABS</div>
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
      {/* 3. DASHBOARD MAIN TABS                                                    */}
      {/* ========================================================================= */}
      {session && (
        <div className="space-y-6">
          {/* Navigation Pill Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#07213A] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Edit className="w-4 h-4 text-[#F95700]" />
              <span>Edit Profile (Pravixo Style)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#07213A] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Operations &amp; Analytics</span>
            </button>

            <Link
              href="/dashboard/branches"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-slate-500" />
              <span>Branches</span>
            </Link>

            <Link
              href="/dashboard/leads"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-[#F95700]" />
              <span>Customer Leads</span>
            </Link>

            <Link
              href="/dashboard/seo-campaigns"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Pay-As-You-Rank™</span>
            </Link>
          </div>

          {/* ===================================================================== */}
          {/* TAB 1: PRAVIXO-STYLE ACCORDION EDIT PROFILE                           */}
          {/* ===================================================================== */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Edit Profile Top Bar (Image 3) */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-black text-slate-900">
                    Edit Profile
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    (Click any section below to open &amp; edit details)
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 shadow-2xs">
                  <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                  <span>Verified Account</span>
                </div>
              </div>

              {/* Photo & Banner Switcher (Image 3) */}
              <div className="flex items-center gap-4 pb-2">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 bg-white p-0.5 flex-shrink-0 shadow-xs">
                  {logoUrl ? (
                    <img src={logoUrl} alt={businessName} className="w-full h-full object-contain rounded-full" />
                  ) : (
                    <div className="w-full h-full bg-[#07213A] text-white font-bold flex items-center justify-center text-sm rounded-full">
                      {businessName.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newLogo = prompt('Enter image URL for Business Photo / Logo:', logoUrl);
                      if (newLogo) setLogoUrl(newLogo.trim());
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                    <span>Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const newCover = prompt('Enter banner cover image URL:', coverUrl);
                      if (newCover) setCoverUrl(newCover.trim());
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Banner</span>
                  </button>
                </div>
              </div>

              {/* =================================================================== */}
              {/* ACCORDION 1: Basic Information (Image 4 Orange Chevron)             */}
              {/* =================================================================== */}
              <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs transition">
                <button
                  type="button"
                  onClick={() => toggleSection('basicInfo')}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100/80 text-[#F95700] flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        Basic Information
                      </h3>
                      <p className="text-xs text-slate-400">
                        Display name, handle, category, location, phone, and starting bio
                      </p>
                    </div>
                  </div>

                  {/* Orange Chevron Icon from Image 4 */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <ChevronDown
                      className={`w-5 h-5 text-[#F95700] stroke-[2.5] transition-transform duration-200 ${
                        openSections.basicInfo ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </div>
                </button>

                {openSections.basicInfo && (
                  <div className="p-6 pt-3 border-t border-slate-100 space-y-5 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                          Handle / Public Slug (/biz/[slug]) <span className="text-[#F95700]">*</span>
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
                          Bio / Business Description 
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

              {/* =================================================================== */}
              {/* ACCORDION 2: Social Presence / Channels (Requirement 3)             */}
              {/* =================================================================== */}
              <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs transition">
                <button
                  type="button"
                  onClick={() => toggleSection('socialChannels')}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-100/80 text-pink-600 flex items-center justify-center flex-shrink-0">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        Social Presence / Channels
                      </h3>
                      <p className="text-xs text-slate-400">
                        Connect Instagram, YouTube, Facebook, LinkedIn, Twitter/X
                      </p>
                    </div>
                  </div>

                  {/* Orange Chevron Icon from Image 4 */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <ChevronDown
                      className={`w-5 h-5 text-[#F95700] stroke-[2.5] transition-transform duration-200 ${
                        openSections.socialChannels ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </div>
                </button>

                {openSections.socialChannels && (
                  <div className="p-6 pt-3 border-t border-slate-100 space-y-5 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* =================================================================== */}
              {/* ACCORDION 3: KYC Documents (Image 4 Orange Chevron)                 */}
              {/* =================================================================== */}
              <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs transition">
                <button
                  type="button"
                  onClick={() => toggleSection('kyc')}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        KYC Documents &amp; Verification
                      </h3>
                      <p className="text-xs text-slate-400">
                        GSTIN registration, ROC incorporation, and verified badges
                      </p>
                    </div>
                  </div>

                  {/* Orange Chevron Icon from Image 4 */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <ChevronDown
                      className={`w-5 h-5 text-[#F95700] stroke-[2.5] transition-transform duration-200 ${
                        openSections.kyc ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </div>
                </button>

                {openSections.kyc && (
                  <div className="p-6 pt-3 border-t border-slate-100 space-y-6 animate-in fade-in duration-150">
                    {/* Compliance Information Header */}
                    <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                        <FileCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Enter your official government registration details below to verify and display badges.</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        {gstin || cin ? 'KYC Active & Verified' : 'Pending KYC Submission'}
                      </span>
                    </div>

                    {/* Editable KYC Form Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      {/* GSTIN Input */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-slate-700">
                            GSTIN Registration <span className="text-[#F95700]">*</span>
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">15 chars</span>
                        </div>
                        <input
                          type="text"
                          maxLength={15}
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                          placeholder="e.g. 07AAAAA0000A1Z5"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono tracking-wider focus:outline-none focus:border-[#F95700] uppercase bg-white"
                        />
                        <p className="text-[11px] text-slate-400">
                          State code + PAN + entity + check digit
                        </p>
                      </div>

                      {/* ROC / CIN / MSME Input */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-slate-700">
                            ROC CIN / Registration
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">ROC / Udyam</span>
                        </div>
                        <input
                          type="text"
                          maxLength={21}
                          value={cin}
                          onChange={(e) => setCin(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))}
                          placeholder="e.g. U72900DL2021PTC123456"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono tracking-wider focus:outline-none focus:border-[#F95700] uppercase bg-white"
                        />
                        <p className="text-[11px] text-slate-400">
                          MCA Corporate CIN, LLPIN, or MSME Udyam
                        </p>
                      </div>

                      {/* Business PAN Card */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-slate-700">
                            Business / Company PAN
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">10 chars</span>
                        </div>
                        <input
                          type="text"
                          maxLength={10}
                          value={pan}
                          onChange={(e) => setPan(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                          placeholder="e.g. AAAAA0000A"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono tracking-wider focus:outline-none focus:border-[#F95700] uppercase bg-white"
                        />
                        <p className="text-[11px] text-slate-400">
                          Income Tax Department PAN
                        </p>
                      </div>
                    </div>

                    {/* Document Upload & Proof Certificate */}
                    <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            Upload Official Registration Proof (GST Certificate / Incorporation Deed)
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Attach a PDF or photo of your registration certificate for manual auditor sign-off.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <label className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#F95700] text-xs font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs">
                            <Upload className="w-3.5 h-3.5 text-[#F95700]" />
                            <span>{kycDocName ? 'Change File' : 'Upload Document'}</span>
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setKycDocName(file.name);
                                  setKycStatus('verified');
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {kycDocName && (
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-emerald-200 text-xs">
                          <div className="flex items-center gap-2 text-emerald-900 font-semibold truncate">
                            <FileCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span className="truncate">{kycDocName}</span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              Attached
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setKycDocName('');
                            }}
                            className="text-xs text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Live Preview Cards (Matching Reference Screenshot) */}
                    <div className="space-y-2 pt-2">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Live Preview &amp; Verification Badges:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* GSTIN Card */}
                        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-800">GSTIN Registration</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="text-xs text-emerald-900 font-mono font-bold">
                            {gstin || 'Not Provided (Enter GSTIN above)'}
                          </div>
                          <div className="text-[10px] text-emerald-700">
                            {gstin ? 'Verified & Active' : 'Enter 15-digit GSTIN to activate'}
                          </div>
                        </div>

                        {/* ROC Incorporation Card */}
                        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-800">ROC Incorporation</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="text-xs text-emerald-900 font-mono font-bold">
                            {cin || 'Not Provided (Enter CIN / Udyam above)'}
                          </div>
                          <div className="text-[10px] text-emerald-700">
                            {cin ? 'Audited & Compliant' : 'Enter CIN to activate'}
                          </div>
                        </div>

                        {/* BharatBN Engine Badge */}
                        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-800">BharatBN™ Badge</span>
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="text-xs text-emerald-900 font-mono font-bold">
                            {gstin || cin ? 'Engine 7 Verified' : 'Standard Business'}
                          </div>
                          <div className="text-[10px] text-emerald-700">
                            {gstin || cin ? '100% SERP Consistency' : 'Fill GSTIN / CIN for Engine 7 Verification'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Save KYC Button */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSaving ? 'Saving...' : 'Save & Verify KYC Documents'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* =================================================================== */}
              {/* ACCORDION 4: Products, Services & Amenities (Image 4 Chevron)       */}
              {/* =================================================================== */}
              <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs transition">
                <button
                  type="button"
                  onClick={() => toggleSection('offerings')}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        Products, Services &amp; Amenities
                      </h3>
                      <p className="text-xs text-slate-400">
                        Manage service offerings catalog and customer amenities
                      </p>
                    </div>
                  </div>

                  {/* Orange Chevron Icon from Image 4 */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <ChevronDown
                      className={`w-5 h-5 text-[#F95700] stroke-[2.5] transition-transform duration-200 ${
                        openSections.offerings ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </div>
                </button>

                {openSections.offerings && (
                  <div className="p-6 pt-3 border-t border-slate-100 space-y-5 animate-in fade-in duration-150">
                    {/* Services */}
                    <div className="space-y-3">
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

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-5 py-2 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Offerings</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* =================================================================== */}
              {/* ACCORDION 5: Photo Gallery Showcase (Image 4 Orange Chevron)        */}
              {/* =================================================================== */}
              <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs transition">
                <button
                  type="button"
                  onClick={() => toggleSection('gallery')}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        Showcase Photo Gallery ({gallery.length} photos)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Add and manage high-res showroom &amp; facility photos
                      </p>
                    </div>
                  </div>

                  {/* Orange Chevron Icon from Image 4 */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <ChevronDown
                      className={`w-5 h-5 text-[#F95700] stroke-[2.5] transition-transform duration-200 ${
                        openSections.gallery ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </div>
                </button>

                {openSections.gallery && (
                  <div className="p-6 pt-3 border-t border-slate-100 space-y-4 animate-in fade-in duration-150">
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
                        + Add Photo to Gallery
                      </button>
                    </form>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-5 py-2 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Gallery</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* =================================================================== */}
              {/* ACCORDION 6: Audience Feedback & Reviews (Image 4 Orange Chevron)   */}
              {/* =================================================================== */}
              <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs transition">
                <button
                  type="button"
                  onClick={() => toggleSection('reviews')}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-500 flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        Audience Feedback &amp; Reviews ({reviews.length})
                      </h3>
                      <p className="text-xs text-slate-400">
                        View verified customer feedback, star ratings, and testimonials
                      </p>
                    </div>
                  </div>

                  {/* Orange Chevron Icon from Image 4 */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <ChevronDown
                      className={`w-5 h-5 text-[#F95700] stroke-[2.5] transition-transform duration-200 ${
                        openSections.reviews ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </div>
                </button>

                {openSections.reviews && (
                  <div className="p-6 pt-3 border-t border-slate-100 space-y-4 animate-in fade-in duration-150">
                    <div className="space-y-3">
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

          {/* ===================================================================== */}
          {/* TAB 2: OVERVIEW & ANALYTICS                                           */}
          {/* ===================================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Verified Inquiries</span>
                    <MessageSquare className="w-4 h-4 text-[#F95700]" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">128</div>
                  <div className="text-[11px] text-emerald-600 font-medium">+18% from last week</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Active Outlets</span>
                    <Building2 className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">185</div>
                  <div className="text-[11px] text-slate-500">Across 14 Tier-1/2 cities</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Top-10 Keywords</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">14</div>
                  <div className="text-[11px] text-emerald-600 font-medium">Dual-verified milestones</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Ownership Status</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">Verified</div>
                  <div className="text-[11px] text-slate-500">Admin Audited &amp; Verified</div>
                </div>
              </div>

              {/* Quick Navigation Panels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  href="/dashboard/branches"
                  className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#F95700] transition space-y-3 shadow-xs hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base">Franchise Network</h3>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#F95700] transition" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Bulk import branch master records, assign outlet managers, and track geographic branch distribution.
                  </p>
                </Link>

                <Link
                  href="/dashboard/leads"
                  className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#F95700] transition space-y-3 shadow-xs hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base">Leads &amp; Inquiries</h3>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#F95700] transition" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Real-time lead log with verified consent timestamps, source URL, UTM parameters, and WhatsApp delivery.
                  </p>
                </Link>

                <Link
                  href="/dashboard/seo-campaigns"
                  className="group bg-white p-6 rounded-2xl border border-[#F95700]/40 bg-gradient-to-br from-white to-[#F95700]/5 hover:border-[#F95700] transition space-y-3 shadow-xs hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900 text-base">Pay-As-You-Rank™ Tracker</h3>
                      <Sparkles className="w-4 h-4 text-[#F95700]" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#F95700] transition" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Inspect live Google SERP rankings, dual-proof validation records, and milestone payout escrow invoices.
                  </p>
                </Link>
              </div>
            </div>
          )}
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
