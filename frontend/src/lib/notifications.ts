export interface AppNotification {
  id: string;
  type: 'approval' | 'system' | 'update' | 'social' | 'business';
  title: string;
  desc: string;
  time: string;
  timestamp: number;
  link: string;
  isRead: boolean;
  badgeLabel?: string;
  actionText?: string;
}

export const defaultStaticNotifications: Omit<AppNotification, 'isRead'>[] = [
  {
    id: 'notif-feed-anand-01',
    type: 'social',
    title: 'Anand Sahu posted an update',
    desc: 'Guest of Honour at national infrastructure awards and youth discourse event in New Delhi.',
    time: '12m ago',
    timestamp: Date.now() - 12 * 60 * 1000,
    link: '/people/anand-sahu',
    badgeLabel: 'Public Figure',
    actionText: 'View Post',
  },
  {
    id: 'notif-doc-priya-02',
    type: 'update',
    title: 'Dr. Priya Sharma shared clinical insights',
    desc: 'Published clinical findings on preventive cardiology and lifestyle health for youth in India.',
    time: '45m ago',
    timestamp: Date.now() - 45 * 60 * 1000,
    link: '/people/dr-priya-sharma',
    badgeLabel: 'Doctor & Healthcare',
    actionText: 'Read Paper',
  },
  {
    id: 'notif-edu-rakesh-03',
    type: 'social',
    title: 'Prof. Rakesh Verma started a new discussion',
    desc: 'National scientific temper lecture series announced for high school and university students.',
    time: '2h ago',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    link: '/people/prof-rakesh-verma',
    badgeLabel: 'Teacher & Educator',
    actionText: 'Join Discourse',
  },
  {
    id: 'notif-biz-choco-04',
    type: 'business',
    title: 'Choco Delights updated catalog',
    desc: 'Handcrafted Belgian truffles and corporate festive gift hampers added with same-day Mumbai delivery.',
    time: '3h ago',
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    link: '/biz/choco-delights-confectionery-andheri-mumbai',
    badgeLabel: 'Verified Business',
    actionText: 'View Catalog',
  },
  {
    id: 'notif-sys-views-05',
    type: 'system',
    title: 'Weekly Profile Reach Milestone',
    desc: 'Your profile and listed presence were discovered by 240+ verified users on BharatBN this week.',
    time: '1d ago',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    link: '/dashboard',
    badgeLabel: 'Analytics',
    actionText: 'View Stats',
  },
];

export function getNotifications(): AppNotification[] {
  if (typeof window === 'undefined') {
    return defaultStaticNotifications.map((n) => ({ ...n, isRead: false }));
  }

  try {
    let readSet = new Set<string>();
    const readStored = localStorage.getItem('bharatbn_notifications_read');
    if (readStored) {
      try {
        const arr = JSON.parse(readStored);
        if (Array.isArray(arr)) readSet = new Set(arr);
      } catch {}
    }

    const items: AppNotification[] = [];

    // 1. Dynamic Check: Has the logged in person or business been verified/approved?
    const sessionStr = localStorage.getItem('bharatbn_owner_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        const isPerson = session.accountType === 'person' || !!session.personId;
        const isVerified = session.isVerified === true || session.status === 'approved';

        if (isVerified) {
          const profileSlug = session.slug || (isPerson ? 'ai' : 'apple-noida');
          const profileName = session.name || session.businessName || 'Your Account';
          const profileLink = isPerson ? `/people/${profileSlug}` : `/biz/${profileSlug}`;

          const approvalNotifId = `notif-verified-approved-${profileSlug}`;
          items.push({
            id: approvalNotifId,
            type: 'approval',
            title: '🎉 Profile Verified & Approved!',
            desc: `Congratulations! ${profileName} has been officially verified by BharatBN™ Admin. You have received the Official Blue Checkmark badge.`,
            time: 'Just now',
            timestamp: Date.now(),
            link: profileLink,
            isRead: readSet.has(approvalNotifId),
            badgeLabel: 'Official Blue Checkmark',
            actionText: 'View Live Profile',
          });
        }
      } catch (e) {
        console.error('Error parsing session for notifications', e);
      }
    }

    // Also check claims store for approved businesses
    const claimsStr = localStorage.getItem('bharatbn_claims_store');
    if (claimsStr) {
      try {
        const claims = JSON.parse(claimsStr);
        if (Array.isArray(claims)) {
          claims.forEach((c) => {
            if (c.status === 'approved') {
              const bizNotifId = `notif-biz-approved-${c.id}`;
              // Avoid duplicates if already added from session
              if (!items.some((it) => it.id === bizNotifId)) {
                items.push({
                  id: bizNotifId,
                  type: 'approval',
                  title: `🏢 Business Verified: ${c.businessName || 'Business'}`,
                  desc: `Your business listing ${c.businessName || ''} is now verified and active with Engine 7 Pay-As-You-Rank™ visibility.`,
                  time: 'Recently',
                  timestamp: Date.now() - 1000 * 60 * 30,
                  link: `/biz/${c.businessSlug || 'apple-noida'}`,
                  isRead: readSet.has(bizNotifId),
                  badgeLabel: 'Verified Business',
                  actionText: 'View Listing',
                });
              }
            }
          });
        }
      } catch {}
    }

    // Add static notifications
    defaultStaticNotifications.forEach((st) => {
      items.push({
        ...st,
        isRead: readSet.has(st.id),
      });
    });

    return items;
  } catch (err) {
    console.error('Error loading notifications', err);
    return defaultStaticNotifications.map((n) => ({ ...n, isRead: false }));
  }
}

export function markNotificationAsRead(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    let readList: string[] = [];
    const readStored = localStorage.getItem('bharatbn_notifications_read');
    if (readStored) {
      try {
        const parsed = JSON.parse(readStored);
        if (Array.isArray(parsed)) readList = parsed;
      } catch {}
    }

    if (!readList.includes(id)) {
      readList.push(id);
      localStorage.setItem('bharatbn_notifications_read', JSON.stringify(readList));
      window.dispatchEvent(new Event('bharatbn_notifications_updated'));
    }
  } catch (e) {
    console.error(e);
  }
}

export function markAllNotificationsAsRead(notifications: AppNotification[]): void {
  if (typeof window === 'undefined') return;
  try {
    const allIds = notifications.map((n) => n.id);
    localStorage.setItem('bharatbn_notifications_read', JSON.stringify(allIds));
    window.dispatchEvent(new Event('bharatbn_notifications_updated'));
  } catch (e) {
    console.error(e);
  }
}
