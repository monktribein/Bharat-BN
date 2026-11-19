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

  // Login Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Signup Form State
  const [signupStep, setSignupStep] = useState<'details' | 'otp'>('details');
  const [signupBusinessName, setSignupBusinessName] = useState('');
  const [signupOwnerName, setSignupOwnerName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCategory, setSignupCategory] = useState('Automobile & EV');
  const [signupCity, setSignupCity] = useState('Noida, UP');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // OTP Verification State (Requirement 4)
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

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const idInput = identifier.trim().toLowerCase();
    const passInput = password.trim();

    if (!idInput) {
      setErrorMessage('Please enter your registered Email or Mobile number.');
      return;
    }

    if (!passInput) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      let matchedBusiness: any = null;

      // 1. Check custom dynamically registered claims in localStorage
      try {
        const stored = localStorage.getItem('bharatbn_claims_store');
        if (stored) {
          const claims = JSON.parse(stored);
          if (Array.isArray(claims)) {
            matchedBusiness = claims.find((c: any) => {
              const email = (c.workEmail || c.email || '').toLowerCase();
              const phone = (c.phone || '').replace(/[^0-9]/g, '');
              const cleanInput = idInput.replace(/[^0-9]/g, '');

              const emailMatch = email && email === idInput;
              const phoneMatch = cleanInput && cleanInput.length >= 10 && phone.includes(cleanInput.slice(-10));

              return emailMatch || phoneMatch;
            });
          }
        }
      } catch (err) {
        console.error(err);
      }

      // 2. Check known default listed businesses if not found in custom storage
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

          // Special check for Apple to match email, secondary email, or mobile
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

          return (
            email === idInput ||
            (cleanInput.length >= 10 && cleanPhone.includes(cleanInput.slice(-10)))
          );
        });
      }

      // Check if business was matched
      if (!matchedBusiness) {
        setIsSubmitting(false);
        setErrorMessage(
          'No business account found for this Email or Mobile. Click "Sign Up as Business" tab above to register for free!'
        );
        return;
      }

      // Ensure Apple password is consistently 12345678
      if (
        matchedBusiness.id === 'BBN-CLM-799760' ||
        matchedBusiness.businessName?.toLowerCase() === 'apple'
      ) {
        matchedBusiness.password = '12345678';
      }

      // Verify Password
      const expectedPassword = matchedBusiness.password || '12345678';
      if (passInput !== expectedPassword) {
        setIsSubmitting(false);
        setErrorMessage('Incorrect password. Please verify your credentials.');
        return;
      }

      // Login Successful!
      const ownerSession = {
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
          matchedBusiness.logo ||
          (matchedBusiness.businessName?.toLowerCase() === 'apple' ? '/apple-logo.svg' : undefined),
      };

      localStorage.setItem('bharatbn_owner_session', JSON.stringify(ownerSession));
      window.dispatchEvent(new Event('bharatbn_auth_changed'));

      setLoginSuccess(true);
      setIsSubmitting(false);

      if (onLoginSuccess) {
        onLoginSuccess(ownerSession);
      }

      setTimeout(() => {
        onClose();
        setLoginSuccess(false);
        router.push('/dashboard');
      }, 700);
    }, 400);
  };

  // Step 1 of Signup: Send Verification OTP
  const handleSendSignupOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

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

    // Generate random 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setSignupStep('otp');
    setOtpCountdown(45);
    setIsOtpTimerActive(true);
    setOtpError(null);
  };

  // Step 2 of Signup: Verify OTP and Register Account
  const handleVerifyOtpAndRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    if (signupOtp.trim() !== generatedOtp.trim()) {
      setOtpError(`Invalid OTP. Please enter the 6-digit code sent to ${signupEmail}.`);
      return;
    }

    setIsSubmitting(true);

    const generatedId = `BBN-BUS-${Date.now().toString().slice(-6)}`;
    const baseSlug = signupBusinessName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

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
      businessDescription: `${signupBusinessName.trim()} is a newly registered business on BharatBN™ Business Network serving ${signupCity} under ${signupCategory}.`,
      description: `${signupBusinessName.trim()} is a newly registered business on BharatBN™ Business Network serving ${signupCity} under ${signupCategory}.`,
      aboutStory: `Founded with a dedication to high quality and trusted customer service in ${signupCity}. We are verified by BharatBN for authentic credentials.`,
      seoTitle: `${signupBusinessName.trim()} | ${signupCity}`,
      seoDescription: `${signupBusinessName.trim()} verified business profile on BharatBN™ Business Network.`,
      socialLinks: {
        instagram: '',
        youtube: '',
        facebook: '',
        linkedin: '',
        twitter: '',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Save to local claims store
    try {
      const stored = localStorage.getItem('bharatbn_claims_store');
      let claims = stored ? JSON.parse(stored) : [];
      claims.unshift(newBusiness);
      localStorage.setItem('bharatbn_claims_store', JSON.stringify(claims));
      window.dispatchEvent(new Event('bharatbn_claims_updated'));
    } catch (err) {
      console.error(err);
    }

    // 2. Call backend API in background
    try {
      api.businesses
        .create({
          name: newBusiness.name,
          phone: newBusiness.phone,
          whatsapp: newBusiness.whatsapp,
          email: newBusiness.email,
          addressLine: newBusiness.addressLine,
          citySlug: signupCity.split(',')[0].trim().toLowerCase(),
          description: newBusiness.description,
          categorySlug: signupCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        })
        .catch(() => {});
    } catch {}

    // 3. Set Owner Session
    const ownerSession = {
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

    if (onLoginSuccess) {
      onLoginSuccess(ownerSession);
    }

    setTimeout(() => {
      onClose();
      setLoginSuccess(false);
      router.push('/dashboard');
    }, 900);
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
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {mode === 'login' ? 'Business Owner Login' : 'Register Your Business'}
              </h2>
              <p className="text-xs text-slate-300">
                {mode === 'login'
                  ? 'Access your listing, leads & operations portal'
                  : 'Get discovered, manage leads & edit profile (Free)'}
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

        {/* Mode Selector Tabs (Log In / Sign Up as Business) */}
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
              <span>Log In to Business</span>
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
              <span>Sign Up as Business</span>
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
                {mode === 'login' ? 'Welcome Back!' : 'Business Registered & Verified!'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Opening your Pravixo-style Business Operations Portal...
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
                  <span>Demo Business Credentials:</span>
                  <span className="text-[10px] text-slate-500 font-mono">Password: 12345678</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier('apple@business.in');
                      setPassword('12345678');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#F95700] text-slate-800 text-[11px] font-semibold transition cursor-pointer shadow-2xs"
                  >
                    Apple (9717056860)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier('cad@gmail.com');
                      setPassword('12345678');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#F95700] text-slate-800 text-[11px] font-semibold transition cursor-pointer shadow-2xs"
                  >
                    Choco Delights (Cadboury)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier('care@apexdentalmumbai.com');
                      setPassword('12345678');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#F95700] text-slate-800 text-[11px] font-semibold transition cursor-pointer shadow-2xs"
                  >
                    Apex Dental
                  </button>
                </div>
              </div>

              {/* Email / Mobile Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Email Address or Mobile Number <span className="text-[#F95700]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. apple@business.in or 9717056860"
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] focus:ring-1 focus:ring-[#F95700] transition bg-white"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Account Password <span className="text-[#F95700]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Demo accounts password is: 12345678')}
                    className="text-[11px] font-semibold text-[#F95700] hover:underline cursor-pointer"
                  >
                    Forgot Password?
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
                    placeholder="Enter 8-digit password (demo: 12345678)"
                    className="w-full text-xs pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] focus:ring-1 focus:ring-[#F95700] transition bg-white"
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
                className="w-full py-2.5 rounded-xl bg-[#07213A] hover:bg-[#0C2D4E] text-white font-bold text-xs sm:text-sm transition shadow-md shadow-navy-950/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Log In to Business Portal</span>
                    <ArrowRight className="w-4 h-4 text-[#F95700]" />
                  </>
                )}
              </button>
            </form>
          ) : signupStep === 'details' ? (
            /* ========================================================================= */
            /* 2. SIGNUP TAB - STEP 1: INITIAL DETAILS                                   */
            /* ========================================================================= */
            <form onSubmit={handleSendSignupOtp} className="space-y-3.5">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Business Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Business Name <span className="text-[#F95700]">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signupBusinessName}
                    onChange={(e) => setSignupBusinessName(e.target.value)}
                    placeholder="e.g. Horizon Motors & Spares"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                  />
                </div>
              </div>

              {/* Owner Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Owner / Representative Full Name <span className="text-[#F95700]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signupOwnerName}
                    onChange={(e) => setSignupOwnerName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                  />
                </div>
              </div>

              {/* Work Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Work Email <span className="text-[#F95700]">* (OTP Verified)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="contact@business.in"
                      className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Mobile / WhatsApp <span className="text-[#F95700]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="9820012345"
                      className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                    />
                  </div>
                </div>
              </div>

              {/* Category & City Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={signupCategory}
                    onChange={(e) => setSignupCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] bg-white text-slate-700"
                  >
                    <option value="Automobile & EV">Automobile &amp; EV</option>
                    <option value="Food, Bakeries & Confectionery">Food &amp; Confectionery</option>
                    <option value="Healthcare & Clinics">Healthcare &amp; Clinics</option>
                    <option value="Preschools & Education">Preschools &amp; Education</option>
                    <option value="Restaurants & Cafes">Restaurants &amp; Cafes</option>
                    <option value="Real Estate & Builders">Real Estate &amp; Builders</option>
                    <option value="IT & Software Services">IT &amp; Software</option>
                    <option value="Retail & Shopping">Retail &amp; Shopping</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">City / Hub</label>
                  <input
                    type="text"
                    required
                    value={signupCity}
                    onChange={(e) => setSignupCity(e.target.value)}
                    placeholder="e.g. Noida, UP or Mumbai, MH"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Create Password <span className="text-[#F95700]">* (Min. 8 characters)</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Set an 8-character password"
                    className="w-full text-xs pl-9 pr-10 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Continue to OTP Button */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white font-bold text-xs sm:text-sm transition shadow-md shadow-[#F95700]/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Continue to Email Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* ========================================================================= */
            /* 3. SIGNUP TAB - STEP 2: EMAIL OTP VERIFICATION (Requirement 4)           */
            /* ========================================================================= */
            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
              <div className="text-center space-y-1 py-1">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#F95700] flex items-center justify-center mx-auto shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Verify Your Business Email</h3>
                <p className="text-xs text-slate-500">
                  We sent a 6-digit verification code to <strong className="text-slate-800">{signupEmail}</strong>
                </p>
              </div>

              {/* Live Demo Testing OTP Helper */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1 text-emerald-800">
                <div className="font-bold flex items-center justify-between">
                  <span>📨 Email Verification Code Sent!</span>
                  <span className="font-mono text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                    OTP: <strong>{generatedOtp}</strong>
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  (For instant demo testing, enter code <strong>{generatedOtp}</strong> below or click Fill Demo Code)
                </p>
                <button
                  type="button"
                  onClick={() => setSignupOtp(generatedOtp)}
                  className="text-[11px] font-bold text-emerald-900 underline hover:text-emerald-700 cursor-pointer"
                >
                  ⚡ Autofill Demo Code ({generatedOtp})
                </button>
              </div>

              {otpError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{otpError}</span>
                </div>
              )}

              {/* OTP Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 text-center">
                  Enter 6-Digit Email OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={signupOtp}
                  onChange={(e) => setSignupOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.5em] text-xl font-mono font-bold py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F95700] focus:ring-2 focus:ring-[#F95700]/20 bg-slate-50/50"
                  autoFocus
                />
              </div>

              {/* Resend & Timer */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => setSignupStep('details')}
                  className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  &larr; Edit Details
                </button>

                <div>
                  {isOtpTimerActive ? (
                    <span className="text-slate-400 font-mono text-[11px]">Resend in {otpCountdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[#F95700] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend OTP</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Verify & Launch Button */}
              <button
                type="submit"
                disabled={isSubmitting || signupOtp.length !== 6}
                className="w-full py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white font-bold text-xs sm:text-sm transition shadow-md shadow-[#F95700]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Verifying &amp; Initializing Profile...</span>
                ) : (
                  <>
                    <span>Verify OTP &amp; Launch Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between flex-shrink-0">
          <span>
            {mode === 'login' ? "Don't have an account yet?" : 'Already registered?'}
          </span>
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setSignupStep('details');
              setErrorMessage(null);
            }}
            className="font-bold text-[#F95700] hover:underline cursor-pointer"
          >
            {mode === 'login' ? '+ Register Your Business Free' : 'Log In Here &rarr;'}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
