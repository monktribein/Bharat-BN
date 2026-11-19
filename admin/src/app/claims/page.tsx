'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
  Building2,
  Download,
  Eye,
  FileCheck,
  UserCheck,
  Phone,
  Mail,
  FileCode,
  CheckSquare,
  Users,
  User,
  Sparkles,
  MapPin,
  AtSign,
  Share2,
  Award,
} from 'lucide-react';

// ============================================================================
// 1. BUSINESS CLAIMS INTERFACES & DEFAULT DATA
// ============================================================================
interface ClaimItem {
  id: string;
  businessName: string;
  businessSlug: string;
  logoUrl?: string;
  logoBase64?: string;
  city: string;
  category: string;
  claimantName: string;
  workEmail: string;
  phone: string;
  gstin: string;
  gstinMatch: number;
  docType: string;
  fileName: string;
  fileSize: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  reviewerNotes?: string;
}

const defaultClaims: ClaimItem[] = [
  {
    id: 'BBN-CLM-799760',
    businessName: 'Apple',
    businessSlug: 'apple-khora-colony-ghaziabad-noida',
    city: 'Noida, UP',
    category: 'Automobile & EV',
    claimantName: 'Kashish Saxena (CEO)',
    workEmail: 'kashish.saxena.123056@gmail.com',
    phone: '+91 97170 56860',
    gstin: '09AAACA7997K1ZP',
    gstinMatch: 98,
    docType: 'GST Registration Certificate',
    fileName: 'Apple_GST_Registration_Noida.pdf',
    fileSize: '1.8 MB',
    submittedAt: 'Today, 10:50 IST (New)',
    status: 'pending',
    reviewerNotes: 'Document uploaded: GST Registration Certificate. Address: Gali Number 14, Master Park, Khora Colony, Ghaziabad, Noida. 98% entity match with Uttar Pradesh Commercial Tax registry.',
  },
  {
    id: 'BBN-CLM-982104',
    businessName: 'Choco Delights & Confectionery (Cadboury)',
    businessSlug: 'choco-delights-confectionery-cadboury',
    city: 'Mumbai, MH',
    category: 'Food, Bakeries & Confectionery',
    claimantName: 'Cadboury Admin',
    workEmail: 'cad@gmail.com',
    phone: '+91 89653 26578',
    gstin: '27AABCC8921N1Z3',
    gstinMatch: 98,
    docType: 'Commercial Electricity / Phone Bill',
    fileName: 'Cadboury_Commercial_Bill.pdf',
    fileSize: '1.2 MB',
    submittedAt: 'Just now (Recently Submitted)',
    status: 'pending',
  },
  {
    id: 'BBN-CLM-849102',
    businessName: 'Apex Super Speciality Dental Clinic',
    businessSlug: 'apex-super-speciality-dental-clinic',
    city: 'Mumbai, MH',
    category: 'Healthcare & Clinics',
    claimantName: 'Dr. Rajesh Sharma',
    workEmail: 'rajesh@apexclinic.com',
    phone: '+91 98200 12345',
    gstin: '27AABCS1429B1Z8',
    gstinMatch: 99,
    docType: 'GST Registration Certificate',
    fileName: 'Apex_GST_Registration_2026.pdf',
    fileSize: '1.4 MB',
    submittedAt: 'Today, 10:14 IST',
    status: 'pending',
  },
  {
    id: 'BBN-CLM-623194',
    businessName: 'Little Elly Preschool & Daycare',
    businessSlug: 'little-elly-international-preschool',
    city: 'Bengaluru, KA',
    category: 'Preschools & Education',
    claimantName: 'Sunita Rao',
    workEmail: 'director@littleellyindiranagar.com',
    phone: '+91 98450 67890',
    gstin: '29AAACL9201D1ZU',
    gstinMatch: 95,
    docType: 'Govt Shop & Establishment License',
    fileName: 'LittleElly_Govt_License_KA.pdf',
    fileSize: '2.8 MB',
    submittedAt: 'Today, 09:30 IST',
    status: 'pending',
  },
  {
    id: 'BBN-CLM-419082',
    businessName: 'Greenfield EV Motors & Spares',
    businessSlug: 'greenfield-ev-motors-kothrud-pune',
    city: 'Pune, MH',
    category: 'Automobile & EV',
    claimantName: 'Anil Deshmukh',
    workEmail: 'anil@greenfieldev.in',
    phone: '+91 97654 32100',
    gstin: '27AAHFG4821M1ZX',
    gstinMatch: 88,
    docType: 'Commercial Electricity Bill',
    fileName: 'MSEDCL_Power_Bill_Jan2026.jpg',
    fileSize: '820 KB',
    submittedAt: 'Yesterday, 18:45 IST',
    status: 'pending',
  },
  {
    id: 'BBN-CLM-310928',
    businessName: 'Dr Batra’s Positive Health Clinic',
    businessSlug: 'dr-batras-positive-health-clinic-bandra-mumbai',
    city: 'Mumbai, MH',
    category: 'Healthcare & Clinics',
    claimantName: 'Dr. Neha Kapoor',
    workEmail: 'dr.neha@drbatras.com',
    phone: '+91 98200 99999',
    gstin: '27AAACD9218F1ZC',
    gstinMatch: 100,
    docType: 'GST Registration Certificate',
    fileName: 'DrBatras_Corporate_GST.pdf',
    fileSize: '3.1 MB',
    submittedAt: '14 Nov 2026',
    status: 'approved',
    reviewerNotes: 'Verified against MCA corporate registration registry.',
  },
  {
    id: 'BBN-CLM-109283',
    businessName: 'Kalyan Jewellers Showroom',
    businessSlug: 'kalyan-jewellers-t-nagar-chennai',
    city: 'Chennai, TN',
    category: 'Retail & Jewellery',
    claimantName: 'R. Ramachandran',
    workEmail: 'ram@randommail.com',
    phone: '+91 94440 12345',
    gstin: '33AAACK4812K1Z0',
    gstinMatch: 42,
    docType: 'Personal Electricity Bill',
    fileName: 'personal_bill.png',
    fileSize: '450 KB',
    submittedAt: '12 Nov 2026',
    status: 'rejected',
    rejectionReason: 'Personal residential bill submitted instead of commercial ROC/GSTIN proof.',
    reviewerNotes: 'Address mismatch between claimant document and registered listing.',
  },
];

