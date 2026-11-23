/**
 * BharatBN Real-Time Metrics & Follower Engine
 * Tracks authentic BharatBN follows, views, and engagements in real-time.
 */

export interface RealMetrics {
  followersCount: number;
  followers: string[];
  followingCount: number;
  following: string[];
  viewsCount: number;
  likesCount: number;
}

export function getStoredFollowerMap(): Record<string, string[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('bharatbn_real_followers');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getStoredFollowingList(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('bharatbn_people_follows');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getStoredViewsMap(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('bharatbn_real_views');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getStoredLikesMap(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('bharatbn_real_likes');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function parseFollowerCount(val: any): number {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return val;
  const s = String(val).trim().toUpperCase();
  if (s.endsWith('M')) {
    const n = parseFloat(s.replace('M', ''));
    return isNaN(n) ? 0 : Math.round(n * 1000000);
  }
  if (s.endsWith('K')) {
    const n = parseFloat(s.replace('K', ''));
    return isNaN(n) ? 0 : Math.round(n * 1000);
  }
  const parsed = parseInt(s.replace(/[^0-9]/g, ''), 10);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatFollowerCount(num: number): string {
  if (isNaN(num) || num <= 0) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return `${num}`;
}

export function getBaseFollowers(slug: string): number {
  if (typeof window === 'undefined') return 0;
  const normSlug = (slug || '').toLowerCase().trim();
  if (!normSlug) return 0;

  if (normSlug === 'kashish') return 1;
  if (normSlug === 'ai') return 0; // AI relies 100% on real authentic BharatBN followers

  // 1. Check viewed person in sessionStorage (bridge from card)
  try {
    const viewedRaw = sessionStorage.getItem('bharatbn_viewed_person');
    if (viewedRaw) {
      const v = JSON.parse(viewedRaw);
      const vSlug = (v.slug || v.handle || '').toLowerCase().replace(/^@/, '').trim();
      if (vSlug === normSlug && v.followersCount) {
        return parseFollowerCount(v.followersCount);
      }
    }
  } catch {}

  // 2. Check active owner session in localStorage
  try {
    const sessRaw = localStorage.getItem('bharatbn_owner_session');
    if (sessRaw) {
      const s = JSON.parse(sessRaw);
      const sSlug = (s.slug || s.handle || '').toLowerCase().replace(/^@/, '').trim();
      if (sSlug === normSlug && s.followersCount) {
        return parseFollowerCount(s.followersCount);
      }
    }
  } catch {}

  // 3. Check bharatbn_people_store in localStorage
  try {
    const storeRaw = localStorage.getItem('bharatbn_people_store');
    if (storeRaw) {
      const arr = JSON.parse(storeRaw);
      if (Array.isArray(arr)) {
        const found = arr.find((p: any) => {
          const ps = (p.slug || p.handle || '').toLowerCase().replace(/^@/, '').trim();
          return ps === normSlug;
        });
        if (found && found.followersCount) {
          return parseFollowerCount(found.followersCount);
        }
      }
    }
  } catch {}

  // 4. Default seed fallbacks
  const seedDefaults: Record<string, number> = {
    'anand-sahu': 28400,
    'kashish': 1,
    'dr-rajesh-sharma': 18900,
    'priya-menon': 12500,
    'ai': 0,
    'vikram-malhotra': 34100,
    'sunita-deshmukh': 19400,
    'arjun-mehta': 32100,
    'kavita-krishnan': 14600,
    'adv-rohit-sharma': 21800,
  };

  return seedDefaults[normSlug] || 0;
}

export function getCurrentUserHandle(): string {
  if (typeof window === 'undefined') return '@visitor';
  try {
    const sessionStr = localStorage.getItem('bharatbn_owner_session');
    if (sessionStr) {
      const sess = JSON.parse(sessionStr);
      if (sess.handle) return sess.handle.startsWith('@') ? sess.handle : `@${sess.handle}`;
      if (sess.slug) return `@${sess.slug}`;
      if (sess.name) return `@${sess.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}`;
    }
  } catch {}
  return '@visitor';
}

export function getRealMetrics(slug: string): RealMetrics {
  const normSlug = (slug || '').toLowerCase().trim();
  const followerMap = getStoredFollowerMap();
  let followers = followerMap[normSlug] || [];
  const myFollowing = getStoredFollowingList();
  const viewsMap = getStoredViewsMap();
  const likesMap = getStoredLikesMap();
  const currentUser = getCurrentUserHandle();

  // If current user is actively following this person, ensure follower list includes them
  if (myFollowing.includes(normSlug) && !followers.some((f) => f.toLowerCase() === currentUser.toLowerCase())) {
    followers = [...followers, currentUser];
    followerMap[normSlug] = followers;
    try {
      localStorage.setItem('bharatbn_real_followers', JSON.stringify(followerMap));
    } catch {}
  }

  const base = getBaseFollowers(normSlug);
  const realCount = base > 0 ? base : followers.length;

  return {
    followersCount: realCount,
    followers,
    followingCount: myFollowing.length,
    following: myFollowing,
    viewsCount: viewsMap[normSlug] || 0,
    likesCount: likesMap[normSlug] || 0,
  };
}

export async function toggleRealFollow(targetSlug: string, isCurrentlyFollowing: boolean): Promise<RealMetrics> {
  const normSlug = (targetSlug || '').toLowerCase().trim();
  const currentUser = getCurrentUserHandle();

  // 1. Update Profile Followers
  const followerMap = getStoredFollowerMap();
  let followers = followerMap[normSlug] || [];

  if (isCurrentlyFollowing) {
    // Unfollow
    followers = followers.filter((f) => f.toLowerCase() !== currentUser.toLowerCase());
  } else {
    // Follow
    if (!followers.some((f) => f.toLowerCase() === currentUser.toLowerCase())) {
      followers.push(currentUser);
    }
  }
  followerMap[normSlug] = followers;
  localStorage.setItem('bharatbn_real_followers', JSON.stringify(followerMap));

  // 2. Update Current User's Following list
  let myFollowing = getStoredFollowingList();
  if (isCurrentlyFollowing) {
    myFollowing = myFollowing.filter((s) => s.toLowerCase() !== normSlug);
  } else {
    if (!myFollowing.some((s) => s.toLowerCase() === normSlug)) {
      myFollowing.push(normSlug);
    }
  }
  localStorage.setItem('bharatbn_people_follows', JSON.stringify(myFollowing));

  // 3. Update in bharatbn_people_store so profile object holds real count
  try {
    const stored = localStorage.getItem('bharatbn_people_store');
    if (stored) {
      const people = JSON.parse(stored);
      if (Array.isArray(people)) {
        const idx = people.findIndex((p: any) => p.slug?.toLowerCase() === normSlug);
        if (idx !== -1) {
          const currentBase = parseFollowerCount(people[idx].followersCount);
          const nextCount = Math.max(0, currentBase + (isCurrentlyFollowing ? -1 : 1));
          people[idx].followersCount = formatFollowerCount(nextCount);
          localStorage.setItem('bharatbn_people_store', JSON.stringify(people));
        }
      }
    }
  } catch {}

  // 4. Broadcast to other tabs & windows
  window.dispatchEvent(new Event('bharatbn_follow_changed'));
  window.dispatchEvent(new Event('bharatbn_metrics_updated'));

  // 5. Sync to server APIs (ports 3000 and 3001)
  const syncPayload = {
    action: isCurrentlyFollowing ? 'unfollow' : 'follow',
    targetSlug: normSlug,
    followerId: currentUser,
    followersCount: followers.length,
  };

  fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(syncPayload),
  }).catch(() => null);

  fetch('http://localhost:3001/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(syncPayload),
  }).catch(() => null);

  return getRealMetrics(normSlug);
}

export function recordRealView(slug: string): number {
  if (typeof window === 'undefined') return 0;
  const normSlug = (slug || '').toLowerCase().trim();
  if (!normSlug) return 0;
  const sessionKey = `bbn_viewed_${normSlug}`;
  try {
    const viewsMap = getStoredViewsMap();
    if (sessionStorage.getItem(sessionKey)) {
      return viewsMap[normSlug] || 1;
    }
    sessionStorage.setItem(sessionKey, '1');
    const count = (viewsMap[normSlug] || 0) + 1;
    viewsMap[normSlug] = count;
    localStorage.setItem('bharatbn_real_views', JSON.stringify(viewsMap));
    window.dispatchEvent(new Event('bharatbn_metrics_updated'));

    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'view', targetSlug: normSlug, viewsCount: count }),
    }).catch(() => null);

    return count;
  } catch {
    return 1;
  }
}

export async function syncRealMetricsFromServer(slug: string): Promise<RealMetrics | null> {
  if (typeof window === 'undefined') return null;
  try {
    const res = await fetch('/api/sync');
    if (!res.ok) return null;
    const data = await res.json();
    const normSlug = (slug || '').toLowerCase().trim();

    let hasChanges = false;
    if (data.followers && data.followers[normSlug]) {
      const followerMap = getStoredFollowerMap();
      followerMap[normSlug] = data.followers[normSlug];
      localStorage.setItem('bharatbn_real_followers', JSON.stringify(followerMap));
      hasChanges = true;
    }

    if (data.views && data.views[normSlug] !== undefined) {
      const viewsMap = getStoredViewsMap();
      viewsMap[normSlug] = Math.max(viewsMap[normSlug] || 0, Number(data.views[normSlug]));
      localStorage.setItem('bharatbn_real_views', JSON.stringify(viewsMap));
      hasChanges = true;
    }

    if (hasChanges) {
      window.dispatchEvent(new Event('bharatbn_metrics_updated'));
    }
    return getRealMetrics(normSlug);
  } catch {
    return null;
  }
}
