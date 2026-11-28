'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import { getRealMetrics, toggleRealFollow } from '@/lib/realMetrics';
import { realMigratedBusinesses, VerifiedBusiness } from '@/data/migratedBusinesses';
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
  UserPlus,
  UserCheck,
  Stethoscope,
  GraduationCap,
  Scale,
  Briefcase,
  Users,
  User,
  Lock,
  LogIn,
  X,
  Check,
  Zap,
  Plus,
} from 'lucide-react';

interface PersonItem {
  id: string;
  name: string;
  slug: string;
  handle: string;
  role: string;
  badge: string;
  category: 'doctors' | 'teachers' | 'tech' | 'public-figures' | 'lawyers' | 'business' | 'creators';
  location: string;
  quote: string;
  avatarUrl?: string;
  coverUrl?: string;
  followersCount: string;
  isVerified: boolean;
}

const personCategories = [
  { id: 'all', label: 'All Profiles', icon: Users },
  { id: 'doctors', label: 'Doctors & Healthcare', icon: Stethoscope },
  { id: 'teachers', label: 'Teachers & Educators', icon: GraduationCap },
  { id: 'tech', label: 'Tech & AI Innovators', icon: Sparkles },
  { id: 'public-figures', label: 'Public Figures & Speakers', icon: Award },
  { id: 'lawyers', label: 'Lawyers & Legal', icon: Scale },
  { id: 'business', label: 'Business Leaders', icon: Briefcase },
  { id: 'creators', label: 'Creators & Artists', icon: Star },
];

const defaultPeopleList: PersonItem[] = [
  {
    id: 'BBN-PPL-AI-001',
    name: 'AI',
    slug: 'ai',
    handle: '@ai',
    role: 'Autonomous AI Researcher & Platform Pioneer',
    badge: 'AI Innovator',
    category: 'tech',
    location: 'Bengaluru, KA',
    quote: 'Empowering 1.4 Billion Indians with sovereign AI innovation and smart discovery.',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3hEgLT9ydPe-iOHF398fMJVnm1uzTONhg_QOIdUI2uP9_uAzy9s2Kx_I_vCL1VKGcriHuGeSVJCWeON9JvPqcVeFBpbAPuVEnCtDyLBvmixloh9FSU2lFkMbq0JLuRRhkRrwvARsAF20IB_RytUQmF4OquaihJpOVa-E-lJdrtePNSAWffnmdmjlc3asHGZpx8bIX656Xb3kNa-lUWpr5oZsYcHYyiOJdyz7kjJ7H',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYSUhv8qFdTnnRGsNAMIodkXX0JD851DdEEFZidhiMf0IJI9fducFeP_AbYkdlDZhpIAIDfCFfWo1Ssb3e9sLiJNTBxiS42nk04eIPNYSWMZlvbkMlk1aWJvwnbCnlZeyQrxJSzs_M-nDOJ1-91icAzOhUDYGRxpOswczlXQXpB0bUMEcEQ0TpDljkflpRELm-yycCEdmicbcVubBtWZRKW9gkvD7RsRhrb5579quG',
    followersCount: '0',
    isVerified: true,
  },
  {
    id: 'BBN-PPL-KASHISH-001',
    name: 'Kashish Saxena',
    slug: 'kashish',
    handle: '@kashish',
    role: 'Public Figure & Speaker',
    badge: 'Public Figure',
    category: 'public-figures',
    location: 'noida',
    quote: 'hi',
    avatarUrl: '/people/kashish-avatar.png',
    coverUrl: '/people/kashish-cover.jpg',
    followersCount: '0',
    isVerified: true,
  },
  {
    id: 'BBN-PPL-ANAND-SAHU-001',
    name: 'Anand Sahu',
    slug: 'anand-sahu',
    handle: '@anandsahu',
    role: 'Nationalist Thinker & Speaker',
    badge: 'Public Figure',
    category: 'public-figures',
    location: 'New Delhi, India',
    quote: 'Thoughts for Nation Building and a Stronger India.',
    avatarUrl: '/people/anand-sahu-avatar.jpg',
    coverUrl: '/people/anand-sahu-cover.jpg',
    followersCount: '0',
    isVerified: true,
  },
  {
    id: 'BBN-PPL-SWETA-GUPTA-001',
    name: 'Dr. Sweta Gupta',
    slug: 'dr-sweta-gupta',
    handle: '@drswetagupta',
    role: 'Medical Director & Senior IVF Specialist | MBBS, MD, DNB, MRCOG (UK)',
    badge: 'Medical Leader',
    category: 'doctors',
    location: 'Sector 32, Noida, UP',
    quote: 'Compassionate reproductive care and international clinical excellence for every aspiring family.',
    avatarUrl: '/people/dr-sweta-gupta.png',
    coverUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    followersCount: '1680',
    isVerified: true,
  },
  {
    id: 'BBN-PPL-SANJAY-GUPTA-001',
    name: 'Dr. Sanjay Gupta',
    slug: 'dr-sanjay-gupta',
    handle: '@drsanjaygupta',
    role: 'Chief Robotic Knee Replacement Surgeon | MS Orthopedics, MCh Orth (UK), FRCS',
    badge: 'Medical Leader',
    category: 'doctors',
    location: 'Sector 32, Noida, UP',
    quote: 'Global surgical excellence and robotic precision for painless, lasting joint mobility.',
    avatarUrl: '/people/dr-sanjay-gupta.png',
    coverUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    followersCount: '1420',
    isVerified: true,
  },
  {
    id: 'BBN-PPL-RAJESH-002',
    name: 'Dr. Rajesh Sharma',
    slug: 'dr-rajesh-sharma',
    handle: '@dr_rajesh',
    role: 'Healthcare Pioneer & Dental Surgeon',
    badge: 'Healthcare',
    category: 'doctors',
    location: 'Mumbai, MH',
    quote: 'Making world-class preventive dental healthcare accessible for every Indian.',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    followersCount: '0',
    isVerified: true,
  },
  {
    id: 'BBN-PPL-PRIYA-DOC-005',
    name: 'Dr. Priya Sharma',
    slug: 'dr-priya-sharma',
    handle: '@drpriya_cardio',
    role: 'Senior Consultant Cardiologist & Medical Researcher',
    badge: 'Senior Doctor',
    category: 'doctors',
    location: 'AIIMS, New Delhi',
    quote: 'Preventive cardiology and sovereign clinical trials for affordable Indian heart care.',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    followersCount: '0',
    isVerified: true,
  },
  {
    id: 'BBN-PPL-RAKESH-EDU-006',
    name: 'Prof. Rakesh Verma',
    slug: 'prof-rakesh-verma',
    handle: '@prof_rakesh',
    role: 'Physics Professor & National Educator',
    badge: 'National Educator',
    category: 'teachers',
    location: 'Kota / Jaipur, RJ',
    quote: 'Conceptual clarity and scientific temper for every aspiring student in India.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    followersCount: '0',
    isVerified: true,
  },
  {
    id: 'BBN-PPL-MEENAKSHI-EDU-007',
    name: 'Dr. Meenakshi Iyer',
    slug: 'dr-meenakshi-iyer',
    handle: '@meenakshi_edu',
    role: 'Higher Education Dean & Sanskrit Scholar',
    badge: 'Academician',
    category: 'teachers',
    location: 'Chennai, TN',
    quote: 'Ancient wisdom combined with modern critical thinking for national resurgence.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    followersCount: '0',
    isVerified: true,
  },
  {
    id: 'BBN-PPL-RAJESHWAR-LAW-008',
    name: 'Adv. Rajeshwar Dayal',
    slug: 'adv-rajeshwar-dayal',
    handle: '@adv_rajeshwar',
    role: 'Senior Advocate & Constitutional Jurist',
    badge: 'Senior Counsel',
    category: 'lawyers',
    location: 'Supreme Court, New Delhi',
    quote: 'Defending the rule of law and constitutional justice for every citizen.',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    followersCount: '0',
    isVerified: true,
  },
  {
    id: 'BBN-PPL-VIKRAM-004',
    name: 'Vikram Singhania',
    slug: 'vikram-singhania',
    handle: '@vikram_singhania',
    role: 'Franchise Enterprise Strategist',
    badge: 'Advisor',
    category: 'business',
    location: 'Gurugram, HR',
    quote: 'Scaling Bharat homegrown brands into nationwide consumer powerhouses.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    followersCount: '0',
    isVerified: true,
  },
  {
    id: 'BBN-PPL-PRIYA-003',
    name: 'Priya Menon',
    slug: 'priya-menon',
    handle: '@priyamenon_ev',
    role: 'Clean Tech & EV Policy Advocate',
    badge: 'Policy Voice',
    category: 'business',
    location: 'Bengaluru, KA',
    quote: 'Sustainable green mobility and public EV infrastructure for modern India.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80',
    followersCount: '0',
    isVerified: true,
  },
];

