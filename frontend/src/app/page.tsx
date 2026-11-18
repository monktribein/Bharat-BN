'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import {
  Building2,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Award,
  Sparkles,
  Search,
} from 'lucide-react';

interface VerifiedBusiness {
  id: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  phone: string;
  whatsapp: string;
  rating: number;
  reviewsCount: number;
  tags: string[];
  isVerified: boolean;
  statusText?: string;
}

const defaultVerifiedList: VerifiedBusiness[] = [
  {
    id: 'BBN-CLM-799760',
    name: 'Apple',
    slug: 'apple',
    category: 'Automobile & EV',
    city: 'Noida, UP',
    phone: '+91 97170 56860',
    whatsapp: '919717056860',
    rating: 4.9,
    reviewsCount: 38,
    tags: ['Electric Vehicles', 'Automobile Accessories', 'Authorized Dealership'],
    isVerified: true,
    statusText: 'Admin Approved & Verified',
  },
  {
    id: 'BBN-CLM-982104',
    name: 'Choco Delights & Confectionery (Cadboury)',
    slug: 'choco-delights-confectionery-cadboury',
    category: 'Food, Bakeries & Confectionery',
    city: 'Mumbai, MH',
    phone: '+91 89653 26578',
    whatsapp: '918965326578',
    rating: 4.9,
    reviewsCount: 48,
    tags: ['Artisan Chocolates', 'Belgian Truffles', 'Gift Hampers'],
    isVerified: true,
    statusText: 'Admin Approved & Verified',
  },
  {
    id: '55555555-5555-5555-5555-555555555001',
    name: 'Apex Super Speciality Dental Clinic',
    slug: 'apex-super-speciality-dental-clinic',
    category: 'Healthcare & Clinics',
    city: 'Mumbai, MH',
    phone: '+91 98200 12345',
    whatsapp: '919820012345',
    rating: 4.9,
    reviewsCount: 124,
    tags: ['Invisalign', 'Root Canal', 'Dental Implants'],
    isVerified: true,
    statusText: 'Audited & Verified',
  },
  {
    id: '55555555-5555-5555-5555-555555555002',
    name: 'Little Elly International Preschool',
    slug: 'little-elly-international-preschool',
    category: 'Preschools & Education',
    city: 'Bengaluru, KA',
    phone: '+91 98450 67890',
    whatsapp: '919845067890',
    rating: 4.8,
    reviewsCount: 86,
    tags: ['Toddler Care', 'Pre-K Program', 'Daycare'],
    isVerified: true,
    statusText: 'Audited & Verified',
  },
  {
    id: 'BBN-CLM-419082',
    name: 'Greenfield EV Motors & Spares',
    slug: 'greenfield-ev-motors-kothrud-pune',
    category: 'Automobile & EV',
    city: 'Pune, MH',
    phone: '+91 97654 32100',
    whatsapp: '919765432100',
    rating: 4.7,
    reviewsCount: 52,
    tags: ['EV Two-Wheelers', 'Battery Swapping', 'Authorized Spares'],
    isVerified: true,
    statusText: 'Audited & Verified',
  },
  {
    id: 'BBN-DIR-005',
    name: 'Tata EV Mobility Hub',
    slug: 'tata-ev-mobility-hub-sector-63-noida',
    category: 'Automobile & EV',
    city: 'Noida, UP',
    phone: '+91 98188 44556',
    whatsapp: '919818844556',
    rating: 4.9,
    reviewsCount: 58,
    tags: ['Automobile Showrooms', 'Electric Cars', 'EV Fast Charging'],
    isVerified: true,
    statusText: 'Audited & Verified',
  },
  {
    id: '55555555-5555-5555-5555-555555555003',
    name: 'NexaByte Software & Cloud Labs',
    slug: 'nexabyte-software-cloud-labs',
    category: 'IT, Software & Technology',
    city: 'Bengaluru, KA',
    phone: '+91 98860 54321',
    whatsapp: '919886054321',
    rating: 4.9,
    reviewsCount: 42,
    tags: ['Custom Software', 'Cloud Architecture', 'Mobile Apps'],
    isVerified: true,
    statusText: 'Audited & Verified',
  },
  {
    id: 'BBN-DIR-004',
    name: 'Copper Chimney Fine Dining',
    slug: 'copper-chimney-worli-mumbai',
    category: 'Restaurants & Cafes',
    city: 'Mumbai, MH',
    phone: '+91 98210 55555',
    whatsapp: '919821055555',
    rating: 4.8,
    reviewsCount: 95,
    tags: ['North Indian', 'Dum Biryani', 'Banquet & Catering'],
    isVerified: true,
    statusText: 'Audited & Verified',
  },
];