// ============================================================================
// 2. PEOPLE & PUBLIC FIGURE CLAIMS INTERFACES & DEFAULT DATA
// ============================================================================
interface PersonClaimItem {
  id: string;
  name: string;
  slug: string;
  handle: string;
  role: string;
  badge: string;
  location: string;
  email: string;
  phone: string;
  quote: string;
  aboutText?: string;
  avatarUrl?: string;
  coverUrl?: string;
  followersCount?: string | number;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  isVerified: boolean;
  rejectionReason?: string;
  reviewerNotes?: string;
}

const defaultPeopleClaims: PersonClaimItem[] = [
  {
    id: 'BBN-PPL-KASHISH-001',
    name: 'Kashish Saxena',
    slug: 'kashish',
    handle: '@kashish',
    role: 'Creator & Platform Pioneer',
    badge: 'Creator',
    location: 'Noida, UP',
    email: 'kashish.saxena.123056@gmail.com',
    phone: '+91 97170 56860',
    quote: 'Empowering local businesses and creators across Bharat.',
    aboutText: 'Creator and digital pioneer building verified hyper-local networking and growth initiatives for North India businesses.',
    avatarUrl: '',
    coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
    followersCount: '1.2K',
    submittedAt: 'Today, 13:00 IST (New)',
    status: 'pending',
    isVerified: false,
    reviewerNotes: 'Mobile OTP phone verification completed. Email verified. Initial creator verification request.',
  },
  {
    id: 'BBN-PPL-ANAND-SAHU-001',
    name: 'Anand Sahu',
    slug: 'anand-sahu',
    handle: '@anandsahu',
    role: 'Nationalist Thinker & Speaker',
    badge: 'Public Figure',
    location: 'New Delhi, India',
    email: 'anand.sahu@bjp-india.org',
    phone: '+91 98110 54321',
    quote: 'Thoughts for Nation Building and a Stronger India.',
    aboutText: 'Anand Sahu publishes commentary, event updates and photographs related to public life, social work and political activities.',
    avatarUrl: '/people/anand-sahu-avatar.jpg',
    coverUrl: 'https://images.unsplash.com/photo-1598890777032-bde13fbe3492?auto=format&fit=crop&w=1600&q=80',
    followersCount: '28.4K',
    submittedAt: '18 Nov 2026',
    status: 'approved',
    isVerified: true,
    reviewerNotes: 'Official public figure credentials verified against national public records.',
  },
  {
    id: 'BBN-PPL-RAJESH-002',
    name: 'Dr. Rajesh Sharma',
    slug: 'dr-rajesh-sharma',
    handle: '@dr_rajesh',
    role: 'Healthcare Pioneer & Dental Surgeon',
    badge: 'Medical Leader',
    location: 'Mumbai, MH',
    email: 'dr.rajesh@apexdental.in',
    phone: '+91 98200 12345',
    quote: 'Making world-class preventive dental healthcare accessible for every Indian.',
    aboutText: 'Senior Consultant & Implantologist with 18+ years of clinical leadership.',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    followersCount: '18.9K',
    submittedAt: '17 Nov 2026',
    status: 'approved',
    isVerified: true,
    reviewerNotes: 'Dental Council of India certificate and clinic license verified.',
  },
];

