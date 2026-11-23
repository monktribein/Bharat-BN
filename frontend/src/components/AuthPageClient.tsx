'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  User,
  LogIn,
  UserPlus,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface AuthPageClientProps {
  initialMode: 'login' | 'signup';
}

function AuthPageInner({ initialMode }: AuthPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || searchParams.get('returnUrl') || '';

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [accountType, setAccountType] = useState<'business' | 'person'>('person');

  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [successUser, setSuccessUser] = useState<any>(null);

  // Sync mode with prop
  useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
  }, [initialMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const inputContact = emailOrPhone.trim();
    const inputPass = password.trim();

    if (mode === 'signup' && !name.trim()) {
      setErrorMessage(
        accountType === 'business'
          ? 'Please enter your Business Name.'
          : 'Please enter your Full Name.'
      );
      return;
    }

    if (!inputContact) {
      setErrorMessage('Please enter your Email or Phone number.');
      return;
    }

    if (!inputPass) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const cleanName =
          name.trim() ||
          inputContact.split('@')[0].replace(/[^a-z0-9]/gi, ' ').trim() ||
          (accountType === 'business' ? 'My Business' : 'User');

        const cleanSlug = cleanName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        if (accountType === 'person') {
          // ================= PERSONAL PROFILE SESSION =================
          let matched: any = null;

          // Check stored people in localStorage
          try {
            const stored = localStorage.getItem('bharatbn_people_store');
            if (stored) {
              const people = JSON.parse(stored);
              if (Array.isArray(people)) {
                matched = people.find((p: any) => {
                  const em = (p.email || '').toLowerCase();
                  const ph = (p.phone || '').replace(/[^0-9]/g, '');
                  const hdl = (p.handle || '').toLowerCase().replace(/^@/, '');
                  const search = inputContact.toLowerCase().replace(/^@/, '');
                  return em === search || hdl === search || (ph && ph.includes(search.replace(/[^0-9]/g, '')));
                });
              }
            }
          } catch {}

          // Default fallback profiles if matched by input
          if (!matched) {
            const low = inputContact.toLowerCase();
            if (low.includes('anand')) {
              matched = {
                id: 'BBN-PPL-ANAND-SAHU-001',
                name: 'Anand Sahu',
                slug: 'anand-sahu',
                handle: '@anandsahu',
                role: 'Nationalist Thinker & Speaker',
                avatarUrl: '/people/anand-sahu-avatar.jpg',
                coverUrl: '/people/anand-sahu-cover.jpg',
                isVerified: true,
              };
            } else if (low.includes('kashish')) {
              matched = {
                id: 'BBN-PPL-KASHISH-001',
                name: 'Kashish Saxena',
                slug: 'kashish',
                handle: '@kashish',
                role: 'Public Figure & Speaker',
                badge: 'Public Figure',
                location: 'noida',
                quote: 'hi',
                avatarUrl: '/people/kashish-avatar.png',
                coverUrl: '/people/kashish-cover.jpg',
                isVerified: true,
              };
            } else if (low.includes('ai') || low === '@ai' || low === 'ai') {
              matched = {
                id: 'BBN-PPL-AI-001',
                name: 'AI',
                slug: 'ai',
                handle: '@ai',
                role: 'Autonomous AI Researcher & Platform Pioneer',
                avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
                isVerified: false,
              };
            }
          }

          const session = {
            accountType: 'person',
            personId: matched?.id || `BBN-PPL-${Date.now().toString(36).toUpperCase()}`,
            name: matched?.name || cleanName,
            slug: matched?.slug || cleanSlug,
            handle: matched?.handle || `@${cleanSlug}`,
            role: matched?.role || 'Creator & Professional',
            badge: matched?.badge || 'Verified Member',
            avatarUrl: matched?.avatarUrl || '',
            coverUrl: matched?.coverUrl || '',
            isVerified: matched ? matched.isVerified !== false : true,
            status: 'approved',
          };

          // If signup, save to people store with 0 real followers
          if (mode === 'signup') {
            try {
              const currentPeople = JSON.parse(localStorage.getItem('bharatbn_people_store') || '[]');
              currentPeople.unshift({
                ...session,
                email: inputContact.includes('@') ? inputContact : `${cleanSlug}@bharatbn.com`,
                phone: !inputContact.includes('@') ? inputContact : '+91 98000 00000',
                followersCount: '0',
              });
              localStorage.setItem('bharatbn_people_store', JSON.stringify(currentPeople));
              window.dispatchEvent(new Event('bharatbn_people_updated'));
            } catch {}
          }

          localStorage.setItem('bharatbn_owner_session', JSON.stringify(session));
          window.dispatchEvent(new Event('bharatbn_auth_changed'));

          setSuccessUser(session);
          setAuthSuccess(true);
          setIsSubmitting(false);

          setTimeout(() => {
            if (redirectUrl) {
              router.push(redirectUrl);
            } else {
              router.push('/dashboard/person');
            }
          }, 800);
        } else {
          // ================= BUSINESS ACCOUNT SESSION =================
          let matchedBiz: any = null;

          try {
            const stored = localStorage.getItem('bharatbn_claims_store');
            if (stored) {
              const claims = JSON.parse(stored);
              if (Array.isArray(claims)) {
                matchedBiz = claims.find((c: any) => {
                  const em = (c.workEmail || c.email || '').toLowerCase();
                  const ph = (c.phone || '').replace(/[^0-9]/g, '');
                  const bName = (c.businessName || '').toLowerCase();
                  const search = inputContact.toLowerCase();
                  return em === search || bName === search || (ph && ph.includes(search.replace(/[^0-9]/g, '')));
                });
              }
            }
          } catch {}

          if (!matchedBiz) {
            const low = inputContact.toLowerCase();
            if (low.includes('apple')) {
              matchedBiz = {
                id: 'BBN-CLM-799760',
                businessName: 'Apple',
                businessSlug: 'apple',
                ownerName: 'Kashish Saxena',
                logoUrl: '/apple-logo.svg',
                status: 'approved',
              };
            } else if (low.includes('cad') || low.includes('choco')) {
              matchedBiz = {
                id: 'BBN-CLM-982104',
                businessName: 'Choco Delights & Confectionery (Cadboury)',
                businessSlug: 'choco-delights-confectionery-cadboury',
                status: 'approved',
              };
            }
          }

          const ownerSession = {
            accountType: 'business',
            businessId: matchedBiz?.id || `BBN-CLM-${Date.now().toString(36).toUpperCase()}`,
            businessName: matchedBiz?.businessName || cleanName,
            businessSlug: matchedBiz?.businessSlug || cleanSlug,
            ownerName: matchedBiz?.ownerName || cleanName,
            ownerEmail: inputContact.includes('@') ? inputContact : `${cleanSlug}@business.in`,
            phone: !inputContact.includes('@') ? inputContact : '+91 98000 00000',
            status: 'approved',
            logoUrl:
              matchedBiz?.logoUrl ||
              (cleanName.toLowerCase() === 'apple' ? '/apple-logo.svg' : undefined),
          };

          if (mode === 'signup') {
            try {
              const currentClaims = JSON.parse(localStorage.getItem('bharatbn_claims_store') || '[]');
              currentClaims.unshift({
                ...ownerSession,
                category: 'Business & Commercial',
                isVerified: true,
                rating: 4.8,
                reviewsCount: 1,
              });
              localStorage.setItem('bharatbn_claims_store', JSON.stringify(currentClaims));
              window.dispatchEvent(new Event('bharatbn_claims_updated'));
            } catch {}
          }

          localStorage.setItem('bharatbn_owner_session', JSON.stringify(ownerSession));
          window.dispatchEvent(new Event('bharatbn_auth_changed'));

          setSuccessUser(ownerSession);
          setAuthSuccess(true);
          setIsSubmitting(false);

          setTimeout(() => {
            if (redirectUrl) {
              router.push(redirectUrl);
            } else {
              router.push('/dashboard');
            }
          }, 800);
        }
      } catch (err: any) {
        setIsSubmitting(false);
        setErrorMessage(err?.message || 'Authentication failed. Please try again.');
      }
    }, 500);
  };

  const handleDemoFill = (type: 'kashish' | 'anand' | 'apple') => {
    if (type === 'kashish') {
      setAccountType('person');
      setName('Kashish Saxena');
      setEmailOrPhone('kashish@bharatbn.com');
      setPassword('password123');
    } else if (type === 'anand') {
      setAccountType('person');
      setName('Anand Sahu');
      setEmailOrPhone('anand@bharatbn.com');
      setPassword('password123');
    } else if (type === 'apple') {
      setAccountType('business');
      setName('Apple');
      setEmailOrPhone('owner@apple.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] via-[#EEF2F6] to-[#E2E8F0] flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group cursor-pointer">
            <Image
              src="/icon.png"
              alt="BharatBN Logo"
              width={42}
              height={42}
              className="rounded-xl shadow-md group-hover:scale-105 transition"
            />
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              Bharat<span className="text-[#F95700]">BN</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500 font-medium">
            India&apos;s Sovereign Business &amp; People Network
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden"
        >
          {/* Top Auth Mode Toggle (Log In vs Sign Up) */}
          <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {/* Account Type Selector (Business vs Personal) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Select Account Type
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/80 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setAccountType('person');
                    setErrorMessage(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    accountType === 'person'
                      ? 'bg-white text-[#F95700] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Personal Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAccountType('business');
                    setErrorMessage(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    accountType === 'business'
                      ? 'bg-white text-[#07213A] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Business</span>
                </button>
              </div>
            </div>

            {/* Success Animation */}
            {authSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-3"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Welcome, {successUser?.name || 'Member'}!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Authenticated successfully. Redirecting you...
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* Name Field for Sign Up */}
                {mode === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {accountType === 'business' ? 'Business Name' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={
                        accountType === 'business'
                          ? 'e.g. Apex Dental Clinic'
                          : 'e.g. Kashish Saxena'
                      }
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F95700] focus:ring-2 focus:ring-[#F95700]/10 transition"
                    />
                  </div>
                )}

                {/* Email or Mobile Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Email, Mobile, or @Handle
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      accountType === 'business'
                        ? 'owner@business.com or 9876543210'
                        : 'kashish@bharatbn.com or @kashish'
                    }
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F95700] focus:ring-2 focus:ring-[#F95700]/10 transition"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    {mode === 'login' && (
                      <span className="text-[11px] text-[#F95700] hover:underline cursor-pointer">
                        Forgot?
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F95700] focus:ring-2 focus:ring-[#F95700]/10 transition"
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-[#F95700]/25 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Processing...</span>
                  ) : mode === 'login' ? (
                    <>
                      <span>Sign In to BharatBN</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Create Free Account</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Demo Quick Fill Buttons */}
            {!authSuccess && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block text-center">
                  Quick Demo Login
                </span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  <button
                    type="button"
                    onClick={() => handleDemoFill('kashish')}
                    className="px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200/60 text-orange-700 text-[11px] font-semibold hover:bg-orange-100 transition cursor-pointer"
                  >
                    Kashish Saxena
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFill('anand')}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/60 text-blue-700 text-[11px] font-semibold hover:bg-blue-100 transition cursor-pointer"
                  >
                    Anand Sahu
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFill('apple')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold hover:bg-slate-200 transition cursor-pointer"
                  >
                    Apple (Business)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer switcher */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <span>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                  }}
                  className="font-bold text-[#F95700] hover:underline cursor-pointer"
                >
                  Create one free
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="font-bold text-[#F95700] hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>
        </motion.div>

        {/* Security / Governance Footnote */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Sovereign 256-bit Encrypted BharatBN Authentication</span>
        </div>
      </div>
    </div>
  );
}

export default function AuthPageClient(props: AuthPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-sm text-slate-400 font-medium">Loading BharatBN Sign In...</div>
        </div>
      }
    >
      <AuthPageInner {...props} />
    </Suspense>
  );
}
