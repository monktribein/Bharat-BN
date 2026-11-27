'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  ChevronRight,
  ChevronUp,
  Sparkles,
  X,
  MessageCircle,
  Check,
  Send,
  HelpCircle,
} from 'lucide-react';
import {
  FacebookFIcon,
  InstagramIcon,
  YouTubeIcon,
  TwitterXIcon,
  LinkedInIcon,
} from '@/components/SocialIcons';

export default function Footer() {
  const pathname = usePathname();
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSupportPillOpen, setIsSupportPillOpen] = useState(true);

  // Monitor scroll for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    setIsSubscribed(true);
    setEmailInput('');
    setTimeout(() => {
      setIsSubscribed(false);
    }, 5000);
  };

  // Do not render public footer on dedicated admin console routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <footer className="bg-[#050D18] text-slate-300 pt-16 pb-10 border-t border-[#0C1A2E] relative font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-[#0E2038]">
            {/* Column 1: Brand & Contact & App Store Badges (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              {/* Brand Logo */}
              <Link href="/" className="inline-block group mb-1">
                <Image
                  src="/logo-dark.png"
                  alt="BharatBN - India's Local Business Network"
                  width={260}
                  height={80}
                  priority
                  className="h-12 sm:h-14 w-auto object-contain hover:opacity-95 transition"
                />
              </Link>

              {/* Mission Statement */}
              <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed max-w-sm">
                Connecting verified local businesses, enterprises, and public voices across India.
                We take care of every detail so your business can grow with trust, visibility, and sovereign reach.
              </p>

              {/* Direct Contact Info */}
              <div className="space-y-2 pt-1 text-xs sm:text-[13px]">
                <a
                  href="tel:+919717056860"
                  className="flex items-center gap-2.5 text-slate-300 hover:text-white transition group font-medium"
                >
                  <span className="w-6 h-6 rounded-full bg-[#0B1829] border border-slate-800 flex items-center justify-center text-[#F95700] group-hover:scale-110 transition-transform">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  <span>+91 97170 56860</span>
                </a>

                <a
                  href="mailto:support@bharatbn.com"
                  className="flex items-center gap-2.5 text-slate-300 hover:text-white transition group font-medium"
                >
                  <span className="w-6 h-6 rounded-full bg-[#0B1829] border border-slate-800 flex items-center justify-center text-[#F95700] group-hover:scale-110 transition-transform">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <span>Email Support (support@bharatbn.com)</span>
                </a>
              </div>

              {/* App Store Buttons */}
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                {/* Google Play Badge */}
                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0B1728] hover:bg-[#10223A] border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl flex items-center gap-2.5 transition shadow-xs group"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3.6 1.8L13.8 12 3.6 22.2C3.2 21.8 3 21.2 3 20.4V3.6C3 2.8 3.2 2.2 3.6 1.8Z"
                      fill="#00E676"
                    />
                    <path
                      d="M17.2 8.6L13.8 12 3.6 1.8C4.2 1.3 5.2 1.4 6 1.8L17.2 8.6Z"
                      fill="#FFD54F"
                    />
                    <path
                      d="M13.8 12L17.2 15.4 6 22.2C5.2 22.6 4.2 22.7 3.6 22.2L13.8 12Z"
                      fill="#FF1744"
                    />
                    <path
                      d="M20.8 10.6L17.2 8.6 13.8 12 17.2 15.4 20.8 13.4C21.7 12.9 21.7 11.1 20.8 10.6Z"
                      fill="#29B6F6"
                    />
                  </svg>
                  <div className="text-left">
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block leading-none">
                      GET IT ON
                    </span>
                    <span className="text-[12px] font-extrabold text-white leading-tight block mt-0.5">
                      Google Play
                    </span>
                  </div>
                </a>

                {/* App Store Badge */}
                <a
                  href="https://apple.com/app-store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0B1728] hover:bg-[#10223A] border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl flex items-center gap-2.5 transition shadow-xs group"
                >
                  <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1.01.08 2.03-.5 2.64-1.24z" />
                  </svg>
                  <div className="text-left">
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block leading-none">
                      DOWNLOAD ON THE
                    </span>
                    <span className="text-[12px] font-extrabold text-white leading-tight block mt-0.5">
                      App Store
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links (2.5 cols) */}
            <div className="lg:col-span-2 sm:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-[#F95700] rounded-full inline-block" />
                <h4 className="text-white font-bold text-sm tracking-wide">Quick Links</h4>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-[13px]">
                <li>
                  <Link
                    href="/about"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-[#F95700] transition-colors">›</span>
                    <span>About Us</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-[#F95700] transition-colors">›</span>
                    <span>Explore Directory</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/people"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-[#F95700] transition-colors">›</span>
                    <span>People & Verified Figures</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/enterprise"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-[#F95700] transition-colors">›</span>
                    <span>Franchise Enterprise</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/enterprise#pay-as-you-rank"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-[#F95700] transition-colors">›</span>
                    <span>Pay-As-You-Rank™</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/claim/new"
                    className="text-slate-400 hover:text-[#F95700] transition flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-[#F95700] transition-colors">›</span>
                    <span>Claim Your Business</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-[#F95700] transition-colors">›</span>
                    <span>Business Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?q=growth"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-[#F95700] transition-colors">›</span>
                    <span>Knowledge Hub</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Our Services / Core Network (2.5 cols) */}
            <div className="lg:col-span-3 sm:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-[#F95700] rounded-full inline-block" />
                <h4 className="text-white font-bold text-sm tracking-wide">Our Services</h4>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-[13px]">
                <li>
                  <Link
                    href="/search?category=healthcare-clinics"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-[#F95700] transition-colors">›</span>
                    <span>Healthcare & Clinics</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?category=education-preschools"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-[#F95700] transition-colors">›</span>
                    <span>Preschools & Education</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?category=real-estate-builders"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-[#F95700] transition-colors">›</span>
                    <span>Real Estate & Builders</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?category=it-software"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-[#F95700] transition-colors">›</span>
                    <span>IT & Cloud Software</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?category=fashion-lifestyle"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-[#F95700] transition-colors">›</span>
                    <span>Fashion & Lifestyle</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?category=weddings-events"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-[#F95700] transition-colors">›</span>
                    <span>Weddings & Event Venues</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?category=citizens-legal"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-[#F95700] transition-colors">›</span>
                    <span>Citizens & Legal Services</span>
                  </Link>
                </li>
                <li>
                  <a
                    href="https://wa.me/919717056860?text=Hello%20BharatBN%20Help"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#F95700] transition flex items-center gap-1.5 group"
                  >
                    <span className="text-slate-600 group-hover:text-[#F95700] transition-colors">›</span>
                    <span>Help & Merchant Support</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Stay Connected & Newsletter & Badges (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-[#F95700] rounded-full inline-block" />
                <h4 className="text-white font-bold text-sm tracking-wide">Stay Connected</h4>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Subscribe for local market updates, upcoming business summits & exclusive merchant growth alerts.
              </p>

              {/* Newsletter Form */}
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center gap-1.5 bg-[#081526] border border-slate-800 rounded-full p-1 focus-within:border-[#F95700] transition shadow-inner">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address"
                    className="bg-transparent text-xs px-3.5 py-1.5 text-white placeholder:text-slate-500 focus:outline-none flex-1 min-w-0"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-[#F95700] hover:bg-[#EA4E00] text-white text-xs font-bold px-4 py-2 rounded-full transition flex items-center gap-1 shadow-md shadow-orange-600/30 whitespace-nowrap cursor-pointer shrink-0"
                  >
                    <span>Subscribe</span>
                    <span className="text-sm">→</span>
                  </button>
                </div>
                {isSubscribed && (
                  <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 pt-1 animate-fadeIn">
                    <Check className="w-3.5 h-3.5" />
                    <span>Subscribed! You will receive BharatBN alerts.</span>
                  </div>
                )}
              </form>

              {/* Follow Us */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-300 block mb-3 tracking-wide">
                  Follow Us
                </span>
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  {/* Facebook */}
                  <a
                    href="https://facebook.com/bharatbn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#0C1B2D] hover:bg-[#F95700] text-slate-200 hover:text-white border border-[#162B42] hover:border-[#F95700] flex items-center justify-center transition-all shadow-xs group cursor-pointer"
                    title="Follow on Facebook"
                  >
                    <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.5-.14-2.854-.14C11.828 2 10 3.722 10 6.945V9.5H7v4h3V22h4v-8.5z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com/bharatbn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#0C1B2D] hover:bg-[#F95700] text-slate-200 hover:text-white border border-[#162B42] hover:border-[#F95700] flex items-center justify-center transition-all shadow-xs group cursor-pointer"
                    title="Follow on Instagram"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current stroke-[2.2] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" />
                    </svg>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/919717056860?text=Hello%20BharatBN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#0C1B2D] hover:bg-[#25D366] text-slate-200 hover:text-white border border-[#162B42] hover:border-[#25D366] flex items-center justify-center transition-all shadow-xs group cursor-pointer"
                    title="Chat on WhatsApp"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current stroke-[2.2] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                    </svg>
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://youtube.com/@bharatbn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#0C1B2D] hover:bg-[#FF0000] text-slate-200 hover:text-white border border-[#162B42] hover:border-[#FF0000] flex items-center justify-center transition-all shadow-xs group cursor-pointer"
                    title="Watch on YouTube"
                  >
                    <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>

                  {/* Twitter / X */}
                  <a
                    href="https://x.com/bharatbn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#0C1B2D] hover:bg-slate-700 text-slate-200 hover:text-white border border-[#162B42] hover:border-slate-600 flex items-center justify-center transition-all shadow-xs group cursor-pointer"
                    title="Follow on X"
                  >
                    <svg className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com/company/bharatbn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#0C1B2D] hover:bg-[#0A66C2] text-slate-200 hover:text-white border border-[#162B42] hover:border-[#0A66C2] flex items-center justify-center transition-all shadow-xs group cursor-pointer"
                    title="Follow on LinkedIn"
                  >
                    <svg className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.55a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Payment & Trust Badges (Matching Screenshot) */}
              <div className="pt-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* UPI Badge */}
                  <div className="h-7 px-3 bg-white rounded-md flex items-center justify-center shadow-xs border border-slate-200 select-none">
                    <span className="font-black text-xs italic tracking-tighter text-[#0A2F44] flex items-center gap-0.5">
                      <span className="text-[#0E8A16]">U</span>
                      <span className="text-[#F95700]">P</span>
                      <span className="text-[#0A2F44]">I</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0E8A16] inline-block ml-0.5" />
                    </span>
                  </div>

                  {/* VISA Badge */}
                  <div className="h-7 px-3 bg-white rounded-md flex items-center justify-center shadow-xs border border-slate-200 select-none">
                    <span className="font-black text-xs italic tracking-widest text-[#1A1F71]">
                      VISA
                    </span>
                  </div>

                  {/* MasterCard Badge */}
                  <div className="h-7 px-3 bg-white rounded-md flex items-center justify-center shadow-xs border border-slate-200 select-none">
                    <div className="flex items-center -space-x-1.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B]" />
                      <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90" />
                    </div>
                  </div>

                  {/* RuPay Badge */}
                  <div className="h-7 px-3 bg-white rounded-md flex items-center justify-center shadow-xs border border-slate-200 select-none">
                    <span className="font-extrabold text-[11px] tracking-tight text-[#07213A] flex items-center">
                      <span className="text-[#07213A]">Ru</span>
                      <span className="text-[#F95700]">Pay</span>
                      <span className="text-[#00875A] font-black text-xs ml-0.5">❯</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Compliance */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 BharatBN™. All Rights Reserved.</p>
            <div className="flex items-center gap-6 flex-wrap font-medium">
              <Link href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition">
                Terms &amp; Conditions
              </Link>
              <Link href="/editorial-standards" className="hover:text-white transition">
                DPDP Act &amp; Governance
              </Link>
              <Link href="/search#faq" className="hover:text-white transition">
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Right Controls (Matching Screenshot) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5">
        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
            className="w-10 h-10 rounded-full bg-[#F95700] hover:bg-[#EA4E00] text-white flex items-center justify-center shadow-lg shadow-orange-500/30 transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <ChevronUp className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        {/* Floating Support Pill */}
        {isSupportPillOpen && (
          <div className="flex items-center bg-white text-slate-900 border border-slate-200 rounded-full px-3.5 py-2 shadow-xl shadow-black/15 text-xs font-bold gap-2 animate-fadeIn select-none">
            <a
              href="https://wa.me/919717056860?text=Hello%20BharatBN%20Support"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-900 hover:text-[#F95700] transition"
            >
              <span className="w-2 h-2 rounded-full bg-[#F95700] animate-pulse" />
              <span>Get Support</span>
            </a>
            <button
              type="button"
              onClick={() => setIsSupportPillOpen(false)}
              className="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
              aria-label="Dismiss support pill"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
