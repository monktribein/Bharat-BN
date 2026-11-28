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
  Check,
  Send,
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
            {/* Column 1: Brand & Contact & App Store Badges */}
            <div className="lg:col-span-4 space-y-5">
              {/* Brand Logo & Subhead */}
              <div>
                <Link href="/" className="inline-block group mb-1.5">
                  <Image
                    src="/logo-dark.png"
                    alt="BharatBN - India's Audited Business Network"
                    width={260}
                    height={80}
                    priority
                    className="h-11 sm:h-12 w-auto object-contain hover:opacity-95 transition"
                  />
                </Link>
                <div className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-[#00b074] flex items-center gap-1.5 pl-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00b074] inline-block" />
                  <span>INDIA&apos;S AUDITED BUSINESS NETWORK</span>
                </div>
              </div>

              {/* Mission Statement */}
              <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed max-w-sm">
                Connecting verified Indian businesses, clinics, and enterprises with nationwide high-intent visibility and audited trust.
              </p>

              {/* Direct Contact Cards */}
              <div className="space-y-2 pt-1 text-xs sm:text-[13px]">
                <a
                  href="tel:+9118002028899"
                  className="flex items-center gap-2.5 text-slate-300 hover:text-white transition group font-medium bg-[#0B1829] border border-slate-800/80 rounded-xl px-3.5 py-2 w-fit"
                >
                  <span className="w-6 h-6 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#F95700] group-hover:scale-110 transition-transform">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  <span className="tracking-wide font-semibold">+91 1800 202 8899</span>
                </a>

                <a
                  href="mailto:support@bharatbn.com"
                  className="flex items-center gap-2.5 text-slate-300 hover:text-white transition group font-medium bg-[#0B1829] border border-slate-800/80 rounded-xl px-3.5 py-2 w-fit"
                >
                  <span className="w-6 h-6 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#F95700] group-hover:scale-110 transition-transform">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <span>support@bharatbn.com</span>
                </a>
              </div>

            </div>

            {/* Column 2: Quick Links */}
            <div className="lg:col-span-2 sm:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#F95700] rounded-full inline-block" />
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">Quick Links</h4>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-[13px]">
                <li>
                  <Link
                    href="/about"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span>About BharatBN</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span>Audited Directory</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/seo-campaigns"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span>Pay-As-You-Rank™</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/enterprise"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span>Franchise Hub</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?filter=verified"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span>Verified Seller Preview</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/claim/new"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span>MCA &amp; GST Validator</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?q=growth"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span>Knowledge Base</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Business Solutions */}
            <div className="lg:col-span-3 sm:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#F95700] rounded-full inline-block" />
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">Business Solutions</h4>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-[13px]">
                <li>
                  <Link
                    href="/search?category=healthcare-clinics"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span>Healthcare &amp; Clinics</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?category=education-schools"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span>CBSE &amp; ICSE Institutions</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?category=food-confectionery"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span>FMCG &amp; Retail Chains</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?category=precision-manufacturing"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span>Precision Manufacturing</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?category=legal-services"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span>Legal &amp; Auditing Desks</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search?filter=sellers"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span>Verified Seller Preview</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/editorial-standards"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span>Director Background Check</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about#redressal"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span>Help &amp; Dispute Redressal</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Stay Connected & Payment Partners */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#F95700] rounded-full inline-block" />
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">Stay Connected</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Subscribe for regional procurement alerts, B2B tender alerts &amp; local business ranking updates.
              </p>

              {/* Newsletter Subscription */}
              <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter business email..."
                    required
                    className="w-full bg-[#071322] border border-[#162D4A] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F95700] pr-24 transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3.5 rounded-lg bg-[#c2410c] hover:bg-[#ea580c] text-white text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>Subscribe</span>
                    <span className="text-xs">→</span>
                  </button>
                </div>
                {isSubscribed && (
                  <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 pt-1 animate-fadeIn">
                    <Check className="w-3.5 h-3.5" />
                    <span>Subscribed! You will receive BharatBN alerts.</span>
                  </div>
                )}
              </form>

              {/* Social Media Tiles - Brand colors always visible */}
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com/company/bharatbn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#0A66C2] hover:bg-[#0952a5] text-white border border-[#0A66C2] flex items-center justify-center transition-all shadow-xs cursor-pointer"
                    title="Follow on LinkedIn"
                  >
                    <LinkedInIcon className="w-3.5 h-3.5 fill-current" />
                  </a>

                  {/* X (formerly Twitter) */}
                  <a
                    href="https://x.com/bharatbn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-black hover:bg-slate-800 text-white border border-slate-600 flex items-center justify-center transition-all shadow-xs cursor-pointer"
                    title="Follow on X"
                  >
                    <TwitterXIcon className="w-3.5 h-3.5 fill-current" />
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://youtube.com/@bharatbn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#FF0000] hover:bg-[#cc0000] text-white border border-[#FF0000] flex items-center justify-center transition-all shadow-xs cursor-pointer"
                    title="Watch on YouTube"
                  >
                    <YouTubeIcon className="w-3.5 h-3.5 fill-current" />
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://facebook.com/bharatbn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#1877F2] hover:bg-[#1259bd] text-white border border-[#1877F2] flex items-center justify-center transition-all shadow-xs cursor-pointer"
                    title="Follow on Facebook"
                  >
                    <FacebookFIcon className="w-3 h-3 fill-current" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Bar: Copyright & Compliance */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 BharatBN Technologies Private Limited. All Rights Reserved.</p>
            <div className="flex items-center gap-6 flex-wrap font-medium">
              <Link href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition">
                Terms of Service
              </Link>
              <Link href="/editorial-standards" className="hover:text-white transition">
                Audit Protocol
              </Link>
              <Link href="/terms#anti-fraud" className="hover:text-white transition">
                Anti-Fraud Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Right Controls (Matching Stitch Screenshot) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5">
        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
            className="w-9 h-9 rounded-full bg-[#F95700] hover:bg-[#EA4E00] text-white flex items-center justify-center shadow-lg shadow-orange-500/30 transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <ChevronUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    </>
  );
}
