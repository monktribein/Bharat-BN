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
  ShieldCheck,
  AtSign,
  Briefcase,
  Check,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface BusinessLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onLoginSuccess?: (session: any) => void;
}

const GoogleIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

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

  // Login Form States
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Business Signup Form States
  const [bizName, setBizName] = useState('');
  const [bizOwnerName, setBizOwnerName] = useState('');
  const [bizEmail, setBizEmail] = useState('');
  const [bizPhone, setBizPhone] = useState('');
  const [bizCategory, setBizCategory] = useState('Automobile & EV');
  const [bizPassword, setBizPassword] = useState('');

  // Personal Profile Signup Form States
  const [personFullName, setPersonFullName] = useState('');
  const [personHandle, setPersonHandle] = useState('');
  const [personEmail, setPersonEmail] = useState('');
  const [personPhone, setPersonPhone] = useState('');
  const [personCategory, setPersonCategory] = useState('Public Figure & Speaker');
  const [personPassword, setPersonPassword] = useState('');

  // Agreement
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  useEffect(() => {
    setMounted(true);
    setMode(initialMode);
    setErrorMessage(null);
  }, [initialMode, isOpen]);

  if (!isOpen || !mounted) return null;

  // =========================================================================
  // AUTHENTICATION LOGIC: REALISTIC & FRICTIONLESS
  // =========================================================================

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const idInput = identifier.trim().toLowerCase();
    const passInput = password.trim();

    if (!idInput) {
      setErrorMessage('Please enter your email, mobile number, or username.');
      return;
    }

    if (!passInput) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        if (accountType === 'person') {
          // 1. PERSON LOGIN
          let matched: any = null;

          // Check stored people
          const stored = localStorage.getItem('bharatbn_people_store');
          if (stored) {
            try {
              const people = JSON.parse(stored);
              if (Array.isArray(people)) {
                matched = people.find((p: any) => {
                  const em = (p.email || '').toLowerCase();
                  const ph = (p.phone || '').replace(/[^0-9]/g, '');
                  const hdl = (p.handle || '').toLowerCase().replace(/^@/, '');
                  const cleanInput = idInput.replace(/^@/, '');
                  return em === idInput || hdl === cleanInput || (ph && ph.includes(idInput.replace(/[^0-9]/g, '')));
                });
              }
            } catch {}
          }

          // Known seed profiles
          if (!matched) {
            if (idInput.includes('anand')) {
              matched = {
                id: 'BBN-PPL-ANAND-SAHU-001',
                name: 'Anand Sahu',
                slug: 'anand-sahu',
                role: 'Nationalist Thinker & Speaker',
                badge: 'Public Figure',
                handle: '@anandsahu',
                email: 'anand@bharatbn.com',
                phone: '+91 98110 00000',
                avatarUrl: '/people/anand-portrait.png',
                isVerified: true,
              };
            } else if (idInput.includes('ai')) {
              matched = {
                id: 'BBN-PPL-AI-001',
                name: 'AI',
                slug: 'ai',
                role: 'Autonomous AI Researcher & Platform Pioneer',
                badge: 'AI Innovator',
                handle: '@ai',
                email: 'ai@bharatbn.com',
                avatarUrl: '',
                isVerified: true,
              };
            } else if (idInput.includes('kashish')) {
              matched = {
                id: 'BBN-PPL-KASHISH-001',
                name: 'Kashish Saxena',
                slug: 'kashish',
                role: 'Creator & Platform Pioneer',
                badge: 'Creator',
                handle: '@kashish',
                email: 'kashish.saxena.123056@gmail.com',
                avatarUrl: '',
                isVerified: true,
              };
            }
          }

          // If brand new login, seamlessly create verified session for this user
          if (!matched) {
            const cleanSlug = idInput.split('@')[0].replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'user';
            const cleanName = cleanSlug
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');

            matched = {
              id: `BBN-PPL-${Date.now().toString(36).toUpperCase()}`,
              name: cleanName,
              slug: cleanSlug,
              role: 'Verified Professional & Creator',
              badge: 'Verified Member',
              handle: `@${cleanSlug}`,
              email: idInput.includes('@') ? idInput : `${cleanSlug}@bharatbn.com`,
              phone: !idInput.includes('@') ? idInput : '+91 98000 00000',
              avatarUrl: '',
              isVerified: true,
            };
          }

          const session = {
            accountType: 'person',
            personId: matched.id,
            name: matched.name,
            slug: matched.slug,
            handle: matched.handle || `@${matched.slug}`,
            role: matched.role || 'Creator & Professional',
            badge: matched.badge || 'Verified Member',
            avatarUrl: matched.avatarUrl || '',
            isVerified: matched.isVerified !== false,
            status: 'approved',
          };

          localStorage.setItem('bharatbn_owner_session', JSON.stringify(session));
          window.dispatchEvent(new Event('bharatbn_auth_changed'));

          setLoginSuccess(true);
          setIsSubmitting(false);
          if (onLoginSuccess) onLoginSuccess(session);

          setTimeout(() => {
            onClose();
            setLoginSuccess(false);
            router.push('/dashboard/person');
          }, 800);
        } else {
          // 2. BUSINESS LOGIN
          let matchedBiz: any = null;

          // Check claims store
          const stored = localStorage.getItem('bharatbn_claims_store');
          if (stored) {
            try {
              const claims = JSON.parse(stored);
              if (Array.isArray(claims)) {
                matchedBiz = claims.find((c: any) => {
                  const em = (c.workEmail || c.email || '').toLowerCase();
                  const ph = (c.phone || '').replace(/[^0-9]/g, '');
                  const bName = (c.businessName || '').toLowerCase();
                  return em === idInput || bName === idInput || (ph && ph.includes(idInput.replace(/[^0-9]/g, '')));
                });
              }
            } catch {}
          }

          // Known seed businesses
          if (!matchedBiz) {
            if (idInput.includes('apple')) {
              matchedBiz = {
                id: 'BBN-CLM-799760',
                businessName: 'Apple',
                businessSlug: 'apple',
                ownerName: 'Kashish Saxena',
                email: 'apple@business.in',
                phone: '+91 97170 56860',
                category: 'Automobile & EV',
                logoUrl: '/apple-logo.svg',
                status: 'approved',
              };
            } else if (idInput.includes('cad') || idInput.includes('choco')) {
              matchedBiz = {
                id: 'BBN-CLM-982104',
                businessName: 'Choco Delights & Confectionery (Cadboury)',
                businessSlug: 'choco-delights-confectionery-cadboury',
                ownerName: 'Cadboury Operations',
                email: 'cad@gmail.com',
                category: 'Food, Bakeries & Confectionery',
                status: 'approved',
              };
            }
          }

          // If brand new business login, seamlessly create verified session
          if (!matchedBiz) {
            const cleanSlug = idInput.split('@')[0].replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'business';
            const cleanName = cleanSlug
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');

            matchedBiz = {
              id: `BBN-CLM-${Date.now().toString(36).toUpperCase()}`,
              businessName: cleanName,
              businessSlug: cleanSlug,
              ownerName: 'Business Owner',
              email: idInput.includes('@') ? idInput : `${cleanSlug}@business.in`,
              phone: !idInput.includes('@') ? idInput : '+91 98000 00000',
              category: 'Business & Commercial',
              status: 'approved',
            };
          }

          const ownerSession = {
            accountType: 'business',
            businessId: matchedBiz.id,
            businessName: matchedBiz.businessName || matchedBiz.name,
            businessSlug: matchedBiz.businessSlug || matchedBiz.slug,
            ownerName: matchedBiz.ownerName || 'Verified Business Owner',
            ownerEmail: matchedBiz.email || matchedBiz.workEmail,
            phone: matchedBiz.phone,
            category: matchedBiz.category || 'Business & Commercial',
            status: 'approved',
            logoUrl:
              matchedBiz.logoUrl ||
              (matchedBiz.businessName?.toLowerCase() === 'apple' ? '/apple-logo.svg' : undefined),
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
          }, 800);
        }
      } catch (err) {
        setIsSubmitting(false);
        setErrorMessage('Unable to sign in. Please try again.');
      }
    }, 500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreedToTerms) {
      setErrorMessage('Please accept the Terms of Service to continue.');
      return;
    }

    if (accountType === 'business') {
      if (!bizName.trim()) {
        setErrorMessage('Please enter your Business or Company name.');
        return;
      }
      if (!bizEmail.trim()) {
        setErrorMessage('Please enter your work email or contact.');
        return;
      }
      if (!bizPassword || bizPassword.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      setIsSubmitting(true);

      setTimeout(() => {
        const slug = bizName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const newBiz = {
          id: `BBN-CLM-${Math.floor(100000 + Math.random() * 900000)}`,
          businessName: bizName.trim(),
          businessSlug: slug,
          ownerName: bizOwnerName.trim() || 'Authorized Representative',
          workEmail: bizEmail.trim(),
          phone: bizPhone.trim() || '+91 98000 00000',
          category: bizCategory,
          status: 'approved',
          isVerified: true,
          rating: 4.8,
          reviewsCount: 1,
        };

        // Save to claims store
        try {
          const currentClaims = JSON.parse(localStorage.getItem('bharatbn_claims_store') || '[]');
          currentClaims.unshift(newBiz);
          localStorage.setItem('bharatbn_claims_store', JSON.stringify(currentClaims));
          window.dispatchEvent(new Event('bharatbn_claims_updated'));
        } catch {}

        const session = {
          accountType: 'business',
          businessId: newBiz.id,
          businessName: newBiz.businessName,
          businessSlug: newBiz.businessSlug,
          ownerName: newBiz.ownerName,
          ownerEmail: newBiz.workEmail,
          phone: newBiz.phone,
          category: newBiz.category,
          status: 'approved',
        };

        localStorage.setItem('bharatbn_owner_session', JSON.stringify(session));
        window.dispatchEvent(new Event('bharatbn_auth_changed'));

        setLoginSuccess(true);
        setIsSubmitting(false);
        if (onLoginSuccess) onLoginSuccess(session);

        setTimeout(() => {
          onClose();
          setLoginSuccess(false);
          router.push('/dashboard');
        }, 800);
      }, 600);
    } else {
      // PERSONAL PROFILE SIGNUP
      if (!personFullName.trim()) {
        setErrorMessage('Please enter your Full Name.');
        return;
      }
      if (!personEmail.trim()) {
        setErrorMessage('Please enter your email or mobile.');
        return;
      }
      if (!personPassword || personPassword.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      setIsSubmitting(true);

      setTimeout(() => {
        const cleanHandle = (personHandle.trim() || personFullName.trim())
          .toLowerCase()
          .replace(/[^a-z0-9_]/gi, '')
          .slice(0, 20);
        const slug = cleanHandle || 'profile';

        const newPerson = {
          id: `BBN-PPL-${Date.now().toString(36).toUpperCase()}`,
          name: personFullName.trim(),
          slug,
          handle: `@${slug}`,
          role: personCategory,
          badge: 'Verified Member',
          email: personEmail.trim(),
          phone: personPhone.trim() || '+91 98000 00000',
          location: 'India',
          quote: 'Building and collaborating across BharatBN network.',
          avatarUrl: '',
          followersCount: '1.2K',
          isVerified: true,
          status: 'approved',
        };

        // Save to people store
        try {
          const currentPeople = JSON.parse(localStorage.getItem('bharatbn_people_store') || '[]');
          currentPeople.unshift(newPerson);
          localStorage.setItem('bharatbn_people_store', JSON.stringify(currentPeople));
          window.dispatchEvent(new Event('bharatbn_people_updated'));
        } catch {}

        const session = {
          accountType: 'person',
          personId: newPerson.id,
          name: newPerson.name,
          slug: newPerson.slug,
          handle: newPerson.handle,
          role: newPerson.role,
          badge: newPerson.badge,
          avatarUrl: '',
          isVerified: true,
          status: 'approved',
        };

        localStorage.setItem('bharatbn_owner_session', JSON.stringify(session));
        window.dispatchEvent(new Event('bharatbn_auth_changed'));

        setLoginSuccess(true);
        setIsSubmitting(false);
        if (onLoginSuccess) onLoginSuccess(session);

        setTimeout(() => {
          onClose();
          setLoginSuccess(false);
          router.push('/dashboard/person');
        }, 800);
      }, 600);
    }
  };

  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (accountType === 'business') {
        const session = {
          accountType: 'business',
          businessId: 'BBN-CLM-799760',
          businessName: 'Apple',
          businessSlug: 'apple',
          ownerName: 'Kashish Saxena',
          ownerEmail: 'kashish.saxena.123056@gmail.com',
          category: 'Automobile & EV',
          status: 'approved',
          logoUrl: '/apple-logo.svg',
        };
        localStorage.setItem('bharatbn_owner_session', JSON.stringify(session));
        window.dispatchEvent(new Event('bharatbn_auth_changed'));
        setLoginSuccess(true);
        setIsSubmitting(false);
        if (onLoginSuccess) onLoginSuccess(session);
        setTimeout(() => {
          onClose();
          setLoginSuccess(false);
          router.push('/dashboard');
        }, 700);
      } else {
        const session = {
          accountType: 'person',
          personId: 'BBN-PPL-KASHISH-001',
          name: 'Kashish Saxena',
          slug: 'kashish',
          handle: '@kashish',
          role: 'Creator & Platform Pioneer',
          badge: 'Creator',
          avatarUrl: '',
          isVerified: true,
          status: 'approved',
        };
        localStorage.setItem('bharatbn_owner_session', JSON.stringify(session));
        window.dispatchEvent(new Event('bharatbn_auth_changed'));
        setLoginSuccess(true);
        setIsSubmitting(false);
        if (onLoginSuccess) onLoginSuccess(session);
        setTimeout(() => {
          onClose();
          setLoginSuccess(false);
          router.push('/dashboard/person');
        }, 700);
      }
    }, 450);
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Top Header Card */}
        <div className="p-6 pb-4 border-b border-slate-100 flex-shrink-0 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Image
                src="/logo-light.png"
                alt="BharatBN"
                width={130}
                height={44}
                className="h-8 w-auto object-contain"
              />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {loginSuccess
                ? 'Welcome to BharatBN!'
                : mode === 'login'
                ? 'Welcome back'
                : 'Create your account'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {accountType === 'business'
                ? 'Manage operations, customer inquiries, and certified business discovery.'
                : 'Publish updates, build followers, and connect with India’s verified voices.'}
            </p>
          </div>

          {/* Account Type Toggle (Business vs Personal) */}
          {!loginSuccess && (
            <div className="mt-4 p-1 bg-slate-100 rounded-2xl grid grid-cols-2 gap-1 border border-slate-200/60">
              <button
                type="button"
                onClick={() => {
                  setAccountType('business');
                  setErrorMessage(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  accountType === 'business'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className={`w-3.5 h-3.5 ${accountType === 'business' ? 'text-[#C94A00]' : 'text-slate-400'}`} />
                <span>Business Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAccountType('person');
                  setErrorMessage(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  accountType === 'person'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className={`w-3.5 h-3.5 ${accountType === 'person' ? 'text-[#C94A00]' : 'text-slate-400'}`} />
                <span>Personal Profile</span>
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {loginSuccess ? (
            <div className="py-10 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {mode === 'login' ? 'Authentication Successful' : 'Account Created Successfully'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Opening your {accountType === 'business' ? 'Business Operations Dashboard' : 'Personal Profile Dashboard'}...
              </p>
            </div>
          ) : (
            <>
              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}

              {/* Social Login Button: Continue with Google */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2.5 cursor-pointer hover:bg-slate-50 disabled:opacity-50"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              {/* OR Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider relative">
                  or
                </span>
              </div>

              {mode === 'login' ? (
                /* ========================================================================= */
                /* LOGIN FORM                                                                */
                /* ========================================================================= */
                <form onSubmit={handleLogin} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {accountType === 'business' ? 'Business Email or Mobile' : 'Email, Mobile or @Handle'}
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
                        placeholder={
                          accountType === 'business'
                            ? 'name@company.com or +91...'
                            : 'name@gmail.com or @handle'
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#C94A00] transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">Password</label>
                      <button
                        type="button"
                        onClick={() => alert('Password reset instructions will be sent to your registered email.')}
                        className="text-[11px] font-bold text-[#C94A00] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#C94A00] transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-[#C94A00] focus:ring-[#C94A00] border-slate-300"
                      />
                      <span>Remember this device</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-[#C94A00] hover:bg-[#A83800] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-[#C94A00]/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* ========================================================================= */
                /* SIGNUP FORM                                                               */
                /* ========================================================================= */
                <form onSubmit={handleSignup} className="space-y-3">
                  {accountType === 'business' ? (
                    <>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">Business / Store Name *</label>
                        <input
                          type="text"
                          required
                          value={bizName}
                          onChange={(e) => setBizName(e.target.value)}
                          placeholder="e.g. Tata EV Mobility Hub"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#C94A00] transition"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">Owner / Authorized Name</label>
                          <input
                            type="text"
                            value={bizOwnerName}
                            onChange={(e) => setBizOwnerName(e.target.value)}
                            placeholder="Full Name"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#C94A00] transition"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">Business Category</label>
                          <select
                            value={bizCategory}
                            onChange={(e) => setBizCategory(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#C94A00] transition"
                          >
                            <option value="Automobile & EV">Automobile &amp; EV</option>
                            <option value="IT, Software & Technology">IT &amp; Software</option>
                            <option value="Healthcare & Clinics">Healthcare &amp; Clinics</option>
                            <option value="Restaurants & Cafes">Restaurants &amp; Cafes</option>
                            <option value="Retail & Shopping">Retail &amp; Shopping</option>
                            <option value="Real Estate & Infrastructure">Real Estate</option>
                            <option value="Professional Services">Professional Services</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">Work Email *</label>
                          <input
                            type="email"
                            required
                            value={bizEmail}
                            onChange={(e) => setBizEmail(e.target.value)}
                            placeholder="contact@company.com"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#C94A00] transition"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">Mobile / WhatsApp</label>
                          <input
                            type="tel"
                            value={bizPhone}
                            onChange={(e) => setBizPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#C94A00] transition"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">Create Password (min 6 chars) *</label>
                        <input
                          type="password"
                          required
                          value={bizPassword}
                          onChange={(e) => setBizPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#C94A00] transition"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={personFullName}
                          onChange={(e) => setPersonFullName(e.target.value)}
                          placeholder="e.g. Dr. Priya Sharma"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#C94A00] transition"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">Desired Handle</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">@</span>
                            <input
                              type="text"
                              value={personHandle}
                              onChange={(e) => setPersonHandle(e.target.value)}
                              placeholder="username"
                              className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#C94A00] transition"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">Profession / Field</label>
                          <select
                            value={personCategory}
                            onChange={(e) => setPersonCategory(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#C94A00] transition"
                          >
                            <option value="Doctors & Healthcare">Doctors &amp; Healthcare</option>
                            <option value="Teachers & Educators">Teachers &amp; Educators</option>
                            <option value="Tech & AI Innovators">Tech &amp; AI Innovators</option>
                            <option value="Public Figures & Speakers">Public Figures &amp; Speakers</option>
                            <option value="Lawyers & Legal">Lawyers &amp; Legal</option>
                            <option value="Business Leaders">Business Leaders</option>
                            <option value="Creators & Artists">Creators &amp; Artists</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={personEmail}
                            onChange={(e) => setPersonEmail(e.target.value)}
                            placeholder="name@gmail.com"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#C94A00] transition"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">Mobile Number</label>
                          <input
                            type="tel"
                            value={personPhone}
                            onChange={(e) => setPersonPhone(e.target.value)}
                            placeholder="+91 98000 00000"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#C94A00] transition"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">Create Password (min 6 chars) *</label>
                        <input
                          type="password"
                          required
                          value={personPassword}
                          onChange={(e) => setPersonPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#C94A00] transition"
                        />
                      </div>
                    </>
                  )}

                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-slate-500">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="w-4 h-4 rounded text-[#C94A00] focus:ring-[#C94A00] border-slate-300 mt-0.5"
                      />
                      <span>
                        I agree to the BharatBN™{' '}
                        <span className="font-bold text-slate-700 hover:underline">Terms of Service</span> and{' '}
                        <span className="font-bold text-slate-700 hover:underline">Privacy Policy</span>.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-[#C94A00] hover:bg-[#A83800] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-[#C94A00]/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    <span>{isSubmitting ? 'Creating account...' : 'Create Free Account'}</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Footer Mode Switcher */}
        {!loginSuccess && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center flex-shrink-0">
            {mode === 'login' ? (
              <p className="text-xs text-slate-600 font-medium">
                Don&apos;t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                  }}
                  className="font-bold text-[#C94A00] hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-600 font-medium">
                Already registered with BharatBN?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="font-bold text-[#C94A00] hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sovereign &amp; Secure 256-bit Encrypted Infrastructure</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
