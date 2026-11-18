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
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BusinessLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (session: any) => void;
}

export default function BusinessLoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: BusinessLoginModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

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
          'No business account found for this Email or Mobile. Please verify or click "List Business Free" below to register.'
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
        businessName: matchedBusiness.businessName,
        businessSlug: matchedBusiness.businessSlug,
        ownerName: matchedBusiness.claimantName || matchedBusiness.ownerName || 'Verified Business Owner',
        ownerEmail: matchedBusiness.workEmail || matchedBusiness.email,
        phone: matchedBusiness.phone,
        city: matchedBusiness.city || 'Noida, UP',
        category: matchedBusiness.category || 'Automobile & EV',
        status: matchedBusiness.status || 'approved',
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

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-[#07213A] to-[#0D3861] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F95700]/20 border border-[#F95700]/40 flex items-center justify-center text-[#F95700]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Business Owner Login</h2>
              <p className="text-xs text-slate-300">Access your listing &amp; customer inquiries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-6 space-y-4">
          {loginSuccess ? (
            <div className="py-6 text-center space-y-2 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Login Successful!</h3>
              <p className="text-xs text-slate-500">Redirecting to your Business Operations Portal...</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

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
                    placeholder="e.g. apple@business.in or 9820012345"
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
                    onClick={() => alert('Password reset link sent to your registered email.')}
                    className="text-[11px] font-semibold text-[#F95700] hover:underline"
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
                    placeholder="Enter your password"
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
                className="w-full py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white font-bold text-xs sm:text-sm transition shadow-md shadow-[#F95700]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Log In to Business Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>New business on BharatBN?</span>
          <a
            href="/claim/new"
            onClick={onClose}
            className="font-bold text-[#F95700] hover:underline"
          >
            + List Business &amp; Create Account
          </a>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