export default function ClaimModerationPage() {
  // Top Moderation Category Mode: 'business' vs 'people'
  const [moderationType, setModerationType] = useState<'business' | 'people'>('business');

  // Business Claims State
  const [claims, setClaims] = useState<ClaimItem[]>(defaultClaims);
  const [selectedClaim, setSelectedClaim] = useState<ClaimItem | null>(defaultClaims[0]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedReason, setSelectedReason] = useState('Personal utility bill instead of commercial proof');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // People Claims State
  const [peopleClaims, setPeopleClaims] = useState<PersonClaimItem[]>(defaultPeopleClaims);
  const [selectedPerson, setSelectedPerson] = useState<PersonClaimItem | null>(defaultPeopleClaims[0]);
  const [peopleFilter, setPeopleFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [peopleSearchQuery, setPeopleSearchQuery] = useState('');
  const [peopleNotes, setPeopleNotes] = useState('');
  const [selectedPeopleReason, setSelectedPeopleReason] = useState('Incomplete identity or KYC verification');
  const [showPeopleRejectModal, setShowPeopleRejectModal] = useState(false);

  // Global Notification
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Check URL query parameters for ?tab=people on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'people') {
        setModerationType('people');
      }
    }
  }, []);

  // Load dynamically submitted business claims from localStorage
  useEffect(() => {
    const loadStoredClaims = () => {
      try {
        const stored = localStorage.getItem('bharatbn_claims_store');
        if (stored) {
          const parsed: ClaimItem[] = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setClaims((prev) => {
              const map = new Map<string, ClaimItem>();
              parsed.forEach((c) => map.set(c.id, c));
              prev.forEach((c) => {
                if (!map.has(c.id)) map.set(c.id, c);
              });
              return Array.from(map.values());
            });
          }
        }
      } catch (e) {
        console.error('Failed to load local claims', e);
      }
    };

    loadStoredClaims();
    window.addEventListener('bharatbn_claims_updated', loadStoredClaims);
    return () => window.removeEventListener('bharatbn_claims_updated', loadStoredClaims);
  }, []);

  // Load dynamically registered people from localStorage
  useEffect(() => {
    const loadStoredPeople = () => {
      try {
        const stored = localStorage.getItem('bharatbn_people_store');
        const map = new Map<string, PersonClaimItem>();

        // Seed with default people
        defaultPeopleClaims.forEach((p) => map.set(p.id, p));

        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            parsed.forEach((p: any) => {
              const id = p.id || `BBN-PPL-${(p.slug || 'user').toUpperCase()}`;
              const existing = map.get(id);
              map.set(id, {
                id,
                name: p.name || 'Registered User',
                slug: p.slug || (p.handle ? p.handle.replace(/^@/, '') : 'user'),
                handle: p.handle?.startsWith('@') ? p.handle : `@${p.handle || p.slug || 'user'}`,
                role: p.role || 'Public Figure & Speaker',
                badge: p.badge || 'Public Figure',
                location: p.location || 'India',
                email: p.email || existing?.email || 'user@bharatbn.in',
                phone: p.phone || existing?.phone || '+91 97170 56860',
                quote: p.quote || existing?.quote || 'Building a stronger connected community across India.',
                aboutText: p.aboutText || existing?.aboutText || '',
                avatarUrl: p.avatarUrl || existing?.avatarUrl || '',
                coverUrl: p.coverUrl || existing?.coverUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
                followersCount: p.followersCount || existing?.followersCount || '0',
                submittedAt: p.submittedAt || existing?.submittedAt || 'Today, 13:00 IST (New)',
                status: p.status || (p.isVerified ? 'approved' : 'pending'),
                isVerified: p.isVerified ?? (p.status === 'approved'),
                reviewerNotes: p.reviewerNotes || existing?.reviewerNotes,
                rejectionReason: p.rejectionReason || existing?.rejectionReason,
              });
            });
          }
        }

        const list = Array.from(map.values());
        setPeopleClaims(list);
        if (!selectedPerson && list.length > 0) {
          setSelectedPerson(list[0]);
        }
      } catch (e) {
        console.error('Failed to load local people claims', e);
      }
    };

    loadStoredPeople();
    window.addEventListener('bharatbn_people_updated', loadStoredPeople);
    return () => window.removeEventListener('bharatbn_people_updated', loadStoredPeople);
  }, []);

  // Filtered Business Claims
  const filteredClaims = claims.filter((c) => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.businessName.toLowerCase().includes(q) ||
        c.claimantName.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.gstin.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered People Claims
  const filteredPeople = peopleClaims.filter((p) => {
    if (peopleFilter !== 'all' && p.status !== peopleFilter) return false;
    if (peopleSearchQuery.trim()) {
      const q = peopleSearchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.handle.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = claims.filter((c) => c.status === 'pending').length;
  const approvedCount = claims.filter((c) => c.status === 'approved').length;
  const rejectedCount = claims.filter((c) => c.status === 'rejected').length;

  const pendingPeopleCount = peopleClaims.filter((p) => p.status === 'pending').length;
  const approvedPeopleCount = peopleClaims.filter((p) => p.status === 'approved').length;
  const rejectedPeopleCount = peopleClaims.filter((p) => p.status === 'rejected').length;

  // Handle Business Decision
  const handleDecision = (decision: 'approved' | 'rejected') => {
    if (!selectedClaim) return;

    const updated = claims.map((c) => {
      if (c.id === selectedClaim.id) {
        return {
          ...c,
          status: decision,
          rejectionReason: decision === 'rejected' ? selectedReason : undefined,
          reviewerNotes: notes || (decision === 'approved' ? 'Verified by Admin review.' : selectedReason),
        };
      }
      return c;
    });

    setClaims(updated);
    const updatedSelected = updated.find((c) => c.id === selectedClaim.id) || null;
    setSelectedClaim(updatedSelected);
    setShowRejectModal(false);
    setNotes('');

    try {
      localStorage.setItem('bharatbn_claims_store', JSON.stringify(updated));
      window.dispatchEvent(new Event('bharatbn_claims_updated'));
    } catch {}

    setActionSuccess(`Claim ${selectedClaim.id} (${selectedClaim.businessName}) marked as ${decision.toUpperCase()}.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Handle People Decision
  const handlePersonDecision = (decision: 'approved' | 'rejected') => {
    if (!selectedPerson) return;

    const updated = peopleClaims.map((p) => {
      if (p.id === selectedPerson.id) {
        return {
          ...p,
          status: decision,
          isVerified: decision === 'approved',
          rejectionReason: decision === 'rejected' ? selectedPeopleReason : undefined,
          reviewerNotes:
            peopleNotes ||
            (decision === 'approved'
              ? 'Profile verified and approved with Official Blue Checkmark by Admin.'
              : selectedPeopleReason),
        };
      }
      return p;
    });

    setPeopleClaims(updated);
    const updatedSelected = updated.find((p) => p.id === selectedPerson.id) || null;
    setSelectedPerson(updatedSelected);
    setShowPeopleRejectModal(false);
    setPeopleNotes('');

    try {
      // Sync to bharatbn_people_store
      localStorage.setItem('bharatbn_people_store', JSON.stringify(updated));

      // If active owner session matches this person, update it too!
      const currentSessionStr = localStorage.getItem('bharatbn_owner_session');
      if (currentSessionStr) {
        const currentSession = JSON.parse(currentSessionStr);
        if (
          currentSession.accountType === 'person' &&
          (currentSession.slug === selectedPerson.slug || currentSession.personId === selectedPerson.id)
        ) {
          const updatedSession = {
            ...currentSession,
            status: decision,
            isVerified: decision === 'approved',
          };
          localStorage.setItem('bharatbn_owner_session', JSON.stringify(updatedSession));
          window.dispatchEvent(new Event('bharatbn_auth_changed'));
        }
      }

      window.dispatchEvent(new Event('bharatbn_people_updated'));
    } catch (e) {
      console.error(e);
    }

    setActionSuccess(
      decision === 'approved'
        ? `Profile ${selectedPerson.handle} (${selectedPerson.name}) marked as APPROVED with Verified Blue Checkmark!`
        : `Profile ${selectedPerson.handle} (${selectedPerson.name}) marked as REJECTED.`
    );
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const filterTabs: {
    id: 'all' | 'pending' | 'approved' | 'rejected';
    label: string;
    count: number;
    highlight?: boolean;
  }[] = [
    { id: 'all', label: 'All', count: claims.length, highlight: false },
    { id: 'pending', label: 'Pending', count: pendingCount, highlight: true },
    { id: 'approved', label: 'Approved', count: approvedCount, highlight: false },
    { id: 'rejected', label: 'Rejected', count: rejectedCount, highlight: false },
  ];

  const peopleFilterTabs: {
    id: 'all' | 'pending' | 'approved' | 'rejected';
    label: string;
    count: number;
    highlight?: boolean;
  }[] = [
    { id: 'all', label: 'All', count: peopleClaims.length, highlight: false },
    { id: 'pending', label: 'Pending', count: pendingPeopleCount, highlight: true },
    { id: 'approved', label: 'Approved', count: approvedPeopleCount, highlight: false },
    { id: 'rejected', label: 'Rejected', count: rejectedPeopleCount, highlight: false },
  ];

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP MODERATION MODE SELECTOR                                           */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Moderation &amp; Verification Center
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              {pendingCount + pendingPeopleCount} Total Pending
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Review and verify business entity ownership (GSTIN) and public figure creator profiles.
          </p>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs shadow-inner">
          <button
            type="button"
            onClick={() => setModerationType('business')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              moderationType === 'business'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-brand-600" />
            <span>Business Claims</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
              {pendingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setModerationType('people')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              moderationType === 'people'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#F95700]" />
            <span>Personal &amp; People Approvals</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-orange-100 text-[#F95700] font-bold">
              {pendingPeopleCount}
            </span>
          </button>
        </div>
      </div>

      {/* Animated Action Notification */}
      <AnimatePresence>
        {actionSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2.5 rounded-md flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-medium">{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. TAB A: BUSINESS CLAIMS MODERATION                                      */}
      {/* ========================================================================= */}
      {moderationType === 'business' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-brand-600" />
              <span>Business Listing Claims ({filteredClaims.length})</span>
            </div>

            {/* Filter Pills with Framer Motion LayoutId */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
              {filterTabs.map((tab) => {
                const isActive = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className="relative px-3 py-1 rounded text-[11px] font-medium transition cursor-pointer"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="claimsFilterPill"
                        className="absolute inset-0 bg-white rounded shadow-xs"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                      {tab.label}{' '}
                      <span className={`font-mono text-[10px] ${tab.highlight && isActive ? 'text-amber-600' : 'text-slate-400'}`}>
                        ({tab.count})
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Split Interface for Business */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Claims Queue Table / List (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
              {/* Quick Search */}
              <div className="p-2.5 border-b border-slate-200 bg-slate-50/70">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search business, 'Apple', GSTIN..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-brand-500 bg-white"
                  />
                </div>
              </div>

              {/* List items */}
              <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
                {filteredClaims.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No claim records matching the current filter.
                  </div>
                ) : (
                  filteredClaims.map((claim) => {
                    const isSelected = selectedClaim?.id === claim.id;
                    return (
                      <motion.div
                        key={claim.id}
                        onClick={() => setSelectedClaim(claim)}
                        whileHover={{ backgroundColor: isSelected ? undefined : 'rgba(248, 250, 252, 0.8)' }}
                        className={`p-3 cursor-pointer transition text-xs space-y-1.5 ${
                          isSelected
                            ? 'bg-slate-100/90 border-l-[3px] border-[#F95700]'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-slate-600">{claim.id}</span>
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                              claim.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : claim.status === 'rejected'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {claim.status}
                          </span>
                        </div>

                        <div className="font-semibold text-slate-900 truncate">
                          {claim.businessName}
                        </div>

                        <div className="text-[11px] text-slate-500 flex items-center justify-between font-mono">
                          <span>{claim.claimantName}</span>
                          <span>{claim.submittedAt}</span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Detailed Document Inspector Dossier (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200/90 shadow-xs p-5 space-y-5">
              <AnimatePresence mode="wait">
                {selectedClaim ? (
                  <motion.div
                    key={selectedClaim.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {/* Dossier Header */}
                    <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-slate-500 font-semibold">{selectedClaim.id}</span>
                          <span className="text-slate-300">&bull;</span>
                          <span className="text-[11px] text-slate-500 font-mono">{selectedClaim.submittedAt}</span>
                        </div>
                        <h2 className="text-base font-bold text-slate-900 mt-1">
                          {selectedClaim.businessName}
                        </h2>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {selectedClaim.city} &bull; {selectedClaim.category}
                          </span>
                          <span className="text-slate-300">|</span>
                          <a
                            href={`http://localhost:3000/biz/${selectedClaim.businessSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1"
                          >
                            View Live Listing <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-mono font-bold px-2 py-1 rounded uppercase ${
                          selectedClaim.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : selectedClaim.status === 'rejected'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        Status: {selectedClaim.status}
                      </span>
                    </div>

                    {/* Claimant Credentials */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded border border-slate-100 bg-slate-50/50 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-slate-400">Claimant Name</span>
                        <div className="font-semibold text-slate-800">{selectedClaim.claimantName}</div>
                      </div>
                      <div className="p-3 rounded border border-slate-100 bg-slate-50/50 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-slate-400">Official Work Email</span>
                        <div className="font-mono text-slate-800 truncate">{selectedClaim.workEmail}</div>
                      </div>
                      <div className="p-3 rounded border border-slate-100 bg-slate-50/50 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-slate-400">Registered Phone</span>
                        <div className="font-mono text-slate-800">{selectedClaim.phone}</div>
                      </div>
                      <div className="p-3 rounded border border-slate-100 bg-slate-50/50 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-slate-400">Claimed GSTIN</span>
                        <div className="font-mono font-bold text-slate-900">{selectedClaim.gstin}</div>
                      </div>
                    </div>

                    {/* GSTIN Entity Matching Score */}
                    <div className="p-3 rounded-md bg-emerald-50/80 border border-emerald-200 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div>
                          <div className="font-bold text-emerald-900">
                            GSTIN Confidence Match: {selectedClaim.gstinMatch}%
                          </div>
                          <div className="text-[11px] text-emerald-700">
                            Verified against GST Common Portal (GSTN API) &bull; Active Taxpayer Status
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Uploaded Proof Document Box */}
                    <div className="border border-slate-200 rounded-md p-3.5 space-y-3 bg-slate-50/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span>{selectedClaim.docType}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">{selectedClaim.fileSize}</span>
                      </div>

                      <div className="p-3 bg-white rounded border border-slate-200 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-700 truncate max-w-xs">{selectedClaim.fileName}</span>
                        <button
                          type="button"
                          onClick={() => alert(`Downloading ${selectedClaim.fileName}`)}
                          className="text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 font-sans text-xs font-medium cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Proof</span>
                        </button>
                      </div>
                    </div>

                    {/* Rejection / Reviewer Notes if any */}
                    {selectedClaim.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 p-3 rounded-md text-xs text-red-800 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Rejection Notice</span>
                        </div>
                        <p className="text-[11px] text-red-700">{selectedClaim.rejectionReason}</p>
                      </div>
                    )}

                    {selectedClaim.reviewerNotes && (
                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-md text-xs text-slate-700 space-y-0.5 font-mono">
                        <span className="text-[10px] text-slate-400 uppercase">Reviewer Audit Note</span>
                        <div className="text-[11px]">{selectedClaim.reviewerNotes}</div>
                      </div>
                    )}

                    {/* Actions Desk */}
                    {selectedClaim.status === 'pending' ? (
                      <div className="pt-2 border-t border-slate-200 space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-medium text-slate-700">
                            Internal Audit Note (Logged to audit trail)
                          </label>
                          <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g. Cross-verified with Maharashtra ROC portal"
                            className="w-full text-xs p-2 rounded border border-slate-200 focus:outline-none focus:border-brand-500"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowRejectModal(true)}
                            className="px-3.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded transition cursor-pointer"
                          >
                            Reject Claim
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDecision('approved')}
                            className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve &amp; Assign Listing</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
                        <span>Decision locked by Operator</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = claims.map((c) =>
                              c.id === selectedClaim.id ? { ...c, status: 'pending' as const } : c
                            );
                            setClaims(updated);
                            setSelectedClaim({ ...selectedClaim, status: 'pending' });
                          }}
                          className="text-brand-600 hover:underline cursor-pointer"
                        >
                          Reopen for review
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="p-12 text-center text-xs text-slate-400">
                    Select a claim ticket from the queue on the left to inspect documents.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB B: PEOPLE & PUBLIC FIGURE VERIFICATIONS                            */}
      {/* ========================================================================= */}
      {moderationType === 'people' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#F95700]" />
              <span>Personal Profiles &amp; Public Figures ({filteredPeople.length})</span>
            </div>

            {/* Filter Pills for People */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
              {peopleFilterTabs.map((tab) => {
                const isActive = peopleFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPeopleFilter(tab.id)}
                    className="relative px-3 py-1 rounded text-[11px] font-medium transition cursor-pointer"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="peopleFilterPill"
                        className="absolute inset-0 bg-white rounded shadow-xs"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                      {tab.label}{' '}
                      <span className={`font-mono text-[10px] ${tab.highlight && isActive ? 'text-orange-600' : 'text-slate-400'}`}>
                        ({tab.count})
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Split Interface for People */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: People Profiles Queue (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
              {/* Quick Search */}
              <div className="p-2.5 border-b border-slate-200 bg-slate-50/70">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={peopleSearchQuery}
                    onChange={(e) => setPeopleSearchQuery(e.target.value)}
                    placeholder="Search personal profile, 'Kashish', '@kashish', role..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-brand-500 bg-white"
                  />
                </div>
              </div>

              {/* People List */}
              <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
                {filteredPeople.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No personal profiles matching current filter.
                  </div>
                ) : (
                  filteredPeople.map((person) => {
                    const isSelected = selectedPerson?.id === person.id;
                    return (
                      <motion.div
                        key={person.id}
                        onClick={() => setSelectedPerson(person)}
                        whileHover={{ backgroundColor: isSelected ? undefined : 'rgba(248, 250, 252, 0.8)' }}
                        className={`p-3.5 cursor-pointer transition text-xs space-y-2 ${
                          isSelected
                            ? 'bg-slate-100/90 border-l-[3px] border-[#F95700]'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {/* Avatar or initial */}
                            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-700 border border-slate-300">
                              {person.avatarUrl ? (
                                <img src={person.avatarUrl} alt={person.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="bg-gradient-to-tr from-amber-600 to-orange-500 text-white w-full h-full flex items-center justify-center font-bold">
                                  {person.name.slice(0, 1).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1">
                                <span>{person.name}</span>
                                {person.isVerified && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-50" />
                                )}
                              </div>
                              <div className="text-[11px] font-mono text-slate-400">{person.handle}</div>
                            </div>
                          </div>

                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                              person.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : person.status === 'rejected'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {person.status}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 line-clamp-1 font-medium">
                          {person.role} &bull; {person.location}
                        </div>

                        <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                          <span>{person.id}</span>
                          <span>{person.submittedAt}</span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Person Inspector Dossier (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200/90 shadow-xs p-5 space-y-5">
              <AnimatePresence mode="wait">
                {selectedPerson ? (
                  <motion.div
                    key={selectedPerson.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200 shadow-sm flex-shrink-0 flex items-center justify-center">
                          {selectedPerson.avatarUrl ? (
                            <img src={selectedPerson.avatarUrl} alt={selectedPerson.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-orange-500 text-white font-black text-lg flex items-center justify-center">
                              {selectedPerson.name.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-slate-500 font-semibold">{selectedPerson.id}</span>
                            <span className="text-slate-300">&bull;</span>
                            <span className="text-[11px] text-slate-500 font-mono">{selectedPerson.submittedAt}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <h2 className="text-base font-bold text-slate-900">
                              {selectedPerson.name}
                            </h2>
                            {selectedPerson.isVerified && (
                              <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs" title="Official Verified Profile">
                                <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                              </div>
                            )}
                            <span className="text-xs font-mono text-slate-400 font-semibold">({selectedPerson.handle})</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {selectedPerson.location} &bull; {selectedPerson.role}
                            </span>
                            <span className="text-slate-300">|</span>
                            <a
                              href={`http://localhost:3000/people/${selectedPerson.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#F95700] hover:underline font-bold inline-flex items-center gap-1"
                            >
                              View Live Profile <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-mono font-bold px-2 py-1 rounded uppercase ${
                          selectedPerson.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : selectedPerson.status === 'rejected'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {selectedPerson.status}
                      </span>
                    </div>

                    {/* Contact & Registration Information */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded border border-slate-100 bg-slate-50/50 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-slate-400">Registered Email</span>
                        <div className="font-mono text-slate-800 truncate">{selectedPerson.email}</div>
                      </div>
                      <div className="p-3 rounded border border-slate-100 bg-slate-50/50 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-slate-400">Registered Mobile (OTP Verified)</span>
                        <div className="font-mono text-slate-800">{selectedPerson.phone}</div>
                      </div>
                      <div className="p-3 rounded border border-slate-100 bg-slate-50/50 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-slate-400">Public Figure Category</span>
                        <div className="font-semibold text-slate-800">{selectedPerson.badge}</div>
                      </div>
                      <div className="p-3 rounded border border-slate-100 bg-slate-50/50 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-slate-400">Public URL Slug</span>
                        <div className="font-mono font-bold text-slate-900">/people/{selectedPerson.slug}</div>
                      </div>
                    </div>

                    {/* Identity Verification Audit Checklist */}
                    <div className="p-3.5 rounded-lg bg-orange-50/80 border border-orange-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-orange-900 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#F95700]" />
                          <span>Identity &amp; Public Voice Verification (96% Confidence Match)</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-orange-200/80 text-orange-950 font-mono text-[10px] font-bold">
                          KYC Level 2
                        </span>
                      </div>
                      <p className="text-[11px] text-orange-800">
                        Phone OTP confirmed &bull; Linked with authenticated email &bull; Compliant with BharatBN Public Figure &amp; Creator Code of Conduct.
                      </p>
                    </div>

                    {/* Headline / Thought */}
                    {selectedPerson.quote && (
                      <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">National Quote / Headline</span>
                        <p className="italic text-slate-800 font-medium">&ldquo;{selectedPerson.quote}&rdquo;</p>
                      </div>
                    )}

                    {/* Bio / About */}
                    {selectedPerson.aboutText && (
                      <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Submitted Biography</span>
                        <p className="text-slate-700 leading-relaxed">{selectedPerson.aboutText}</p>
                      </div>
                    )}

                    {/* Rejection / Reviewer Notes if any */}
                    {selectedPerson.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 p-3 rounded-md text-xs text-red-800 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Rejection Notice</span>
                        </div>
                        <p className="text-[11px] text-red-700">{selectedPerson.rejectionReason}</p>
                      </div>
                    )}

                    {selectedPerson.reviewerNotes && (
                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-md text-xs text-slate-700 space-y-0.5 font-mono">
                        <span className="text-[10px] text-slate-400 uppercase">Reviewer Audit Note</span>
                        <div className="text-[11px]">{selectedPerson.reviewerNotes}</div>
                      </div>
                    )}

                    {/* Actions Desk for People */}
                    {selectedPerson.status === 'pending' ? (
                      <div className="pt-2 border-t border-slate-200 space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-medium text-slate-700">
                            Internal Review Note (Recorded to audit trail)
                          </label>
                          <input
                            type="text"
                            value={peopleNotes}
                            onChange={(e) => setPeopleNotes(e.target.value)}
                            placeholder="e.g. Identity and creator credentials verified"
                            className="w-full text-xs p-2 rounded border border-slate-200 focus:outline-none focus:border-brand-500"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowPeopleRejectModal(true)}
                            className="px-3.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded transition cursor-pointer"
                          >
                            Reject Profile
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePersonDecision('approved')}
                            className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Verify &amp; Approve Profile (Grant Blue Checkmark)</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
                        <span>Decision locked by Operator</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = peopleClaims.map((p) =>
                              p.id === selectedPerson.id ? { ...p, status: 'pending' as const, isVerified: false } : p
                            );
                            setPeopleClaims(updated);
                            setSelectedPerson({ ...selectedPerson, status: 'pending', isVerified: false });
                            try {
                              localStorage.setItem('bharatbn_people_store', JSON.stringify(updated));
                              window.dispatchEvent(new Event('bharatbn_people_updated'));
                            } catch {}
                          }}
                          className="text-[#F95700] hover:underline cursor-pointer"
                        >
                          Reopen for review
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="p-12 text-center text-xs text-slate-400">
                    Select a profile from the queue on the left to review details.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. REJECT MODALS                                                          */}
      {/* ========================================================================= */}
      {/* Business Reject Modal */}
      <AnimatePresence>
        {showRejectModal && selectedClaim && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Reject Claim: {selectedClaim.id}
                </h3>
                <button onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  Select the rejection reason. An automated email with re-upload instructions will be sent to{' '}
                  <span className="font-mono font-semibold text-slate-800">{selectedClaim.workEmail}</span>.
                </p>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700">Rejection Reason</label>
                  <select
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-brand-500"
                  >
                    <option value="Personal utility bill instead of commercial proof">Personal utility bill instead of commercial proof</option>
                    <option value="GSTIN mismatch with corporate registry">GSTIN mismatch with corporate registry</option>
                    <option value="Document unreadable or low resolution">Document unreadable or low resolution</option>
                    <option value="Authorization letter missing director sign-off">Authorization letter missing director sign-off</option>
                    <option value="Suspected duplicate or unauthorized takeover attempt">Suspected duplicate or unauthorized takeover attempt</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDecision('rejected')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* People Reject Modal */}
      <AnimatePresence>
        {showPeopleRejectModal && selectedPerson && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Reject Profile Verification: {selectedPerson.id}
                </h3>
                <button onClick={() => setShowPeopleRejectModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  Select the rejection reason for <strong className="text-slate-900">{selectedPerson.name}</strong> ({selectedPerson.handle}).
                  Notification will be logged to their creator dashboard.
                </p>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700">Rejection Reason</label>
                  <select
                    value={selectedPeopleReason}
                    onChange={(e) => setSelectedPeopleReason(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-brand-500"
                  >
                    <option value="Incomplete identity or KYC verification">Incomplete identity or KYC verification</option>
                    <option value="Suspected impersonation or parody account">Suspected impersonation or parody account</option>
                    <option value="Public figure threshold or criteria not met">Public figure threshold or criteria not met</option>
                    <option value="Unverified contact information">Unverified contact information</option>
                    <option value="Terms of Service or Community Standards violation">Terms of Service or Community Standards violation</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPeopleRejectModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handlePersonDecision('rejected')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
