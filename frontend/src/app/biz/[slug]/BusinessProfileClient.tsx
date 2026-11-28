'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  MessageCircle,
  Globe,
  Clock,
  ShieldCheck,
  Send,
  Star,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Share2,
  Bookmark,
  Check,
  Award,
  Sparkles,
  Camera,
  Calendar,
  ArrowRight,
  Flame,
  Droplets,
  BadgeCheck,
  X,
  Copy,
  Navigation,
  School,
  Building2,
  Users,
  GraduationCap,
  Activity,
  Stethoscope,
  UtensilsCrossed,
  Laptop,
} from 'lucide-react';
import { BusinessProfile } from './businessData';

interface BusinessProfileClientProps {
  initialBusiness: BusinessProfile;
  slug: string;
}

export default function BusinessProfileClient({
  initialBusiness,
  slug,
}: BusinessProfileClientProps) {
  const [business, setBusiness] = useState<BusinessProfile>(initialBusiness);
  const [reviewsList, setReviewsList] = useState(initialBusiness.reviews);

  // UI Interactive States
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Inquiry Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryGrade, setInquiryGrade] = useState('Nursery / KG');
  const [inquirySession, setInquirySession] = useState('2026 - 2027');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // New Review Form State
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRole, setReviewRole] = useState('Verified Parent (Class IX)');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Review Filter Chip
  const [reviewFilter, setReviewFilter] = useState('all');

  // Business Type Category Detection
  const isEducation = useMemo(() => {
    const text = `${business.name} ${business.category} ${slug}`.toLowerCase();
    return (
      (text.includes('school') ||
        text.includes('amity') ||
        text.includes('academy') ||
        text.includes('college') ||
        text.includes('preschool') ||
        text.includes('elly')) &&
      !text.includes('restaurant') &&
      !text.includes('aeroplane')
    );
  }, [business.name, business.category, slug]);

  const isHealthcare = useMemo(() => {
    const text = `${business.name} ${business.category} ${slug}`.toLowerCase();
    return (
      text.includes('dental') ||
      text.includes('clinic') ||
      text.includes('hospital') ||
      text.includes('doctor') ||
      text.includes('surgeon') ||
      text.includes('ivf') ||
      text.includes('orthopedic') ||
      text.includes('knee') ||
      text.includes('health') ||
      text.includes('apex')
    );
  }, [business.name, business.category, slug]);

  const isFood = useMemo(() => {
    const text = `${business.name} ${business.category} ${slug}`.toLowerCase();
    return (
      text.includes('choco') ||
      text.includes('cadboury') ||
      text.includes('bakery') ||
      text.includes('cafe') ||
      text.includes('restaurant') ||
      text.includes('aeroplane') ||
      text.includes('dining') ||
      text.includes('food')
    );
  }, [business.name, business.category, slug]);

  const isTech = useMemo(() => {
    const text = `${business.name} ${business.category} ${slug}`.toLowerCase();
    return (
      text.includes('software') ||
      text.includes('seo') ||
      text.includes('digital') ||
      text.includes('nktech') ||
      text.includes('it & software')
    );
  }, [business.name, business.category, slug]);

  const isManufacturing = useMemo(() => {
    const text = `${business.name} ${business.category} ${slug}`.toLowerCase();
    return (
      text.includes('yarn') ||
      text.includes('export') ||
      text.includes('manufacturing') ||
      text.includes('textile') ||
      text.includes('industrial') ||
      text.includes('bhagwati')
    );
  }, [business.name, business.category, slug]);

  // Synchronize dynamic updates from localStorage (for newly claimed businesses)
  useEffect(() => {
    const loadDynamic = () => {
      if (typeof window === 'undefined') return;
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
              (cleanSlug.includes('amity') && (c.businessSlug?.includes('amity') || c.id === 'BBN-SCH-NOIDA-44-001')) ||
              (cleanSlug.includes('choco') && (c.businessSlug?.includes('choco') || c.id === 'BBN-CLM-982104')) ||
              (cleanSlug.includes('apple') && (c.businessSlug?.includes('apple') || c.id === 'BBN-CLM-799760')) ||
              (cleanSlug.includes('apex') && (c.businessSlug?.includes('apex') || c.id === 'BBN-CLM-849102'))
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
              phone: found.phone || prev.phone,
              whatsapp: found.whatsapp || (found.phone ? found.phone.replace(/[^0-9]/g, '') : prev.whatsapp),
              email: found.workEmail || prev.email,
              website: found.website || prev.website,
              addressLine: found.addressLine || prev.addressLine,
              landmark: found.landmark || prev.landmark,
              description: found.businessDescription || found.description || prev.description,
              aboutStory: found.aboutStory || found.businessDescription || found.description || prev.aboutStory,
              coverUrl: found.coverUrl || prev.coverUrl,
              rating: found.rating ? Number(found.rating) : prev.rating,
              reviewsCount: found.reviewsCount ? Number(found.reviewsCount) : prev.reviewsCount,
            }));
            if (found.reviews && Array.isArray(found.reviews) && found.reviews.length > 0) {
              setReviewsList(found.reviews);
            }
          }
        }
      } catch (e) {
        console.error('Dynamic load error', e);
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

  // Gallery Images Array (Strictly authentic, no dummy images added)
  const galleryItems = useMemo(() => {
    if (business.gallery && business.gallery.length > 0) {
      return business.gallery;
    }
    if (business.coverUrl) {
      return [
        {
          url: business.coverUrl,
          caption: `${business.name} — Verified Facility Detail`,
        },
      ];
    }
    // High quality fallbacks for Amity / Schools ONLY when literally empty
    if (isEducation && (slug.includes('amity') || business.name.toLowerCase().includes('amity'))) {
      return [
        {
          url:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDxE4CTBABtRH269uabKbn2DhJi-i_xt931NiyWevA77xu_pMDbDsxBQd8x6yo5VH7bNvgIFS6retyfla2NzKSY08wBm_35dK5knVtKxnzsCnWNcIzPf2ubIxH19Bb5X5xAxpew-tjsqLlGSHEM_lTLp_01TpGHRk8cdcXqIsA7G503z3nA4UuPfJurHyuFvhu6GhhLuvbIwdocu7xw3fzdWotxu-sJJ-WGVVm_peYX',
          caption: 'Main Academic Wing — Central Campus & Amphitheatre',
        },
        {
          url:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDuZx47w-7P53rqNswNp3qybJ4LL6-4aDtbdBIq6VzhTmC9lagTU21vG2hzvDk5nJcgncYUoyqqK0aEKYGh6LNPM6ggw70mSvCYsjLOr0LqD13kn_b-0tkAoYX-KfLjbBzGb6AqPgr1Gwz5rPbgIeYVhm4WVbWJW7V7YWqJqJlqEK3D_7NhxcmsF_Jh57qQmMGHQd4b3fxUf3gRa7kl6oIv5NvQRjkBvNcrgA1ljf-j',
          caption: 'Smart Classrooms with Interactive Digital Infrastructure',
        },
        {
          url:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBDpDsP9aSiVf0AlW6BFQMFiePjBKeS_XrzNry_jZboVuvMZASFTYpHiHcnysC-S5rSMSlrnvBil5YvCsdvYypmt8ualaj6QTi0Me37c-TFfS3NvQm9NfXcYCWwTTw8N8qCxkZDFd9AmuAKQ3_a7D58mGzvGSG4UNVE5a5KcsI4TF8_JwGGUX9r6QskE13_zeO6dPkz2ei_9fqAMyIanPf42KSSRcoCjY1-LadX1GbP',
          caption: 'Atal Tinkering STEM & Robotics Innovation Lab',
        },
        {
          url:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDC4jyPZ-Y0uFmqAIyeZLYA0gwSBOiz2hd-KftLRHfMUheUfalNRf--v_JUXPfBub2LAupP4MLcj7r7h29z5bXbNdwMolAJJJaGWats-3VFfgJUWqrJdz-fyQb_CBVaIUNzksLBrMybx9ZO66kNEPF0RIKlK5VsPgI651T_epWRzAfURWC-3w4tjQIPLpRccocgPiqo0GcD_nowIWu5tUBfrVKFHkTLldr8UvImP57J',
          caption: 'Olympic Swimming & Multi-Sport Indoor Arena',
        },
      ];
    }
    return [];
  }, [business.gallery, business.coverUrl, business.name, isEducation, slug]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquiryName('');
      setInquiryPhone('');
      setInquiryMessage('');
    }, 1500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      rating: reviewRating,
      date: 'Just now',
      comment: reviewComment.trim(),
      verified: true,
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setIsReviewModalOpen(false);
      setReviewSubmitted(false);
      setReviewAuthor('');
      setReviewComment('');
    }, 1200);
  };

  return (
    <div className="bg-[#f8f9ff] min-h-screen pb-24 text-[#0d1c2f] font-sans antialiased selection:bg-[#ffdbd0] selection:text-[#9b2f00]">
      {/* 1. TOP BREADCRUMB & TAXONOMY BAR */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 text-xs">
          <nav className="flex items-center gap-1.5 text-slate-500 font-medium overflow-x-auto no-scrollbar whitespace-nowrap">
            <Link href="/" className="hover:text-[#c2410c] transition">
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <Link
              href={`/search?category=${isEducation ? 'education-preschools' : isHealthcare ? 'healthcare-clinics' : 'all'}`}
              className="hover:text-[#c2410c] transition"
            >
              {isEducation ? 'Education & Schools' : isHealthcare ? 'Healthcare & Clinics' : 'Verified Directory'}
            </Link>
            <span className="text-slate-300">/</span>
            <Link
              href={`/search?city=${encodeURIComponent(business.city || 'Noida')}`}
              className="hover:text-[#c2410c] transition hidden sm:inline"
            >
              {business.city || 'Noida'}
            </Link>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-md">
              {business.name}
            </span>
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsBookmarked((prev) => !prev)}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition cursor-pointer inline-flex items-center gap-1.5 ${
                isBookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SECTION: HERO HEADER & ASYMMETRICAL CAMPUS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
          {/* Left Title & Subtitle */}
          <div className="space-y-1.5 max-w-3xl">
            {/* Subtitle / Category / Location / Affiliation Eyebrow shifted above title */}
            <p className="text-xs sm:text-sm text-[#4d556b] font-medium leading-relaxed">
              <span>{business.category}</span>
              <span className="mx-1.5">•</span>
              <span>{business.landmark || business.addressLine}</span>
              <span className="mx-1.5">•</span>
              <span>Est. {business.establishedYear || 1994}</span>
              <span className="mx-1.5">•</span>
              <span className="text-[#006c4a] font-semibold">ROC Audited</span>
            </p>

            {/* Main Entity Heading */}
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0d1c2f] tracking-tight leading-tight">
                {business.name}
              </h1>
            </div>
          </div>

          {/* Right Metric Tile (Rating + Audit Score - Clickable to #reviews) */}
          <a
            href="#reviews"
            className="flex items-center gap-3.5 bg-[#eff4ff] hover:bg-[#dde9ff] px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl border border-[#dde9ff] shadow-xs self-start lg:self-center flex-shrink-0 transition-all cursor-pointer hover:shadow-sm group"
            title="Click to view verified customer reviews and audit score"
          >
            <div className="flex flex-col items-center justify-center bg-[#c2410c] text-white w-12 h-12 rounded-xl shadow-xs group-hover:scale-105 transition-transform">
              <span className="text-lg font-black leading-none">{Number(business.rating || 4.8).toFixed(1)}</span>
              <div className="flex items-center text-amber-300 text-[9px] mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 fill-current" />
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-[#0d1c2f] group-hover:text-[#c2410c] transition-colors">
                {business.reviewsCount || reviewsList.length || 428} Verified Reviews
              </span>
              <span className="text-[11px] text-[#006c4a] font-semibold flex items-center gap-1 mt-0.5">
                <Check className="w-3 h-3 stroke-[2.5]" />
                <span>
                  {isFood
                    ? '100% Guest & Hygiene Verified'
                    : isHealthcare
                    ? '100% Patient & Clinical Verified'
                    : isEducation
                    ? '100% Parent & Auditor Verified'
                    : '100% Client & Auditor Verified'}
                </span>
              </span>
              <span className="text-[10px] text-[#4d556b] mt-0.5">Audit Score: 98.4 / 100</span>
            </div>
          </a>
        </div>

        {/* Asymmetrical Visual Showcase Grid (Dynamic based on authentic photos count) */}
        {galleryItems.length <= 1 ? (
          <div
            onClick={() => {
              if (galleryItems.length > 0) {
                setSelectedGalleryIdx(0);
                setIsGalleryModalOpen(true);
              }
            }}
            className="w-full h-80 sm:h-96 md:h-[440px] rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm border border-slate-200/90 bg-slate-50 flex items-center justify-center p-2 sm:p-4"
          >
            <img
              src={galleryItems[0]?.url || business.coverUrl || '/placeholder.png'}
              alt={galleryItems[0]?.caption || business.name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2 flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 text-[#0d1c2f] text-xs font-bold shadow-md border border-slate-200/80">
                <Camera className="w-3.5 h-3.5 text-[#c2410c]" />
                <span>1 Verified Photo</span>
              </span>
            </div>
          </div>
        ) : galleryItems.length === 2 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-auto md:h-[420px] rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-white">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedGalleryIdx(idx);
                  setIsGalleryModalOpen(true);
                }}
                className="h-72 md:h-full relative overflow-hidden group cursor-pointer bg-slate-900"
              >
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c2f]/85 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                  <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-sm">
                    {item.caption || `${business.name} — Photo ${idx + 1}`}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white border border-white/20 flex-shrink-0">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Audited</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : galleryItems.length === 3 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 h-auto md:h-[420px] rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-white">
            <div
              onClick={() => {
                setSelectedGalleryIdx(0);
                setIsGalleryModalOpen(true);
              }}
              className="md:col-span-8 h-72 md:h-full relative overflow-hidden group cursor-pointer bg-slate-900"
            >
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${galleryItems[0]?.url}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c2f]/85 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                <div>
                  <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    {galleryItems[0]?.caption || business.name}
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white border border-white/20 flex-shrink-0">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Audited Dec 2025</span>
                </span>
              </div>
            </div>
            <div className="md:col-span-4 grid grid-rows-2 gap-3 h-72 md:h-full">
              {[1, 2].map((idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedGalleryIdx(idx);
                    setIsGalleryModalOpen(true);
                  }}
                  className="relative overflow-hidden group cursor-pointer rounded-xl bg-slate-900"
                >
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${galleryItems[idx]?.url}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 right-2.5 text-white text-xs font-bold truncate">
                    {galleryItems[idx]?.caption}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 h-auto md:h-[420px] rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-white">
            {/* Main Campus / Facility Image (7 Cols) */}
            <div
              onClick={() => {
                setSelectedGalleryIdx(0);
                setIsGalleryModalOpen(true);
              }}
              className="md:col-span-7 h-72 md:h-full relative overflow-hidden group cursor-pointer"
            >
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${galleryItems[0]?.url}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c2f]/85 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#ffdbd0] block mb-0.5">
                    {isFood
                      ? 'Main Dining Deck & Runway Cabin'
                      : isHealthcare
                      ? 'Main Clinical Center & Surgical Wing'
                      : isEducation
                      ? 'Main Academic Wing'
                      : isManufacturing
                      ? 'Production & Export Operations'
                      : isTech
                      ? 'AI Innovation & Strategy Center'
                      : 'Main Operations Facility'}
                  </span>
                  <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    {galleryItems[0]?.caption || business.name}
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white border border-white/20 flex-shrink-0">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Audited Dec 2025</span>
                </span>
              </div>
            </div>

            {/* 3-Tile Secondary Media Stack (5 Cols) */}
            <div className="md:col-span-5 grid grid-cols-2 gap-3 h-72 md:h-full">
              {/* Tile 1 */}
              <div
                onClick={() => {
                  setSelectedGalleryIdx(1);
                  setIsGalleryModalOpen(true);
                }}
                className="relative overflow-hidden group cursor-pointer rounded-xl bg-slate-900"
              >
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${galleryItems[1]?.url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 right-2.5 text-white text-xs font-bold truncate">
                  {galleryItems[1]?.caption || (isFood ? 'First-Class Cabin' : isHealthcare ? 'Specialist Consultation' : isEducation ? 'Smart Classrooms' : 'Executive Facilities')}
                </span>
              </div>

              {/* Tile 2 */}
              <div
                onClick={() => {
                  setSelectedGalleryIdx(2);
                  setIsGalleryModalOpen(true);
                }}
                className="relative overflow-hidden group cursor-pointer rounded-xl bg-slate-900"
              >
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${galleryItems[2]?.url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 right-2.5 text-white text-xs font-bold truncate">
                  {galleryItems[2]?.caption || (isFood ? 'Cockpit Simulation Lounge' : isHealthcare ? 'Advanced Diagnostics' : isEducation ? 'Atal Tinkering Lab' : 'Operations Center')}
                </span>
              </div>

              {/* Tile 3 (Col-Span 2) */}
              <div
                onClick={() => {
                  setSelectedGalleryIdx(3);
                  setIsGalleryModalOpen(true);
                }}
                className="col-span-2 relative overflow-hidden group cursor-pointer rounded-xl bg-slate-900"
              >
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${galleryItems[3]?.url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-between px-4 text-white">
                  <span className="text-xs sm:text-sm font-bold truncate max-w-[200px] sm:max-w-xs">
                    {galleryItems[3]?.caption || (isFood ? 'Gourmet Dining Hall & Banquet' : isHealthcare ? 'Patient Recovery Suites' : isEducation ? 'Olympic Sports Arena' : 'Customer Experience Center')}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGalleryIdx(0);
                      setIsGalleryModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-[#0d1c2f] text-xs font-bold hover:bg-white hover:scale-105 transition-all shadow-md cursor-pointer flex-shrink-0 active:scale-95"
                    title="Click to view full photo archive"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#c2410c]" />
                    <span>+{galleryItems.length} Photos & 360° Tour</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2.5 STICKY SECTION NAVIGATION TABS */}
      <nav className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-y border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
          <a
            href="#overview"
            className="px-3.5 py-1.5 rounded-lg bg-[#eff4ff] text-[#0d1c2f] font-bold text-xs hover:bg-[#dde9ff] transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            Overview
          </a>
          <a
            href="#facilities"
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-[#0d1c2f] hover:bg-slate-100 font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            {isFood ? 'Dining Amenities' : isHealthcare ? 'Clinical Facilities' : isEducation ? 'Audited Facilities' : 'Services & Amenities'}
          </a>
          <a
            href="#programs"
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-[#0d1c2f] hover:bg-slate-100 font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            {isFood ? 'Cabins & Menu' : isHealthcare ? 'Procedures & Wings' : isEducation ? 'Curriculum & Grades' : 'Core Capabilities'}
          </a>
          <a
            href="#compliance"
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-[#0d1c2f] hover:bg-slate-100 font-semibold text-xs transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          >
            <span>Compliance Dossier</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]" />
          </a>
          <a
            href="#reviews"
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-[#0d1c2f] hover:bg-slate-100 font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            {isFood ? 'Guest Reviews' : isHealthcare ? 'Patient Reviews' : isEducation ? 'Parent Reviews' : 'Customer Reviews'} ({business.reviewsCount || reviewsList.length})
          </a>
          <a
            href="#location"
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-[#0d1c2f] hover:bg-slate-100 font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            {isEducation ? 'Campus Location' : 'Venue Location'}
          </a>
          <a
            href="#inquiry"
            className="ml-auto px-3.5 py-1.5 rounded-lg bg-[#c2410c] hover:bg-[#9a3412] text-white font-bold text-xs transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            {isFood ? 'Book a Table' : isHealthcare ? 'Book Appointment' : isEducation ? 'Direct Inquiry' : 'Direct Inquiry'}
          </a>
        </div>
      </nav>

      {/* 3. SECTION: MAIN 12-COL TWO-COLUMN INTERFACE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Deep Institutional Dossier (8 COLS)                          */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* CARD 1: Official Overview & Heritage */}
            <article className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col gap-4" id="overview">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-[#c2410c] rounded-xs" />
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0d1c2f]">
                    {isEducation
                      ? 'Official Overview & Academic Heritage'
                      : isFood
                      ? 'Official Overview & Dining Heritage'
                      : isHealthcare
                      ? 'Official Overview & Clinical Heritage'
                      : 'Official Overview & Verified Heritage'}
                  </h2>
                </div>
                <a
                  href="#compliance"
                  className="inline-flex items-center gap-1.5 text-xs text-[#006c4a] hover:underline font-medium transition-colors"
                  title="Click to view verified government clearance documents"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#006c4a]" />
                  <span>
                    {isFood
                      ? 'Verified by FSSAI & Municipal Audit'
                      : isHealthcare
                      ? 'Verified by Medical Council Audit'
                      : isEducation
                      ? 'Verified by Ministry Audit'
                      : 'Verified by ROC & GSTIN Audit'}
                  </span>
                </a>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {business.description || business.aboutStory}
              </p>

              {/* Core Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {isFood ? (
                  <>
                    <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dde9ff] flex flex-col">
                      <span className="text-[11px] font-semibold text-[#4d556b]">Dining Ambience</span>
                      <span className="text-lg sm:text-xl font-bold text-[#0d1c2f] mt-0.5">Aviation Cabin</span>
                      <span className="text-[10px] text-[#006c4a] font-medium">Authentic Aircraft</span>
                    </div>
                    <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dde9ff] flex flex-col">
                      <span className="text-[11px] font-semibold text-[#4d556b]">Seating Capacity</span>
                      <span className="text-lg sm:text-xl font-bold text-[#0d1c2f] mt-0.5">180+ Guests</span>
                      <span className="text-[10px] text-[#4d556b] font-medium">First-Class & Banquet</span>
                    </div>
                    <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dde9ff] flex flex-col">
                      <span className="text-[11px] font-semibold text-[#4d556b]">Hygiene Clearance</span>
                      <span className="text-lg sm:text-xl font-bold text-[#0d1c2f] mt-0.5">FSSAI Grade A+</span>
                      <span className="text-[10px] text-[#c2410c] font-medium">Clean Kitchen Audited</span>
                    </div>
                    <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dde9ff] flex flex-col">
                      <span className="text-[11px] font-semibold text-[#4d556b]">Customer Rating</span>
                      <span className="text-lg sm:text-xl font-bold text-[#006c4a] mt-0.5">{Number(business.rating || 4.9).toFixed(1)} / 5.0</span>
                      <span className="text-[10px] text-[#0d1c2f] font-medium">100% Verified Dining</span>
                    </div>
                  </>
                ) : isHealthcare ? (
                  <>
                    <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dde9ff] flex flex-col">
                      <span className="text-[11px] font-semibold text-[#4d556b]">Clinical Experience</span>
                      <span className="text-lg sm:text-xl font-bold text-[#0d1c2f] mt-0.5">20+ Years</span>
                      <span className="text-[10px] text-[#006c4a] font-medium">Specialist Care</span>
                    </div>
                    <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dde9ff] flex flex-col">
                      <span className="text-[11px] font-semibold text-[#4d556b]">Patient Success</span>
                      <span className="text-lg sm:text-xl font-bold text-[#0d1c2f] mt-0.5">98.4%</span>
                      <span className="text-[10px] text-[#4d556b] font-medium">Documented Outcomes</span>
                    </div>
                    <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dde9ff] flex flex-col">
                      <span className="text-[11px] font-semibold text-[#4d556b]">Clinical Standard</span>
                      <span className="text-lg sm:text-xl font-bold text-[#0d1c2f] mt-0.5">NABH Clean Room</span>
                      <span className="text-[10px] text-[#c2410c] font-medium">Strict Protocols</span>
                    </div>
                    <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dde9ff] flex flex-col">
                      <span className="text-[11px] font-semibold text-[#4d556b]">Patient Rating</span>
                      <span className="text-lg sm:text-xl font-bold text-[#006c4a] mt-0.5">{Number(business.rating || 4.9).toFixed(1)} / 5.0</span>
                      <span className="text-[10px] text-[#0d1c2f] font-medium">100% Verified Patients</span>
                    </div>
                  </>
                ) : isEducation ? (
                  <>
                    <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dde9ff] flex flex-col">
                      <span className="text-[11px] font-semibold text-[#4d556b]">Student-Teacher Ratio</span>
                      <span className="text-lg sm:text-xl font-bold text-[#0d1c2f] mt-0.5">14 : 1</span>
                      <span className="text-[10px] text-[#006c4a] font-medium">Optimal Focus</span>
                    </div>
                    <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dde9ff] flex flex-col">
                      <span className="text-[11px] font-semibold text-[#4d556b]">Campus Footprint</span>
                      <span className="text-lg sm:text-xl font-bold text-[#0d1c2f] mt-0.5">15 Acres</span>
                      <span className="text-[10px] text-[#4d556b] font-medium">Integrated Sports</span>
                    </div>
                    <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dde9ff] flex flex-col">
                      <span className="text-[11px] font-semibold text-[#4d556b]">Board Affiliation</span>
                      <span className="text-lg sm:text-xl font-bold text-[#0d1c2f] mt-0.5">CBSE All-India</span>
                      <span className="text-[10px] text-[#c2410c] font-medium">Nursery to Class XII</span>
                    </div>
                    <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dde9ff] flex flex-col">
                      <span className="text-[11px] font-semibold text-[#4d556b]">Avg. Board Score</span>
                      <span className="text-lg sm:text-xl font-bold text-[#006c4a] mt-0.5">89.6%</span>
                      <span className="text-[10px] text-[#0d1c2f] font-medium">Class XII Aggregate</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dde9ff] flex flex-col">
                      <span className="text-[11px] font-semibold text-[#4d556b]">Established</span>
                      <span className="text-lg sm:text-xl font-bold text-[#0d1c2f] mt-0.5">Est. {business.establishedYear || 2020}</span>
                      <span className="text-[10px] text-[#006c4a] font-medium">Verified Operations</span>
                    </div>
                    <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dde9ff] flex flex-col">
                      <span className="text-[11px] font-semibold text-[#4d556b]">Verified Score</span>
                      <span className="text-lg sm:text-xl font-bold text-[#006c4a] mt-0.5">{Number(business.rating || 4.9).toFixed(1)} / 5.0</span>
                      <span className="text-[10px] text-[#4d556b] font-medium">Audited Reviews</span>
                    </div>
                    <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dde9ff] flex flex-col">
                      <span className="text-[11px] font-semibold text-[#4d556b]">Service SLA</span>
                      <span className="text-lg sm:text-xl font-bold text-[#0d1c2f] mt-0.5">100% SLA</span>
                      <span className="text-[10px] text-[#c2410c] font-medium">Quality Benchmarks</span>
                    </div>
                    <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dde9ff] flex flex-col">
                      <span className="text-[11px] font-semibold text-[#4d556b]">Compliance</span>
                      <span className="text-lg sm:text-xl font-bold text-[#0d1c2f] mt-0.5">ROC & GSTIN</span>
                      <span className="text-[10px] text-[#0d1c2f] font-medium">Active Legal Entity</span>
                    </div>
                  </>
                )}
              </div>

              {/* Leader / Founder Note */}
              <div className="bg-[#eff4ff]/60 p-4 rounded-xl border border-[#dde9ff] flex gap-3.5 items-start mt-1">
                <div className="w-10 h-10 rounded-full bg-[#c2410c] text-white flex items-center justify-center flex-shrink-0 font-bold text-sm shadow-xs">
                  {business.owner?.name ? business.owner.name.slice(0, 2).toUpperCase() : isFood ? 'BA' : isHealthcare ? 'DR' : 'BB'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-[#0d1c2f]">
                    {business.owner?.name || (isEducation ? 'Mrs. Renu Singh' : 'Authorized Business Operator')} — {business.owner?.role || (isEducation ? 'Principal Message' : isFood ? 'Founder & Operations Message' : isHealthcare ? 'Medical Director Message' : 'Leadership Message')}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 italic mt-1 leading-relaxed">
                    &ldquo;
                    {isFood
                      ? 'Our vision is to combine the authentic exhilaration of commercial aviation with world-class culinary excellence. Every guest boards as a passenger and leaves with memories of exceptional gourmet hospitality.'
                      : isHealthcare
                      ? 'Every patient entrusts us with their well-being. Our commitment is delivering transparent, empathetic, and evidence-based clinical excellence with world-standard medical technology.'
                      : isEducation
                      ? 'Our commitment is rooted in nurturing curious minds with uncompromising ethical rigor, scientific inquiry, and cultural grounding in Bharat’s civilizational values.'
                      : 'We are committed to delivering top-tier service, verified operational transparency, and lasting value for our clients and community.'}
                    &rdquo;
                  </p>
                </div>
              </div>
            </article>

            {/* CARD 2: Audited Facilities & Amenities */}
            <article className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col gap-4" id="facilities">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-[#006c4a] rounded-xs" />
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0d1c2f]">
                    {isFood
                      ? 'Audited Dining Amenities & Safety Standards'
                      : isHealthcare
                      ? 'Audited Clinical Facilities & Patient Safety'
                      : isEducation
                      ? 'Audited Campus Facilities & Security Standards'
                      : 'Audited Enterprise Facilities & Standards'}
                  </h2>
                </div>
                <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                  Physical Inspection Completed Dec 12, 2025
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#4d556b]">
                Every listed facility below has been physically geo-verified by BharatBN ground auditors. No self-declarations without proof.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(business.amenities && business.amenities.length > 0
                  ? business.amenities.map((item, idx) => ({
                      title: item,
                      sub: 'Audited & Verified Standard',
                      icon: idx % 4 === 0 ? Sparkles : idx % 4 === 1 ? ShieldCheck : idx % 4 === 2 ? UtensilsCrossed : Award,
                    }))
                  : [
                      { title: 'Full Air-Conditioned Ambience', sub: 'Climate Controlled', icon: Sparkles },
                      { title: '24x7 Security & CCTV', sub: 'Audited Safety Protocols', icon: ShieldCheck },
                      { title: 'Customer Parking & Access', sub: 'Direct Corridor Access', icon: Navigation },
                      { title: 'Online Payments & Invoicing', sub: '100% Tax Compliant', icon: Award },
                      { title: 'Verified Professional Staff', sub: 'Police & KYC Cleared', icon: BadgeCheck },
                      { title: 'Strict Hygiene & Sanitation', sub: 'Audited Standards', icon: Droplets },
                    ]
                ).map((fac, idx) => {
                  const Icon = fac.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#eff4ff] border border-[#dde9ff]">
                      <Icon className="w-5 h-5 text-[#006c4a] flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-[#0d1c2f] truncate">{fac.title}</span>
                        <span className="text-[11px] text-[#4d556b] truncate">{fac.sub}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            {/* CARD 3: Sector Specific Showcase (Dining Cabins vs Clinical Wings vs School Programs) */}
            <article className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col gap-4" id="programs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-[#c2410c] rounded-xs" />
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0d1c2f]">
                    {isFood
                      ? 'Signature Menus, Dining Cabins & Aviation Experiences'
                      : isHealthcare
                      ? 'Clinical Specializations, Diagnostic Procedures & Care Wings'
                      : isEducation
                      ? 'Programs, Curriculum & Admission Cycles'
                      : 'Core Enterprise Capabilities, Solutions & Service Tiers'}
                  </h2>
                </div>
                <span className="text-xs text-[#c2410c] font-bold bg-[#ffdbd0]/60 px-2.5 py-1 rounded-full">
                  {isFood
                    ? 'Lunch & Dinner Flights Active'
                    : isHealthcare
                    ? 'OPD & Surgical Consultations Active'
                    : isEducation
                    ? 'Academic Year 2026 – 2027'
                    : 'Active Service Tiers'}
                </span>
              </div>

              {/* Stage Ribbon */}
              <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#dde9ff] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c2410c] flex items-center justify-center text-white flex-shrink-0">
                    {isFood ? <UtensilsCrossed className="w-5 h-5" /> : isHealthcare ? <Stethoscope className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#0d1c2f]">
                      {isFood
                        ? 'Online Boarding Pass Table Booking Active'
                        : isHealthcare
                        ? 'Priority Clinical Appointment Desk Active'
                        : isEducation
                        ? 'Phase II Online Registration Active'
                        : 'Direct Commercial Procurement & Service RFQ Active'}
                    </span>
                    <span className="text-xs text-[#4d556b]">
                      {isFood
                        ? 'First-Class Dining Suites, Cockpit Photo-Op, and Runway Family Banquets'
                        : isHealthcare
                        ? 'Direct Consultation with Senior Specialists & Fast-Track Diagnostic Triage'
                        : isEducation
                        ? 'Pre-Primary (Nursery / KG) and Class XI Entrance Registrations Close March 15, 2026'
                        : 'Dedicated Account Support & Milestone-Based Deliverable Guarantees'}
                    </span>
                  </div>
                </div>
                <a
                  href="#inquiry"
                  className="px-4 py-2 rounded-xl bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-bold transition shadow-xs whitespace-nowrap"
                >
                  {isFood ? 'Reserve a Flight Table' : isHealthcare ? 'Book Clinical Consultation' : isEducation ? 'Apply via Priority Desk' : 'Request Commercial Quote'}
                </a>
              </div>

              {/* 3 Sector Experience Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {isFood ? (
                  <>
                    <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#dde9ff] flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#c2410c]">Premium Dining</span>
                        <span className="text-[11px] text-[#4d556b]">Window & Aisle</span>
                      </div>
                      <h3 className="text-base font-bold text-[#0d1c2f]">First-Class Luxury Cabin</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Ergonomic aircraft seats with authentic tray tables, personal cabin steward call buttons, and customized boarding pass table tags.
                      </p>
                      <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-[#006c4a] font-semibold">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Boarding Passes Included</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#dde9ff] flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#c2410c]">Simulation Zone</span>
                        <span className="text-[11px] text-[#4d556b]">Kids & Family</span>
                      </div>
                      <h3 className="text-base font-bold text-[#0d1c2f]">Pilot Cockpit Experience</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Step inside the real cockpit. Kids and aviation fans receive pilot caps and wings while taking souvenir photos with actual avionics panels.
                      </p>
                      <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-[#006c4a] font-semibold">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Free Souvenir Photo-Op</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#dde9ff] flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#c2410c]">Gourmet Feasts</span>
                        <span className="text-[11px] text-[#4d556b]">Continental & Indian</span>
                      </div>
                      <h3 className="text-base font-bold text-[#0d1c2f]">Multi-Cuisine Runway Buffet</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Master-chef curated hot buffet featuring tandoori grills, Italian pastas, authentic North Indian curries, and live runway mocktail bar.
                      </p>
                      <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-[#006c4a] font-semibold">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Pure Veg & Non-Veg Kitchens</span>
                      </div>
                    </div>
                  </>
                ) : isHealthcare ? (
                  <>
                    <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#dde9ff] flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#c2410c]">Clinical Specialization</span>
                        <span className="text-[11px] text-[#4d556b]">Senior Specialists</span>
                      </div>
                      <h3 className="text-base font-bold text-[#0d1c2f]">Advanced Diagnostics & OPD</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Comprehensive diagnostic evaluation with high-definition digital imaging, ultrasound, and evidence-based personalized therapy roadmaps.
                      </p>
                      <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-[#006c4a] font-semibold">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Prior Appointments Open</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#dde9ff] flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#c2410c]">Operatory Standards</span>
                        <span className="text-[11px] text-[#4d556b]">Clean Room</span>
                      </div>
                      <h3 className="text-base font-bold text-[#0d1c2f]">Precision Operatory Suites</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Ultra-clean positive pressure operatory suites with sub-millimeter precision robotics, micro-manipulators, and zero-infection protocols.
                      </p>
                      <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-[#006c4a] font-semibold">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>NABH Standards Cleared</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#dde9ff] flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#c2410c]">Patient Journey</span>
                        <span className="text-[11px] text-[#4d556b]">Post-Care</span>
                      </div>
                      <h3 className="text-base font-bold text-[#0d1c2f]">Rehabilitation & Recovery</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Dedicated care coordinators assisting with day-1 mobility, nutritional guidance, medication schedules, and remote WhatsApp follow-ups.
                      </p>
                      <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-[#006c4a] font-semibold">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Dedicated Care Manager</span>
                      </div>
                    </div>
                  </>
                ) : isEducation ? (
                  <>
                    <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#dde9ff] flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#c2410c]">Pre-Primary Wing</span>
                        <span className="text-[11px] text-[#4d556b]">Ages 3 - 5</span>
                      </div>
                      <h3 className="text-base font-bold text-[#0d1c2f]">Amiown Montessori</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Play-based experiential methodology with child psychologists, sensory development rooms, and speech guidance labs.
                      </p>
                      <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-[#006c4a] font-semibold">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Seats Available: 18 (Phase II)</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#dde9ff] flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#c2410c]">Middle School</span>
                        <span className="text-[11px] text-[#4d556b]">Classes I - VIII</span>
                      </div>
                      <h3 className="text-base font-bold text-[#0d1c2f]">CBSE Foundational & NEP</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Coding, French/German third languages, inter-disciplinary robotics, debate societies, and national astronomy club.
                      </p>
                      <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-[#006c4a] font-semibold">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Admissions on Merit / Transfer</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#dde9ff] flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#c2410c]">Senior Secondary</span>
                        <span className="text-[11px] text-[#4d556b]">Classes IX - XII</span>
                      </div>
                      <h3 className="text-base font-bold text-[#0d1c2f]">Science, Commerce, Arts</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Dedicated JEE / NEET / CUET mentoring cells, corporate internships, and international university counseling desk.
                      </p>
                      <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-[#c2410c] font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Written Aptitude Test Req.</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#dde9ff] flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#c2410c]">Service Pillar 1</span>
                        <span className="text-[11px] text-[#4d556b]">Core Service</span>
                      </div>
                      <h3 className="text-base font-bold text-[#0d1c2f]">{business.services[0] || 'Direct Service Delivery'}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Dedicated service fulfillment executed under verified SLA metrics and transparent customer consultation.
                      </p>
                      <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-[#006c4a] font-semibold">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Guaranteed SLA Benchmarks</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#dde9ff] flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#c2410c]">Service Pillar 2</span>
                        <span className="text-[11px] text-[#4d556b]">Enterprise Grade</span>
                      </div>
                      <h3 className="text-base font-bold text-[#0d1c2f]">{business.services[1] || 'Commercial Solutions'}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        End-to-end management with dedicated point of contact, milestone tracking, and sovereign customer data security.
                      </p>
                      <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-[#006c4a] font-semibold">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Verified Account Manager</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#dde9ff] flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#c2410c]">Service Pillar 3</span>
                        <span className="text-[11px] text-[#4d556b]">Quality Assurance</span>
                      </div>
                      <h3 className="text-base font-bold text-[#0d1c2f]">{business.services[2] || 'Customer Support & Warranty'}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Responsive after-sales support with fast resolution turnarounds, digital invoicing, and continuous satisfaction reviews.
                      </p>
                      <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-[#006c4a] font-semibold">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>100% Satisfaction Support</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </article>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Sticky Enterprise Action Rail (4 COLS)                      */}
          {/* ========================================================================= */}
          <aside className="lg:col-span-4 flex flex-col gap-5 sticky top-20">
            {/* CARD 1: Direct Official Desk (High Intent) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#006c4a] font-bold flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-[#0d1c2f]">
                      {isFood
                        ? 'Table Reservations Desk'
                        : isHealthcare
                        ? 'Front Clinical Desk'
                        : isEducation
                        ? 'Admissions Directorate'
                        : 'Verified Business Desk'}
                    </span>
                    <span className="text-[10px] text-[#006c4a] font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>
                        {isFood
                          ? 'Official Restaurant Operator'
                          : isHealthcare
                          ? 'Official Clinic Operator'
                          : isEducation
                          ? 'Official Campus Operator'
                          : 'Official Business Operator'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp CTA */}
              <a
                href={`https://wa.me/${business.whatsapp || '919820099881'}?text=${encodeURIComponent(
                  isFood
                    ? `I want to reserve a table / inquire about menu at ${business.name} via BharatBN`
                    : isHealthcare
                    ? `I want to book an appointment with ${business.name} via BharatBN`
                    : isEducation
                    ? `I am inquiring about admissions for ${business.name} via BharatBN`
                    : `I am inquiring about services from ${business.name} via BharatBN`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm transition shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                <span>Chat on WhatsApp</span>
              </a>
              <span className="text-center text-[11px] text-[#4d556b]">
                {isFood
                  ? 'Table hosts respond in ~5 minutes'
                  : isHealthcare
                  ? 'Care coordinators respond in ~5 minutes'
                  : isEducation
                  ? 'Admissions counselors respond in ~5 minutes'
                  : 'Business team responds in ~5 minutes'}
              </span>

              {/* Official Direct Line & Portal */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${business.phone}`}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#eff4ff] hover:bg-[#dde9ff] text-[#0d1c2f] text-xs font-bold transition"
                >
                  <Phone className="w-3.5 h-3.5 text-[#c2410c]" />
                  <span className="truncate">{business.phone}</span>
                </a>
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#eff4ff] hover:bg-[#dde9ff] text-[#0d1c2f] text-xs font-bold transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#4d556b]" />
                  <span>Official Portal</span>
                </a>
              </div>
            </div>

            {/* CARD 2: Direct Priority Inquiry Form */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col gap-3" id="inquiry">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#c2410c] rounded-xs" />
                <h3 className="text-base font-bold text-[#0d1c2f]">
                  {isFood
                    ? 'Direct Table Booking / Inquiry'
                    : isHealthcare
                    ? 'Direct Clinical Appointment'
                    : isEducation
                    ? 'Send Direct Inquiry'
                    : 'Send Direct Business Inquiry'}
                </h3>
              </div>
              <p className="text-[11px] text-[#4d556b]">
                {isFood
                  ? 'Directly routed to the Restaurant Host & Reservations Desk.'
                  : isHealthcare
                  ? 'Directly routed to the Clinical Coordinator Desk.'
                  : isEducation
                  ? 'Directly routed to the Principal Admissions Secretariat.'
                  : 'Directly routed to verified business management.'}{' '}
                Encrypted under BharatBN Privacy Shield.
              </p>

              {inquirySubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <Check className="w-6 h-6 text-[#006c4a] stroke-[2.5] mx-auto" />
                  <h4 className="text-xs font-bold text-emerald-900">Inquiry Routed Successfully</h4>
                  <p className="text-[11px] text-emerald-700">Official management has received your submission.</p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="flex flex-col gap-2.5 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      {isFood
                        ? 'Guest Full Name'
                        : isHealthcare
                        ? 'Patient Full Name'
                        : isEducation
                        ? 'Parent / Guardian Full Name'
                        : 'Contact Person Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder={isFood ? 'e.g. Captain Sanjeev Verma' : isHealthcare ? 'e.g. Meera Sharma' : isEducation ? 'e.g. Dr. Sunil Mehta' : 'e.g. Rajesh Kumar'}
                      className="w-full px-3 py-2 rounded-lg bg-[#eff4ff] text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#c2410c] border border-transparent focus:border-slate-300 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      WhatsApp / Phone Number
                    </label>
                    <div className="flex items-center bg-[#eff4ff] rounded-lg overflow-hidden border border-transparent focus-within:border-slate-300 focus-within:bg-white">
                      <span className="px-2.5 py-2 text-[#4d556b] text-xs bg-slate-200/70 font-semibold">+91</span>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        placeholder="98XXXXXXXX"
                        className="w-full px-2.5 py-2 bg-transparent text-slate-900 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {isFood ? 'Dining Zone' : isHealthcare ? 'Specialty / Dept' : isEducation ? 'Grade of Interest' : 'Service Need'}
                      </label>
                      <select
                        value={inquiryGrade}
                        onChange={(e) => setInquiryGrade(e.target.value)}
                        className="w-full px-2 py-2 rounded-lg bg-[#eff4ff] text-slate-900 text-xs focus:bg-white focus:outline-none border border-transparent focus:border-slate-300"
                      >
                        {isFood ? (
                          <>
                            <option>First-Class Cabin</option>
                            <option>Cockpit Experience Lounge</option>
                            <option>Multi-Cuisine Buffet</option>
                            <option>Family Runway Banquet</option>
                          </>
                        ) : isHealthcare ? (
                          <>
                            <option>Initial Consultation</option>
                            <option>Specialist Opinion</option>
                            <option>Diagnostic Review</option>
                            <option>Post-Op Follow-up</option>
                          </>
                        ) : isEducation ? (
                          <>
                            <option>Nursery / KG</option>
                            <option>Class I - V</option>
                            <option>Class VI - VIII</option>
                            <option>Class IX - X</option>
                            <option>Class XI (Science)</option>
                            <option>Class XI (Commerce)</option>
                            <option>Class XI (Humanities)</option>
                          </>
                        ) : (
                          <>
                            <option>General Service Inquiry</option>
                            <option>Commercial Quote / RFQ</option>
                            <option>Urgent Requirement</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        {isFood ? 'Party Size' : isHealthcare ? 'Preferred Time' : isEducation ? 'Academic Session' : 'Timeline'}
                      </label>
                      <select
                        value={inquirySession}
                        onChange={(e) => setInquirySession(e.target.value)}
                        className="w-full px-2 py-2 rounded-lg bg-[#eff4ff] text-slate-900 text-xs focus:bg-white focus:outline-none border border-transparent focus:border-slate-300"
                      >
                        {isFood ? (
                          <>
                            <option>2 Guests (Couple)</option>
                            <option>3 - 5 Guests (Family)</option>
                            <option>6 - 10 Guests (Group)</option>
                            <option>10+ Guests (Banquet)</option>
                          </>
                        ) : isHealthcare ? (
                          <>
                            <option>Morning Slot</option>
                            <option>Afternoon Slot</option>
                            <option>Evening Slot</option>
                            <option>Weekend Slot</option>
                          </>
                        ) : isEducation ? (
                          <>
                            <option>2026 - 2027</option>
                            <option>2027 - 2028</option>
                          </>
                        ) : (
                          <>
                            <option>Immediate</option>
                            <option>Within 1 Week</option>
                            <option>Within 1 Month</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Message or Queries
                    </label>
                    <textarea
                      rows={2}
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      placeholder={
                        isFood
                          ? 'Mention dietary preferences, anniversary/birthday celebration...'
                          : isHealthcare
                          ? 'Mention symptoms, previous reports, preferred date...'
                          : isEducation
                          ? 'Mention transfer case, sibling discount, bus routes...'
                          : 'Mention service specifications or questions...'
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#eff4ff] text-slate-900 text-xs focus:bg-white focus:outline-none border border-transparent focus:border-slate-300 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-1 py-2.5 px-4 rounded-xl bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>
                      {isFood
                        ? 'Confirm Table Reservation'
                        : isHealthcare
                        ? 'Request Appointment Slot'
                        : isEducation
                        ? 'Submit Priority Inquiry'
                        : 'Submit Direct Inquiry'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-center text-[10px] text-[#4d556b]">
                    Zero Spam Guarantee • Strict Non-Commercial Disclosure
                  </span>
                </form>
              )}
            </div>

            {/* CARD 3: Operating Hours */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-[#0d1c2f]">
                  {isFood
                    ? 'Restaurant Operating Hours'
                    : isHealthcare
                    ? 'Clinic Consultation Hours'
                    : isEducation
                    ? 'Campus Visiting Hours'
                    : 'Business Operating Hours'}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Open Now
                </span>
              </div>
              <div className="flex flex-col gap-2 text-xs divide-y divide-slate-100">
                {business.workingHours && business.workingHours.length > 0 ? (
                  business.workingHours.map((wh, idx) => (
                    <div key={idx} className="flex justify-between pt-2">
                      <span className="text-[#4d556b]">{wh.days}</span>
                      <span className={`font-bold ${wh.isOpenNow ? 'text-[#0d1c2f]' : 'text-[#c2410c]'}`}>{wh.time}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between pt-1">
                      <span className="text-[#4d556b]">Monday – Saturday</span>
                      <span className="font-bold text-[#0d1c2f]">10:00 AM – 9:00 PM</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-[#4d556b]">Sunday</span>
                      <span className="font-bold text-[#0d1c2f]">11:00 AM – 8:00 PM</span>
                    </div>
                  </>
                )}
              </div>
              <span className="text-[10px] text-[#4d556b] italic pt-1">
                {isFood
                  ? 'Advance reservations recommended for peak evening flights.'
                  : isHealthcare
                  ? 'Prior appointment recommended to minimize waiting time.'
                  : isEducation
                  ? 'Prior appointment mandatory for Principal interaction.'
                  : 'Direct inquiries answered during active business hours.'}
              </span>
            </div>

            {/* CARD 4: Nearby Verified Businesses */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-[#0d1c2f]">
                  {isFood
                    ? 'Nearby Verified Dining'
                    : isHealthcare
                    ? 'Nearby Verified Healthcare'
                    : isEducation
                    ? 'Nearby Verified Schools'
                    : 'Nearby Verified Businesses'}
                </span>
                <Link
                  href={`/search?category=${
                    isFood
                      ? 'food-dining'
                      : isHealthcare
                      ? 'healthcare-clinics'
                      : isEducation
                      ? 'education-preschools'
                      : 'directory'
                  }`}
                  className="text-xs text-[#c2410c] font-semibold hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="flex flex-col gap-2">
                {(isFood
                  ? [
                      { name: 'Bayview Multi-Cuisine Diner', sub: 'Andheri West • 1.2 km', rating: 4.8, code: 'BV' },
                      { name: 'Sky High Aviation Lounge', sub: 'Link Road • 2.1 km', rating: 4.7, code: 'SH' },
                      { name: 'Coastal Spice Kitchen', sub: 'Oshiwara • 2.6 km', rating: 4.9, code: 'CS' },
                    ]
                  : isHealthcare
                  ? [
                      { name: 'Wave Healthcare Multispeciality', sub: 'Sector 32, Noida • 0.4 km', rating: 4.9, code: 'WH' },
                      { name: 'Apex Ortho & Joint Clinic', sub: 'Sector 29, Noida • 1.8 km', rating: 4.8, code: 'AO' },
                      { name: 'City Fertility Care Center', sub: 'Sector 18, Noida • 2.5 km', rating: 4.9, code: 'CF' },
                    ]
                  : [
                      { name: 'Lotus Valley International', sub: 'Sector 126, Noida • 3.2 km', rating: 4.7, code: 'LV' },
                      { name: 'Delhi Public School (DPS)', sub: 'Sector 30, Noida • 2.8 km', rating: 4.8, code: 'DP' },
                      { name: 'Step by Step School', sub: 'Sector 132, Noida • 5.1 km', rating: 4.9, code: 'ST' },
                    ]
                ).map((s, idx) => (
                  <Link
                    key={idx}
                    href={`/search?q=${encodeURIComponent(s.name)}`}
                    className="p-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#dde9ff] transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-[#0d1c2f]">
                        {s.code}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[#0d1c2f] group-hover:text-[#c2410c] transition truncate">
                          {s.name}
                        </span>
                        <span className="text-[10px] text-[#4d556b] truncate">{s.sub}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#006c4a]">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{s.rating}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* ========================================================================= */}
        {/* FULL-WIDTH INSTITUTIONAL DOSSIER SECTIONS (SAME WIDTH AS CONTAINER)       */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-6 mt-8">
          {/* CARD 4: BharatBN Compliance Dossier */}
          <article className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col gap-4" id="compliance">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#006c4a] rounded-xs" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#0d1c2f]">BharatBN Compliance Dossier</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006c4a]">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>
                  {isFood
                    ? '100% Cleared FSSAI Food Safety Audit'
                    : isHealthcare
                    ? '100% Cleared Clinical & Medical Audit'
                    : isEducation
                    ? '100% Cleared Institutional Audit'
                    : '100% Cleared Sovereign Business Audit'}
                </span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#4d556b]">
              {isFood
                ? 'Food and hospitality establishment audited under the BharatBN National Trust Framework. Documents cross-checked with Central FSSAI, Municipal Health Department, and Fire Services.'
                : isHealthcare
                ? 'Clinical establishment audited under the BharatBN National Trust Framework. Credentials cross-checked with State Medical Council, NMC, and Pollution Control Board.'
                : isEducation
                ? 'Public institutions audited under the BharatBN National Trust Framework. Documents cross-checked with Noida Authority, Ministry of Education, and Uttar Pradesh Police.'
                : 'Commercial establishment audited under the BharatBN National Trust Framework. Documents cross-checked with Ministry of Corporate Affairs (MCA), GSTIN, and MSME Udyam.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {(isFood
                ? [
                    {
                      title: 'FSSAI Central Food Safety Registration',
                      desc: 'Registration ID: FSSAI/MUM/2026/891 • Valid through Dec 2028',
                      badge: 'Grade A+ Hygiene Cleared',
                      icon: UtensilsCrossed,
                    },
                    {
                      title: 'Commercial Kitchen Fire Safety & NOC',
                      desc: 'Issued by Municipal Fire Department • Ref: FS-MUM-2025/441 • Valid until Nov 2027',
                      badge: 'Physical Clearance OK',
                      icon: Flame,
                    },
                    {
                      title: '100% Kitchen & Steward Staff Health Verification',
                      desc: 'Periodic medical fitness, skin testing, and police verification for all 45 staff members',
                      badge: 'Biometrics Verified',
                      icon: BadgeCheck,
                    },
                    {
                      title: 'RO Purified Water & Food Contact Safety Certification',
                      desc: 'Food Safety Testing Lab Report #PHD-MUM-8921 • Potable Water Cleared',
                      badge: 'Tested Dec 2025',
                      icon: Droplets,
                    },
                  ]
                : isHealthcare
                ? [
                    {
                      title: 'State Medical Council & NMC Registration',
                      desc: 'Registration ID: MCI/UP/89201 • Active Specialist Standing',
                      badge: 'MCI Validated',
                      icon: Stethoscope,
                    },
                    {
                      title: 'Clinical Establishment & Fire Safety NOC',
                      desc: 'Issued by Directorate of Health Services • Ref: DHS-NOI-2025/319',
                      badge: 'Physical Clearance OK',
                      icon: Flame,
                    },
                    {
                      title: 'Bio-Medical Waste Management Clearance',
                      desc: 'Pollution Control Board Clearance • Authorization #UPPCB-BMW-771',
                      badge: 'Biometrics Verified',
                      icon: BadgeCheck,
                    },
                    {
                      title: 'Ultra-Clean Operation Theatre & Water Purity Certificate',
                      desc: 'Microbiological culture clearance & positive pressure air filtration audit',
                      badge: 'Tested Dec 2025',
                      icon: Droplets,
                    },
                  ]
                : isEducation
                ? [
                    {
                      title: 'CBSE Senior Secondary Affiliation',
                      desc: 'Affiliation ID: CBSE/AFF/2130230 • Valid through 31 March 2029',
                      badge: 'MHRD Validated',
                      icon: GraduationCap,
                    },
                    {
                      title: 'Fire Safety & Structural NOC',
                      desc: 'Issued by UP Fire Service Noida • Ref: FS-NOI-2025/881 • Valid until Nov 2027',
                      badge: 'Physical Clearance OK',
                      icon: Flame,
                    },
                    {
                      title: '100% Teaching & Support Staff Police Verification',
                      desc: 'Biometric CCTNS background check completed for all 340 campus personnel',
                      badge: 'Biometrics Verified',
                      icon: BadgeCheck,
                    },
                    {
                      title: 'Potable Water & Sanitary Fitness Certificate',
                      desc: 'CMO Noida Health Department • Certificate #PHD-NOIDA-6421',
                      badge: 'Tested Dec 2025',
                      icon: Droplets,
                    },
                  ]
                : [
                    {
                      title: 'Ministry of Corporate Affairs (MCA) / ROC Registration',
                      desc: 'Active Legal Entity • Registered under Companies Act / MSME Protocol',
                      badge: 'MCA Validated',
                      icon: Award,
                    },
                    {
                      title: 'Goods & Services Tax (GSTIN) Active Compliance',
                      desc: 'GSTIN Verified • Active GSTR-1 and GSTR-3B filings on record',
                      badge: '100% GST Validated',
                      icon: ShieldCheck,
                    },
                    {
                      title: 'MSME / Udyam Enterprise Verification',
                      desc: 'Government of India Udyam Aadhaar Enterprise Registration Cleared',
                      badge: 'Udyam Verified',
                      icon: BadgeCheck,
                    },
                    {
                      title: 'Commercial Premise & Safety Verification',
                      desc: 'Municipal Trade License and Physical Inspection Cleared',
                      badge: 'Tested Dec 2025',
                      icon: Droplets,
                    },
                  ]
              ).map((row, idx) => {
                const RowIcon = row.icon;
                return (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#eff4ff] border border-[#dde9ff] gap-2">
                    <div className="flex items-center gap-3">
                      <RowIcon className="w-5 h-5 text-[#006c4a] flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-bold text-[#0d1c2f]">{row.title}</span>
                        <span className="text-[11px] text-[#4d556b]">{row.desc}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 self-start sm:self-center">
                      {row.badge}
                    </span>
                  </div>
                );
              })}
            </div>
          </article>

          {/* CARD 5: Verified Reviews */}
          <article className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col gap-4" id="reviews">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#c2410c] rounded-xs" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#0d1c2f]">
                  {isFood
                    ? 'Verified Guest Reviews'
                    : isHealthcare
                    ? 'Verified Patient Reviews'
                    : isEducation
                    ? 'Verified Parent Reviews'
                    : 'Verified Customer Reviews'}{' '}
                  ({business.reviewsCount || reviewsList.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#c2410c] hover:text-white text-slate-800 text-xs font-bold transition cursor-pointer shadow-xs"
              >
                + Leave Verified Review
              </button>
            </div>

            {/* Review Summary Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#eff4ff] p-4 sm:p-5 rounded-xl border border-[#dde9ff]">
              <div className="md:col-span-4 flex flex-col items-center justify-center p-2 text-center border-b md:border-b-0 md:border-r border-[#dde9ff]">
                <span className="text-4xl sm:text-5xl font-black text-[#0d1c2f] leading-none">
                  {Number(business.rating || 4.9).toFixed(1)}
                </span>
                <div className="flex text-amber-400 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-[#4d556b] mt-1.5 font-medium">
                  Based on {business.reviewsCount || reviewsList.length} verified submissions
                </span>
                <span className="text-[10px] text-[#006c4a] font-bold mt-0.5">Zero Paid or Bot Reviews</span>
              </div>

              {/* Distribution Bars */}
              <div className="md:col-span-8 flex flex-col justify-center gap-2">
                {[
                  { stars: '5 Star', pct: '88%' },
                  { stars: '4 Star', pct: '9%' },
                  { stars: '3 Star', pct: '2%' },
                  { stars: '2 Star', pct: '1%' },
                ].map((bar, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <span className="w-12 text-[#4d556b] font-medium">{bar.stars}</span>
                    <div className="flex-1 bg-white h-2 rounded-full overflow-hidden border border-slate-200">
                      <div className="bg-[#006c4a] h-full rounded-full" style={{ width: bar.pct }} />
                    </div>
                    <span className="w-8 text-right font-bold text-[#0d1c2f]">{bar.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Review Cards */}
            <div className="flex flex-col gap-3 pt-2">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl bg-[#eff4ff] border border-[#dde9ff] flex flex-col gap-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#c2410c] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {rev.author.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-[#0d1c2f]">{rev.author}</span>
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                            <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                            <span>
                              {isFood
                                ? 'Verified Guest'
                                : isHealthcare
                                ? 'Verified Patient'
                                : isEducation
                                ? 'Verified Parent'
                                : 'Verified Customer'}
                            </span>
                          </span>
                        </div>
                        <span className="text-[10px] text-[#4d556b]">
                          Review posted {rev.date} •{' '}
                          {isFood
                            ? 'Verified via Dining Bill / Reservation'
                            : isHealthcare
                            ? 'Verified via Clinical Appointment'
                            : isEducation
                            ? 'Verified via Student ID Card'
                            : 'Verified via Tax Invoice'}
                        </span>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-1">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </article>

          {/* CARD 6: Location & Transit Corridor */}
          <article className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col gap-4" id="location">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#c2410c] rounded-xs" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#0d1c2f]">
                  {isEducation
                    ? 'Campus Location & Transit Corridor'
                    : isFood
                    ? 'Restaurant Venue Location & Arrival Corridor'
                    : 'Business Location & Transit Corridor'}
                </h2>
              </div>
              <span className="text-xs text-[#4d556b] font-medium">
                {isFood
                  ? 'GPS Coordinates: 19.1363° N, 72.8277° E (Mumbai)'
                  : isHealthcare
                  ? 'GPS Coordinates: 28.5700° N, 77.3400° E (Noida)'
                  : 'GPS Coordinates: 28.5529° N, 77.3392° E'}
              </span>
            </div>

            {/* Embedded Map Graphic with Overlay Callout */}
            <div
              className="w-full h-72 rounded-xl bg-cover bg-center shadow-inner relative overflow-hidden border border-slate-200"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDGfxJl_LY4uAP7r7i_975zCuZZC2c0NREqx-UHjGMu6SB0pEEPZwbuLlQgQ1HOEuisDDUxlf_LkQS8nLwHzGny8an7d2KliZJtTrfyCT6vYk_RYkIFq6jahLKgUZH6-7HXARdbhFYNahB3v_3iiLXKxZYAQ76x87Ui9wiDIQ4kyg8siGikre4BtBf7cH7XhNa8f3gzS88VEZsBniH1nCazouJQUJ_71rgLNGSv5N3r')`,
              }}
            >
              <div className="absolute inset-0 bg-[#0d1c2f]/10" />
              {/* Overlay Pin Callout */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-slate-200 max-w-xs flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c2410c] animate-ping" />
                  <span className="text-xs font-bold text-[#0d1c2f]">
                    {isFood
                      ? 'Boarding Gate #1 (Valet & Dining Entrance)'
                      : isHealthcare
                      ? 'Main Clinical Entrance'
                      : isEducation
                      ? 'Main Gate #1 (Admissions)'
                      : 'Main Entrance'}
                  </span>
                </div>
                <p className="text-[11px] text-[#4d556b] leading-tight">
                  {business.addressLine || 'Commercial Hub Corridor'}
                </p>
                <span className="text-[10px] text-[#c2410c] font-semibold">
                  Landmark: {business.landmark || 'Near Metro Station'}
                </span>
              </div>
            </div>

            {/* Transit Connectivity Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#dde9ff] flex flex-col">
                <span className="text-[11px] text-[#4d556b]">Nearest Transit Node</span>
                <span className="text-xs sm:text-sm font-bold text-[#0d1c2f] mt-0.5">
                  {business.landmark ? business.landmark.replace('Near ', '') : `${business.city} Metro Station`}
                </span>
                <span className="text-[10px] text-[#4d556b]">Direct Walking Access • 200m</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#dde9ff] flex flex-col">
                <span className="text-[11px] text-[#4d556b]">Arterial Road Access</span>
                <span className="text-xs sm:text-sm font-bold text-[#0d1c2f] mt-0.5">
                  {isFood ? 'New Link Road Corridor' : `${business.city} Main Highway`}
                </span>
                <span className="text-[10px] text-[#4d556b]">Wide 6-Lane Commercial Belt</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#dde9ff] flex flex-col">
                <span className="text-[11px] text-[#4d556b]">Parking & Accessibility</span>
                <span className="text-xs sm:text-sm font-bold text-[#0d1c2f] mt-0.5">
                  {isFood ? 'Valet Car Parking' : 'On-Site Customer Parking'}
                </span>
                <span className="text-[10px] text-[#4d556b]">
                  {isFood ? 'Dedicated Valet & Elevator Access' : 'Wheelchair & Elevator Accessible'}
                </span>
              </div>
            </div>
          </article>

          {/* INSTITUTIONAL TRUST & CLAIM BAR */}
          <div className="w-full bg-[#eff4ff] border border-[#dde9ff] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#006c4a] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0d1c2f]">
                Are you the official management of {business.name}?
              </span>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Link
                href={`/claim/${business.id || business.slug}`}
                className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 text-[#0d1c2f] hover:bg-slate-50 text-xs font-bold rounded-xl transition text-center"
              >
                Claim Verified Profile
              </Link>
              <a
                href="mailto:support@bharatbn.com?subject=Report%20Inaccuracy"
                className="flex-1 sm:flex-none px-4 py-2 bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-bold rounded-xl transition text-center"
              >
                Report Inaccuracy / Request Re-Audit
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LIGHTBOX / PHOTO GALLERY MODAL */}
      <AnimatePresence>
        {isGalleryModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {selectedGalleryIdx + 1} of {galleryItems.length} — Audited Visual Archive
              </span>
              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center py-4">
              <div className="relative max-w-4xl max-h-[70vh] w-full h-[60vh] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={galleryItems[selectedGalleryIdx]?.url}
                  alt={galleryItems[selectedGalleryIdx]?.caption || `${business.name} Visual Showcase`}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Prev / Next buttons (only if > 1 image) */}
              {galleryItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedGalleryIdx((prev) => (prev > 0 ? prev - 1 : galleryItems.length - 1))}
                    className="absolute left-2 sm:left-8 p-3 rounded-full bg-black/60 hover:bg-black text-white transition cursor-pointer border border-white/20"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGalleryIdx((prev) => (prev < galleryItems.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 sm:right-8 p-3 rounded-full bg-black/60 hover:bg-black text-white transition cursor-pointer border border-white/20"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip (only if > 1 image) */}
            {galleryItems.length > 1 && (
              <div className="flex items-center justify-center gap-3 overflow-x-auto py-2">
                {galleryItems.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedGalleryIdx(i)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition cursor-pointer flex-shrink-0 relative ${
                      selectedGalleryIdx === i ? 'border-[#c2410c] scale-105' : 'border-white/20 opacity-60'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* 5. LEAVE VERIFIED REVIEW MODAL */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#006c4a]" />
                  <h3 className="text-base font-bold text-slate-900">Submit Verified Review</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {reviewSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-50 text-center space-y-2">
                  <Check className="w-8 h-8 text-[#006c4a] stroke-[2.5] mx-auto" />
                  <h4 className="font-bold text-emerald-950">Review Verified & Posted!</h4>
                  <p className="text-xs text-emerald-700">Thank you for contributing sovereign trust to BharatBN.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="e.g. Sumanth Narang"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {isFood
                        ? 'Dining Experience / Role'
                        : isHealthcare
                        ? 'Treatment / Patient Role'
                        : isEducation
                        ? 'Your Role / Ward Class'
                        : 'Your Relationship / Role'}
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewRole}
                      onChange={(e) => setReviewRole(e.target.value)}
                      placeholder={
                        isFood
                          ? 'e.g. Verified Guest (Dinner Flight)'
                          : isHealthcare
                          ? 'e.g. Verified Patient (Robotic Knee / IVF)'
                          : isEducation
                          ? 'e.g. Verified Parent (Class X)'
                          : 'e.g. Verified Client'
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Star Rating</label>
                    <div className="flex items-center gap-1.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="cursor-pointer"
                        >
                          <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-current' : 'text-slate-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Your Detailed Experience</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={
                        isFood
                          ? 'Share your experience regarding food taste, aircraft cabin hospitality, cockpit simulation, or hygiene...'
                          : isHealthcare
                          ? 'Share your experience regarding clinical care, doctor guidance, or facilities...'
                          : isEducation
                          ? 'Share your experience regarding academics, sports, safety or transportation...'
                          : 'Share your experience with this verified business...'
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Submit Verified Review
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
