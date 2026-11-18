'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Building2,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  UserCheck,
} from 'lucide-react';

interface RegisteredBusiness {
  id: string;
  businessName: string;
  businessSlug: string;
  ownerName: string;
  phone: string;
  email: string;
  city: string;
  category: string;
  status: string;
}

const defaultKnownBusinesses: RegisteredBusiness[] = [
  {
    id: 'BBN-CLM-799760',
    businessName: 'Apple',
    businessSlug: 'apple-khora-colony-ghaziabad-noida',
    ownerName: 'Kashish Saxena (CEO)',
    phone: '+91 97170 56860',
    email: 'kashish.saxena.123056@gmail.com',
    city: 'Noida, UP',
    category: 'Automobile & EV',
    status: 'approved',
  },
  {
    id: 'BBN-CLM-982104',
    businessName: 'Choco Delights & Confectionery (Cadboury)',
    businessSlug: 'choco-delights-confectionery-andheri-mumbai',
    ownerName: 'Cadboury Admin',
    phone: '+91 89653 26578',
    email: 'cad@gmail.com',
    city: 'Mumbai, MH',
    category: 'Food, Bakeries & Confectionery',
    status: 'approved',
  },
  {
    id: '55555555-5555-5555-5555-555555555001',
    businessName: 'Apex Super Speciality Dental Clinic',
    businessSlug: 'apex-super-speciality-dental-clinic-andheri-mumbai',
    ownerName: 'Dr. Rajesh Sharma',
    phone: '+91 98200 12345',
    email: 'rajesh@apexclinic.com',
    city: 'Mumbai, MH',
    category: 'Healthcare & Clinics',
    status: 'approved',
  },
  {
    id: '55555555-5555-5555-5555-555555555002',
    businessName: 'Little Elly International Preschool',
    businessSlug: 'little-elly-international-preschool-indiranagar-bengaluru',
    ownerName: 'Sunita Rao',
    phone: '+91 98450 67890',
    email: 'director@littleellyindiranagar.com',
    city: 'Bengaluru, KA',
    category: 'Preschools & Education',
    status: 'approved',
  },
];

interface BusinessLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (biz: RegisteredBusiness) => void;
}

export default function BusinessLoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: BusinessLoginModalProps) {
  const [activeTab, setActiveTab] = useState<'quick' | 'phone'>('quick');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [availableBusinesses, setAvailableBusinesses] = useState<RegisteredBusiness[]>(defaultKnownBusinesses);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync dynamic claims into selectable business list
  useEffect(() => {
    if (!isOpen) return;
    try {
      const stored = localStorage.getItem('bharatbn_claims_store');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const dynamic: RegisteredBusiness[] = parsed.map((p: any) => ({
            id: p.id,
            businessName: p.businessName,
            businessSlug: p.businessSlug || (p.businessName || 'business').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            ownerName: p.claimantName || p.claimant || 'Business Owner',
            phone: p.phone || '+91 97170 56860',
            email: p.workEmail || p.email || '',
            city: p.city || 'Noida, UP',
            category: p.category || 'Automobile & EV',
            status: p.status || 'approved',
          }));

          setAvailableBusinesses((prev) => {
            const map = new Map<string, RegisteredBusiness>();
            dynamic.forEach((b) => map.set(b.id, b));
            prev.forEach((b) => {
              if (!map.has(b.id)) map.set(b.id, b);
            });
            return Array.from(map.values());
          });
        }
      }
    } catch {}
  }, [isOpen]);

  const selectBusiness = (biz: RegisteredBusiness) => {
    try {
      const session = {
        businessId: biz.id,
        businessName: biz.businessName,
        businessSlug: biz.businessSlug,
        ownerName: biz.ownerName,
        phone: biz.phone,
        email: biz.email,
        city: biz.city,
        category: biz.category,
        status: biz.status,
      };

      localStorage.setItem('bharatbn_owner_session', JSON.stringify(session));
      window.dispatchEvent(new Event('bharatbn_auth_changed'));
      if (onLoginSuccess) onLoginSuccess(biz);
      onClose();
    } catch (e) {
      console.error('Failed to log in:', e);
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleaned = phoneNumber.replace(/[^0-9]/g, '');

    if (!cleaned || cleaned.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Check if phone matches any known business
    const matched = availableBusinesses.find((b) =>
      b.phone.replace(/[^0-9]/g, '').includes(cleaned.slice(-10))
    );

    if (!otpSent) {
      setOtpSent(true);
      return;
    }

    // Verify OTP (any 4 or 6 digit code for demo / instant login)
    if (otp.length >= 4) {
      if (matched) {
        selectBusiness(matched);
      } else {
        // Create instant session for this phone
        const customBiz: RegisteredBusiness = {
          id: `BBN-OWN-${cleaned.slice(-6)}`,
          businessName: 'My Enterprise Business',
          businessSlug: 'my-enterprise-business',
          ownerName: 'Verified Partner',
          phone: `+91 ${cleaned.slice(-10)}`,
          email: 'partner@bharatbn.com',
          city: 'Noida, UP',
          category: 'Verified Enterprise',
          status: 'approved',
        };
        selectBusiness(customBiz);
      }
    } else {
      setErrorMsg('Please enter the 4-digit verification code (e.g. 1234).');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-[#07213A] to-[#0A2E52] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F95700]/20 border border-[#F95700]/40 flex items-center justify-center text-[#F95700]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Business Owner Portal Login</h2>
              <p className="text-xs text-slate-300">Access your dashboard, leads &amp; branches</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('quick');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 px-4 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'quick'
                ? 'bg-white text-slate-900 border-b-2 border-[#F95700] font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#F95700]" />
            <span>Select Listed Business</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('phone');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 px-4 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'phone'
                ? 'bg-white text-slate-900 border-b-2 border-[#F95700] font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-[#F95700]" />
            <span>Login with Mobile / OTP</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {activeTab === 'quick' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Choose your registered business below to log into your owner dashboard:
              </p>

              <div className="space-y-2.5">
                {availableBusinesses.map((biz) => (
                  <button
                    key={biz.id}
                    onClick={() => selectBusiness(biz)}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-[#F95700] bg-slate-50/70 hover:bg-[#F95700]/5 transition flex items-center justify-between group cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm group-hover:text-[#F95700] transition">
                          {biz.businessName}
                        </span>
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {biz.ownerName} &bull; {biz.city}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {biz.phone}
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#F95700] group-hover:border-[#F95700] transition shadow-xs">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <p className="text-xs text-slate-600">
                Enter the mobile number registered with your BharatBN listing:
              </p>

              {errorMsg && (
                <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="97170 56860"
                    disabled={otpSent}
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#F95700] focus:border-transparent outline-none disabled:bg-slate-100"
                  />
                </div>
              </div>

              {otpSent && (
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  <label className="text-xs font-semibold text-slate-700">Enter OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter any 4-digit code (e.g. 1234)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold tracking-widest text-center focus:ring-2 focus:ring-[#F95700] focus:border-transparent outline-none"
                  />
                  <p className="text-[11px] text-slate-400 text-center">
                    Demo Mode: Any 4-digit OTP will automatically authenticate.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white font-bold text-xs sm:text-sm transition shadow-md shadow-[#F95700]/25 cursor-pointer"
              >
                {otpSent ? 'Verify & Log In to Dashboard' : 'Send Verification OTP'}
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Need to list a new business?</span>
          <a
            href="/claim/new"
            onClick={onClose}
            className="font-bold text-[#F95700] hover:underline"
          >
            + List Business Free
          </a>
        </div>
      </motion.div>
    </div>
  );
}
