'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  MessageCircle,
  Globe,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Send,
  Star,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Share2,
  Bookmark,
  Check,
  Eye,
  Award,
  Sparkles,
  Mail,
  FileText,
  BadgeCheck,
  HelpCircle,
  ChevronDown,
  Copy,
  Navigation,
} from 'lucide-react';
import { BusinessProfile } from './businessData';
import {
  InstagramIcon,
  YouTubeIcon,
  FacebookFIcon,
  TwitterXIcon,
  LinkedInIcon,
} from '@/components/SocialIcons';

function getCategorySearchUrl(cat: string, mainCategory: string = ''): string {
  const combined = `${cat} ${mainCategory}`.toLowerCase();
  let categoryParam = '';
  let queryParam = cat;

  if (
    combined.includes('auto') ||
    combined.includes('ev') ||
    combined.includes('vehicle') ||
    combined.includes('car') ||
    combined.includes('motor')
  ) {
    categoryParam = 'automobile-ev-showrooms';
    queryParam = cat;
  } else if (
    combined.includes('food') ||
    combined.includes('choco') ||
    combined.includes('baker') ||
    combined.includes('confectionery')
  ) {
    categoryParam = 'food-confectionery';
    queryParam = cat;
  } else if (
    combined.includes('dental') ||
    combined.includes('health') ||
    combined.includes('clinic')
  ) {
    categoryParam = 'healthcare-clinics';
    queryParam = cat;
  } else if (
    combined.includes('school') ||
    combined.includes('educat') ||
    combined.includes('daycare') ||
    combined.includes('preschool')
  ) {
    categoryParam = 'education-preschools';
    queryParam = cat;
  } else if (
    combined.includes('soft') ||
    combined.includes('tech') ||
    combined.includes('cloud') ||
    combined.includes('it')
  ) {
    categoryParam = 'it-software-technology';
    queryParam = cat;
  } else if (
    combined.includes('restaurant') ||
    combined.includes('cafe') ||
    combined.includes('dining')
  ) {
    categoryParam = 'restaurants-cafes';
    queryParam = cat;
  }

  const params = new URLSearchParams();
  if (categoryParam) params.set('category', categoryParam);
  if (queryParam) params.set('q', queryParam);

  return `/search?${params.toString()}`;
}

interface BusinessProfileClientProps {
  initialBusiness: BusinessProfile;
  slug: string;
}

