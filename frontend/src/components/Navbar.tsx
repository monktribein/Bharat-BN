'use client';

import { useState, useEffect, useRef } from 'react';
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
  LogIn,
  UserPlus,
  LayoutDashboard,
  Bell,
  Users,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import BusinessLoginModal from './BusinessLoginModal';
import {
  AppNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/lib/notifications';

interface UserSession {
  accountType?: 'business' | 'person';
  businessId?: string;
  businessName?: string;
  businessSlug?: string;
  ownerName?: string;
  logoUrl?: string;
  status?: string;
  // Person profile fields
  personId?: string;
  name?: string;
  slug?: string;
  avatarUrl?: string;
  role?: string;
  handle?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [ownerSession, setOwnerSession] = useState<UserSession | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState<AppNotification[]>([]);

  // Sync Notifications from Store / localStorage
  useEffect(() => {
    const syncNotifs = () => {
      try {
        const notifs = getNotifications();
        setNotificationsList(notifs);
      } catch {}
    };

    syncNotifs();
    window.addEventListener('bharatbn_notifications_updated', syncNotifs);
    window.addEventListener('bharatbn_auth_changed', syncNotifs);
    window.addEventListener('storage', syncNotifs);
    return () => {
      window.removeEventListener('bharatbn_notifications_updated', syncNotifs);
      window.removeEventListener('bharatbn_auth_changed', syncNotifs);
      window.removeEventListener('storage', syncNotifs);
    };
  }, []);

  const unreadCount = notificationsList.filter((n) => !n.isRead).length;
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close Notifications Dropdown on Click Outside or Escape Key
  useEffect(() => {
    if (!isNotificationOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNotificationOpen]);

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
      name: 'People',
      href: '/people',
      icon: Users,
      isActive: pathname?.startsWith('/people'),
      isHighlight: true,
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
    <>
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
        <div className="flex items-center gap-2.5 flex-shrink-0 relative">
          {ownerSession ? (
            <div className="flex items-center gap-2">
              {/* In-App Notifications Bell (Only Shown for Logged-In Users) */}
              <div ref={notificationRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 transition relative cursor-pointer shadow-xs"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-slate-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black leading-none shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-xl p-4 space-y-3 z-50 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-[#F95700]" />
                        <span className="font-extrabold text-xs text-slate-900">
                          Notifications {unreadCount > 0 && `(${unreadCount})`}
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            markAllNotificationsAsRead(notificationsList);
                          }}
                          className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {notificationsList.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notificationsList.slice(0, 5).map((n) => {
                          const isApproval = n.type === 'approval';

                          return (
                            <Link
                              key={n.id}
                              href={n.link}
                              onClick={() => {
                                markNotificationAsRead(n.id);
                                setIsNotificationOpen(false);
                              }}
                              className={`block p-2.5 rounded-xl border transition space-y-1 relative ${
                                isApproval
                                  ? 'bg-emerald-50/90 border-emerald-300 hover:bg-emerald-100/70 shadow-xs'
                                  : n.isRead
                                  ? 'bg-white hover:bg-slate-50 border-slate-100'
                                  : 'bg-blue-50/40 hover:bg-blue-50/70 border-blue-200'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  {isApproval ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                  ) : (
                                    !n.isRead && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                                    )
                                  )}
                                  <span className={`font-bold text-xs line-clamp-1 ${isApproval ? 'text-emerald-950 font-black' : 'text-slate-900'}`}>
                                    {n.title}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 flex-shrink-0">{n.time}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 line-clamp-2">{n.desc}</p>
                            </Link>
                          );
                        })
                      )}
                    </div>

                    {/* View All Notifications Button & People Feed Link */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <Link
                        href="/notifications"
                        onClick={() => setIsNotificationOpen(false)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#F95700] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>View All Notifications</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <div className="text-center">
                        <Link
                          href="/people"
                          onClick={() => setIsNotificationOpen(false)}
                          className="text-[11px] font-bold text-slate-500 hover:text-[#F95700] hover:underline"
                        >
                          Explore People &amp; Following Feed &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* DYNAMIC DASHBOARD BUTTONS: PERSON VS BUSINESS */}
              {ownerSession.accountType === 'person' || ownerSession.personId ? (
                /* === PERSON / CREATOR PROFILE LOGGED IN === */
                <>
                  <Link
                    href="/dashboard/person"
                    className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition shadow-xs overflow-hidden cursor-pointer flex-shrink-0"
                    title={`${ownerSession.name || 'Personal Profile'} - Go to Profile Dashboard`}
                  >
                    {ownerSession.avatarUrl ? (
                      <img
                        src={ownerSession.avatarUrl}
                        alt={ownerSession.name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-orange-500 to-amber-600 text-white font-bold flex items-center justify-center text-xs">
                        {(ownerSession.name || 'P').slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </Link>

                  <Link
                    href="/dashboard/person"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-xs"
                    title="Manage Personal / Creator Profile Dashboard"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-600" />
                    <span>Profile Dashboard</span>
                  </Link>

                  <Link
                    href="/dashboard/person#new-post"
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#C94A00] hover:bg-[#A83800] transition shadow-xs"
                    title="Publish a new post or update"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>New Post</span>
                  </Link>
                </>
              ) : (
                /* === BUSINESS OWNER LOGGED IN === */
                <>
                  <Link
                    href="/dashboard"
                    className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition shadow-xs overflow-hidden cursor-pointer flex-shrink-0"
                    title={`${ownerSession.businessName} (Owner Account) - Go to Dashboard`}
                  >
                    {ownerSession.logoUrl || (ownerSession.businessName?.toLowerCase() === 'apple' ? '/apple-logo.svg' : null) ? (
                      <img
                        src={ownerSession.logoUrl || (ownerSession.businessName?.toLowerCase() === 'apple' ? '/apple-logo.svg' : '')}
                        alt={ownerSession.businessName}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#07213A] text-white font-bold flex items-center justify-center text-xs">
                        {(ownerSession.businessName || 'B').slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </Link>

                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-xs"
                    title="Go to Business Operations Dashboard"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-600" />
                    <span>Dashboard</span>
                  </Link>

                  {/* List Business Button (Visible AFTER business signs in!) */}
                  <Link
                    href="/claim/new"
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#C94A00] hover:bg-[#A83800] transition cursor-pointer shadow-xs"
                    title="List another branch or new business"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>List Business</span>
                  </Link>
                </>
              )}

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl text-red-600 bg-red-50/70 hover:bg-red-100 border border-red-200 flex items-center justify-center transition cursor-pointer shadow-xs flex-shrink-0"
                title="Log out of account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* === VISITOR (NOT LOGGED IN): ONLY LOGIN & SIGN UP === */
            <div className="flex items-center gap-2">
              {/* Login Button */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsLoginModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer shadow-xs"
                  title="Log in to Business or Personal account"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Login</span>
                </button>
              </motion.div>

              {/* Sign Up Button (With orange primary styling) */}
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('signup');
                    setIsLoginModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#C94A00] bg-gradient-to-r from-[#D94F00] to-[#C24100] hover:from-[#C24100] hover:to-[#A83800] shadow-md shadow-[#D94F00]/25 transition cursor-pointer"
                  title="Create an account as Business or Person"
                >
                  <UserPlus className="w-4 h-4 stroke-[2.5]" />
                  <span>Sign Up</span>
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.header>

    {/* Business Auth Modal (Login & OTP-based Signup) */}
    <BusinessLoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setIsLoginModalOpen(false)}
      initialMode={authModalMode}
    />
  </>
);
}
