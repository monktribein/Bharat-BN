'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  Building2,
  ShieldCheck,
  User,
  Plus,
  LogOut,
  Edit,
} from 'lucide-react';

interface OwnerSession {
  businessId: string;
  businessName: string;
  businessSlug: string;
  ownerName: string;
  logoUrl?: string;
  status?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [ownerSession, setOwnerSession] = useState<OwnerSession | null>(null);

  // Sync Owner Session from localStorage
  useEffect(() => {
    const syncSession = () => {
      try {
        const stored = localStorage.getItem('bharatbn_owner_session');
        if (stored) {
          setOwnerSession(JSON.parse(stored));
        } else {
          setOwnerSession(null);
        }
      } catch {
        setOwnerSession(null);
      }
    };

    syncSession();
    window.addEventListener('bharatbn_auth_changed', syncSession);
    return () => window.removeEventListener('bharatbn_auth_changed', syncSession);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('bharatbn_owner_session');
      window.dispatchEvent(new Event('bharatbn_auth_changed'));
      setOwnerSession(null);
    } catch {}
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
        {/* Official Brand Logo with Hover Micro-Interaction */}
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

        {/* Center Floating Pill Navigation with Sliding Active Indicator */}
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
                  className={`w-4 h-4 transition-colors duration-200 ${active ? 'text-[#D94F00]' : 'text-slate-500'
                    }`}
                />
                <span
                  className={`transition-colors duration-200 ${active ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons: Logged In as Business Owner vs Visitor */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {ownerSession ? (
            <div className="flex items-center gap-2">
              {/* Business Account Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                {ownerSession.logoUrl ? (
                  <img
                    src={ownerSession.logoUrl}
                    alt={ownerSession.businessName}
                    className="w-6 h-6 rounded-lg object-contain bg-white border border-slate-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-[#07213A] text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                    {ownerSession.businessName.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="hidden sm:block text-left max-w-[140px]">
                  <div className="font-bold text-slate-900 truncate leading-tight">
                    {ownerSession.businessName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Owner Account</div>
                </div>
              </div>

              {/* Edit Profile Button */}
              <Link
                href={`/claim/${ownerSession.businessId || ownerSession.businessSlug}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-xs"
                title="Edit your business profile"
              >
                <Edit className="w-3.5 h-3.5 text-[#F95700]" />
                <span className="hidden sm:inline">Edit Profile</span>
              </Link>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50/70 hover:bg-red-100 border border-red-200 transition cursor-pointer"
                title="Log out of business account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
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