// Exact Categories matching Reference Image 2
const visualCategories = [
  {
    name: 'Health',
    categorySlug: 'healthcare-clinics',
    query: 'Health',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Education',
    categorySlug: 'education-preschools',
    query: 'Education',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Food & Cafe',
    categorySlug: 'food-confectionery',
    query: 'Food',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Malls',
    categorySlug: 'retail-shopping',
    query: 'Mall',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Entertainment',
    categorySlug: 'restaurants-cafes',
    query: 'Entertainment',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Hobbies',
    categorySlug: 'education-preschools',
    query: 'Hobbies',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Real-Estate',
    categorySlug: 'real-estate-builders',
    query: 'Real Estate',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Citizens',
    categorySlug: 'legal-financial-services',
    query: 'Citizen Services',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Associations',
    categorySlug: 'it-software-technology',
    query: 'Associations',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Fashion Lifestyle',
    categorySlug: 'retail-shopping',
    query: 'Fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Pet & Animals',
    categorySlug: 'healthcare-clinics',
    query: 'Pet Veterinary',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Services',
    categorySlug: 'legal-financial-services',
    query: 'Services',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
  },
];

// Exact City Portals matching Reference Image 3
const cityPortals = [
  {
    name: 'Noidabn',
    cityQuery: 'noida',
    cityName: 'Noida Hub / NCR',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Greaternoidabn',
    cityQuery: 'noida',
    cityName: 'Greater Noida / Expressway',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Meerutbn',
    cityQuery: 'meerut',
    cityName: 'Meerut City / NCR',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Gurgaonbn',
    cityQuery: 'new-delhi',
    cityName: 'Gurugram / Cyber City',
    image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Dehradunbn',
    cityQuery: 'dehradun',
    cityName: 'Dehradun Valley',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Ghaziabadbn',
    cityQuery: 'noida',
    cityName: 'Ghaziabad / Indirapuram',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Haridwarbn',
    cityQuery: 'haridwar',
    cityName: 'Haridwar Ghats',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Lucknowbn',
    cityQuery: 'lucknow',
    cityName: 'Lucknow Heritage',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemFadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const },
  },
};