// Helper to resolve official brand logos
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

const flagshipVerifiedBusinesses: VerifiedBusiness[] = [
  // 5 GlobalBN Featured Listings (Matching Official Mosaic Showcase)
  {
    id: 'WP-88681',
    wpId: 88681,
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
    rating: 4.9,
    reviewsCount: 114,
    tags: ['Aeroplane Restaurant', 'Fine Dining', 'Continental', 'North Indian', 'Family Dining'],
    isVerified: true,
    isClaimed: true,
  },
  {
    id: 'WP-88033',
    wpId: 88033,
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
    rating: 5.0,
    reviewsCount: 96,
    tags: ['Best IVF Doctor in Noida', 'Dr. Sweta Gupta', 'IVF Clinic', 'Fertility Specialist'],
    isVerified: true,
    isClaimed: true,
  },
  {
    id: 'WP-88019',
    wpId: 88019,
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
    rating: 5.0,
    reviewsCount: 88,
    tags: ['AI SEO Agency', 'Digital Marketing Agency', 'Google AI Overviews', 'Local SEO'],
    isVerified: true,
    isClaimed: true,
  },
  {
    id: 'WP-87923',
    wpId: 87923,
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
    rating: 5.0,
    reviewsCount: 73,
    tags: ['Robotic Knee Surgery', 'Joint Replacement', 'Dr. Sanjay Gupta', 'Orthopedic Surgeon'],
    isVerified: true,
    isClaimed: true,
  },
  {
    id: 'WP-87913',
    wpId: 87913,
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
    rating: 4.9,
    reviewsCount: 62,
    tags: ['Cotton Polyester Yarn Exporters', 'Bhagwati Exports', 'Panipat Weavers', 'Yarn Mills'],
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
    rating: 5.0,
    reviewsCount: 38,
    tags: ['Cadbury Chocolates', 'Bakery', 'Desserts', 'Custom Cakes'],
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
    rating: 5.0,
    reviewsCount: 42,
    tags: ['Invisalign', 'Dental Implants', 'Teeth Whitening'],
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
    rating: 4.8,
    reviewsCount: 428,
    tags: ['CBSE Affiliated', 'Atal Tinkering Lab', 'Sports Complex'],
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
    rating: 4.9,
    reviewsCount: 65,
    tags: ['iPhone', 'MacBook', 'Authorized Support'],
    isVerified: true,
    isClaimed: true,
  },
];

const defaultVerifiedList: VerifiedBusiness[] = [
  ...flagshipVerifiedBusinesses,
  ...realMigratedBusinesses
    .filter((b) => b.image && b.image.includes('globalbn.com'))
    .slice(0, 36),
];

