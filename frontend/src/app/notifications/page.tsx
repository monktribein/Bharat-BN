'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  ShieldCheck,
  CheckCheck,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Users,
  Building2,
  Filter,
  Check,
  Trash2,
  ChevronRight,
  User,
  Heart,
  TrendingUp,
} from 'lucide-react';
import {
  AppNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/lib/notifications';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'approval' | 'social' | 'business'>('all');
  const [session, setSession] = useState<any>(null);

  const syncData = () => {
    try {
      const notifs = getNotifications();
      setNotifications(notifs);

      const storedSession = localStorage.getItem('bharatbn_owner_session');
      if (storedSession) {
        setSession(JSON.parse(storedSession));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    syncData();
    window.addEventListener('bharatbn_notifications_updated', syncData);
    window.addEventListener('bharatbn_auth_changed', syncData);
    window.addEventListener('storage', syncData);

    return () => {
      window.removeEventListener('bharatbn_notifications_updated', syncData);
      window.removeEventListener('bharatbn_auth_changed', syncData);
      window.removeEventListener('storage', syncData);
    };
  }, []);

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead(notifications);
    syncData();
  };

  const handleMarkOne = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    markNotificationAsRead(id);
    syncData();
  };

  const handleClearRead = () => {
    try {
      // Clear from local storage
      const unreadOnly = notifications.filter((n) => !n.isRead);
      setNotifications(unreadOnly);
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const approvalsCount = notifications.filter((n) => n.type === 'approval').length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'approval') return n.type === 'approval';
    if (activeTab === 'social') return n.type === 'social' || n.type === 'update';
    if (activeTab === 'business') return n.type === 'business' || n.type === 'system';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link href="/" className="hover:text-slate-700 transition">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-800 font-semibold">Notifications</span>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#07213A] to-[#1A3A5A] text-white flex items-center justify-center shadow-md">
                <Bell className="w-6 h-6 text-[#F95700]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Notification Center</span>
                  {unreadCount > 0 && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-600 text-white">
                      {unreadCount} new
                    </span>
                  )}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Stay updated with verified approvals, official badges, follow alerts, and platform insights.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Mark all read</span>
            </button>

            {session && (
              <Link
                href={
                  session.accountType === 'person' || session.personId
                    ? '/dashboard/person'
                    : '/dashboard'
                }
                className="px-4 py-2.5 rounded-xl bg-[#07213A] hover:bg-[#1A3A5A] text-white font-bold text-xs inline-flex items-center gap-1.5 transition shadow-xs"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shadow-xs ${
              activeTab === 'all'
                ? 'bg-[#07213A] text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <span>All Notifications</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {notifications.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('approval')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shadow-xs ${
              activeTab === 'approval'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Approvals &amp; Verified</span>
            {approvalsCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === 'approval' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {approvalsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shadow-xs ${
              activeTab === 'social'
                ? 'bg-[#07213A] text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>People &amp; Updates</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('business')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shadow-xs ${
              activeTab === 'business'
                ? 'bg-[#07213A] text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Business &amp; Network</span>
          </button>
        </div>

        {/* Notifications Feed */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No notifications in this tab</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You are all caught up! When new updates, followers, or verification approvals occur, they will appear here.
              </p>
            </div>
          ) : (
            filteredNotifications.map((n) => {
              const isApproval = n.type === 'approval';

              return (
                <div
                  key={n.id}
                  className={`rounded-2xl transition-all duration-200 border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group ${
                    isApproval
                      ? 'bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-white border-emerald-200 shadow-xs hover:border-emerald-400'
                      : n.isRead
                      ? 'bg-white border-slate-200/80 hover:border-slate-300'
                      : 'bg-blue-50/30 border-blue-200/80 hover:border-blue-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3.5 w-full sm:w-auto">
                    {/* Left Icon */}
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs ${
                        isApproval
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : n.type === 'social'
                          ? 'bg-blue-100 text-blue-700'
                          : n.type === 'business'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isApproval ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : n.type === 'social' ? (
                        <User className="w-5 h-5" />
                      ) : n.type === 'business' ? (
                        <Building2 className="w-5 h-5" />
                      ) : (
                        <Sparkles className="w-5 h-5" />
                      )}
                    </div>

                    {/* Notification Details */}
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {n.badgeLabel && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isApproval
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {n.badgeLabel}
                          </span>
                        )}
                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{n.time}</span>
                        </span>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" title="Unread" />
                        )}
                      </div>

                      <h3
                        className={`text-sm sm:text-base font-bold leading-snug ${
                          isApproval ? 'text-emerald-950 font-black' : 'text-slate-900'
                        }`}
                      >
                        {n.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                        {n.desc}
                      </p>
                    </div>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <Link
                      href={n.link}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition whitespace-nowrap shadow-xs ${
                        isApproval
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-[#F95700] hover:border-[#F95700] hover:text-white'
                      }`}
                    >
                      <span>{n.actionText || 'View Details'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>

                    {!n.isRead && (
                      <button
                        type="button"
                        onClick={(e) => handleMarkOne(n.id, e)}
                        className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 text-emerald-600" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