export default function HomePage() {
  const [verifiedBusinesses, setVerifiedBusinesses] = useState<VerifiedBusiness[]>(defaultVerifiedList);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Sync with Admin Approvals / localStorage / Cross-Port Sync
  useEffect(() => {
    const syncApprovedClaims = () => {
      try {
        let claimsData: any[] = [];
        const stored = localStorage.getItem('bharatbn_claims_store');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) claimsData = parsed;
          } catch {}
        }

        // Also check cross-port shared cookie
        try {
          const match = document.cookie.match(/bharatbn_approved_sync=([^;]+)/);
          if (match && match[1]) {
            const cookieClaims = JSON.parse(decodeURIComponent(match[1]));
            if (Array.isArray(cookieClaims)) {
              cookieClaims.forEach((cc: any) => {
                const idx = claimsData.findIndex((x) => x.id === cc.id);
                if (idx >= 0) claimsData[idx] = cc;
                else claimsData.push(cc);
              });
            }
          }
        } catch {}

        if (claimsData.length > 0) {
          const newApproved: VerifiedBusiness[] = claimsData
            .filter((c: any) => c.status === 'approved')
            .map((c: any) => ({
              id: c.id,
              name: c.businessName,
              slug:
                c.businessSlug ||
                c.slug ||
                (c.businessName || 'business').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              category: c.category || 'Automobile & EV',
              city: c.city || 'Noida, UP',
              phone: c.phone || '+91 97170 56860',
              whatsapp: (c.phone || c.whatsapp || '919717056860').replace(/[^0-9]/g, ''),
              rating: 4.9,
              reviewsCount: c.reviewsCount || 38,
              tags:
                Array.isArray(c.tags) && c.tags.length > 0
                  ? c.tags
                  : Array.isArray(c.services) && c.services.length > 0
                  ? c.services.slice(0, 3)
                  : ['Verified Enterprise', 'Govt Audited'],
              isVerified: true,
              statusText: 'Admin Approved & Verified',
            }));

          if (newApproved.length > 0) {
            setVerifiedBusinesses((prev) => {
              const map = new Map<string, VerifiedBusiness>();
              newApproved.forEach((b) => map.set(b.id, b));
              prev.forEach((b) => {
                if (!map.has(b.id)) map.set(b.id, b);
              });
              return Array.from(map.values());
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    syncApprovedClaims();
    window.addEventListener('bharatbn_claims_updated', syncApprovedClaims);
    window.addEventListener('bharatbn_auth_changed', syncApprovedClaims);
    window.addEventListener('storage', syncApprovedClaims);
    return () => {
      window.removeEventListener('bharatbn_claims_updated', syncApprovedClaims);
      window.removeEventListener('bharatbn_auth_changed', syncApprovedClaims);
      window.removeEventListener('storage', syncApprovedClaims);
    };
  }, []);

  // Butter-Smooth Auto-Sliding Carousel with Pause on Mouse Hover / Click
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationId: number;
    let accumulatedScroll = slider.scrollLeft;

    const autoScroll = () => {
      if (!isPaused && slider) {
        accumulatedScroll += 0.8;
        if (accumulatedScroll >= slider.scrollWidth - slider.clientWidth - 1) {
          accumulatedScroll = 0;
          slider.scrollLeft = 0;
        } else {
          slider.scrollLeft = accumulatedScroll;
        }
      } else if (slider) {
        accumulatedScroll = slider.scrollLeft;
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    animationId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const amount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section with 3D Connected Local Network Background */}
      <section className="relative pt-10 pb-12 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] z-30">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src="/bharatbn-network-3d.jpg"
            alt="BharatBN 3D Connected Local Business Network"
            fill
            priority
            quality={90}
            className="object-cover object-center opacity-30 blur-[2px] scale-[1.03] select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/70 via-transparent to-white/95" />
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[320px] bg-gradient-to-r from-brand-500/10 via-brandGold-400/10 to-indiaGreen-500/10 blur-3xl"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-20 max-w-7xl mx-auto text-center space-y-6"
        >
          <motion.div variants={itemFadeUp} className="inline-block">
            <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full border border-brand-200 shadow-xs text-xs font-semibold text-navy-900 hover:border-brand-400 transition">
              <span className="text-brandGold-500 font-bold">✦</span>
              <span className="tracking-wide">Bharat&apos;s Local Business Network</span>
              <span className="text-brandGold-500 font-bold">✦</span>
            </div>
          </motion.div>

          <motion.h1
            variants={itemFadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-navy-900 leading-tight max-w-5xl mx-auto drop-shadow-xs"
          >
            Discover Verified Businesses. <br className="hidden sm:inline" />
            <span className="text-brand-500">Grow High-Intent Visibility.</span>
          </motion.h1>

          <motion.p
            variants={itemFadeUp}
            className="text-base sm:text-lg text-slate-700 font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-xs"
          >
            Connect with top-rated clinics, schools, and franchise outlets across India. 
            Audited NAP details, direct WhatsApp inquiries, and guaranteed local rank visibility.
          </motion.p>

          <motion.div variants={itemFadeUp} className="pt-2 w-full">
            <SearchBar />
          </motion.div>
        </motion.div>
      </section>

      {/* ======================================================== */}
      {/* 2. SECTION: Categories (Matching Reference Image 2)      */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-1 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Categories
            </h2>
            <Link
              href="/search"
              className="text-xs sm:text-sm font-bold text-[#F95700] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-14 h-1 bg-[#F95700] rounded-full" />
        </div>

        {/* 12 Visual Cards Grid (Matching Reference Image 2: 6x2 layout) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {visualCategories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 aspect-[4/3] bg-slate-900"
            >
              <Link
                href={`/search?category=${cat.categorySlug}&q=${encodeURIComponent(cat.query)}`}
                className="block w-full h-full relative"
                title={`Explore ${cat.name} on BharatBN`}
              >
                {/* Background Photo */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30 group-hover:from-black/75 group-hover:via-black/30 group-hover:to-transparent transition duration-300" />

                {/* Gold/Orange Centered Text Title (Signature of Image 2) */}
                <div className="absolute inset-0 flex items-center justify-center p-2 text-center z-10">
                  <span className="font-extrabold text-sm sm:text-base text-[#F95700] group-hover:text-amber-400 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition transform group-hover:scale-105">
                    {cat.name}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION: Recent Listings (Auto-Sliding Carousel with Pause on Hover)   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Recent Listings
              </h2>
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Auto-Sliding Feed
              </span>
            </div>
            <div className="w-14 h-1 bg-[#F95700] rounded-full" />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByAmount('left')}
              className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition shadow-xs cursor-pointer text-slate-600 hover:text-slate-900"
              title="Slide Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount('right')}
              className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition shadow-xs cursor-pointer text-slate-600 hover:text-slate-900"
              title="Slide Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              href="/search"
              className="text-xs sm:text-sm font-bold text-[#F95700] hover:underline ml-2 hidden sm:inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Small Compact Cards Carousel (Pauses on Hover / Mouse Click) */}
        <div
          ref={sliderRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex items-stretch gap-4 overflow-x-auto py-3 px-1 no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Double array for infinite seamless looping */}
          {[...verifiedBusinesses, ...verifiedBusinesses].map((biz, idx) => (
            <div
              key={`${biz.id}-${idx}`}
              className="w-72 sm:w-80 flex-shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-[#F95700] hover:shadow-lg transition-all duration-300 p-4 flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                {/* Header Tag & Rating */}
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[100px]">
                      {biz.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[11px] font-bold text-amber-700">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{biz.rating}</span>
                    <span className="text-[9px] text-slate-400 font-normal">({biz.reviewsCount})</span>
                  </div>
                </div>

                {/* Business Name */}
                <Link
                  href={`/biz/${biz.slug}`}
                  className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#F95700] transition leading-snug line-clamp-1 block"
                  title={biz.name}
                >
                  {biz.name}
                </Link>

                <div className="text-[11px] text-slate-500 font-medium truncate">
                  {biz.category}
                </div>

                {/* Tags Preview */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {biz.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded truncate max-w-[130px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Phone & WhatsApp */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <a
                  href={`https://wa.me/${biz.whatsapp}?text=Hi%2C+I+found+${encodeURIComponent(biz.name)}+on+BharatBN`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>WhatsApp</span>
                </a>

                <Link
                  href={`/biz/${biz.slug}`}
                  className="inline-flex items-center gap-1 bg-slate-100 hover:bg-[#F95700] hover:text-white text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                >
                  <span>Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SECTION: City Portal (Matching Reference Image 3)    */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-1 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              City Portal
            </h2>
            <Link
              href="/search"
              className="text-xs sm:text-sm font-bold text-[#F95700] hover:underline flex items-center gap-1"
            >
              <span>All Cities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-14 h-1 bg-[#F95700] rounded-full" />
        </div>

        {/* 8 Visual City Cards Grid (Matching Reference Image 3: 4x2 layout) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {cityPortals.map((cp, index) => (
            <motion.div
              key={cp.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 aspect-[16/10] bg-slate-900"
            >
              <Link
                href={`/search?city=${cp.cityQuery}`}
                className="block w-full h-full relative"
                title={`Explore businesses in ${cp.cityName}`}
              >
                {/* Background Photo */}
                <Image
                  src={cp.image}
                  alt={cp.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-75"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30 group-hover:from-black/75 group-hover:via-black/30 group-hover:to-transparent transition duration-300" />

                {/* Gold/Orange Centered Text (Signature of Image 3) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center z-10">
                  <span className="font-extrabold text-base sm:text-lg text-[#F95700] group-hover:text-amber-400 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition transform group-hover:scale-105">
                    {cp.name}
                  </span>
                  <span className="text-[10px] text-slate-300 font-medium drop-shadow-xs mt-0.5">
                    {cp.cityName}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Featured Verified Business Profile Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: '#07213A' }}
          className="bg-[#07213A] bg-gradient-to-r from-[#041424] via-[#07213A] to-[#0c2a49] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-700/50"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-[#128807]/20 text-[#22c55e] border border-[#128807]/40 px-3 py-1 rounded-full text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" />
                Audited &amp; Verified Listing
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Apex Super Speciality Dental Clinic
              </h3>
              <p className="text-slate-200 text-sm leading-relaxed">
                Shop 4, Greenfield Heights, Lokhandwala Complex, Andheri West, Mumbai. Equipped with 3D digital imaging, certified Invisalign providers and 24x7 emergency dental trauma unit.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['Invisalign', 'Dental Implants', 'Root Canal', 'Teeth Whitening'].map((tag) => (
                  <span key={tag} className="bg-white/10 text-xs px-2.5 py-1 rounded-lg text-slate-100 border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="pt-4 flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/biz/apex-super-speciality-dental-clinic"
                    className="inline-block bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md shadow-brand-500/20"
                  >
                    View Profile &amp; Inquire
                  </Link>
                </motion.div>
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-400" /> Andheri West, Mumbai
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/15 space-y-4">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <span className="text-xs font-medium text-slate-200">Visibility Status</span>
                <span className="text-xs font-bold text-[#4ade80] flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Rank #8 in Mumbai
                </span>
              </div>
              <div className="text-xs text-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span>NAP Consistency Score:</span>
                  <span className="font-semibold text-white">100% (Audited)</span>
                </div>
                <div className="flex justify-between">
                  <span>Pay-As-You-Rank™ Milestone:</span>
                  <span className="font-semibold text-[#4ade80]">Top-10 Verified</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span className="font-semibold text-white">&lt; 15 mins via WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 6. Pay-As-You-Rank™ & Enterprise Value Prop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            whileHover={{ y: -4 }}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:border-indiaGreen-500/50 transition"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Pay-As-You-Rank™ Engine</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Don&apos;t pay upfront fees for empty promises. BharatBN offers milestone-verified keyword ranking:
              25% advance, 25% upon Top-20 verification, and 50% only when your business reaches Google Top-10.
            </p>
            <Link
              href="/dashboard/seo-campaigns"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Learn about Ranking Milestones <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            whileHover={{ y: -4 }}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:border-brand-500/50 transition"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Enterprise Franchise Network</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Manage 10 to 500+ outlets from a single Brand HQ dashboard. Bulk CSV branch onboarding, 
              isolated branch manager permissions, aggregated lead analytics, and unified local visibility.
            </p>
            <Link
              href="/enterprise"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-600"
            >
              Explore Enterprise Solutions <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 7. Claim CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: '#07213A' }}
          className="relative overflow-hidden bg-[#07213A] bg-gradient-to-r from-[#041424] via-[#07213A] to-[#041424] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700/50 shadow-lg"
        >
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-brandGold-400 to-[#128807]" />
          
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-brandGold-400 text-xs font-semibold uppercase tracking-wider">
              <span>✦</span> Verified Directory Partner
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Own a local business or clinic?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Claim your listing today with official proof to control your details and start receiving verified inquiries.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/claim/new"
              className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition text-sm shadow-md shadow-brand-500/20 whitespace-nowrap"
            >
              Claim Your Business Now
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}