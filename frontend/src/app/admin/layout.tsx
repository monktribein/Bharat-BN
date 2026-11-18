'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  ExternalLink,
  Bell,
  Search,
  Users,
  ShieldAlert,
  Server,
  Activity,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  Database,
  Cpu,
  LogOut,
  Command,
  CheckCheck,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';

interface NavSection {
  title: string;
  items: {
    name: string;
    href: string;
    icon: any;
    badge?: string;
    badgeVariant?: 'amber' | 'slate' | 'emerald' | 'blue';
  }[];
}

interface AdminNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'claim' | 'seo' | 'alert' | 'system';
  isRead: boolean;
  link: string;
  badge?: string;
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        name: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
      },
      {
        name: 'Pending Approvals',
        href: '/admin/claims',
        icon: ShieldAlert,
        badge: '3',
        badgeVariant: 'amber',
      },
    ],
  },
  {
    title: 'Directory Management',
    items: [
      {
        name: 'All Businesses',
        href: '/admin/listings',
        icon: Building2,
        badge: '184k',
        badgeVariant: 'slate',
      },
      {
        name: 'Franchises & Chains',
        href: '/admin/franchises',
        icon: Users,
        badge: '38 Brands',
        badgeVariant: 'blue',
      },
    ],
  },
  {
    title: 'Growth & Billing',
    items: [
      {
        name: 'Rankings & Milestones',
        href: '/admin/seo-milestones',
        icon: TrendingUp,
        badge: '2 Due',
        badgeVariant: 'emerald',
      },
    ],
  },
];

