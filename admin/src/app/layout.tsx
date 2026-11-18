'use client';

import './globals.css';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldAlert,
  Building2,
  Users,
  TrendingUp,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Command,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  badgeVariant?: 'amber' | 'emerald' | 'blue' | 'slate';
}

interface NavSection {
  title: string;
  items: NavItem[];
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
        href: '/',
        icon: LayoutDashboard,
      },
      {
        name: 'Pending Approvals',
        href: '/claims',
        icon: ShieldAlert,
        badge: '1',
        badgeVariant: 'amber',
      },
    ],
  },
  {
    title: 'Directory Management',
    items: [
      {
        name: 'All Businesses',
        href: '/listings',
        icon: Building2,
        badge: '7',
        badgeVariant: 'slate',
      },
      {
        name: 'Franchises & Chains',
        href: '/franchises',
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
        href: '/seo-milestones',
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
    link: '/claims',
    badge: 'Review',
  },
  {
    id: 'notif-1',
    title: 'New Ownership Claim',
    description: 'Choco Delights & Confectionery uploaded commercial verification document.',
    time: '18m ago',
    type: 'claim',
    isRead: false,
    link: '/claims',
    badge: 'Review',
  },
  {
    id: 'notif-2',
    title: 'Verification Request',
    description: 'Apex Super Speciality Dental Clinic submitted GST registration proof.',
    time: '45m ago',
    type: 'claim',
    isRead: false,
    link: '/claims',
    badge: 'Pending',
  },
  {
    id: 'notif-3',
    title: 'Rank Milestone Achieved',
    description: 'Little Elly International Preschool reached Rank #1 on Google in Indiranagar.',
    time: '2h ago',
    type: 'seo',
    isRead: false,
    link: '/seo-milestones',
    badge: 'Payout Due',
  },
];

export default function RootLayout({
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
                      description: `Submitted by ${c.claimantName || 'Claimant'}. Requires verification.`,
                      time: 'Just now',
                      type: 'claim',
                      isRead: false,
                      link: '/claims',
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
      router.push(`/claims?q=${encodeURIComponent(headerSearch.trim())}`);
    }
  };

  const filteredNotifications =
    notifFilter === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <html lang="en">
      <head>
        <title>BharatBN — Admin Console & Moderation Portal</title>
        <meta name="description" content="BharatBN Dedicated Admin Management Console" />
        <link rel="icon" href="/logo-icon.png" />
      </head>
      <body>
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
                    ADMIN
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between bg-[#0A1E35] px-2.5 py-1.5 rounded-md border border-[#133054] text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-2 h-2 rounded-full bg-[#F95700] flex-shrink-0 animate-pulse" />
                    <span className="font-semibold text-slate-100 truncate text-[11px]">Admin Control Center</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">v2.0</span>
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
                      const isActive =
                        item.href === '/'
                          ? pathname === '/' || pathname === '/admin'
                          : pathname?.startsWith(item.href) || pathname?.startsWith('/admin' + item.href);

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
                                  ? 'text-[#F95700]'
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

              <a
                href={process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'http://localhost:3000'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-2.5 py-2 rounded-md text-xs text-slate-300 hover:text-white hover:bg-[#0A1E35] transition"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Public Website</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </aside>

          {/* Main Content Workspace */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Workspace Header */}
            <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-xs">
              {/* Quick Search in Console */}
              <form onSubmit={handleHeaderSearch} className="relative w-72 sm:w-96">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  placeholder="Search businesses, claims, owners..."
                  className="w-full text-xs pl-8 pr-12 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-slate-50/60 focus:bg-white text-slate-800"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 flex items-center gap-0.5 border border-slate-200 px-1 py-0.2 rounded bg-white">
                  <Command className="w-2.5 h-2.5" /> K
                </span>
              </form>

              {/* Header Right Actions */}
              <div className="flex items-center gap-3">
                {/* Notifications Bell with Popover */}
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={() => setIsNotifOpen((prev) => !prev)}
                    className="relative p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                    aria-label="Open notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F95700] ring-2 ring-white" />
                    )}
                  </button>

                  {/* Notifications Dropdown Panel */}
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden text-left animate-in fade-in-50 zoom-in-95 duration-100">
                      <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="text-[10px] bg-brand-500 text-white font-mono font-bold px-1.5 py-0.2 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <button
                            type="button"
                            onClick={markAllAsRead}
                            className="text-[#F95700] hover:underline font-medium cursor-pointer"
                          >
                            Mark all read
                          </button>
                        </div>
                      </div>

                      {/* Notification List */}
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                        {filteredNotifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 text-xs">
                            No notifications
                          </div>
                        ) : (
                          filteredNotifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => handleNotificationClick(notif)}
                              className={`p-3 transition cursor-pointer hover:bg-slate-50 flex items-start gap-2.5 ${
                                !notif.isRead ? 'bg-orange-50/40' : ''
                              }`}
                            >
                              <div className="mt-0.5 w-2 h-2 rounded-full bg-[#F95700] flex-shrink-0" />
                              <div className="space-y-0.5 flex-1 min-w-0">
                                <div className="font-semibold text-slate-900 text-xs truncate">
                                  {notif.title}
                                </div>
                                <div className="text-[11px] text-slate-600 line-clamp-2">
                                  {notif.description}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {notif.time}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Operator Profile Badge */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-7 h-7 rounded-md bg-[#07213A] text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                    OP
                  </div>
                  <div className="hidden sm:block text-left text-xs leading-tight">
                    <div className="font-semibold text-slate-800">Operator HQ</div>
                    <div className="text-[10px] text-slate-400 font-mono">superadmin</div>
                  </div>
                </div>
              </div>
            </header>

            {/* Page View Container */}
            <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
