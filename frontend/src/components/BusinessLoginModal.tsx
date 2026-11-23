'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  X,
  Building2,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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

  // Simple Form States
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMode(initialMode);
    setErrorMessage(null);
  }, [initialMode, isOpen]);

  if (!isOpen || !mounted) return null;

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

        const cleanSlug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

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

          // Default fallback profiles if matched
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
            isVerified: matched ? matched.isVerified !== false : true,
            status: 'approved',
          };

          // If signup, save to people store
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

          setLoginSuccess(true);
          setIsSubmitting(false);
          if (onLoginSuccess) onLoginSuccess(session);

          setTimeout(() => {
            onClose();
            setLoginSuccess(false);
            router.push('/dashboard/person');
          }, 600);
        } else {
          // ================= BUSINESS ACCOUNT SESSION =================
          let matchedBiz: any = null;

          // Check claims store
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

          // If signup, save to claims store
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

          setLoginSuccess(true);
          setIsSubmitting(false);
          if (onLoginSuccess) onLoginSuccess(ownerSession);

          setTimeout(() => {
            onClose();
            setLoginSuccess(false);
            router.push('/dashboard');
          }, 600);
        }
      } catch (err) {
        setIsSubmitting(false);
        setErrorMessage('Something went wrong. Please try again.');
      }
    }, 400);
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-auto"
      >
        {/* Simple Header */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {mode === 'login' ? 'Log In' : 'Sign Up'}
            </h2>
            <p className="text-xs text-slate-500">
              {accountType === 'business'
                ? 'Business Account'
                : 'Personal Profile'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Toggle (Business vs Personal) */}
        {!loginSuccess && (
          <div className="p-3 bg-slate-50 border-b border-slate-100">
            <div className="grid grid-cols-2 p-1 bg-white rounded-xl border border-slate-200 gap-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAccountType('business');
                  setErrorMessage(null);
                }}
                className={`py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  accountType === 'business'
                    ? 'bg-[#C94A00] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Business</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAccountType('person');
                  setErrorMessage(null);
                }}
                className={`py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  accountType === 'person'
                    ? 'bg-[#C94A00] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Personal</span>
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-5">
          {loginSuccess ? (
            <div className="py-8 text-center space-y-2 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {mode === 'login' ? 'Logged In Successfully' : 'Account Created Successfully'}
              </h3>
              <p className="text-xs text-slate-500">Opening your dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Name Field (Only on Sign Up) */}
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {accountType === 'business' ? 'Business Name' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={accountType === 'business' ? 'e.g. Royal Auto Hub' : 'e.g. Rahul Sharma'}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#C94A00] transition"
                  />
                </div>
              )}

              {/* Email or Phone Field */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Email or Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="name@example.com or 9876543210"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#C94A00] transition"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 pr-9 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#C94A00] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#C94A00] hover:bg-[#A83800] text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-1"
              >
                <span>
                  {isSubmitting
                    ? 'Please wait...'
                    : mode === 'login'
                    ? 'Log In'
                    : 'Create Account'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Simple Footer Switcher */}
        {!loginSuccess && (
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <span>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                  }}
                  className="font-bold text-[#C94A00] hover:underline cursor-pointer"
                >
                  Sign Up
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
                  className="font-bold text-[#C94A00] hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </span>
            )}
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