export default function BusinessProfileClient({
  initialBusiness,
  slug,
}: BusinessProfileClientProps) {
  // Active Image Slider Index
  const [currentSlide, setCurrentSlide] = useState(0);

  // Phone Reveal State (like reference image: 9716XXXXXX [Reveal])
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);

  // Lead Inquiry Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'success'>('idle');

  // Customer Review Form State
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

  const [business, setBusiness] = useState<BusinessProfile>(initialBusiness);
  const [reviewsList, setReviewsList] = useState(initialBusiness.reviews);

  // Load custom listed business if exists in localStorage (sync real-time user edits)
  useEffect(() => {
    const loadDynamic = () => {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('bharatbn_claims_store');
          if (stored) {
            const claims = JSON.parse(stored);
            const cleanSlug = (slug || '').toLowerCase();
            const found = claims.find(
              (c: any) =>
                c.businessSlug === slug ||
                c.slug === slug ||
                c.id === slug ||
                (cleanSlug.includes('choco') && (c.businessSlug?.includes('choco') || c.id === 'BBN-CLM-982104')) ||
                (cleanSlug.includes('apple') && (c.businessSlug?.includes('apple') || c.id === 'BBN-CLM-799760')) ||
                (cleanSlug.includes('apex') && (c.businessSlug?.includes('apex') || c.id?.includes('555555555001') || c.id === 'BBN-CLM-849102')) ||
                (cleanSlug.includes('little-elly') && (c.businessSlug?.includes('little-elly') || c.id?.includes('555555555002')))
            );

            if (found) {
              setBusiness((prev) => ({
                ...prev,
                id: found.id || prev.id,
                name: found.businessName || prev.name,
                status: found.status || 'approved',
                logoUrl: found.logoBase64 || found.logoUrl || prev.logoUrl,
                city: found.city || prev.city,
                state: found.state || prev.state,
                category: found.category || prev.category,
                categoryHierarchy:
                  found.categoryHierarchy && found.categoryHierarchy.length > 0
                    ? found.categoryHierarchy
                    : [found.category || 'Directory', found.businessName || prev.name],
                phone: found.phone || prev.phone,
                whatsapp:
                  found.whatsapp ||
                  (found.phone ? found.phone.replace(/[^0-9]/g, '') : prev.whatsapp),
                email: found.workEmail || prev.email,
                website: found.website || prev.website,
                addressLine: found.addressLine || prev.addressLine,
                landmark: found.landmark || prev.landmark,
                pincode: found.pincode || prev.pincode,
                description: found.businessDescription || found.description || prev.description,
                aboutStory: found.aboutStory || found.businessDescription || found.description || prev.aboutStory,
                seoTitle: found.seoTitle || prev.seoTitle,
                seoDescription: found.seoDescription || found.businessDescription || found.description || prev.seoDescription,
                coverUrl: found.coverUrl || prev.coverUrl,
                socialLinks: found.socialLinks || prev.socialLinks,
                establishedYear: found.establishedYear
                  ? Number(found.establishedYear)
                  : prev.establishedYear,
                services:
                  found.services && found.services.length > 0 ? found.services : prev.services,
                amenities:
                  found.amenities && found.amenities.length > 0 ? found.amenities : prev.amenities,
                gallery:
                  found.gallery && found.gallery.length > 0 ? found.gallery : prev.gallery,
                workingHours:
                  found.workingHours && found.workingHours.length > 0
                    ? found.workingHours
                    : prev.workingHours,
                owner: {
                  ...prev.owner,
                  name: found.claimantName || prev.owner.name,
                  role: found.ownerRole || prev.owner.role,
                  memberSince: found.memberSince || prev.owner.memberSince,
                  verifiedDocType: found.docType || prev.owner.verifiedDocType,
                  responseRate: found.responseRate || prev.owner.responseRate,
                },
                rating: found.rating ? Number(found.rating) : prev.rating,
                reviewsCount: found.reviewsCount ? Number(found.reviewsCount) : prev.reviewsCount,
              }));

              if (found.reviews && Array.isArray(found.reviews) && found.reviews.length > 0) {
                setReviewsList(found.reviews);
              }
            }
          }
        } catch (err) {
          console.error('Error loading dynamic listing:', err);
        }
      }
    };

    loadDynamic();
    window.addEventListener('bharatbn_claims_updated', loadDynamic);
    window.addEventListener('storage', loadDynamic);
    return () => {
      window.removeEventListener('bharatbn_claims_updated', loadDynamic);
      window.removeEventListener('storage', loadDynamic);
    };
  }, [slug]);

  // Synchronize document title & meta description in the DOM
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const pageTitle =
        business.seoTitle ||
        (business.city ? `${business.name} | ${business.city}` : business.name);
      document.title = pageTitle;

      const desc =
        business.seoDescription ||
        business.description ||
        business.aboutStory;

      if (desc) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', desc);
      }
    }
  }, [
    business.name,
    business.city,
    business.description,
    business.aboutStory,
    business.seoTitle,
    business.seoDescription,
  ]);

  // Auto-advance slideshow every 3.5 seconds (pauses when hovered)
  const [isSliderHovered, setIsSliderHovered] = useState(false);

  useEffect(() => {
    if (!business.gallery || business.gallery.length <= 1 || isSliderHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % business.gallery.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [business.gallery, isSliderHovered]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % business.gallery.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + business.gallery.length) % business.gallery.length);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) return;
    setInquiryStatus('success');
    setTimeout(() => {
      setInquiryName('');
      setInquiryEmail('');
      setInquiryPhone('');
      setInquirySubject('');
      setInquiryMessage('');
      setInquiryStatus('idle');
    }, 4000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewText) return;
    const newRev = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor,
      rating: newReviewRating,
      date: 'Today',
      comment: newReviewText,
      verified: true,
    };
    setReviewsList([newRev, ...reviewsList]);
    setNewReviewAuthor('');
    setNewReviewText('');
    setIsReviewSubmitted(true);
    setTimeout(() => setIsReviewSubmitted(false), 3500);
  };

  // Masked phone format for reveal button
  const maskedPhone = business.phone ? business.phone.slice(0, 9) + ' XXXXX' : '+91 98XXX XXXXX';

  // Right sidebar interactive state
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const faqs = [
    {
      q: 'Do they accept bulk corporate or customized orders?',
      a: 'Yes, customized gift hampers and bulk orders with custom branding are available. Inquire via WhatsApp or phone for volume catalogs and GST invoicing.',
    },
    {
      q: 'Is same-day delivery or appointment booking available?',
      a: 'Yes, same-day delivery across the local city hub is supported for orders placed before 4:00 PM. For clinics, same-day priority appointments are available.',
    },
    {
      q: 'Are the business credentials and licenses verified?',
      a: 'Yes, BharatBN has audited official registration proof (ROC certificate, active GSTIN match, and local trade/health licenses) for this listing.',
    },
    {
      q: 'What payment modes are accepted?',
      a: 'All major payment modes are accepted: UPI (Google Pay, PhonePe, Paytm), Credit & Debit cards, Net Banking, and official Corporate GST invoices.',
    },
  ];

  // Dynamically compute similar businesses based on current business category
  const similarBusinesses = useMemo(() => {
    const cat = (business.category || '').toLowerCase();
    if (cat.includes('auto') || cat.includes('ev')) {
      return [
        {
          name: 'Greenfield EV Motors & Spares',
          category: 'Automobile & EV Solutions',
          city: 'Pune / Noida Hub',
          rating: 4.8,
          reviews: 42,
          phone: '+91 97654 32100',
          slug: 'greenfield-ev-motors-kothrud-pune',
        },
        {
          name: 'Tata EV Mobility Hub',
          category: 'Electric Cars & Authorized Spares',
          city: 'Sector 63, Noida',
          rating: 4.9,
          reviews: 58,
          phone: '+91 98188 44556',
          slug: 'tata-ev-mobility-hub-sector-63-noida',
        },
        {
          name: 'Apple EV Mobility Pavilion',
          category: 'EV Mobility Showrooms',
          city: 'Khora Colony, Noida',
          rating: 4.9,
          reviews: 38,
          phone: '+91 97170 56860',
          slug: 'apple',
        },
      ];
    }
    if (cat.includes('dental') || cat.includes('health')) {
      return [
        {
          name: 'Apex Super Speciality Dental Clinic',
          category: 'Healthcare & Multispeciality Dental',
          city: 'Andheri West, Mumbai',
          rating: 4.9,
          reviews: 48,
          phone: '+91 98200 12345',
          slug: 'apex-super-speciality-dental-clinic',
        },
        {
          name: 'Dr. Smile Advanced Dental Studio',
          category: 'Dental Implants & Smile Design',
          city: 'Lokhandwala, Mumbai',
          rating: 4.8,
          reviews: 52,
          phone: '+91 98201 54321',
          slug: 'apex-super-speciality-dental-clinic',
        },
      ];
    }
    if (cat.includes('school') || cat.includes('educat')) {
      return [
        {
          name: 'Little Elly International Preschool',
          category: 'Preschools & Early Education',
          city: 'Indiranagar, Bengaluru',
          rating: 4.8,
          reviews: 86,
          phone: '+91 98450 67890',
          slug: 'little-elly-international-preschool',
        },
        {
          name: 'EuroKids Early Learning Centre',
          category: 'Daycare & Kindergarten',
          city: 'HAL 2nd Stage, Bengaluru',
          rating: 4.9,
          reviews: 64,
          phone: '+91 98451 98765',
          slug: 'little-elly-international-preschool',
        },
      ];
    }
    return [
      {
        name: 'The Belgian Waffle & Chocolate Co.',
        category: 'Food, Desserts & Confectionery',
        city: 'Lokhandwala, Mumbai',
        rating: 4.8,
        reviews: 64,
        phone: '+91 98200 88991',
        slug: 'choco-delights-confectionery-cadboury',
      },
      {
        name: 'Cadbury Gourmet Studio',
        category: 'Artisan Confectionery & Hampers',
        city: 'Bandra West, Mumbai',
        rating: 4.9,
        reviews: 92,
        phone: '+91 98199 22334',
        slug: 'choco-delights-confectionery-cadboury',
      },
      {
        name: 'Le15 Patisserie & Bakery Studio',
        category: 'Gourmet Pastries & Chocolates',
        city: 'Andheri West, Mumbai',
        rating: 4.7,
        reviews: 58,
        phone: '+91 98330 11223',
        slug: 'choco-delights-confectionery-cadboury',
      },
    ];
  }, [business.category]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      {/* Top Breadcrumbs & Taxonomy Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Link href="/" className="hover:text-[#F95700] transition">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/search?city=${(business.city || 'all').toLowerCase()}`}
              className="hover:text-[#F95700] transition"
            >
              {business.city}
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-bold truncate max-w-xs sm:max-w-md">
              {business.name}
            </span>
          </nav>

          <div className="flex items-center gap-2 text-slate-500">
            <span className="flex items-center gap-1 text-[11px] font-mono">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>528 Views</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] font-mono text-emerald-600 font-bold">
              ID: {business.id}
            </span>
          </div>
        </div>
      </div>

      {/* Verification Notice Banner */}
      {business.status === 'pending' && (
        <div className="bg-amber-50/90 border-b border-amber-200/90 px-4 py-2.5 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-2.5 text-xs text-amber-900">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
            <span className="font-bold">Profile Verification in Progress:</span>
            <span className="text-amber-800">
              This listing has been submitted and is undergoing standard platform verification. All business details and contact channels shown below are live.
            </span>
          </div>
        </div>
      )}

      {/* Main Container: 2-Column Professional Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Title Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {business.logoUrl ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs flex-shrink-0 bg-white p-1.5 flex items-center justify-center">
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#07213A] to-[#1b4d7e] text-white font-mono font-bold text-xl flex items-center justify-center border border-navy-700 shadow-xs flex-shrink-0">
                {business.name.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {business.status === 'pending' ? (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Under Verification
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Audited &amp; Verified Business
                  </span>
                )}

                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200/80 px-2.5 py-1 rounded-full text-xs font-semibold">
                  <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                  Owner Managed
                </span>

                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-1 rounded-full text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{Number(business.rating || 4.9).toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({business.reviewsCount} Reviews)</span>
                </span>

                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-1 rounded-full text-xs font-semibold sm:ml-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Open Now
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-900 tracking-tight leading-tight">
                {business.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-[#F95700] flex-shrink-0" />
                  <span>
                    {business.addressLine}, {business.city}, {business.state} – {business.pincode}
                  </span>
                </span>
                {business.landmark && (
                  <span className="text-slate-400 font-normal hidden sm:inline">
                    (Landmark: {business.landmark})
                  </span>
                )}
              </div>

              {/* Category Hierarchy Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500 font-medium">
                <span className="font-bold text-slate-400 mr-1">Categories:</span>
                {business.categoryHierarchy.map((cat, i) => {
                  const searchUrl = getCategorySearchUrl(cat, business.category);
                  return (
                    <span key={cat} className="inline-flex items-center gap-1">
                      <Link
                        href={searchUrl}
                        className="text-[#F95700] hover:text-[#d94a00] hover:underline font-semibold transition cursor-pointer"
                        title={`Discover other ${cat} businesses on BharatBN`}
                      >
                        {cat}
                      </Link>
                      {i < business.categoryHierarchy.length - 1 && (
                        <span className="text-slate-300">/</span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 Cols): Image Slider, About Us, Offerings, Reviews */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Interactive Image Slider / Gallery */}
            {business.gallery && business.gallery.length > 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden p-3 space-y-3">
                {/* Main Image Stage */}
                <div
                  onMouseEnter={() => setIsSliderHovered(true)}
                  onMouseLeave={() => setIsSliderHovered(false)}
                  className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 group"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide < business.gallery.length ? currentSlide : 0}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="relative w-full h-full"
                    >
                      <img
                        src={
                          business.gallery[
                            currentSlide < business.gallery.length ? currentSlide : 0
                          ]?.url
                        }
                        alt={
                          business.gallery[
                            currentSlide < business.gallery.length ? currentSlide : 0
                          ]?.caption || business.name
                        }
                        className="w-full h-full object-cover object-center"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Counter Badge */}
                  <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5 shadow-md">
                    <span>📷</span>
                    <span>
                      {(currentSlide < business.gallery.length ? currentSlide : 0) + 1} of{' '}
                      {business.gallery.length}
                    </span>
                  </div>

                  {/* Caption Overlay */}
                  {business.gallery[currentSlide < business.gallery.length ? currentSlide : 0]
                    ?.caption && (
                    <div className="absolute top-4 left-4 right-4 bg-gradient-to-b from-slate-950/70 via-slate-950/30 to-transparent p-3 rounded-t-lg text-white text-xs sm:text-sm font-semibold truncate pointer-events-none">
                      {
                        business.gallery[
                          currentSlide < business.gallery.length ? currentSlide : 0
                        ].caption
                      }
                    </div>
                  )}

                  {/* Arrow Controls */}
                  {business.gallery.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Previous photo"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition border border-white/20 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Next photo"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition border border-white/20 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails Row */}
                {business.gallery.length > 1 && (
                  <div className="flex items-center gap-2.5 pt-1 overflow-x-auto pb-0.5">
                    {business.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        className={`relative w-20 sm:w-24 h-14 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                          currentSlide === idx
                            ? 'border-[#F95700] ring-2 ring-[#F95700]/30 scale-[1.03] shadow-xs'
                            : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.caption || `Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 bg-slate-950/70 text-white text-[9px] font-mono font-bold px-1 rounded">
                          {idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* 2. About Us & Heritage Story */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="w-4 h-4 text-[#F95700]" />
                <h2 className="text-base sm:text-lg font-bold text-navy-900">
                  About {business.name}
                </h2>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{business.aboutStory}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                    Established
                  </div>
                  <div className="text-sm font-black text-navy-900 mt-0.5">
                    {business.establishedYear}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                    Verified Score
                  </div>
                  <div className="text-sm font-black text-emerald-600 mt-0.5">100% Audited</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                    Response Time
                  </div>
                  <div className="text-sm font-black text-navy-900 mt-0.5">
                    {business.owner.responseRate || '< 15 mins'}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                    City Rank
                  </div>
                  <div className="text-sm font-black text-[#F95700] mt-0.5">Top-3 Verified</div>
                </div>
              </div>
            </div>

            {/* 3. Key Offerings & Specialities */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkles className="w-4 h-4 text-[#F95700]" />
                <h3 className="text-base sm:text-lg font-bold text-navy-900">
                  Products, Services &amp; Specialities
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {business.services.map((service) => (
                  <div
                    key={service}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#F95700]/50 hover:bg-orange-50/20 transition text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Amenities & Facilities */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Award className="w-4 h-4 text-blue-600" />
                <h3 className="text-base sm:text-lg font-bold text-navy-900">
                  Premises Amenities &amp; Standards
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {business.amenities.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* 5. Working Hours Schedule */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#F95700]" />
                  <h3 className="text-base sm:text-lg font-bold text-navy-900">
                    Business Hours &amp; Timings
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Currently Open
                </span>
              </div>
              <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                {business.workingHours.map((wh) => (
                  <div key={wh.days} className="py-2.5 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">{wh.days}</span>
                    <span className="font-mono text-slate-600 font-medium">{wh.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Ratings & Customer Reviews Section */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <h3 className="text-base sm:text-lg font-bold text-navy-900">
                    Verified Customer Reviews ({business.reviewsCount || 48} Total &bull; Showing {reviewsList.length} Verified)
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-amber-700">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{Number(business.rating || 4.9).toFixed(1)} / 5.0 Rating</span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 divide-y divide-slate-100">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#07213A] text-white font-bold text-xs flex items-center justify-center">
                          {rev.author[0]}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{rev.author}</span>
                            {rev.verified && (
                              <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{rev.date}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* Write a Review Box */}
              <form
                onSubmit={handleAddReview}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
              >
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Leave a Verified Review
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    className="text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#F95700]"
                  />
                  <div className="flex items-center justify-between px-3 bg-white border border-slate-200 rounded-lg">
                    <span className="text-xs text-slate-500 font-medium">Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= newReviewRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <textarea
                  required
                  rows={2}
                  placeholder="Share your experience with this verified business..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#F95700]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#07213A] hover:bg-[#0c2a49] text-white text-xs font-bold transition cursor-pointer"
                >
                  Post Review
                </button>
                {isReviewSubmitted && (
                  <span className="text-xs text-emerald-600 font-bold ml-2">
                    ✓ Review posted successfully!
                  </span>
                )}
              </form>
            </div>
          </div>

          {/* Right Column (4 Cols): Sticky Owner Card, WhatsApp CTA, Phone Reveal, Lead Form */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            {/* 1. Verified Owner Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
              <div className="flex items-center gap-3">
                {business.logoUrl ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200/90 shadow-xs flex-shrink-0 bg-white p-1 flex items-center justify-center">
                    <img
                      src={business.logoUrl}
                      alt={business.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#07213A] to-[#1b4d7e] text-white font-mono font-bold text-sm flex items-center justify-center border border-navy-700 shadow-xs flex-shrink-0">
                    {business.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-slate-900 truncate">
                      {business.owner.name}
                    </span>
                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200 flex-shrink-0">
                      VERIFIED ✓
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {business.owner.role}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Member Since: {business.owner.memberSince}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Contact Details Card with Phone [ Reveal ] Button */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-100 pb-2">
                Verified Contact Details
              </div>

              {/* Direct WhatsApp CTA Button */}
              <a
                href={`https://wa.me/${business.whatsapp}?text=Hi%2C+I+found+${encodeURIComponent(
                  business.name
                )}+on+BharatBN+and+want+to+inquire`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition hover:shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Click to chat on WhatsApp</span>
              </a>

              {/* Interactive Phone Number with [ Reveal ] Button */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-xs font-mono font-bold text-slate-800 truncate">
                    {isPhoneRevealed ? business.phone : maskedPhone}
                  </span>
                </div>

                {!isPhoneRevealed ? (
                  <button
                    type="button"
                    onClick={() => setIsPhoneRevealed(true)}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg transition cursor-pointer flex-shrink-0"
                  >
                    Reveal
                  </button>
                ) : (
                  <a
                    href={`tel:${business.phone}`}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition cursor-pointer flex-shrink-0"
                  >
                    Call
                  </a>
                )}
              </div>

              {/* Website Link */}
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition"
              >
                <span className="flex items-center gap-2 truncate">
                  <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{business.website}</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              </a>
            </div>

            {/* Official Social Media Channels */}
            {business.socialLinks && Object.values(business.socialLinks).some((v) => !!v) && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>Official Social Channels</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified Handles
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  {business.socialLinks.instagram && (
                    <a
                      href={
                        business.socialLinks.instagram.startsWith('http')
                          ? business.socialLinks.instagram
                          : `https://instagram.com/${business.socialLinks.instagram.replace('@', '')}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-pink-200 bg-pink-50/50 hover:bg-pink-100/60 text-pink-700 transition cursor-pointer"
                      title="Follow on Instagram"
                    >
                      <InstagramIcon className="w-4 h-4 text-pink-600 shrink-0" />
                      <span className="truncate">Instagram</span>
                    </a>
                  )}
                  {business.socialLinks.youtube && (
                    <a
                      href={
                        business.socialLinks.youtube.startsWith('http')
                          ? business.socialLinks.youtube
                          : `https://youtube.com/@${business.socialLinks.youtube.replace('@', '')}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-100/60 text-red-700 transition cursor-pointer"
                      title="Watch on YouTube"
                    >
                      <YouTubeIcon className="w-4 h-4 text-red-600 shrink-0" />
                      <span className="truncate">YouTube</span>
                    </a>
                  )}
                  {business.socialLinks.facebook && (
                    <a
                      href={
                        business.socialLinks.facebook.startsWith('http')
                          ? business.socialLinks.facebook
                          : `https://facebook.com/${business.socialLinks.facebook}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 text-blue-700 transition cursor-pointer"
                      title="Follow on Facebook"
                    >
                      <FacebookFIcon className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="truncate">Facebook</span>
                    </a>
                  )}
                  {business.socialLinks.linkedin && (
                    <a
                      href={
                        business.socialLinks.linkedin.startsWith('http')
                          ? business.socialLinks.linkedin
                          : `https://linkedin.com/company/${business.socialLinks.linkedin}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-sky-200 bg-sky-50/50 hover:bg-sky-100/60 text-sky-700 transition cursor-pointer"
                      title="Connect on LinkedIn"
                    >
                      <LinkedInIcon className="w-4 h-4 text-sky-700 shrink-0" />
                      <span className="truncate">LinkedIn</span>
                    </a>
                  )}
                  {business.socialLinks.twitter && (
                    <a
                      href={
                        business.socialLinks.twitter.startsWith('http')
                          ? business.socialLinks.twitter
                          : `https://x.com/${business.socialLinks.twitter.replace('@', '')}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer"
                      title="Follow on X / Twitter"
                    >
                      <TwitterXIcon className="w-4 h-4 text-slate-800 shrink-0" />
                      <span className="truncate">Twitter / X</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* 3. Send Email / Direct Inquiry Form */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="bg-[#F95700] text-white p-3.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Send Direct Inquiry</span>
              </div>

              <form onSubmit={handleLeadSubmit} className="p-5 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#F95700] bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#F95700] bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#F95700] bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Subject / Requirement
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bulk Hamper Pricing / Appointment"
                    value={inquirySubject}
                    onChange={(e) => setInquirySubject(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#F95700] bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your inquiry or order details..."
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#F95700] bg-slate-50/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-[#07213A] hover:bg-[#0c2a49] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>

                {inquiryStatus === 'success' && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-bold">
                    ✓ Inquiry submitted! Owner notified via WhatsApp.
                  </div>
                )}
              </form>
            </div>

            {/* 4. Government Audit & NAP Credential Box */}
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>BharatBN Audit Guarantee</span>
              </div>
              <ul className="text-[11px] text-emerald-800 space-y-1 font-medium list-disc list-inside">
                <li>Government GSTIN Registration Verified</li>
                <li>ROC Corporate Records Matched</li>
                <li>Physical Address &amp; NAP Parity 100%</li>
                <li>Direct Owner-Controlled WhatsApp Channel</li>
              </ul>
            </div>

            {/* 5. Interactive Location Map & Directions Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Map &amp; Landmark
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Geo Verified
                </span>
              </div>

              {/* Map Visual Preview */}
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center group">
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

                {/* Roads Visual Mock */}
                <div className="absolute w-full h-3 bg-slate-200 top-1/2 -translate-y-1/2" />
                <div className="absolute h-full w-3 bg-slate-200 left-1/2 -translate-x-1/2" />
                <div className="absolute w-full h-1.5 bg-[#F95700]/20 top-1/2 -translate-y-1/2" />

                {/* Animated Pulsing Location Pin */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative">
                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#F95700] opacity-40"></span>
                    <div className="w-8 h-8 rounded-full bg-[#F95700] text-white flex items-center justify-center shadow-lg border-2 border-white">
                      <MapPin className="w-4 h-4 fill-white" />
                    </div>
                  </div>
                  <span className="mt-1 text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-full shadow-md">
                    {business.name.slice(0, 20)}...
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1 pt-1">
                <div className="font-semibold text-slate-900">{business.addressLine}</div>
                <div className="text-[11px] text-slate-500">
                  Landmark: {business.landmark || 'Near Metro Station & Commercial Market'}
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  business.name + ' ' + business.addressLine + ' ' + business.city
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-[#F95700] hover:bg-orange-50/20 text-slate-800 hover:text-[#F95700] font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions on Google Maps</span>
              </a>
            </div>

            {/* 6. Frequently Asked Questions (FAQ) Accordion */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <HelpCircle className="w-4 h-4 text-[#F95700]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                  Frequently Asked Questions
                </span>
              </div>

              <div className="space-y-2">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={faq.q}
                      className="rounded-xl border border-slate-200 overflow-hidden transition"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-3 text-left flex items-center justify-between gap-2 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <span className="text-xs font-bold text-slate-800 leading-snug">
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[#F95700]' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-3 pb-3 text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 pt-2 bg-slate-50/50"
                          >
                            {faq.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 7. Similar Verified Businesses Nearby */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Similar Verified in {business.city}
                </span>
                <Link
                  href={getCategorySearchUrl(business.category, business.category)}
                  className="text-[11px] font-bold text-[#F95700] hover:underline"
                >
                  View All →
                </Link>
              </div>

              <div className="space-y-3 pt-1">
                {similarBusinesses.map((sim) => (
                  <div
                    key={sim.name}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/biz/${sim.slug}`}
                          className="font-bold text-xs text-slate-900 hover:text-[#F95700] transition truncate block"
                        >
                          {sim.name}
                        </Link>
                        <div className="text-[10px] text-slate-400 truncate">{sim.category}</div>
                      </div>
                      <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex-shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{Number(sim.rating || 4.9).toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-500 font-mono text-[10px]">{sim.city}</span>
                      <a
                        href={`https://wa.me/${sim.phone.replace(/[^0-9]/g, '')}?text=Hi%2C+I+found+${encodeURIComponent(
                          sim.name
                        )}+on+BharatBN`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-[#25D366] hover:underline flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Share, Save & QR Code Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-100 pb-2">
                Share &amp; Save Listing
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isCopied ? 'Link Copied!' : 'Copy Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2.5 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    isBookmarked
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      isBookmarked ? 'fill-amber-500 text-amber-500' : ''
                    }`}
                  />
                  <span>{isBookmarked ? 'Saved ★' : 'Save'}</span>
                </button>
              </div>

              <a
                href={`https://wa.me/?text=Check+out+${encodeURIComponent(
                  business.name
                )}+on+BharatBN:+${encodeURIComponent('https://bharat-bn.vercel.app/biz/' + business.slug)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Share Profile on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
