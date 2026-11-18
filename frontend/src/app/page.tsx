'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import {
  Stethoscope,
  GraduationCap,
  Car,
  UtensilsCrossed,
  Building2,
  Briefcase,
  Sparkles,
  Wrench,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  ExternalLink,
  ChevronDown,
  Laptop,
  Factory,
  ShoppingBag,
  Truck,
} from 'lucide-react';

const categories = [
  { name: 'IT & Software Services', slug: 'it-software-technology', icon: Laptop, count: '16,500+' },
  { name: 'Healthcare & Clinics', slug: 'healthcare-clinics', icon: Stethoscope, count: '14,200+' },
  { name: 'Education & Coaching', slug: 'education-preschools', icon: GraduationCap, count: '9,800+' },
  { name: 'Automobile & EV', slug: 'automobile-ev-showrooms', icon: Car, count: '6,400+' },
  { name: 'Restaurants & Cafes', slug: 'restaurants-cafes', icon: UtensilsCrossed, count: '18,500+' },
  { name: 'Real Estate & Builders', slug: 'real-estate-builders', icon: Building2, count: '5,100+' },
  { name: 'Legal & CA Services', slug: 'legal-financial-services', icon: Briefcase, count: '4,300+' },
  { name: 'Retail & Supermarkets', slug: 'retail-shopping', icon: ShoppingBag, count: '11,200+' },
  { name: 'Manufacturing & Industrial', slug: 'manufacturing-industrial', icon: Factory, count: '7,400+' },
  { name: 'Home Services', slug: 'home-industrial-services', icon: Wrench, count: '12,600+' },
  { name: 'Logistics & Packers', slug: 'logistics-packers-movers', icon: Truck, count: '5,800+' },
  { name: 'Beauty & Spas', slug: 'beauty-spa-salons', icon: Sparkles, count: '8,900+' },
];

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
    id: 'BBN-CLM-982104',
    name: 'Choco Delights & Confectionery (Cadboury)',
    slug: 'choco-delights-confectionery-andheri-mumbai',
    category: 'Food, Bakeries & Confectionery',
    city: 'Mumbai, MH',
    phone: '+91 89653 26578',
    whatsapp: '918965326578',
    rating: 4.9,
    reviewsCount: 48,
    tags: ['Artisan Chocolates', 'Belgian Truffles', 'Gift Hampers', 'Same-Day Delivery'],
    isVerified: true,
    statusText: 'Admin Approved & Verified',
  },
  {
    id: '55555555-5555-5555-5555-555555555001',
    name: 'Apex Super Speciality Dental Clinic',
    slug: 'apex-super-speciality-dental-clinic-andheri-mumbai',
    category: 'Healthcare & Clinics',
    city: 'Mumbai, MH',
    phone: '+91 98200 12345',
    whatsapp: '919820012345',
    rating: 4.9,
    reviewsCount: 124,
    tags: ['Invisalign', 'Root Canal', 'Dental Implants', '24x7 Emergency'],
    isVerified: true,
    statusText: 'Audited & Verified',
  },
  {
    id: '55555555-5555-5555-5555-555555555002',
    name: 'Little Elly International Preschool',
    slug: 'little-elly-international-preschool-indiranagar-bengaluru',
    category: 'Preschools & Education',
    city: 'Bengaluru, KA',
    phone: '+91 98450 67890',
    whatsapp: '919845067890',
    rating: 4.8,
    reviewsCount: 86,
    tags: ['Toddler Care', 'Pre-K Program', 'Daycare', 'CCTV Enabled'],
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
  const [showAll, setShowAll] = useState(false);

  // Sync with Admin Approvals / localStorage
  useEffect(() => {
    const syncApprovedClaims = () => {
      try {
        const stored = localStorage.getItem('bharatbn_claims_store');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const newApproved: VerifiedBusiness[] = parsed
              .filter((c: any) => c.status === 'approved')
              .map((c: any) => ({
                id: c.id,
                name: c.businessName,
                slug: c.businessSlug || 'choco-delights-confectionery-andheri-mumbai',
                category: c.category || 'Food, Bakeries & Confectionery',
                city: c.city || 'Mumbai, MH',
                phone: c.phone || '+91 89653 26578',
                whatsapp: (c.phone || '918965326578').replace(/[^0-9]/g, ''),
                rating: 4.9,
                reviewsCount: 48,
                tags: ['Artisan Chocolates', 'Gift Hampers', 'Verified Partner'],
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
        }
      } catch (e) {
        console.error(e);
      }
    };

    syncApprovedClaims();
    window.addEventListener('bharatbn_claims_updated', syncApprovedClaims);
    return () => window.removeEventListener('bharatbn_claims_updated', syncApprovedClaims);
  }, []);

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Hero Section with 3D Connected Local Network Background (Softly Blurred & Compact) */}
      <section className="relative pt-10 pb-12 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] z-30">
        {/* Background Layer (Confines Background 3D Image & Ambient Glow with overflow-hidden) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src="/bharatbn-network-3d.jpg"
            alt="BharatBN 3D Connected Local Business Network"
            fill
            priority
            quality={90}
            className="object-cover object-center opacity-30 blur-[2px] scale-[1.03] select-none"
          />
          {/* Soft Atmospheric Light Wash for 100% Text & Search Clarity */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/70 via-transparent to-white/95" />

          {/* Animated background ambient glow orb */}
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
          {/* Logo Tagline Pill */}
          <motion.div variants={itemFadeUp} className="inline-block">
            <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full border border-brand-200 shadow-xs text-xs font-semibold text-navy-900 hover:border-brand-400 transition">
              <span className="text-brandGold-500 font-bold">✦</span>
              <span className="tracking-wide">Bharat&apos;s Local Business Network</span>
              <span className="text-brandGold-500 font-bold">✦</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemFadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-navy-900 leading-tight max-w-5xl mx-auto drop-shadow-xs"
          >
            Discover Verified Businesses. <br className="hidden sm:inline" />
            <span className="text-brand-500">Grow High-Intent Visibility.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemFadeUp}
            className="text-base sm:text-lg text-slate-700 font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-xs"
          >
            Connect with top-rated clinics, schools, and franchise outlets across India. 
            Audited NAP details, direct WhatsApp inquiries, and guaranteed local rank visibility.
          </motion.p>

          {/* Sleek SearchBar */}
          <motion.div variants={itemFadeUp} className="pt-2 w-full">
            <SearchBar />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. LIVE VERIFIED BUSINESSES GRID (Recently Approved / Active) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3"
        >
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-navy-900">
                Verified Local Businesses
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Audited &amp; Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Businesses approved through official proof documents (ROC, GSTIN, Shop Licenses)
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs sm:text-sm font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1 self-start sm:self-auto"
          >
            Explore All Listings <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Business Cards Grid with Framer Motion Stagger (Top 4 only by default) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {(showAll ? verifiedBusinesses : verifiedBusinesses.slice(0, 4)).map((biz, index) => (
            <motion.div
              key={biz.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-brand-400 hover:shadow-md transition p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Verified Business
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {biz.city}
                      </span>
                    </div>

                    <Link href={`/biz/${biz.slug}`}>
                      <h3 className="font-bold text-base sm:text-lg text-navy-900 hover:text-brand-600 transition leading-snug">
                        {biz.name}
                      </h3>
                    </Link>
                    <div className="text-xs text-slate-500 font-medium">{biz.category}</div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg text-xs font-bold text-amber-700 flex-shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{biz.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({biz.reviewsCount})</span>
                  </div>
                </div>

                {/* Service Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {biz.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-slate-600 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {biz.phone}
                </span>

                <div className="flex items-center gap-2">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={`https://wa.me/${biz.whatsapp}?text=Hi%2C+I+found+${encodeURIComponent(biz.name)}+on+BharatBN+and+want+to+inquire`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </motion.a>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href={`/biz/${biz.slug}`}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                    >
                      <span>Profile</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Action Button Bar */}
        {verifiedBusinesses.length > 4 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-[#F95700]/50 text-slate-700 hover:text-[#F95700] font-bold text-xs sm:text-sm shadow-xs hover:shadow transition"
            >
              <span>{showAll ? 'Show Top 4 Only' : `View All Verified Listings (${verifiedBusinesses.length})`}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  showAll ? 'rotate-180 text-[#F95700]' : ''
                }`}
              />
            </motion.button>

            <Link
              href="/search"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#F95700] hover:text-[#E24A00] px-3 py-2 hover:underline"
            >
              <span>Explore Full Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </section>

      {/* 3. Explore by Category with Staggered Card Entrance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-navy-900">Explore by Category</h2>
            <p className="text-sm text-slate-500">Verified service providers curated by domain specialists</p>
          </div>
          <Link href="/search" className="text-sm font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Link
                  href={`/search?category=${cat.slug}`}
                  className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-brand-500 hover:shadow-lg hover:shadow-brand-500/10 transition flex flex-col justify-between h-full"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="w-12 h-12 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center mb-4 group-hover:bg-brand-500 group-hover:text-white transition"
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-navy-900 group-hover:text-brand-500 transition text-sm">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{cat.count} listings</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Verified Business Profile Preview */}
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
                    href="/biz/apex-super-speciality-dental-clinic-andheri-mumbai"
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

      {/* 5. Pay-As-You-Rank™ & Enterprise Value Prop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Pay-As-You-Rank */}
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

          {/* Card 2: Enterprise Franchise */}
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

      {/* 6. Claim CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: '#07213A' }}
          className="relative overflow-hidden bg-[#07213A] bg-gradient-to-r from-[#041424] via-[#07213A] to-[#041424] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700/50 shadow-lg"
        >
          {/* Subtle logo accent line at bottom */}
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