// Exact Categories matching Reference with Badges and Subtitles
const visualCategories = [
  {
    name: 'Healthcare & Clinics',
    categorySlug: 'healthcare-clinics',
    query: 'Healthcare',
    tag: 'Top Rated',
    subtitle: '3,420+ Certified Centers',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'CBSE & ICSE Schools',
    categorySlug: 'education-preschools',
    query: 'Education',
    tag: 'Audited',
    subtitle: '1,890+ Verified Campuses',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Artisan Roasters & F&B',
    categorySlug: 'food-confectionery',
    query: 'Food',
    tag: 'Trending',
    subtitle: '940+ Food Enterprises',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Franchise Head Units',
    categorySlug: 'retail-shopping',
    query: 'Franchise',
    tag: 'High ROI',
    subtitle: '620+ Active Brands',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Precision Manufacturing',
    categorySlug: 'manufacturing-industrial',
    query: 'Manufacturing',
    tag: 'MSME Gold',
    subtitle: '4,110+ Units Audited',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'CA & Legal Audits',
    categorySlug: 'legal-financial-services',
    query: 'Legal CA',
    tag: 'Direct Desk',
    subtitle: '2,300+ Verified Desks',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'IT & Software Hubs',
    categorySlug: 'it-software-technology',
    query: 'Software',
    tag: 'High Intent',
    subtitle: 'Web, Apps & Cloud Tech',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Real Estate & Builders',
    categorySlug: 'real-estate-builders',
    query: 'Real Estate',
    tag: 'Verified',
    subtitle: 'Commercial, Plots & Homes',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Automobile & EV Hubs',
    categorySlug: 'automobile-ev-showrooms',
    query: 'EV Auto',
    tag: 'Trending',
    subtitle: 'Showrooms, Dealers & Charging',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Retail & Supermarkets',
    categorySlug: 'retail-shopping',
    query: 'Mall Retail',
    tag: 'Popular',
    subtitle: 'Shopping Centers & Stores',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=600&q=80',
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
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Auto-scroll Categories States & Ref
  const [isCategoryPaused, setIsCategoryPaused] = useState(false);
  const [categoryProgress, setCategoryProgress] = useState(0);
  const categoriesSliderRef = useRef<HTMLDivElement>(null);

  // People & Category Filter States
  const [peopleList, setPeopleList] = useState<PersonItem[]>(defaultPeopleList);
  const [selectedPersonCategory, setSelectedPersonCategory] = useState<string>('all');
  const [ownerSession, setOwnerSession] = useState<any>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [followedSlugs, setFollowedSlugs] = useState<string[]>([]);
  const peopleSliderRef = useRef<HTMLDivElement>(null);

  // Admin-managed BharatBN Hero Background Banner
  const [homeBanner, setHomeBanner] = useState<{
    enabled: boolean;
    heroTheme: 'dark' | 'light';
    imageUrl: string;
  }>({
    enabled: true,
    heroTheme: 'dark',
    imageUrl: '/hero-bg.jpg',
  });

  useEffect(() => {
    const loadHomeBanner = async () => {
      try {
        const res = await fetch('/api/sync', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data?.homeBanner) {
            setHomeBanner((prev) => ({ ...prev, ...data.homeBanner }));
          }
        }
      } catch { }
    };
    loadHomeBanner();
  }, []);

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
          } catch { }
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
        } catch { }

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

    const syncPeople = () => {
      try {
        const stored = localStorage.getItem('bharatbn_people_store');
        const sessionStr = localStorage.getItem('bharatbn_owner_session');
        const sess = sessionStr ? JSON.parse(sessionStr) : null;
        const isSessPerson = sess && sess.accountType === 'person';
        const sessSlug = isSessPerson ? (sess.slug || sess.handle?.replace(/^@/, '') || '').toLowerCase().trim() : '';

        setPeopleList((prev) => {
          const map = new Map<string, PersonItem>();

          // 1. Load from bharatbn_people_store
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed) && parsed.length > 0) {
                let hasRepairs = false;
                parsed.forEach((p: any) => {
                  const slug = (p.slug || p.handle?.replace(/^@/, '') || 'creator').toLowerCase().trim();
                  const isKashish = slug === 'kashish' || p.name?.toLowerCase().includes('kashish');
                  const isAnand = slug === 'anand-sahu' || slug === 'anand' || p.name?.toLowerCase().includes('anand sahu');

                  let cat: PersonItem['category'] = (isKashish || isAnand) ? 'public-figures' : 'creators';
                  const lower = (p.role || p.badge || p.category || '').toLowerCase();
                  if (isKashish || isAnand) {
                    cat = 'public-figures';
                  } else if (lower.includes('doctor') || lower.includes('health') || lower.includes('clinic') || lower.includes('dental')) {
                    cat = 'doctors';
                  } else if (lower.includes('teach') || lower.includes('professor') || lower.includes('edu') || lower.includes('school')) {
                    cat = 'teachers';
                  } else if (lower.includes('ai') || lower.includes('tech') || lower.includes('software') || lower.includes('cloud')) {
                    cat = 'tech';
                  } else if (lower.includes('public') || lower.includes('speaker') || lower.includes('thinker') || lower.includes('nationalist')) {
                    cat = 'public-figures';
                  } else if (lower.includes('law') || lower.includes('advocate') || lower.includes('legal') || lower.includes('jurist')) {
                    cat = 'lawyers';
                  } else if (lower.includes('franchise') || lower.includes('business') || lower.includes('ceo') || lower.includes('founder')) {
                    cat = 'business';
                  }

                  const cleanRole = isKashish ? 'Public Figure & Speaker' : (isAnand ? 'Nationalist Thinker & Speaker' : (p.role || 'Verified Public Voice'));
                  const cleanBadge = isKashish ? 'Public Figure' : (isAnand ? 'Public Figure' : (p.badge || 'Verified'));
                  const cleanLocation = isKashish ? 'noida' : (isAnand ? 'New Delhi, India' : (p.location || 'India'));
                  const cleanQuote = isKashish ? 'hi' : (isAnand ? 'Thoughts for Nation Building and a Stronger India.' : (p.quote || (p.aboutText ? p.aboutText.slice(0, 90) : 'Verified Profile on BharatBN.')));

                  // Prioritize user custom avatar
                  const hasCustomAvatar = p.avatarUrl && typeof p.avatarUrl === 'string' && p.avatarUrl.trim() !== '' && !p.avatarUrl.includes('534528741775');
                  let cleanAvatar = hasCustomAvatar
                    ? p.avatarUrl
                    : (isKashish ? '/people/kashish-avatar.png' : (isAnand ? '/people/anand-sahu-avatar.jpg' : ''));

                  // Prioritize user custom cover
                  const hasCustomCover = p.coverUrl && typeof p.coverUrl === 'string' && p.coverUrl.trim() !== '' && !p.coverUrl.includes('photo-1541872703-74c5e44368f9') && !p.coverUrl.includes('photo-1579546929518') && !p.coverUrl.includes('photo-1598488035139');
                  let cleanCover = hasCustomCover
                    ? p.coverUrl
                    : (isKashish ? '/people/kashish-cover.jpg' : (isAnand ? '/people/anand-sahu-cover.jpg' : ''));

                  // If logged in session has custom avatar or cover, session overrides
                  if (isSessPerson && (sessSlug === slug || (isKashish && sessSlug === 'kashish'))) {
                    if (sess.avatarUrl && sess.avatarUrl.trim() !== '' && !sess.avatarUrl.includes('534528741775')) {
                      cleanAvatar = sess.avatarUrl;
                      p.avatarUrl = sess.avatarUrl;
                      hasRepairs = true;
                    }
                    if (sess.coverUrl && sess.coverUrl.trim() !== '' && !sess.coverUrl.includes('photo-1541872703-74c5e44368f9') && !sess.coverUrl.includes('photo-1579546929518') && !sess.coverUrl.includes('photo-1598488035139')) {
                      cleanCover = sess.coverUrl;
                      p.coverUrl = sess.coverUrl;
                      hasRepairs = true;
                    }
                  }

                  // Authentic BharatBN real followers only
                  const realFollowers = String(getRealMetrics(slug).followersCount);
                  if (p.followersCount !== realFollowers) {
                    p.followersCount = realFollowers;
                    hasRepairs = true;
                  }
                  const cleanFollowers = realFollowers;

                  // Only heal if stale Obama photo or broken image ID
                  if (p.coverUrl && (p.coverUrl.includes('photo-1541872703-74c5e44368f9') || p.coverUrl.includes('photo-1579546929518') || p.coverUrl.includes('photo-1598488035139'))) {
                    p.coverUrl = cleanCover;
                    hasRepairs = true;
                  }
                  if (p.avatarUrl && p.avatarUrl.includes('534528741775')) {
                    p.avatarUrl = cleanAvatar;
                    hasRepairs = true;
                  }

                  map.set(slug, {
                    id: p.id || `PPL-${slug}`,
                    name: p.name || (isAnand ? 'Anand Sahu' : 'Creator'),
                    slug,
                    handle: p.handle || `@${slug}`,
                    role: cleanRole,
                    badge: cleanBadge,
                    category: cat,
                    location: cleanLocation,
                    quote: cleanQuote,
                    avatarUrl: cleanAvatar,
                    coverUrl: cleanCover,
                    followersCount: cleanFollowers,
                    isVerified: (isKashish || isAnand) ? true : (p.isVerified !== false),
                  });
                });

                if (hasRepairs) {
                  try {
                    localStorage.setItem('bharatbn_people_store', JSON.stringify(parsed));
                  } catch { }
                }
              }
            } catch { }
          }

          // 2. Merge logged-in person session directly
          if (isSessPerson && sess.name) {
            const slug = sessSlug || 'kashish';
            const isKashish = slug === 'kashish' || sess.name?.toLowerCase().includes('kashish');
            const isAnand = slug === 'anand-sahu' || slug === 'anand' || sess.name?.toLowerCase().includes('anand sahu');
            const existing = map.get(slug);

            const sAvatar = (sess.avatarUrl && !sess.avatarUrl.includes('534528741775'))
              ? sess.avatarUrl
              : (existing?.avatarUrl || (isKashish ? '/people/kashish-avatar.png' : ''));
            const sCover = (sess.coverUrl && !sess.coverUrl.includes('photo-1541872703-74c5e44368f9') && !sess.coverUrl.includes('photo-1579546929518') && !sess.coverUrl.includes('photo-1598488035139'))
              ? sess.coverUrl
              : (existing?.coverUrl || (isKashish ? '/people/kashish-cover.jpg' : '/people/anand-sahu-cover.jpg'));

            map.set(slug, {
              id: sess.personId || existing?.id || `PPL-${slug}`,
              name: sess.name,
              slug,
              handle: sess.handle || `@${slug}`,
              role: isKashish ? 'Public Figure & Speaker' : (sess.role || existing?.role || 'Creator'),
              badge: isKashish ? 'Public Figure' : (sess.badge || existing?.badge || 'Creator'),
              category: (isKashish || isAnand) ? 'public-figures' : (existing?.category || 'creators'),
              location: isKashish ? 'noida' : (sess.location || existing?.location || 'India'),
              quote: isKashish ? 'hi' : (sess.quote || existing?.quote || 'Verified Profile on BharatBN.'),
              avatarUrl: sAvatar,
              coverUrl: sCover,
              followersCount: String(getRealMetrics(slug).followersCount),
              isVerified: (isKashish || isAnand) ? true : Boolean(sess.isVerified ?? existing?.isVerified ?? true),
            });
          }

          // 3. Fallback to defaultPeopleList if not already present
          defaultPeopleList.forEach((dp) => {
            const realCount = String(getRealMetrics(dp.slug).followersCount);
            if (!map.has(dp.slug)) {
              map.set(dp.slug, {
                ...dp,
                followersCount: realCount,
              });
            } else {
              const existing = map.get(dp.slug)!;
              map.set(dp.slug, {
                ...dp,
                ...existing,
                avatarUrl: existing.avatarUrl || dp.avatarUrl,
                coverUrl: existing.coverUrl || dp.coverUrl,
                followersCount: realCount,
              });
            }
          });

          const prioritySlugs = ['ai', 'kashish', 'anand-sahu', 'dr-rajesh-sharma'];
          return Array.from(map.values()).sort((a, b) => {
            const idxA = prioritySlugs.indexOf(a.slug);
            const idxB = prioritySlugs.indexOf(b.slug);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return 0;
          });
        });

        // 4. Hydrate from central sync cache (/api/sync)
        fetch('/api/sync')
          .then((r) => r.json())
          .then((syncData) => {
            if (syncData?.people && typeof syncData.people === 'object') {
              setPeopleList((prevPeople) => {
                const nextMap = new Map<string, PersonItem>();
                prevPeople.forEach((p) => nextMap.set(p.slug, p));

                let localSess: any = null;
                try {
                  const s = localStorage.getItem('bharatbn_owner_session');
                  if (s) localSess = JSON.parse(s);
                } catch { }

                Object.entries(syncData.people).forEach(([key, remote]: [string, any]) => {
                  const s = key.toLowerCase().trim();
                  if (nextMap.has(s)) {
                    const cur = nextMap.get(s)!;
                    const isAnand = s === 'anand-sahu' || s === 'anand';
                    const isKashish = s === 'kashish' || s === 'kashish-saxena';
                    const isCurrentSess = localSess && (localSess.slug?.toLowerCase() === s || (isKashish && (localSess.name?.toLowerCase().includes('kashish') || localSess.slug === 'kashish')));

                    let remoteAvatar = remote.avatarUrl && typeof remote.avatarUrl === 'string' && remote.avatarUrl.trim() !== '' && !remote.avatarUrl.includes('534528741775') && !remote.avatarUrl.includes('photo-1541872703') ? remote.avatarUrl : null;
                    let remoteCover = remote.coverUrl && typeof remote.coverUrl === 'string' && remote.coverUrl.trim() !== '' && !remote.coverUrl.includes('photo-1541872703') && !remote.coverUrl.includes('photo-1579546929518') && !remote.coverUrl.includes('photo-1598488035139') && !remote.coverUrl.includes('photo-1598890777032') ? remote.coverUrl : null;

                    if (isAnand) {
                      if (!remoteAvatar || remoteAvatar.includes('unsplash')) remoteAvatar = '/people/anand-sahu-avatar.jpg';
                      if (!remoteCover || remoteCover.includes('unsplash')) remoteCover = '/people/anand-sahu-cover.jpg';
                    }

                    // User session or local custom upload always takes precedence over remote cache
                    let finalAvatar = cur.avatarUrl;
                    if (isCurrentSess && localSess?.avatarUrl && localSess.avatarUrl.trim() !== '') {
                      finalAvatar = localSess.avatarUrl;
                    } else if (cur.avatarUrl?.startsWith('data:') || cur.avatarUrl?.startsWith('blob:')) {
                      finalAvatar = cur.avatarUrl;
                    } else if (remoteAvatar) {
                      finalAvatar = remoteAvatar;
                    }

                    let finalCover = cur.coverUrl;
                    if (isCurrentSess && localSess?.coverUrl && localSess.coverUrl.trim() !== '') {
                      finalCover = localSess.coverUrl;
                    } else if (cur.coverUrl?.startsWith('data:') || cur.coverUrl?.startsWith('blob:')) {
                      finalCover = cur.coverUrl;
                    } else if (remoteCover) {
                      finalCover = remoteCover;
                    }

                    nextMap.set(s, {
                      ...cur,
                      avatarUrl: finalAvatar,
                      coverUrl: finalCover,
                      name: isCurrentSess ? (localSess.name || cur.name) : (remote.name || cur.name),
                      role: isCurrentSess ? (localSess.role || cur.role) : (remote.role || cur.role),
                      badge: isCurrentSess ? (localSess.badge || cur.badge) : (remote.badge || cur.badge),
                      location: isCurrentSess ? (localSess.location || cur.location) : (remote.location || cur.location),
                      quote: isCurrentSess ? (localSess.quote !== undefined ? localSess.quote : cur.quote) : (remote.quote || cur.quote),
                    });
                  }
                });

                const prioritySlugs = ['ai', 'kashish', 'anand-sahu', 'dr-rajesh-sharma'];
                return Array.from(nextMap.values()).sort((a, b) => {
                  const idxA = prioritySlugs.indexOf(a.slug);
                  const idxB = prioritySlugs.indexOf(b.slug);
                  if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                  if (idxA !== -1) return -1;
                  if (idxB !== -1) return 1;
                  return 0;
                });
              });
            }
          })
          .catch(() => { });
      } catch (e) {
        console.error(e);
      }
    };

    const syncSession = () => {
      try {
        const sess = localStorage.getItem('bharatbn_owner_session');
        const parsed = sess ? JSON.parse(sess) : null;
        setOwnerSession(parsed);
        if (parsed) {
          const follows = localStorage.getItem('bharatbn_people_follows');
          setFollowedSlugs(follows ? JSON.parse(follows) : []);
        } else {
          setFollowedSlugs([]);
        }
      } catch {
        setOwnerSession(null);
        setFollowedSlugs([]);
      }
    };

    syncApprovedClaims();
    syncPeople();
    syncSession();

    window.addEventListener('bharatbn_claims_updated', syncApprovedClaims);
    window.addEventListener('bharatbn_people_updated', syncPeople);
    window.addEventListener('bharatbn_auth_changed', syncApprovedClaims);
    window.addEventListener('bharatbn_auth_changed', syncPeople);
    window.addEventListener('bharatbn_auth_changed', syncSession);
    window.addEventListener('bharatbn_follow_changed', syncPeople);
    window.addEventListener('bharatbn_follow_changed', syncSession);
    window.addEventListener('bharatbn_metrics_updated', syncPeople);
    window.addEventListener('storage', syncApprovedClaims);
    window.addEventListener('storage', syncPeople);
    window.addEventListener('storage', syncSession);

    return () => {
      window.removeEventListener('bharatbn_claims_updated', syncApprovedClaims);
      window.removeEventListener('bharatbn_people_updated', syncPeople);
      window.removeEventListener('bharatbn_auth_changed', syncApprovedClaims);
      window.removeEventListener('bharatbn_auth_changed', syncPeople);
      window.removeEventListener('bharatbn_auth_changed', syncSession);
      window.removeEventListener('bharatbn_follow_changed', syncPeople);
      window.removeEventListener('bharatbn_follow_changed', syncSession);
      window.removeEventListener('bharatbn_metrics_updated', syncPeople);
      window.removeEventListener('storage', syncApprovedClaims);
      window.removeEventListener('storage', syncPeople);
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  // Smooth Auto-Sliding Carousel with Interval & Pause on Hover / Touch
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      const cardStep = 336; // 320px width + 16px gap
      const maxScroll = slider.scrollWidth - slider.clientWidth;

      if (slider.scrollLeft >= maxScroll - 20) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: cardStep, behavior: 'smooth' });
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isPaused]);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const amount = direction === 'left' ? -340 : 340;
      sliderRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 4500);
    }
  };

  // Smooth Auto-Scrolling for Categories Section
  useEffect(() => {
    if (isCategoryPaused) return;

    const interval = setInterval(() => {
      const slider = categoriesSliderRef.current;
      if (!slider) return;

      const cardStep = 280;
      const maxScroll = slider.scrollWidth - slider.clientWidth;

      if (slider.scrollLeft >= maxScroll - 20) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: cardStep, behavior: 'smooth' });
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isCategoryPaused]);

  const scrollCategoriesByAmount = (direction: 'left' | 'right') => {
    if (categoriesSliderRef.current) {
      const amount = direction === 'left' ? -290 : 290;
      categoriesSliderRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      setIsCategoryPaused(true);
      setTimeout(() => setIsCategoryPaused(false), 4000);
    }
  };

  const handleCategoryScroll = () => {
    const slider = categoriesSliderRef.current;
    if (!slider) return;
    const max = slider.scrollWidth - slider.clientWidth;
    if (max > 0) {
      setCategoryProgress(Math.min(100, Math.max(0, (slider.scrollLeft / max) * 100)));
    }
  };

  const scrollPeopleByAmount = (direction: 'left' | 'right') => {
    if (peopleSliderRef.current) {
      const amount = direction === 'left' ? -340 : 340;
      peopleSliderRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleToggleFollow = async (person: PersonItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!ownerSession) {
      setShowLoginPrompt(true);
      return;
    }
    const curSlug = (person.slug || '').toLowerCase().trim();
    const isCurrentlyFollowing = followedSlugs.includes(curSlug);
    try {
      await toggleRealFollow(curSlug, isCurrentlyFollowing);
      const nextFollowed = isCurrentlyFollowing
        ? followedSlugs.filter((s) => s !== curSlug)
        : [...followedSlugs, curSlug];
      setFollowedSlugs(nextFollowed);
    } catch (err) {
      console.error('Follow toggle failed', err);
    }
  };

  const filteredPeople =
    selectedPersonCategory === 'all'
      ? peopleList
      : peopleList.filter((p) => p.category === selectedPersonCategory);

  const hasHeroBg = Boolean(homeBanner.enabled && homeBanner.imageUrl);
  const isDarkHero = hasHeroBg && homeBanner.heroTheme !== 'light';

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section (Editorial Precision & Utilitarian Search Console) */}
      <section
        className={`relative z-30 w-full min-h-[calc(100vh-72px)] flex flex-col justify-center pt-20 sm:pt-24 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 shadow-xs ${
          hasHeroBg ? 'bg-slate-950 rounded-b-[2rem]' : 'bg-white'
        }`}
      >
        {/* Background: Admin-uploaded Hero Banner OR Subtle Architectural Dot Grid */}
        <div
          className={`absolute inset-0 overflow-hidden pointer-events-none ${
            hasHeroBg ? 'rounded-b-[2rem]' : ''
          }`}
        >
          {hasHeroBg ? (
            <>
              <img
                src={homeBanner.imageUrl}
                alt="BharatBN Hero Background"
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 ${
                  isDarkHero
                    ? 'bg-gradient-to-b from-slate-950/75 via-slate-950/60 to-slate-950/85'
                    : 'bg-gradient-to-b from-white/85 via-white/75 to-white/90 backdrop-blur-[1px]'
                }`}
              />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(#d5e3fd_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
              <div className="absolute -top-24 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl" />
              <div className="absolute top-1/2 -left-20 w-80 h-80 bg-emerald-50/40 rounded-full blur-3xl" />
            </>
          )}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-20 max-w-7xl mx-auto flex flex-col items-center text-center space-y-5"
        >
          {/* Hero Typography */}
          <motion.h1
            variants={itemFadeUp}
            className={`text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight max-w-4xl leading-[1.12] ${
              isDarkHero ? 'text-white drop-shadow-sm' : 'text-[#0d1c2f]'
            }`}
          >
            Discover Verified Businesses. <br className="hidden sm:inline" />
            <span className={isDarkHero ? 'text-[#fb923c]' : 'text-[#c2410c]'}>
              Grow High-Intent Visibility.
            </span>
          </motion.h1>

          <motion.p
            variants={itemFadeUp}
            className={`text-base sm:text-lg max-w-3xl mx-auto leading-relaxed ${
              isDarkHero ? 'text-slate-200' : 'text-slate-600'
            }`}
          >
            Directly connect with 120,000+ audited clinics, schools, manufacturers, and franchise outlets across India. Zero spam leads, authenticated NAP details, and certified local ranking.
          </motion.p>

          <motion.div variants={itemFadeUp} className="pt-2 w-full max-w-6xl mx-auto">
            <SearchBar darkBg={isDarkHero} />
          </motion.div>
        </motion.div>
      </section>

      {/* ======================================================== */}
      {/* 2. SECTION: Key Business Categories                      */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pt-4">
        <div className="text-center pb-1">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="w-2.5 h-1 bg-[#c2410c] rounded-sm" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#c2410c]">Verified Directory Index</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0d1c2f] tracking-tight">
            Explore Key Business Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Inspected facilities, verified corporate registrations, and regional hubs.
          </p>
        </div>

        {/* Auto-Scrolling Horizontal Carousel with Side Arrows */}
        <div className="relative group/carousel">
          <button
            type="button"
            onClick={() => scrollCategoriesByAmount('left')}
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full border border-slate-200 bg-white/95 hover:bg-white shadow-md items-center justify-center transition cursor-pointer text-slate-700 hover:text-[#c2410c]"
            title="Slide Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollCategoriesByAmount('right')}
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full border border-slate-200 bg-white/95 hover:bg-white shadow-md items-center justify-center transition cursor-pointer text-slate-700 hover:text-[#c2410c]"
            title="Slide Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div
            ref={categoriesSliderRef}
            onMouseEnter={() => setIsCategoryPaused(true)}
            onMouseLeave={() => setIsCategoryPaused(false)}
            onTouchStart={() => setIsCategoryPaused(true)}
            onTouchEnd={() => setIsCategoryPaused(false)}
            onScroll={handleCategoryScroll}
            className="flex items-stretch gap-4 overflow-x-auto py-2 px-1 no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Double array for infinite seamless looping */}
            {[...visualCategories, ...visualCategories].map((cat, index) => (
              <motion.div
                key={`${cat.name}-${index}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-56 sm:w-64 flex-shrink-0 relative rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 bg-white border border-slate-200/90 group flex flex-col justify-between"
              >
                <Link
                  href={`/search?category=${cat.categorySlug}&q=${encodeURIComponent(cat.query)}`}
                  className="block h-full relative"
                >
                  {/* Top Image Box */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 224px, 256px"
                      className="object-cover group-hover:scale-108 transition-transform duration-500 opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {cat.tag && (
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider ${cat.tag === 'Top Rated' || cat.tag === 'High ROI'
                          ? 'bg-[#006c4a]'
                          : cat.tag === 'Audited' || cat.tag === 'Trending'
                            ? 'bg-[#c2410c]'
                            : 'bg-slate-700'
                          }`}>
                          {cat.tag}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content & Footer Link */}
                  <div className="p-3.5 flex flex-col justify-between bg-white flex-1">
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-[#0d1c2f] group-hover:text-[#c2410c] transition line-clamp-1 leading-snug">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                        {cat.subtitle}
                      </p>
                    </div>
                    <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#c2410c]">
                      <span>Explore Directory</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll Progress Bar & Helper Footer */}
        <div className="space-y-2 pt-1">
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c2410c] rounded-full transition-all duration-200"
              style={{ width: `${Math.max(10, categoryProgress)}%` }}
            />
          </div>
          <div className="flex justify-center">
            <Link
              href="/search"
              className="inline-flex items-center gap-1 text-[#c2410c] hover:text-[#9b2f00] font-bold text-xs transition-colors"
            >
              <span>View All (18 Sectors)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION: Recent Listings (Auto-Sliding Carousel with Pause on Hover)   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-center pb-1 space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2.5 h-1 bg-[#c2410c] rounded-sm" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#c2410c]">Live Verified Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0d1c2f] tracking-tight">
            Recent Listings
          </h2>
        </div>

        {/* Small Compact Cards Carousel (Pauses on Hover / Mouse Click) */}
        <div className="relative group/carousel">
          <button
            type="button"
            onClick={() => scrollByAmount('left')}
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full border border-slate-200 bg-white/95 hover:bg-white shadow-md items-center justify-center transition cursor-pointer text-slate-700 hover:text-[#c2410c]"
            title="Slide Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount('right')}
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full border border-slate-200 bg-white/95 hover:bg-white shadow-md items-center justify-center transition cursor-pointer text-slate-700 hover:text-[#c2410c]"
            title="Slide Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

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
                className="w-72 sm:w-80 flex-shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-300 p-4 flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  {/* Header Tag & Rating */}
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 truncate max-w-[100px]">
                        {biz.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded text-[11px] font-bold text-amber-700">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{Number(biz.rating || 4.9).toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({biz.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Real WordPress / Claimed Featured Image or Brand Logo */}
                  {(() => {
                    const bLogo = (biz as any).logo || getBusinessLogo(biz.slug, biz.name);
                    if (biz.image && !biz.image.includes('globalbn.com') && !failedImages[biz.id]) {
                      return (
                        <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                          <img
                            src={biz.image}
                            alt={biz.name}
                            onError={() => {
                              setFailedImages((prev) => ({ ...prev, [biz.id]: true }));
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      );
                    }
                    if (bLogo) {
                      return (
                        <div className="relative w-full h-36 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/80 flex items-center justify-center p-3">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200/80 shadow-xs flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                            <img
                              src={bLogo}
                              alt={biz.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="relative w-full h-36 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/80 flex flex-col items-center justify-center p-3 text-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#07213A] to-[#1b4d7e] text-white font-mono font-bold text-sm flex items-center justify-center mb-1 shadow-xs">
                          {biz.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                          {biz.city}
                        </span>
                      </div>
                    );
                  })()}

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
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {biz.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded truncate max-w-[130px]"
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
                    className="inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-3 py-2 rounded-xl transition flex-1 shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <Link
                    href={`/biz/${biz.slug}`}
                    className="inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition flex-1"
                  >
                    <span>Profile</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href="/search"
            className="inline-flex items-center gap-1 text-[#c2410c] hover:text-[#9b2f00] font-bold text-xs transition-colors"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3.5 SECTION: People on BharatBN (Verified Voices, Filter by Categories)   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="text-center pb-1 space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2.5 h-1 bg-[#c2410c] rounded-sm" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#c2410c]">Verified Voices</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0d1c2f] tracking-tight">
            People on BharatBN
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Connect directly with verified doctors, educators, AI innovators, advocates, and public figures building India.
          </p>
        </div>

        {/* Category Filter Pills (Doctors, Teachers, Tech/AI, Public Figures, Legal, Business, Creators) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {personCategories.map((cat) => {
            const Icon = cat.icon;
            const count =
              cat.id === 'all'
                ? peopleList.length
                : peopleList.filter((p) => p.category === cat.id).length;
            const isSelected = selectedPersonCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedPersonCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer shadow-xs ${isSelected
                  ? 'bg-[#0d1c2f] text-white shadow-md shadow-[#0d1c2f]/20 scale-[1.02]'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F95700]' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* People Slider Horizontal Carousel with DP, Role, Follow (Image 1 Style) */}
        <div className="relative group/carousel">
          <button
            type="button"
            onClick={() => scrollPeopleByAmount('left')}
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full border border-slate-200 bg-white/95 hover:bg-white shadow-md items-center justify-center transition cursor-pointer text-slate-700 hover:text-[#c2410c]"
            title="Slide Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollPeopleByAmount('right')}
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full border border-slate-200 bg-white/95 hover:bg-white shadow-md items-center justify-center transition cursor-pointer text-slate-700 hover:text-[#c2410c]"
            title="Slide Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div
            ref={peopleSliderRef}
            className="flex items-stretch gap-4 overflow-x-auto py-3 px-1 no-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredPeople.map((person) => {
              const isFollowed = Boolean(ownerSession && followedSlugs.includes(person.slug));

              return (
                <div
                  key={person.id}
                  className="w-72 sm:w-80 flex-shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  {/* Top Cover Banner */}
                  <div>
                    <div className="relative h-24 bg-gradient-to-r from-slate-900 via-[#0d1c2f] to-slate-800 overflow-hidden">
                      {person.coverUrl && (
                        <img
                          src={person.coverUrl}
                          alt={`${person.name} Cover`}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = person.slug === 'kashish' ? '/people/kashish-cover.jpg' : '/people/anand-sahu-cover.jpg';
                          }}
                          className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition duration-500"
                        />
                      )}
                      <div className="absolute top-2.5 right-2.5">
                        <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs border border-white/20">
                          {person.badge || 'Verified'}
                        </span>
                      </div>
                    </div>

                    {/* Profile DP Avatar & Info */}
                    <div className="p-4 pt-0 relative">
                      <div className="relative -mt-9 mb-3 flex items-end justify-between">
                        <div className="relative w-16 h-16 rounded-full ring-4 ring-white bg-slate-100 shadow-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {person.avatarUrl ? (
                            <img
                              src={person.avatarUrl}
                              alt={person.name}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  const fb = parent.querySelector('.home-avatar-fallback');
                                  if (fb) (fb as HTMLElement).style.display = 'flex';
                                }
                              }}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                          <div
                            className={`w-full h-full bg-gradient-to-tr from-orange-500 to-amber-600 text-white font-extrabold flex items-center justify-center text-xl home-avatar-fallback ${person.avatarUrl ? 'hidden' : 'flex'
                              }`}
                          >
                            {person.name.slice(0, 1).toUpperCase()}
                          </div>
                        </div>

                        {/* Follow Button on Card Header */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleFollow(person, e)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-xs cursor-pointer ${isFollowed
                            ? 'bg-[#0d1c2f] hover:bg-slate-800 text-white'
                            : 'bg-[#ea580c] hover:bg-[#c2410c] text-white'
                            }`}
                          title={isFollowed ? 'Unfollow' : 'Follow this person'}
                        >
                          {isFollowed ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Following</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Follow</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Name & Handle */}
                      <div className="space-y-0.5">
                        <Link
                          href={`/people/${person.slug}`}
                          onClick={() => {
                            try {
                              sessionStorage.setItem('bharatbn_viewed_person', JSON.stringify(person));
                            } catch { }
                          }}
                          className="font-black text-base text-slate-900 group-hover:text-[#ea580c] transition line-clamp-1 flex items-center gap-1.5 cursor-pointer"
                          title={person.name}
                        >
                          <span>{person.name}</span>
                          {person.isVerified && (
                            <CheckCircle2 className="w-4 h-4 fill-blue-600 text-white flex-shrink-0" />
                          )}
                        </Link>
                        <div className="text-xs font-mono font-medium text-slate-400">
                          {person.handle}
                        </div>
                      </div>

                      {/* Role & Location */}
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-semibold text-slate-700 line-clamp-1">
                          {person.role}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{person.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href="/people"
            className="inline-flex items-center gap-1 text-[#c2410c] hover:text-[#9b2f00] font-bold text-xs transition-colors"
          >
            <span>Explore All People</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3.8 SECTION: Proprietary Technology / Pay-As-You-Rank™ Showcase           */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-6">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#c2410c] border-b border-orange-200 pb-1">
            Proprietary Technology
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Technology Pitch */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0d1c2f] tracking-tight leading-tight">
                Why India&apos;s Top MSMEs are Leaving Traditional Lead Engines for{' '}
                <span className="text-[#ea580c]">Pay-As-You-Rank™</span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Old directories sell your customer leads to five of your competitors in the same minute. BharatBN establishes authentic sovereign digital trust with zero cold-calling agents.
              </p>
            </div>

            {/* Feature Bullet Points */}
            <div className="space-y-3.5">
              {/* Bullet 1 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Guaranteed Top-3 Corridor Visibility
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Lock your pin code location. If your business doesn&apos;t appear in the top 3 verified results, you pay ₹0. No hidden management charges.
                  </p>
                </div>
              </div>

              {/* Bullet 2 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 fill-emerald-600 stroke-none" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Instant NAP Canonical Sync
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Real-time bi-directional synchronization with Google Maps, Apple Maps, WhatsApp Business API, and OpenStreetMap.
                  </p>
                </div>
              </div>

              {/* Bullet 3 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Spam-Free Escrow Communication
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Direct high-intent WhatsApp contacts, and verified calls directly to your front desk. Never routed to brokering brokers.
                  </p>
                </div>
              </div>
            </div>

            {/* Audit Button & Subtext */}
            <div className="space-y-2 pt-1">
              <Link
                href="/claim"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#c2410c] hover:bg-[#9a3412] text-white text-sm font-bold shadow-md shadow-orange-900/10 transition"
              >
                <span>Audit Your Business Listing Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

            </div>
          </div>

          {/* Right Column: Live Interactive Ranking Dashboard Widget */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden p-6 space-y-6">
              {/* Widget Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-xs flex-shrink-0">
                    AK
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                      Dr. Arvind K. Dental Clinic
                    </h3>
                    <p className="text-xs text-slate-500">
                      Bank Corridor, Bengaluru East (Pin: 560038)
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live #1 Rank
                </span>
              </div>

              {/* 3 Metric Summary Boxes */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                    IMPRESSION SHARE
                  </div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                    94.8%
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">
                    +18.3% vs avg
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                    DIRECT WA INQUIRIES
                  </div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                    312
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                    High Intent
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                    AUDIT SCORE
                  </div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                    99 / 100
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                    MCA Verified
                  </div>
                </div>
              </div>

              {/* 30-Day Consistency Chart */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">30-Day Position Consistency</span>
                  <span className="text-emerald-700 font-semibold text-[11px]">
                    Position 1.0 (Zero Slump)
                  </span>
                </div>

                {/* SVG Smooth Line Chart */}
                <div className="relative w-full h-24">
                  <svg
                    className="w-full h-full overflow-visible"
                    viewBox="0 0 400 80"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Filled area */}
                    <path
                      d="M 0 30 Q 100 25 200 28 T 400 20 L 400 80 L 0 80 Z"
                      fill="url(#chartGradient)"
                    />
                    {/* Smooth curve line */}
                    <path
                      d="M 0 30 Q 100 25 200 28 T 400 20"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Point on today */}
                    <circle cx="400" cy="20" r="4" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                </div>

                {/* X Axis Dates */}
                <div className="flex items-center justify-between text-[10px] font-medium text-slate-400 pt-1">
                  <span>Nov 1</span>
                  <span>Nov 10</span>
                  <span>Nov 20</span>
                  <span className="text-emerald-700 font-bold">Today (Maintained #1)</span>
                </div>
              </div>

              {/* Footer Guarantee Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    Rank Fee Accrued:{' '}
                    <strong className="text-slate-900 font-bold">₹699/week</strong>{' '}
                    <span className="text-slate-400 text-[11px]">(Active only when in Top 3)</span>
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                  Guaranteed
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Indian Business Founders Testimonials & Field Audits (Image 1 Redesign) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#c2410c]">
            Audited Voices
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0d1c2f] tracking-tight mt-1">
            Trusted by Regional Enterprise Founders
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Read how independent Indian clinics, schools, and manufacturers eliminated junk leads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review 1: Dr. Rohini Nambiar */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1 text-[#c2410c]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed">
                &ldquo;We used to pay other listing portals ₹80,000 every year and receive junk telecaller calls asking for cheap dentures. With BharatBN, patients come directly to WhatsApp asking for aligners and implants. Real patients, real revenue.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-[#c2410c] flex items-center justify-center font-bold text-sm shrink-0">
                RN
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-[#0d1c2f] truncate">
                  Dr. Rohini Nambiar
                </span>
                <span className="text-xs text-slate-500 truncate">
                  Director, Nambiar Multispeciality Dental, Bengaluru
                </span>
              </div>
            </div>
          </div>

          {/* Review 2: Sameer S. Singhania */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1 text-[#c2410c]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed">
                &ldquo;In a franchise model, brand compliance is non-negotiable. BharatBN audited our location on-site, verified our educator qualifications, and gave parents the confidence to book campus tours directly.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                SS
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-[#0d1c2f] truncate">
                  Sameer S. Singhania
                </span>
                <span className="text-xs text-slate-500 truncate">
                  Franchise Trustee, EuroKids Mumbai Cluster
                </span>
              </div>
            </div>
          </div>

          {/* Review 3: Vikram Kulkarni */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1 text-[#c2410c]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed">
                &ldquo;The Pay-As-You-Rank™ model is revolutionary in Indian B2B. We only pay when we arrive at the top of precision tooling searches for the Chakan auto belt. No advance hostage fees.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                VK
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-[#0d1c2f] truncate">
                  Vikram Kulkarni
                </span>
                <span className="text-xs text-slate-500 truncate">
                  Managing Partner, Kulkarni CNC Dies &amp; Moulds, Pune
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. National MSME Empowerment Initiative CTA Banner (Image 1 Redesign) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="rounded-3xl bg-[#c2410c] text-white p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2 max-w-2xl text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-200">
              National MSME Empowerment Initiative
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Is Your Business Ready to Stand Apart from Unverified Listings?
            </h2>
            <p className="text-sm text-orange-100 mt-1 leading-relaxed">
              Submit your GST or Udyam number. Our on-ground verification desk will complete physical address validation within 48 operational hours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <Link
              href="/claim/new"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-orange-50 text-[#c2410c] font-bold text-sm transition-all text-center shadow-md active:scale-95 whitespace-nowrap"
            >
              Claim &amp; Verify Your Listing Free
            </Link>
            <a
              href="https://wa.me/919717056860?text=Hello%20BharatBN%20Enterprise%20Bureau"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors text-center border border-white/20 whitespace-nowrap"
            >
              Speak with Enterprise Bureau
            </a>
          </div>
        </div>
      </section>

      {/* Login Required Modal */}
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
    </div>
  );
}