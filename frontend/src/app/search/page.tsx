'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import { realMigratedBusinesses } from '@/data/migratedBusinesses';
import {
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface DirectoryListing {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  city: string;
  citySlug: string;
  address: string;
  phone: string;
  whatsapp: string;
  image: string;
  logo?: string;
  rating: number;
  reviewsCount: number;
  services: string[];
  isVerified: boolean;
  isClaimed: boolean;
}

// Helper to resolve real official brand logos for featured & claimed entities
const getBusinessLogo = (slug: string = '', name: string = ''): string => {
  const s = slug.toLowerCase();
  const n = name.toLowerCase();
  if (s.includes('choco') || n.includes('choco') || n.includes('cadboury') || n.includes('cadbury')) {
    return '/choco-logo.svg';
  }
  if (s.includes('apex') || n.includes('apex') || n.includes('dental')) {
    return '/apex-logo.svg';
  }
  if (s.includes('apple') || n.includes('apple')) {
    return '/apple-logo.svg';
  }
  if (s.includes('elly') || n.includes('elly') || n.includes('preschool')) {
    return '/little-elly-logo.svg';
  }
  return '';
};

// Canonical verified flagship businesses with real official logos
const canonicalFeaturedListings: DirectoryListing[] = [
  {
    id: 'WP-88681',
    name: 'Bharrat Aeroplane Restaurant',
    slug: 'bharrat-aeroplane-restaurant',
    category: 'Food & Dining',
    categorySlug: 'food-confectionery',
    city: 'Mumbai, MH',
    citySlug: 'mumbai',
    address: 'Link Road, Metro Station Corridor, Andheri West, Mumbai – 400053',
    phone: '+91 98200 99881',
    whatsapp: '919820099881',
    image: '/biz/bharrat-aeroplane.png',
    logo: '/biz/bharrat-aeroplane.png',
    rating: 4.9,
    reviewsCount: 114,
    services: [
      'Aircraft Cabin Family Dining',
      'Cockpit Simulation Photo-Op',
      'Continental & North Indian Buffet',
      'South Indian Specialty Delicacies',
    ],
    isVerified: true,
    isClaimed: true,
  },
  {
    id: 'WP-88033',
    name: 'Discover the Best IVF Doctor in Noida – Dr. Sweta Gupta',
    slug: 'discover-the-best-ivf-doctor-in-noida-dr-sweta-gupta',
    category: 'Healthcare & Clinics',
    categorySlug: 'healthcare-clinics',
    city: 'Noida / NCR',
    citySlug: 'noida',
    address: '3D-5L, Wave City Centre, Sector 32, Noida – 201301',
    phone: '+91 81301 40007',
    whatsapp: '918130140007',
    image: '/biz/dr-sweta-gupta.png',
    logo: '/biz/dr-sweta-gupta.png',
    rating: 5.0,
    reviewsCount: 96,
    services: [
      'Advanced IVF & ICSI Cycles',
      'IUI Fertility Treatment',
      'Blastocyst Embryo Transfer',
      'Egg & Embryo Vitrification',
    ],
    isVerified: true,
    isClaimed: true,
  },
  {
    id: 'WP-88019',
    name: 'Best AI SEO Agency in India | NKTech Noida',
    slug: 'best-ai-seo-agency-in-india',
    category: 'IT & Software',
    categorySlug: 'it-software-technology',
    city: 'Noida / NCR',
    citySlug: 'noida',
    address: 'E Block, Sector 63, Noida, Uttar Pradesh 201301',
    phone: '+91 89208 77101',
    whatsapp: '918920877101',
    image: '/biz/nktech-ai-seo.png',
    logo: '/biz/nktech-ai-seo.png',
    rating: 5.0,
    reviewsCount: 88,
    services: [
      'Google AI Overviews (SGE) Ranking',
      'Pay-As-You-Rank™ Milestone Tracker',
      'Local SEO & Google Maps 3-Pack',
      'Enterprise Programmatic Lead Funnels',
    ],
    isVerified: true,
    isClaimed: true,
  },
  {
    id: 'WP-87913',
    name: 'Cotton Polyester Yarn Exporters in Panipat – Bhagwati Exports',
    slug: 'cotton-polyester-yarn-exporters-in-panipat',
    category: 'Manufacturing & Industrial',
    categorySlug: 'manufacturing-industrial',
    city: 'Panipat, Haryana',
    citySlug: 'panipat',
    address: 'Industrial Area, GT Road, Panipat, Haryana 132103',
    phone: '+91 98120 44550',
    whatsapp: '919812044550',
    image: '/biz/bhagwati-yarn-panipat.webp',
    logo: '/biz/bhagwati-yarn-panipat.webp',
    rating: 4.9,
    reviewsCount: 62,
    services: [
      'Recycled Cotton Yarn Spinning',
      'Open-End High Tenacity Polyester Yarn',
      'Melange & Dyed Weaving Blends',
      'Worldwide Containerized Export Logistics',
    ],
    isVerified: true,
    isClaimed: true,
  },
  {
    id: 'WP-87923',
    name: 'Best Robotic Knee Replacement Surgeon in Noida – Dr. Sanjay Gupta',
    slug: 'best-robotic-knee-replacement-surgeon-in-noida',
    category: 'Healthcare & Clinics',
    categorySlug: 'healthcare-clinics',
    city: 'Noida / NCR',
    citySlug: 'noida',
    address: '3D-5L, Wave City Centre, Sector 32, Noida – 201301',
    phone: '+91 886 044 4888',
    whatsapp: '918860444888',
    image: '/biz/dr-sanjay-gupta.png',
    logo: '/biz/dr-sanjay-gupta.png',
    rating: 5.0,
    reviewsCount: 73,
    services: [
      'Robotic Knee Replacement',
      'Joint Replacement Surgery',
      'Hip Replacement',
      'Sports Medicine & Arthroscopy',
      'AI Pre-Surgical 3D Planning',
    ],
    isVerified: true,
    isClaimed: true,
  },
  {
    id: 'BBN-CLM-982104',
    name: 'Choco Delights & Confectionery (Cadboury)',
    slug: 'choco-delights-confectionery-cadboury',
    category: 'Food & Dining',
    categorySlug: 'food-confectionery',
    city: 'Mumbai, MH',
    citySlug: 'mumbai',
    address: 'Shop 12, Crystal Plaza, New Link Road, Andheri West, Mumbai',
    phone: '+91 89653 26578',
    whatsapp: '918965326578',
    image: '',
    logo: '/choco-logo.svg',
    rating: 5.0,
    reviewsCount: 38,
    services: ['Handmade Truffles', 'Cadbury Gift Hampers', 'Dark Chocolate Slabs', 'Custom Cake Delivery'],
    isVerified: true,
    isClaimed: true,
  },
  {
    id: '55555555-5555-5555-5555-555555555001',
    name: 'Apex Super Speciality Dental Clinic',
    slug: 'apex-super-speciality-dental-clinic',
    category: 'Healthcare & Clinics',
    categorySlug: 'healthcare-clinics',
    city: 'Mumbai, MH',
    citySlug: 'mumbai',
    address: 'Shop 4, Greenfield Heights, Lokhandwala Complex, Andheri West, Mumbai',
    phone: '+91 98200 12345',
    whatsapp: '919820012345',
    image: '',
    logo: '/apex-logo.svg',
    rating: 5.0,
    reviewsCount: 42,
    services: ['Invisalign Aligners', 'Dental Implants', 'Root Canal Treatment', 'Teeth Whitening'],
    isVerified: true,
    isClaimed: true,
  },
  {
    id: 'BBN-SCH-NOIDA-44-001',
    name: 'Amity International School, Noida',
    slug: 'amity-international-school',
    category: 'Education & Schools',
    categorySlug: 'education-schools',
    city: 'Noida / NCR',
    citySlug: 'noida',
    address: 'Sector 44, Noida, Gautam Buddha Nagar, Uttar Pradesh 201303',
    phone: '+91 120 439 9000',
    whatsapp: '919818000000',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    logo: '',
    rating: 4.8,
    reviewsCount: 428,
    services: ['CBSE Affiliated K-12', 'Atal Tinkering Lab', 'Olympic Swimming & Turf', 'Robotics Academy'],
    isVerified: true,
    isClaimed: true,
  },
  {
    id: 'BBN-CLM-APPLE-01',
    name: 'Apple',
    slug: 'apple',
    category: 'Electronics & Appliances',
    categorySlug: 'electronics-appliances',
    city: 'Noida / NCR',
    citySlug: 'noida',
    address: 'Plot 18, Commercial Belt, Sector 63, Noida, Uttar Pradesh',
    phone: '+91 98110 99881',
    whatsapp: '919811099881',
    image: '',
    logo: '/apple-logo.svg',
    rating: 4.9,
    reviewsCount: 65,
    services: ['iPhone & Mac Sales', 'Official Apple Support', 'Device Diagnostics', 'Trade-in Upgrades'],
    isVerified: true,
    isClaimed: true,
  },
  {
    id: 'BBN-CLM-ELLY-01',
    name: 'Little Elly International Preschool',
    slug: 'little-elly-preschool',
    category: 'Education & Schools',
    categorySlug: 'education-schools',
    city: 'Noida / NCR',
    citySlug: 'noida',
    address: 'B-12, Sector 50, Noida, Uttar Pradesh 201301',
    phone: '+91 98180 55443',
    whatsapp: '919818055443',
    image: '',
    logo: '/little-elly-logo.svg',
    rating: 4.9,
    reviewsCount: 29,
    services: ['Playgroup & Nursery', 'Kindergarten (LKG & UKG)', 'Daycare & Activity Hub', 'Vedic Early Math'],
    isVerified: true,
    isClaimed: true,
  },
];

// Convert all clean real businesses into standardized DirectoryListing records
const defaultDirectoryListings: DirectoryListing[] = [
  ...canonicalFeaturedListings,
  ...realMigratedBusinesses.map((b) => {
    const matchedLogo = (b as any).logo || getBusinessLogo(b.slug, b.name);
    return {
      id: b.id,
      name: b.name,
      slug: b.slug,
      category: b.category,
      categorySlug: b.categorySlug || b.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      city: b.city,
      citySlug: b.citySlug || b.city.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      address: b.address || `${b.city}, India`,
      phone: b.phone || '+91 97170 56860',
      whatsapp: (b.whatsapp || b.phone || '919717056860').replace(/[^0-9]/g, ''),
      image: b.image || '',
      logo: matchedLogo,
      rating: Number(b.rating || 4.9),
      reviewsCount: b.reviewsCount || 24,
      services:
        b.services && b.services.length > 0
          ? b.services
          : b.tags && b.tags.length > 0
          ? b.tags
          : ['Audited Enterprise', 'Direct Inquiries'],
      isVerified: b.isVerified ?? true,
      isClaimed: b.isClaimed ?? false,
    };
  }),
];

// Top cities from real database
const TOP_CITIES = [
  { slug: 'greater-noida', name: 'Greater Noida', count: 1009 },
  { slug: 'ghaziabad', name: 'Ghaziabad', count: 89 },
  { slug: 'noida', name: 'Noida / NCR', count: 72 },
  { slug: 'meerut', name: 'Meerut', count: 68 },
  { slug: 'gurgaon', name: 'Gurgaon', count: 42 },
  { slug: 'dehradun', name: 'Dehradun', count: 34 },
  { slug: 'kanpur', name: 'Kanpur', count: 20 },
  { slug: 'delhi', name: 'Delhi', count: 8 },
  { slug: 'agra', name: 'Agra', count: 6 },
  { slug: 'mumbai', name: 'Mumbai', count: 5 },
  { slug: 'bengaluru', name: 'Bengaluru', count: 4 },
];

// Top categories from real database
const TOP_CATEGORIES = [
  { slug: 'healthcare-clinics', name: 'Healthcare & Clinics' },
  { slug: 'education-schools', name: 'Education & Schools' },
  { slug: 'it-software', name: 'IT & Software' },
  { slug: 'electronics-appliances', name: 'Electronics & Appliances' },
  { slug: 'fashion-retail', name: 'Fashion & Retail' },
  { slug: 'food-dining', name: 'Food & Dining' },
  { slug: 'travel-hospitality', name: 'Travel & Hospitality' },
  { slug: 'home-furniture', name: 'Home & Furniture' },
  { slug: 'weddings-events', name: 'Weddings & Events' },
  { slug: 'real-estate-properties', name: 'Real Estate & Properties' },
  { slug: 'verified-local-enterprise', name: 'Local Enterprises' },
];

const ITEMS_PER_PAGE = 20;

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const city = searchParams.get('city') || '';

  const [activeQuery, setActiveQuery] = useState(q);
  const [activeCity, setActiveCity] = useState(city);
  const [activeCategory, setActiveCategory] = useState(category);
  const [listings, setListings] = useState<DirectoryListing[]>(defaultDirectoryListings);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync state if URL query params change
  useEffect(() => {
    setActiveQuery(q);
    setCurrentPage(1);
  }, [q]);

  useEffect(() => {
    setActiveCity(city);
    setCurrentPage(1);
  }, [city]);

  useEffect(() => {
    setActiveCategory(category);
    setCurrentPage(1);
  }, [category]);

  // Hydrate user-submitted listings (like Apple or custom claims) from localStorage
  useEffect(() => {
    const syncListings = () => {
      if (typeof window === 'undefined') return;
      try {
        const stored = localStorage.getItem('bharatbn_claims_store');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const dynamic: DirectoryListing[] = parsed.map((c: any) => {
              const matchedLogo = c.logoUrl || c.logo || getBusinessLogo(c.businessSlug || '', c.businessName || '');
              return {
                id: c.id,
                name: c.businessName,
                slug: c.businessSlug || 'business',
                category: c.category || 'Automobile & EV',
                categorySlug: (c.category || 'automobile-ev').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                city: c.city || 'Noida',
                citySlug: (c.city || 'noida').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                address: c.addressLine || `${c.city || 'Local'}, ${c.state || ''}`,
                phone: c.phone || '+91 97170 56860',
                whatsapp: (c.phone || c.whatsapp || '919717056860').replace(/[^0-9]/g, ''),
                image: c.coverUrl || c.image || '',
                logo: matchedLogo,
                rating: 5.0,
                reviewsCount: 1,
                services:
                  Array.isArray(c.services) && c.services.length > 0
                    ? c.services
                    : ['Verified Business Profile', 'Direct Customer Inquiries'],
                isVerified: true,
                isClaimed: true,
              };
            });

            setListings((prev) => {
              const map = new Map<string, DirectoryListing>();
              dynamic.forEach((item) => map.set(item.id, item));
              prev.forEach((item) => {
                if (!map.has(item.id)) map.set(item.id, item);
              });
              return Array.from(map.values());
            });
          }
        }
      } catch (err) {
        console.error('Error hydrating search listings:', err);
      }
    };

    syncListings();
    window.addEventListener('bharatbn_claims_updated', syncListings);
    return () => window.removeEventListener('bharatbn_claims_updated', syncListings);
  }, []);

  const handlePerformSearch = (newQ: string, newCity: string, newCat: string) => {
    setActiveQuery(newQ);
    setActiveCity(newCity);
    setActiveCategory(newCat);
    setCurrentPage(1);
  };

  // Filter listings based on query, city, category
  const filteredListings = useMemo(() => {
    let result = listings;

    // 1. Category Filter
    if (activeCategory) {
      const actCat = activeCategory.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.categorySlug.toLowerCase().includes(actCat) ||
          b.category.toLowerCase().includes(actCat) ||
          actCat.includes(b.categorySlug.toLowerCase())
      );
    }

    // 2. Search Query Filter across name, category, services, tags, address, city
    if (activeQuery) {
      const rawQuery = activeQuery.toLowerCase().trim();
      const tokens = rawQuery
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter((t) => t.length > 2 && !['and', 'for', 'the', 'with', 'in', 'at'].includes(t));

      const matched = result.filter((b) => {
        const bServices = (b.services || []).map((s) => s.toLowerCase()).join(' ');
        const bText = `${b.name} ${b.category} ${b.city} ${b.address} ${b.slug} ${bServices}`.toLowerCase();

        if (bText.includes(rawQuery)) return true;
        if (tokens.length > 0 && tokens.some((token) => bText.includes(token))) return true;
        return false;
      });

      if (matched.length > 0) {
        result = matched;
      }
    }

    // 3. City Filter
    if (activeCity) {
      const actCity = activeCity.toLowerCase().trim();
      const cityMatches = result.filter(
        (b) =>
          b.citySlug.toLowerCase().includes(actCity) ||
          b.city.toLowerCase().includes(actCity) ||
          actCity.includes(b.citySlug.toLowerCase())
      );

      // If user selected city has matches, use them; otherwise return empty to trigger "other cities" notice
      return { matches: cityMatches, inOtherCities: cityMatches.length === 0 ? result : [] };
    }

    return { matches: result, inOtherCities: [] };
  }, [listings, activeCategory, activeQuery, activeCity]);

  const { matches: finalResults, inOtherCities: otherCityResults } = filteredListings;
  const displayItems = finalResults.length > 0 ? finalResults : otherCityResults;

  // Pagination calculation
  const totalPages = Math.ceil(displayItems.length / ITEMS_PER_PAGE);
  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return displayItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [displayItems, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const clearCityFilter = () => {
    setActiveCity('');
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (activeQuery) params.set('q', activeQuery);
    if (activeCategory) params.set('category', activeCategory);
    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const clearCategoryFilter = () => {
    setActiveCategory('');
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (activeQuery) params.set('q', activeQuery);
    if (activeCity) params.set('city', activeCity);
    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              BharatBN™ Verified Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse over 1,600+ audited businesses across NCR and All India with direct contact and WhatsApp details.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>1,617 Audited Listings</span>
          </div>
        </div>

        <SearchBar
          initialCity={activeCity}
          initialQuery={activeQuery}
          initialCategory={activeCategory}
          compact={true}
          onSearch={handlePerformSearch}
        />
      </div>

      {/* Results & Filter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* City Filter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Filter by City Hub
              </h3>
              {activeCity && (
                <button
                  type="button"
                  onClick={clearCityFilter}
                  className="text-[11px] font-bold text-[#F95700] hover:underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-1 text-xs">
              <Link
                href={`/search${activeCategory ? `?category=${activeCategory}` : ''}${
                  activeQuery ? `${activeCategory ? '&' : '?'}q=${encodeURIComponent(activeQuery)}` : ''
                }`}
                onClick={() => {
                  setActiveCity('');
                  setCurrentPage(1);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg font-medium transition ${
                  !activeCity
                    ? 'bg-[#F95700]/10 text-[#F95700] font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>🇮🇳 All India (All Cities)</span>
                <span className="text-[10px] text-slate-400 font-mono">1,617</span>
              </Link>
              {TOP_CITIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/search?city=${c.slug}${activeCategory ? `&category=${activeCategory}` : ''}${
                    activeQuery ? `&q=${encodeURIComponent(activeQuery)}` : ''
                  }`}
                  onClick={() => {
                    setActiveCity(c.slug);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg transition ${
                    activeCity === c.slug
                      ? 'bg-[#F95700]/10 text-[#F95700] font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({c.count})</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Filter by Category
              </h3>
              {activeCategory && (
                <button
                  type="button"
                  onClick={clearCategoryFilter}
                  className="text-[11px] font-bold text-[#F95700] hover:underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-1 text-xs max-h-72 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={clearCategoryFilter}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition font-medium ${
                  !activeCategory
                    ? 'bg-[#F95700]/10 text-[#F95700] font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {TOP_CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.slug);
                    setCurrentPage(1);
                    const params = new URLSearchParams();
                    params.set('category', cat.slug);
                    if (activeCity) params.set('city', activeCity);
                    if (activeQuery) params.set('q', activeQuery);
                    router.push(`/search?${params.toString()}`);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition truncate ${
                    activeCategory === cat.slug
                      ? 'bg-[#F95700]/10 text-[#F95700] font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200 gap-2">
            <span>
              Showing <span className="font-bold text-slate-800">{paginatedListings.length}</span> of{' '}
              <span className="font-bold text-slate-800">{displayItems.length}</span> listings
              {activeCity && ` in ${activeCity.toUpperCase()}`}
              {activeQuery && ` matching "${activeQuery}"`}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Audited NAP Details &amp; Direct WhatsApp
            </span>
          </div>

          {/* Smart Notice: If matched in other cities */}
          {finalResults.length === 0 && otherCityResults.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
              <div className="text-xs sm:text-sm">
                <span className="font-bold">No exact match in {activeCity.toUpperCase()}.</span> Found{' '}
                <span className="font-bold">{otherCityResults.length}</span> matching result(s) across All India:
              </div>
              <button
                type="button"
                onClick={clearCityFilter}
                className="px-3.5 py-1.5 bg-[#F95700] hover:bg-[#E54800] text-white rounded-lg text-xs font-bold transition whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                Search All India
              </button>
            </div>
          )}

          {/* Main Results Render */}
          {displayItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <p className="text-base font-semibold text-slate-700">No matching businesses found</p>
              <p className="text-sm text-slate-500">
                Try searching across All India or check your keywords.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveQuery('');
                  setActiveCity('');
                  setActiveCategory('');
                  setCurrentPage(1);
                  router.push('/search');
                }}
                className="inline-block bg-[#07213A] text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer hover:bg-[#0c2a49] transition"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            paginatedListings.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-[#F95700] hover:shadow-md transition-all duration-300 space-y-3 group"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Business Cover Image or Real Official Brand Logo */}
                  {(() => {
                    const resolvedLogo = item.logo || getBusinessLogo(item.slug, item.name);
                    if (item.image) {
                      return (
                        <div className="relative w-full sm:w-44 h-36 sm:h-32 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={(e) => {
                              // If image fails, hide broken image tag
                              e.currentTarget.style.display = 'none';
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2 left-2 z-10">
                            <span className="inline-flex items-center gap-1 bg-black/75 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-bold">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {Number(item.rating || 4.9).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="relative w-full sm:w-44 h-36 sm:h-32 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/80 flex flex-col items-center justify-center p-3 text-center flex-shrink-0 group-hover:border-[#F95700]/40 transition">
                        {resolvedLogo ? (
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200/80 shadow-xs flex items-center justify-center p-1.5 mb-1.5 group-hover:scale-105 transition-transform">
                            <img
                              src={resolvedLogo}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#07213A] to-[#1b4d7e] text-white font-mono font-bold text-sm flex items-center justify-center mb-1.5 shadow-xs">
                            {item.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider line-clamp-1">
                          {item.city}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 font-bold mt-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {Number(item.rating || 4.9).toFixed(1)}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Main Details */}
                  <div className="flex-1 min-w-0 space-y-1.5 w-full">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">
                          {item.category}
                        </span>
                        {item.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Audited Enterprise
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Under Review
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
                        {item.city}
                      </span>
                    </div>

                    <Link
                      href={`/biz/${item.slug}`}
                      className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#F95700] transition line-clamp-1 block leading-snug"
                      title={item.name}
                    >
                      {item.name}
                    </Link>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">
                        {item.address ? `${item.address}` : `${item.city}, Uttar Pradesh`}
                      </span>
                    </div>

                    {/* Services/Tags Preview */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.services.slice(0, 3).map((service) => (
                        <span
                          key={service}
                          className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded truncate max-w-[200px]"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-600 font-mono flex items-center gap-1 text-xs">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {item.phone}
                    </span>

                    <a
                      href={`https://wa.me/${item.whatsapp}?text=Hi%2C+I+found+${encodeURIComponent(
                        item.name
                      )}+on+BharatBN`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 font-bold inline-flex items-center gap-1 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      WhatsApp Inquiry
                    </a>
                  </div>

                  <Link
                    href={`/biz/${item.slug}`}
                    className="inline-flex items-center justify-center gap-1.5 bg-[#07213A] hover:bg-[#F95700] text-white text-xs font-bold px-4 py-2 rounded-lg transition whitespace-nowrap self-stretch sm:self-auto cursor-pointer shadow-xs"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-1 text-xs text-slate-600">
                <span>Page</span>
                <span className="font-bold text-slate-900">{currentPage}</span>
                <span>of</span>
                <span className="font-bold text-slate-900">{totalPages}</span>
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-xs"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-400">
          Loading directory search...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