const initialNotifications: AdminNotification[] = [
  {
    id: 'notif-apple',
    title: 'New Ownership Claim: Apple',
    description: 'Kashish Saxena (CEO) submitted GST registration proof for Apple (Noida).',
    time: '5m ago',
    type: 'claim',
    isRead: false,
    link: '/admin/claims',
    badge: 'Review',
  },
  {
    id: 'notif-1',
    title: 'New Ownership Claim',
    description: 'Choco Delights & Confectionery uploaded commercial verification document.',
    time: '18m ago',
    type: 'claim',
    isRead: false,
    link: '/admin/claims',
    badge: 'Review',
  },
  {
    id: 'notif-2',
    title: 'Verification Request',
    description: 'Apex Super Speciality Dental Clinic submitted GST registration proof.',
    time: '45m ago',
    type: 'claim',
    isRead: false,
    link: '/admin/claims',
    badge: 'Pending',
  },
  {
    id: 'notif-3',
    title: 'Rank Milestone Achieved',
    description: 'Little Elly International Preschool reached Rank #1 on Google in Indiranagar.',
    time: '2h ago',
    type: 'seo',
    isRead: false,
    link: '/admin/seo-milestones',
    badge: 'Payout Due',
  },
  {
    id: 'notif-4',
    title: 'Directory Verification Completed',
    description: 'Scheduled NAP consistency audit completed for 184,520 business records.',
    time: '5h ago',
    type: 'system',
    isRead: true,
    link: '/admin',
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Notification State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<AdminNotification[]>(initialNotifications);
  const [headerSearch, setHeaderSearch] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);

  // Dynamic directory counts
  const [totalBusinessesCount, setTotalBusinessesCount] = useState<number>(8);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState<number>(5);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync notifications & real counts with localStorage store
  useEffect(() => {
    const syncWithClaims = () => {
      try {
        const stored = localStorage.getItem('bharatbn_claims_store');
        if (stored) {
          const claims = JSON.parse(stored);
          if (Array.isArray(claims)) {
            const pendingClaims = claims.filter((c: any) => c.status === 'pending');
            const approvedClaims = claims.filter((c: any) => c.status === 'approved');
            setPendingApprovalsCount(pendingClaims.length);
            setTotalBusinessesCount(6 + claims.length);

            setNotifications((prev) => {
              let updated = [...prev];

              // Update any approved claims to show Approved badge
              if (approvedClaims.length > 0) {
                updated = updated.map((n) => {
                  const isApproved = approvedClaims.some(
                    (c: any) => n.id === `claim-${c.id}` || (c.businessName && n.title.includes(c.businessName))
                  );
                  if (isApproved) {
                    return {
                      ...n,
                      title: n.title.replace('Pending', 'Approved').replace('New Ownership Claim:', 'Claim Approved:'),
                      badge: 'Approved',
                      isRead: true,
                    };
                  }
                  return n;
                });
              }

              if (pendingClaims.length > 0) {
                pendingClaims.forEach((c: any) => {
                  if (!updated.some((n) => n.id === `claim-${c.id}`)) {
                    updated.unshift({
                      id: `claim-${c.id}`,
                      title: `Claim Pending: ${c.businessName || 'Business'}`,
                      description: `Submitted by ${c.claimantName || 'Claimant'}. Requires ROC/GSTIN audit.`,
                      time: 'Just now',
                      type: 'claim',
                      isRead: false,
                      link: '/admin/claims',
                      badge: 'New Claim',
                    });
                  }
                });
              }
              return updated;
            });
          }
        }
      } catch (err) {
        console.error('Failed to sync admin notifications:', err);
      }
    };

    syncWithClaims();
    window.addEventListener('bharatbn_claims_updated', syncWithClaims);
    return () => window.removeEventListener('bharatbn_claims_updated', syncWithClaims);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notif: AdminNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    setIsNotifOpen(false);
    router.push(notif.link);
  };

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      router.push(`/admin/claims?q=${encodeURIComponent(headerSearch.trim())}`);
    }
  };

  const filteredNotifications =
    notifFilter === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 flex flex-col md:flex-row antialiased font-sans">
      {/* Sidebar Navigation - Enterprise Dark Midnight Console */}
      <aside className="w-full md:w-64 bg-[#071526] text-slate-300 flex-shrink-0 flex flex-col justify-between border-r border-[#0E243F] select-none">
        <div>
          {/* Organization Switcher Bar */}
          <div className="p-4 border-b border-[#0E243F] bg-[#05111E]">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 group">
                <Image
                  src="/logo-dark.png"
                  alt="BharatBN"
                  width={140}
                  height={38}
                  priority
                  className="h-7 w-auto object-contain opacity-95 group-hover:opacity-100 transition"
                />
              </Link>
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded">
                PROD
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between bg-[#0A1E35] px-2.5 py-1.5 rounded-md border border-[#133054] text-xs">
              <div className="flex items-center gap-2 truncate">
                <div className="w-2 h-2 rounded-full bg-[#F95700] flex-shrink-0 animate-pulse" />
                <span className="font-semibold text-slate-100 truncate text-[11px]">Admin Control Center</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">v1.4</span>
            </div>
          </div>

          {/* Navigation Links Grouped by Section */}
          <nav className="p-3 space-y-4">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="px-2.5 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  {section.title}
                </div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition ${
                        isActive
                          ? 'bg-[#0E2A4A] text-white font-semibold border-l-[3px] border-[#F95700] shadow-inner'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-[#0A1E35]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 transition ${
                            isActive
                              ? 'text-brand-400'
                              : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                            item.badgeVariant === 'amber'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : item.badgeVariant === 'emerald'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : item.badgeVariant === 'blue'
                              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                          }`}
                        >
                          {item.name === 'Pending Approvals'
                            ? String(pendingApprovalsCount)
                            : item.name === 'All Businesses'
                            ? String(totalBusinessesCount)
                            : item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Status Box & Public Directory Link */}
        <div className="p-3 border-t border-[#0E243F] bg-[#05111E] space-y-2">
          <div className="bg-[#0A1C30] rounded-md p-2.5 border border-[#112C4E] space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Directory Status
              </span>
              <span className="text-emerald-400 font-medium text-[10px]">
                Active &amp; Online
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-[#133256] pt-1.5">
              <span>Pending Reviews: <strong className="text-amber-400 font-mono">{pendingApprovalsCount}</strong></span>
              <span>Total: <strong className="text-slate-200 font-mono">{totalBusinessesCount}</strong></span>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-between px-2.5 py-2 rounded-md text-xs text-slate-300 hover:text-white hover:bg-[#0A1E35] transition"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              View Public Website
            </span>
            <span className="text-[11px] text-slate-400 font-mono">↗</span>
          </Link>
        </div>
      </aside>

      {/* Main Administrative Workplace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Toolbar Header - Spacious h-16 with Perfect Vertical Centering */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 h-16 min-h-[64px] flex items-center justify-between px-6 lg:px-8 shadow-xs">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-slate-400">Admin</span>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-bold text-slate-900 tracking-tight">
              {navSections
                .flatMap((s) => s.items)
                .find((i) => i.href === pathname)?.name || 'Control Panel'}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Network
            </span>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            {/* Quick Command Search Bar */}
            <form onSubmit={handleHeaderSearch} className="relative hidden md:flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Search businesses, owners, or claims... (Press /)"
                className="text-xs pl-8 pr-12 py-2 rounded-lg border border-slate-200 bg-slate-50/80 focus:bg-white focus:outline-none focus:border-brand-500 w-72 text-slate-800 placeholder:text-slate-400 transition"
              />
              <span className="absolute right-2 text-[10px] font-mono bg-white border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Command className="w-2.5 h-2.5" />K
              </span>
            </form>

            {/* Interactive Notifications Popover */}
            <div ref={notifRef} className="relative">
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative p-2 rounded-lg transition cursor-pointer ${
                  isNotifOpen
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
                title={unreadCount > 0 ? `${unreadCount} actionable notifications` : 'No new notifications'}
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F95700] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F95700] ring-2 ring-white"></span>
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-left"
                  >
                    {/* Header */}
                    <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Notifications</span>
                        {unreadCount > 0 ? (
                          <span className="text-[10px] font-mono font-bold bg-[#F95700]/10 text-[#F95700] border border-[#F95700]/25 px-1.5 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-400">All caught up</span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllAsRead}
                          className="text-[11px] font-semibold text-[#F95700] hover:text-[#E24A00] flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="px-3 pt-2 pb-1 border-b border-slate-100 flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setNotifFilter('all')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                          notifFilter === 'all'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        All ({notifications.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotifFilter('unread')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                          notifFilter === 'unread'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Unread ({unreadCount})
                      </button>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {filteredNotifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400">
                          No notifications found
                        </div>
                      ) : (
                        filteredNotifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-3.5 hover:bg-slate-50 cursor-pointer transition flex items-start gap-3 ${
                              !notif.isRead ? 'bg-orange-50/20' : ''
                            }`}
                          >
                            {/* Icon */}
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                notif.type === 'claim'
                                  ? 'bg-amber-100 text-amber-700'
                                  : notif.type === 'seo'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {notif.type === 'claim' ? (
                                <ShieldAlert className="w-3.5 h-3.5" />
                              ) : notif.type === 'seo' ? (
                                <TrendingUp className="w-3.5 h-3.5" />
                              ) : (
                                <Server className="w-3.5 h-3.5" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 space-y-0.5">
                              <div className="flex items-center justify-between gap-1">
                                <div className="text-xs font-bold text-slate-900 truncate">
                                  {notif.title}
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                                  {notif.time}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                                {notif.description}
                              </p>
                              {notif.badge && (
                                <span
                                  className={`inline-block mt-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                    notif.badge === 'Action Required' || notif.badge === 'New Claim'
                                      ? 'bg-amber-100 text-amber-800'
                                      : notif.badge === 'Revenue'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {notif.badge}
                                </span>
                              )}
                            </div>

                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-[#F95700] flex-shrink-0 mt-2" />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                      <Link
                        href="/admin/claims"
                        onClick={() => setIsNotifOpen(false)}
                        className="text-xs font-bold text-[#F95700] hover:text-[#E24A00] hover:underline"
                      >
                        Open Claim Moderation Queue →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-5 w-[1px] bg-slate-200" />

            {/* Operator Profile */}
            <div className="flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-lg bg-[#07213A] text-white font-mono font-bold text-xs flex items-center justify-center border border-navy-700 shadow-xs">
                OP
              </div>
              <div className="hidden lg:block text-left text-xs leading-none">
                <div className="font-bold text-slate-900">Operator HQ</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">superadmin@bharatbn</div>
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Body with Generous Padding */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
