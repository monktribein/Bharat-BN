'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Phone,
  User,
  MapPin,
  Tag,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  AtSign,
  UserPlus,
  Quote,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';

interface BusinessLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onLoginSuccess?: (session: any) => void;
}

export default function BusinessLoginModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onLoginSuccess,
}: BusinessLoginModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [accountType, setAccountType] = useState<'business' | 'person'>('business');

  // Login Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Business Signup Form State
  const [signupStep, setSignupStep] = useState<'details' | 'otp'>('details');
  const [signupBusinessName, setSignupBusinessName] = useState('');
  const [signupOwnerName, setSignupOwnerName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCategory, setSignupCategory] = useState('Automobile & EV');
  const [signupCity, setSignupCity] = useState('Noida, UP');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Person Signup Form State
  const [personName, setPersonName] = useState('');
  const [personHandle, setPersonHandle] = useState('');
  const [personRole, setPersonRole] = useState('Public Figure & Speaker');
  const [personCity, setPersonCity] = useState('New Delhi, India');
  const [personEmail, setPersonEmail] = useState('');
  const [personPhone, setPersonPhone] = useState('');
  const [personQuote, setPersonQuote] = useState('');
  const [personPassword, setPersonPassword] = useState('');

  // OTP Verification State
  const [signupOtp, setSignupOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('849201');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpCountdown, setOtpCountdown] = useState(45);
  const [isOtpTimerActive, setIsOtpTimerActive] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMode(initialMode);
  }, [initialMode, isOpen]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any;
    if (isOtpTimerActive && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    } else if (otpCountdown === 0) {
      setIsOtpTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [isOtpTimerActive, otpCountdown]);

  if (!isOpen || !mounted) return null;

  // Handle Login: Supports both Business Accounts and Personal Profiles
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const idInput = identifier.trim().toLowerCase();
    const passInput = password.trim();

    if (!idInput) {
      setErrorMessage(
        accountType === 'business'
          ? 'Please enter your registered Email or Mobile number.'
          : 'Please enter your Email, Mobile, or Handle (e.g. @anandsahu).'
      );
      return;
    }

    if (!passInput) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (accountType === 'person') {
        // ==========================================
        // 1. PERSON / CREATOR LOGIN
        // ==========================================
        let matchedPerson: any = null;

        // Check custom registered persons in localStorage
        try {
          const stored = localStorage.getItem('bharatbn_people_store');
          if (stored) {
            const people = JSON.parse(stored);
            if (Array.isArray(people)) {
              matchedPerson = people.find((p: any) => {
                const em = (p.email || '').toLowerCase();
                const ph = (p.phone || '').replace(/[^0-9]/g, '');
                const hdl = (p.handle || '').toLowerCase().replace(/^@/, '');
                const cleanInput = idInput.replace(/^@/, '').replace(/[^0-9a-z_.-]/g, '');
                return em === idInput || hdl === cleanInput || (ph && ph.includes(idInput.replace(/[^0-9]/g, '')));
              });
            }
          }
        } catch (err) {
          console.error(err);
        }

        // Check default Anand Sahu profile
        if (!matchedPerson) {
          const isAnand =
            idInput === 'anand@bharatbn.com' ||
            idInput === 'anand.sahu' ||
            idInput === '@anandsahu' ||
            idInput === 'anand' ||
            idInput === '+919811000000';

          if (isAnand) {
            matchedPerson = {
              id: 'BBN-PPL-ANAND-SAHU-001',
              name: 'Anand Sahu',
              slug: 'anand-sahu',
              role: 'Nationalist Thinker & Speaker',
              badge: 'Public Figure',
              handle: '@anandsahu',
              email: 'anand@bharatbn.com',
              phone: '+91 98110 00000',
              location: 'New Delhi, India',
              quote: 'Thoughts for Nation Building and a Stronger India.',
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
              coverUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
              status: 'approved',
              isVerified: true,
              password: '12345678',
            };
          }
        }

        // Check pre-seeded AI Creator / Researcher profile
        if (!matchedPerson) {
          const isAI =
            idInput === 'ai' ||
            idInput === '@ai' ||
            idInput === 'ai@bharatbn.com' ||
            idInput === 'ai-innovator';

          if (isAI) {
            matchedPerson = {
              id: 'BBN-PPL-AI-001',
              name: 'AI',
              slug: 'ai',
              role: 'Autonomous AI Researcher & Platform Pioneer',
              badge: 'AI Innovator',
              handle: '@ai',
              email: 'ai@bharatbn.com',
              phone: '+91 98000 00000',
              location: 'Bengaluru, KA',
              quote: 'Empowering 1.4 Billion Indians with sovereign AI innovation and smart discovery.',
              aboutText: 'AI is an autonomous researcher and intelligent creator system engineered for BharatBN™ — empowering local businesses, creators, and public figures with instant verified SEO catalogs, smart follow feeds, and sovereign digital infrastructure.',
              website: 'https://bharatbn.com/ai',
              avatarUrl: '',
              coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
              followersCount: '5.8K',
              viewsCount: '128K+',
              engagementsCount: '2.4K',
              storiesCount: '12',
              status: 'pending',
              isVerified: false,
              password: '12345678',
            };
          }
        }

        // Check pre-seeded Kashish profile
        if (!matchedPerson) {
          const isKashish =
            idInput === 'kashish' ||
            idInput === '@kashish' ||
            idInput === 'kashish.saxena.123056@gmail.com' ||
            idInput === '+919717056860' ||
            idInput === '9717056860';

          if (isKashish) {
            matchedPerson = {
              id: 'BBN-PPL-KASHISH-001',
              name: 'Kashish Saxena',
              slug: 'kashish',
              role: 'Creator & Platform Pioneer',
              badge: 'Creator',
              handle: '@kashish',
              email: 'kashish.saxena.123056@gmail.com',
              phone: '+91 97170 56860',
              location: 'Noida, UP',
              quote: 'Empowering local businesses and creators across Bharat.',
              aboutText: 'Kashish Saxena is a creator, entrepreneur and digital pioneer driving local business discovery, verified creator collaboration, and community initiatives across North India.',
              website: '',
              avatarUrl: '',
              coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80',
              followersCount: '1.2K',
              viewsCount: '42K+',
              engagementsCount: '1.8K',
              storiesCount: '6',
              status: 'pending',
              isVerified: false,
              password: '12345678',
            };
          }
        }

        if (!matchedPerson) {
          setIsSubmitting(false);
          setErrorMessage('No Personal Profile found for this email/handle. Click "Sign Up as Person" tab to create one!');
          return;
        }

        if (passInput !== (matchedPerson.password || '12345678')) {
          setIsSubmitting(false);
          setErrorMessage('Incorrect password. (Demo password: 12345678)');
          return;
        }

        const personSession = {
          accountType: 'person',
          personId: matchedPerson.id,
          name: matchedPerson.name,
          slug: matchedPerson.slug,
          role: matchedPerson.role,
          badge: matchedPerson.badge || 'Public Figure',
          handle: matchedPerson.handle || `@${matchedPerson.slug}`,
          email: matchedPerson.email,
          phone: matchedPerson.phone,
          location: matchedPerson.location,
          quote: matchedPerson.quote,
          website: matchedPerson.website || '',
          aboutText: matchedPerson.aboutText || '',
          avatarUrl: matchedPerson.avatarUrl || '',
          coverUrl: matchedPerson.coverUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80',
          followersCount: matchedPerson.followersCount || '0',
          viewsCount: matchedPerson.viewsCount || '0',
          engagementsCount: matchedPerson.engagementsCount || '0',
          storiesCount: matchedPerson.storiesCount || '0',
          status: matchedPerson.status || 'pending',
          isVerified: matchedPerson.isVerified || (matchedPerson.status === 'approved') || false,
        };

        localStorage.setItem('bharatbn_owner_session', JSON.stringify(personSession));
        window.dispatchEvent(new Event('bharatbn_auth_changed'));

        setLoginSuccess(true);
        setIsSubmitting(false);
        if (onLoginSuccess) onLoginSuccess(personSession);

        setTimeout(() => {
          onClose();
          setLoginSuccess(false);
          router.push('/dashboard/person');
        }, 700);
      } else {
        // ==========================================
        // 2. BUSINESS ACCOUNT LOGIN
        // ==========================================
        let matchedBusiness: any = null;

        try {
          const stored = localStorage.getItem('bharatbn_claims_store');
          if (stored) {
            const claims = JSON.parse(stored);
            if (Array.isArray(claims)) {
              matchedBusiness = claims.find((c: any) => {
                const email = (c.workEmail || c.email || '').toLowerCase();
                const phone = (c.phone || '').replace(/[^0-9]/g, '');
                const cleanInput = idInput.replace(/[^0-9]/g, '');
                return email === idInput || (cleanInput.length >= 10 && phone.includes(cleanInput.slice(-10)));
              });
            }
          }
        } catch (err) {
          console.error(err);
        }

        if (!matchedBusiness) {
          const knownAccounts = [
            {
              id: 'BBN-CLM-799760',
              businessName: 'Apple',
              businessSlug: 'apple',
              ownerName: 'Apple Store Representative',
              email: 'apple@business.in',
              phone: '+91 97170 56860',
              city: 'Noida, UP',
              category: 'Automobile & EV',
              status: 'approved',
              password: '12345678',
            },
            {
              id: 'BBN-CLM-982104',
              businessName: 'Choco Delights & Confectionery (Cadboury)',
              businessSlug: 'choco-delights-confectionery-cadboury',
              ownerName: 'Cadboury Admin',
              email: 'cad@gmail.com',
              phone: '+91 89653 26578',
              city: 'Mumbai, MH',
              category: 'Food, Bakeries & Confectionery',
              status: 'approved',
              password: '12345678',
            },
            {
              id: '55555555-5555-5555-5555-555555555001',
              businessName: 'Apex Super Speciality Dental Clinic',
              businessSlug: 'apex-super-speciality-dental-clinic',
              ownerName: 'Dr. Rajesh Sharma',
              email: 'care@apexdentalmumbai.com',
              phone: '+91 98200 12345',
              city: 'Mumbai, MH',
              category: 'Healthcare & Clinics',
              status: 'approved',
              password: '12345678',
            },
          ];

          matchedBusiness = knownAccounts.find((a) => {
            const email = a.email.toLowerCase();
            const cleanPhone = a.phone.replace(/[^0-9]/g, '');
            const cleanInput = idInput.replace(/[^0-9]/g, '');

            if (a.businessName.toLowerCase() === 'apple') {
              if (
                idInput === 'apple@business.in' ||
                idInput === 'kashish.saxena.123056@gmail.com' ||
                idInput === 'apple' ||
                (cleanInput.length >= 10 && cleanPhone.includes(cleanInput.slice(-10)))
              ) {
                return true;
              }
            }

            return email === idInput || (cleanInput.length >= 10 && cleanPhone.includes(cleanInput.slice(-10)));
          });
        }

        if (!matchedBusiness) {
          setIsSubmitting(false);
          setErrorMessage('No business account found for this Email or Mobile. Click "Sign Up as Business" to register!');
          return;
        }

        const expectedPassword = matchedBusiness.password || '12345678';
        if (passInput !== expectedPassword) {
          setIsSubmitting(false);
          setErrorMessage('Incorrect password. Please verify your credentials.');
          return;
        }

        const ownerSession = {
          accountType: 'business',
          businessId: matchedBusiness.id,
          businessName: matchedBusiness.businessName || matchedBusiness.name,
          businessSlug: matchedBusiness.businessSlug || matchedBusiness.slug,
          ownerName: matchedBusiness.claimantName || matchedBusiness.ownerName || 'Verified Business Owner',
          ownerEmail: matchedBusiness.workEmail || matchedBusiness.email,
          phone: matchedBusiness.phone,
          city: matchedBusiness.city || 'Noida, UP',
          category: matchedBusiness.category || 'Automobile & EV',
          status: matchedBusiness.status || 'approved',
          logoUrl:
            matchedBusiness.logoUrl ||
            matchedBusiness.logoBase64 ||
            (matchedBusiness.businessName?.toLowerCase() === 'apple' ? '/apple-logo.svg' : undefined),
        };

        localStorage.setItem('bharatbn_owner_session', JSON.stringify(ownerSession));
        window.dispatchEvent(new Event('bharatbn_auth_changed'));

        setLoginSuccess(true);
        setIsSubmitting(false);
        if (onLoginSuccess) onLoginSuccess(ownerSession);

        setTimeout(() => {
          onClose();
          setLoginSuccess(false);
          router.push('/dashboard');
        }, 700);
      }
    }, 400);
  };

  // Step 1: Send Verification OTP (Business or Person)
  const handleSendSignupOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (accountType === 'person') {
      if (!personName.trim()) {
        setErrorMessage('Please enter your Full Name.');
        return;
      }
      if (!personHandle.trim()) {
        setErrorMessage('Please choose a unique Handle / Username (e.g. @anandsahu).');
        return;
      }
      if (!personEmail.trim() || !personEmail.includes('@')) {
        setErrorMessage('Please enter a valid Email address.');
        return;
      }
      if (!personPassword || personPassword.length < 8) {
        setErrorMessage('Password must be at least 8 characters.');
        return;
      }
    } else {
      if (!signupBusinessName.trim()) {
        setErrorMessage('Please enter your Business Name.');
        return;
      }
      if (!signupEmail.trim() || !signupEmail.includes('@')) {
        setErrorMessage('Please enter a valid Work Email address.');
        return;
      }
      if (!signupPhone.trim() || signupPhone.replace(/[^0-9]/g, '').length < 10) {
        setErrorMessage('Please enter a valid 10-digit Mobile / WhatsApp number.');
        return;
      }
      if (!signupPassword || signupPassword.length < 8) {
        setErrorMessage('Password must be at least 8 characters.');
        return;
      }
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setSignupStep('otp');
    setOtpCountdown(45);
    setIsOtpTimerActive(true);
    setOtpError(null);
  };

  // Step 2: Verify OTP and Register
  const handleVerifyOtpAndRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    if (signupOtp.trim() !== generatedOtp.trim()) {
      setOtpError('Invalid OTP. Please enter the 6-digit verification code shown above.');
      return;
    }

    setIsSubmitting(true);

    if (accountType === 'person') {
      // Create new Person / Public Figure profile
      const generatedId = `BBN-PPL-${Date.now().toString().slice(-6)}`;
      const cleanHandle = personHandle.trim().startsWith('@') ? personHandle.trim() : `@${personHandle.trim()}`;
      const baseSlug = cleanHandle.replace(/^@/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const newPerson = {
        id: generatedId,
        name: personName.trim(),
        handle: cleanHandle,
        slug: baseSlug || 'user',
        role: personRole,
        badge: 'Public Figure',
        location: personCity.trim(),
        quote: personQuote.trim(),
        email: personEmail.trim(),
        phone: personPhone.trim(),
        password: personPassword,
        website: '',
        aboutText: '',
        avatarUrl: '',
        coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80',
        followersCount: '0',
        followingCount: 0,
        postsCount: 0,
        viewsCount: '0',
        engagementsCount: '0',
        storiesCount: '0',
        updates: [],
        socialLinks: { youtube: '', instagram: '', twitter: '', facebook: '', linkedin: '' },
        isVerified: false,
        status: 'pending',
        submittedAt: 'Today, 13:00 IST (New)',
        createdAt: new Date().toISOString(),
      };

      try {
        const stored = localStorage.getItem('bharatbn_people_store');
        let people = stored ? JSON.parse(stored) : [];
        people.unshift(newPerson);
        localStorage.setItem('bharatbn_people_store', JSON.stringify(people));
        window.dispatchEvent(new Event('bharatbn_people_updated'));
      } catch (err) {
        console.error(err);
      }

      const personSession = {
        accountType: 'person',
        personId: newPerson.id,
        name: newPerson.name,
        slug: newPerson.slug,
        role: newPerson.role,
        badge: newPerson.badge,
        handle: newPerson.handle,
        email: newPerson.email,
        phone: newPerson.phone,
        location: newPerson.location,
        quote: newPerson.quote,
        website: '',
        aboutText: '',
        avatarUrl: newPerson.avatarUrl,
        coverUrl: newPerson.coverUrl,
        status: 'pending',
        isVerified: false,
      };

      localStorage.setItem('bharatbn_owner_session', JSON.stringify(personSession));
      window.dispatchEvent(new Event('bharatbn_auth_changed'));

      setLoginSuccess(true);
      setIsSubmitting(false);
      if (onLoginSuccess) onLoginSuccess(personSession);

      setTimeout(() => {
        onClose();
        setLoginSuccess(false);
        router.push('/dashboard/person');
      }, 900);
    } else {
      // Create new Business Account
      const generatedId = `BBN-BUS-${Date.now().toString().slice(-6)}`;
      const baseSlug = signupBusinessName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

      const newBusiness = {
        id: generatedId,
        businessName: signupBusinessName.trim(),
        name: signupBusinessName.trim(),
        businessSlug: baseSlug,
        slug: baseSlug,
        ownerName: signupOwnerName.trim() || 'Verified Business Owner',
        claimantName: signupOwnerName.trim() || 'Verified Business Owner',
        workEmail: signupEmail.trim(),
        email: signupEmail.trim(),
        phone: signupPhone.trim(),
        whatsapp: signupPhone.replace(/[^0-9]/g, ''),
        category: signupCategory,
        city: signupCity,
        addressLine: `${signupCity}, India`,
        password: signupPassword,
        status: 'approved',
        isVerified: true,
        emailVerified: true,
        verifiedAt: new Date().toISOString(),
        description: `${signupBusinessName.trim()} is a newly registered business on BharatBN™ Business Network.`,
        createdAt: new Date().toISOString(),
      };

      try {
        const stored = localStorage.getItem('bharatbn_claims_store');
        let claims = stored ? JSON.parse(stored) : [];
        claims.unshift(newBusiness);
        localStorage.setItem('bharatbn_claims_store', JSON.stringify(claims));
        window.dispatchEvent(new Event('bharatbn_claims_updated'));
      } catch (err) {
        console.error(err);
      }

      const ownerSession = {
        accountType: 'business',
        businessId: newBusiness.id,
        businessName: newBusiness.businessName,
        businessSlug: newBusiness.businessSlug,
        ownerName: newBusiness.ownerName,
        ownerEmail: newBusiness.email,
        phone: newBusiness.phone,
        city: newBusiness.city,
        category: newBusiness.category,
        status: 'approved',
      };

      localStorage.setItem('bharatbn_owner_session', JSON.stringify(ownerSession));
      window.dispatchEvent(new Event('bharatbn_auth_changed'));

      setLoginSuccess(true);
      setIsSubmitting(false);
      if (onLoginSuccess) onLoginSuccess(ownerSession);

      setTimeout(() => {
        onClose();
        setLoginSuccess(false);
        router.push('/dashboard');
      }, 900);
    }
  };

  const handleResendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpCountdown(45);
    setIsOtpTimerActive(true);
    setOtpError(null);
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-[#07213A] to-[#0D3861] text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#F95700]/20 border border-[#F95700]/40 flex items-center justify-center text-[#F95700]">
              {accountType === 'business' ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold">
                {mode === 'login'
                  ? accountType === 'business'
                    ? 'Business Account Login'
                    : 'Personal Profile Login'
                  : accountType === 'business'
                  ? 'Register Your Business'
                  : 'Create Personal / Creator Profile'}
              </h2>
              <p className="text-xs text-slate-300">
                {accountType === 'business'
                  ? 'Access your business operations, leads & verified profile'
                  : 'Manage your public figure bio, posts & followers feed'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Account Type Switcher: Business vs Person */}
        {!loginSuccess && (
          <div className="p-3 bg-slate-100 border-b border-slate-200 flex-shrink-0">
            <div className="grid grid-cols-2 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs gap-1">
              <button
                type="button"
                onClick={() => {
                  setAccountType('business');
                  setErrorMessage(null);
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  accountType === 'business'
                    ? 'bg-[#07213A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#F95700]" />
                <span>Business Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAccountType('person');
                  setErrorMessage(null);
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  accountType === 'person'
                    ? 'bg-[#07213A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4 text-orange-400" />
                <span>Personal / Creator Profile</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. Mode Selector Tabs: Log In vs Sign Up */}
        {!loginSuccess && (
          <div className="flex border-b border-slate-200 bg-slate-50 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'border-[#F95700] text-[#F95700] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Log In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setSignupStep('details');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center justify-center gap-2 ${
                mode === 'signup'
                  ? 'border-[#F95700] text-[#F95700] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#F95700]" />
              <span>{accountType === 'business' ? 'Sign Up as Business' : 'Sign Up as Person'}</span>
              <span className="text-[10px] uppercase font-extrabold bg-[#F95700] text-white px-1.5 py-0.2 rounded-full">
                OTP
              </span>
            </button>
          </div>
        )}

        {/* Modal Form Scroll Area */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {loginSuccess ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {mode === 'login'
                  ? accountType === 'business'
                    ? 'Business Welcome Back!'
                    : 'Personal Profile Welcome Back!'
                  : accountType === 'business'
                  ? 'Business Registered & Verified!'
                  : 'Personal Profile Created & Verified!'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Opening your {accountType === 'business' ? 'Business Operations Dashboard' : 'Personal Profile Dashboard'}...
              </p>
            </div>
          ) : mode === 'login' ? (
            /* ========================================================================= */
            /* 1. LOGIN TAB                                                              */
            /* ========================================================================= */
            <form onSubmit={handleLogin} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Demo Credentials Quick-Fill Pill */}
              <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/80 text-xs space-y-1.5">
                <div className="font-bold text-slate-700 flex items-center justify-between">
                  <span>Demo {accountType === 'business' ? 'Business' : 'Person'} Credentials:</span>
                  <span className="text-[10px] text-slate-500 font-mono">Password: 12345678</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {accountType === 'business' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIdentifier('apple@business.in');
                          setPassword('12345678');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#F95700] text-slate-800 text-[11px] font-semibold transition cursor-pointer shadow-2xs"
                      >
                        Apple (Noida)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIdentifier('cad@gmail.com');
                          setPassword('12345678');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#F95700] text-slate-800 text-[11px] font-semibold transition cursor-pointer shadow-2xs"
                      >
                        Choco Delights
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifier('anand@bharatbn.com');
                        setPassword('12345678');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#F95700] text-slate-800 text-[11px] font-semibold transition cursor-pointer shadow-2xs"
                    >
                      Anand Sahu (@anandsahu)
                    </button>
                  )}
                </div>
              </div>

              {/* Identifier Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {accountType === 'business' ? 'Email or Mobile Number' : 'Email, Mobile or Handle (@...)'} <span className="text-[#F95700]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    {accountType === 'business' ? <Mail className="w-4 h-4" /> : <AtSign className="w-4 h-4" />}
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={accountType === 'business' ? 'apple@business.in or +91 97170 56860' : 'anand@bharatbn.com or @anandsahu'}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700] transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password <span className="text-[#F95700]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#F95700] hover:bg-[#d94a00] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-[#F95700]/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Log In to {accountType === 'business' ? 'Business Dashboard' : 'Personal Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : signupStep === 'details' ? (
            /* ========================================================================= */
            /* 2. SIGNUP STEP 1: DETAILS (Business or Person)                            */
            /* ========================================================================= */
            <form onSubmit={handleSendSignupOtp} className="space-y-3.5">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {accountType === 'business' ? (
                /* Business Signup Fields */
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Business Name *</label>
                      <input
                        type="text"
                        required
                        value={signupBusinessName}
                        onChange={(e) => setSignupBusinessName(e.target.value)}
                        placeholder="e.g. Royal Auto Works"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Owner Name</label>
                      <input
                        type="text"
                        value={signupOwnerName}
                        onChange={(e) => setSignupOwnerName(e.target.value)}
                        placeholder="e.g. Rajesh Sharma"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Category *</label>
                      <select
                        value={signupCategory}
                        onChange={(e) => setSignupCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                      >
                        <option value="Automobile & EV">Automobile & EV</option>
                        <option value="Food, Bakeries & Confectionery">Food, Bakeries & Confectionery</option>
                        <option value="Healthcare & Clinics">Healthcare & Clinics</option>
                        <option value="Technology & IT Solutions">Technology & IT Solutions</option>
                        <option value="Education & Coaching">Education & Coaching</option>
                        <option value="Retail & Shopping">Retail & Shopping</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">City / State *</label>
                      <input
                        type="text"
                        required
                        value={signupCity}
                        onChange={(e) => setSignupCity(e.target.value)}
                        placeholder="e.g. Noida, UP"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Work Email *</label>
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="business@gmail.com"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Mobile / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        placeholder="+91 98000 00000"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Password (min 8 chars) *</label>
                    <input
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                    />
                  </div>
                </>
              ) : (
                /* Person Signup Fields */
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={personName}
                        onChange={(e) => setPersonName(e.target.value)}
                        placeholder="e.g. Anand Sahu"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Handle / Username *</label>
                      <input
                        type="text"
                        required
                        value={personHandle}
                        onChange={(e) => setPersonHandle(e.target.value)}
                        placeholder="e.g. @anandsahu"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Public Role / Category *</label>
                      <select
                        value={personRole}
                        onChange={(e) => setPersonRole(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                      >
                        <option value="Public Figure & Speaker">Public Figure & Speaker</option>
                        <option value="Creator & Influencer">Creator & Influencer</option>
                        <option value="Industry Expert & Consultant">Industry Expert & Consultant</option>
                        <option value="Author & Thinker">Author & Thinker</option>
                        <option value="Community Leader">Community Leader</option>
                        <option value="Citizen & Professional">Citizen & Professional</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">City / Location *</label>
                      <input
                        type="text"
                        required
                        value={personCity}
                        onChange={(e) => setPersonCity(e.target.value)}
                        placeholder="e.g. New Delhi, India"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={personEmail}
                        onChange={(e) => setPersonEmail(e.target.value)}
                        placeholder="name@gmail.com"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Mobile / WhatsApp</label>
                      <input
                        type="tel"
                        value={personPhone}
                        onChange={(e) => setPersonPhone(e.target.value)}
                        placeholder="+91 98000 00000"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Personal Quote / Headline</label>
                    <input
                      type="text"
                      value={personQuote}
                      onChange={(e) => setPersonQuote(e.target.value)}
                      placeholder="e.g. Thoughts for Nation Building and a Stronger India."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Password (min 8 chars) *</label>
                    <input
                      type="password"
                      required
                      value={personPassword}
                      onChange={(e) => setPersonPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#F95700]"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#F95700] hover:bg-[#d94a00] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to OTP Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* ========================================================================= */
            /* 3. SIGNUP STEP 2: OTP VERIFICATION                                        */
            /* ========================================================================= */
            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
              <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl text-center space-y-1">
                <span className="text-xs font-bold text-orange-950">Verification Code Sent!</span>
                <p className="text-[11px] text-slate-600">
                  Please enter the 6-digit verification code below:
                </p>
                <div className="inline-block py-1 px-3 bg-white border border-orange-300 rounded-lg text-sm font-mono font-black text-[#F95700] tracking-widest mt-1">
                  {generatedOtp}
                </div>
              </div>

              {otpError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{otpError}</span>
                </div>
              )}

              <div className="space-y-1.5 text-center">
                <label className="block text-xs font-bold text-slate-700">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={signupOtp}
                  onChange={(e) => setSignupOtp(e.target.value)}
                  placeholder="8 4 9 2 0 1"
                  className="w-48 mx-auto text-center font-mono font-bold tracking-widest text-lg py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#F95700]"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Didn&apos;t receive code?</span>
                <button
                  type="button"
                  disabled={isOtpTimerActive}
                  onClick={handleResendOtp}
                  className="font-bold text-[#F95700] hover:underline disabled:opacity-50 cursor-pointer"
                >
                  {isOtpTimerActive ? `Resend in ${otpCountdown}s` : 'Resend Code'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying &amp; Creating Account...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify OTP &amp; Create {accountType === 'business' ? 'Business' : 'Person'} Profile</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSignupStep('details')}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                &larr; Back to Details
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
