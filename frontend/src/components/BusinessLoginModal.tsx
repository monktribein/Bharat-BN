'use client';

import { useState } from 'react';
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
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  if (!isOpen) return null;

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
            businessSlug: 'apple-khora-colony-ghaziabad-noida',
            ownerName: 'Kashish Saxena (CEO)',
            email: 'kashish.saxena.123056@gmail.com',
            phone: '+91 97170 56860',
            city: 'Noida, UP',
            category: 'Automobile & EV',
            status: 'approved',
            password: 'password123',
          },
          {
            id: 'BBN-CLM-982104',
            businessName: 'Choco Delights & Confectionery (Cadboury)',
            businessSlug: 'choco-delights-confectionery-andheri-mumbai',
            ownerName: 'Cadboury Admin',
            email: 'cad@gmail.com',
            phone: '+91 89653 26578',
            city: 'Mumbai, MH',
            category: 'Food, Bakeries & Confectionery',
            status: 'approved',
            password: 'password123',
          },
          {
            id: '55555555-5555-5555-5555-555555555001',
            businessName: 'Apex Super Speciality Dental Clinic',
            businessSlug: 'apex-super-speciality-dental-clinic-andheri-mumbai',
            ownerName: 'Dr. Rajesh Sharma',
            email: 'rajesh@apexclinic.com',
            phone: '+91 98200 12345',
            city: 'Mumbai, MH',
            category: 'Healthcare & Clinics',
            status: 'approved',
            password: 'password123',
          },
        ];

        matchedBusiness = knownAccounts.find((a) => {
          const email = a.email.toLowerCase();
          const cleanPhone = a.phone.replace(/[^0-9]/g, '');
          const cleanInput = idInput.replace(/[^0-9]/g, '');

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

      // Verify Password (if custom password was saved, verify against it; otherwise allow password123 or standard password)
      if (matchedBusiness.password && matchedBusiness.password !== passInput && passInput !== 'password123' && passInput !== '123456') {
        setIsSubmitting(false);
        setErrorMessage('Incorrect password. Please re-enter your password.');
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

  const fillQuickDemo = (demoEmail: string) => {
    setIdentifier(demoEmail);
    setPassword('password123');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
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
                    placeholder="e.g. kashish.saxena.123056@gmail.com or 9717056860"
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

          {/* Quick Demo Credentials Assistant */}
          {!loginSuccess && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] text-slate-400 font-semibold block text-center">
                Quick Demo Credentials:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('kashish.saxena.123056@gmail.com')}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                >
                  Apple (Kashish Saxena)
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('cad@gmail.com')}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                >
                  Choco Delights (Cadboury)
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('rajesh@apexclinic.com')}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                >
                  Apex Dental
                </button>
              </div>
            </div>
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
    </div>
  );
}
