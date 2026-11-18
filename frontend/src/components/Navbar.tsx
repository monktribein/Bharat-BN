'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Search,
  Building2,
  ShieldCheck,
  User,
  Plus,
  LogOut,
  PenSquare,
  ChevronDown,
} from 'lucide-react';

interface BharatBNSession {
  businessName: string;
  businessSlug: string;
  claimTicket: string;
  loggedInAt: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<BharatBNSession | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  // Load session from localStorage
  useEffect(() => {
    const checkSession = () => {
      try {
        const raw = localStorage.getItem('bharatbn_session');
        if (raw) {
          setSession(JSON.parse(raw));
        } else {
          setSession(null);
        }
      } catch {
        setSession(null);
      }
    };

    checkSession();

    // Listen for session changes (e.g. after listing a business)
    window.addEventListener('bharatbn_session_changed', checkSession);
    return () => window.removeEventListener('bharatbn_session_changed', checkSession);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bharatbn_session');
    setSession(null);
    setShowMenu(false);
    window.dispatchEvent(new Event('bharatbn_session_changed'));
    router.push('/');
  };

  // Do not render public navbar on dedicated admin console routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    {
      name: 'Explore Directory',
      href: '/search',
      icon: Search,
      isActive: pathname === '/search' || pathname === '/',
    },
    {
      name: 'Franchise Enterprise',
      href: '/enterprise',
      icon: Building2,
      isActive: pathname === '/enterprise',
    },
    {
      name: 'Pay-As-You-Rank™',
      href: '/dashboard/seo-campaigns',
      icon: ShieldCheck,
      isActive: pathname === '/dashboard/seo-campaigns' || pathname?.includes('pay-as-you-rank'),
    },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Official Brand Logo */}
        <Link href="/" className="flex items-center group select-none flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Image
              src="/logo-light.png"
              alt="BharatBN - India's Local Business Network"
              width={240}
              height={88}
              priority
              className="h-12 sm:h-14 w-auto object-contain transition group-hover:opacity-95"
            />
          </motion.div>
        </Link>

        {/* Center Floating Pill Navigation */}
        <nav className="hidden md:flex items-center bg-[#F1F5F9] p-1.5 rounded-full border border-slate-200/70 shadow-inner-xs relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition z-10 flex items-center gap-2"
              >
                {active && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-white rounded-full shadow-xs border border-slate-200/60 -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon
                  className={`w-4 h-4 transition-colors duration-200 ${active ? 'text-[#D94F00]' : 'text-slate-500'}`}
                />
                <span
                  className={`transition-colors duration-200 ${active ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">

          {session ? (
            /* ---- LOGGED IN STATE: My Business + Logout ---- */
            <div className="flex items-center gap-2">
              {/* My Business Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-xs"
                >
                  {/* Avatar initials */}
                  <div className="w-6 h-6 rounded-lg bg-[#07213A] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
                    {session.businessName.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate hidden sm:block">{session.businessName}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden z-50"
                    onMouseLeave={() => setShowMenu(false)}
                  >
                    {/* Business Info Header */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">My Listed Business</div>
                      <div className="text-xs font-bold text-slate-900 truncate mt-0.5">{session.businessName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {session.claimTicket}</div>
                    </div>

                    {/* Menu Actions */}
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        href={`/biz/${session.businessSlug}`}
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Building2 className="w-4 h-4 text-[#F95700]" />
                        <span>View My Profile</span>
                      </Link>

                      <Link
                        href={`/claim/${session.businessSlug}`}
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <PenSquare className="w-4 h-4 text-indigo-500" />
                        <span>Edit Business Details</span>
                      </Link>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Edit Button */}
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Link
                  href={`/claim/${session.businessSlug}`}
                  className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#D94F00] to-[#C24100] hover:from-[#C24100] hover:to-[#A83800] shadow-md shadow-[#D94F00]/25 transition"
                >
                  <PenSquare className="w-4 h-4 stroke-[2.5]" />
                  <span>Edit Listing</span>
                </Link>
              </motion.div>
            </div>
          ) : (
            /* ---- LOGGED OUT STATE: Portal + List Business ---- */
            <>
              {/* Portal Button */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-xs"
                >
                  <User className="w-4 h-4 text-slate-600" />
                  <span>Portal</span>
                </Link>
              </motion.div>

              {/* List Business Button */}
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Link
                  href="/claim/new"
                  className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#C94A00] bg-gradient-to-r from-[#D94F00] to-[#C24100] hover:from-[#C24100] hover:to-[#A83800] shadow-md shadow-[#D94F00]/25 transition"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>List Business</span>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
