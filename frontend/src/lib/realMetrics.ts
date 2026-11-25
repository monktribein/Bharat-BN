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

export function getStoredFollowingMap(): Record<string, string[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('bharatbn_real_following');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getProfileFollowingList(slug: string): string[] {
  if (typeof window === 'undefined') return [];
  const normSlug = (slug || '').toLowerCase().trim();
  if (!normSlug) return [];

  // 1. If currently logged in user matches this slug, check their active following list
  try {
    const sessRaw = localStorage.getItem('bharatbn_owner_session');
    if (sessRaw) {
      const sess = JSON.parse(sessRaw);
      const sessSlug = (sess.slug || sess.handle?.replace(/^@/, '') || '').toLowerCase().trim();
      if (sessSlug === normSlug) {
        const myFollows = getStoredFollowingList();
        if (Array.isArray(myFollows)) return myFollows.filter((s) => s && s.toLowerCase() !== normSlug);
      }
    }
  } catch {}

  // 2. Check explicit profile following map
  try {
    const followingMap = getStoredFollowingMap();
    if (Array.isArray(followingMap[normSlug])) {
      return followingMap[normSlug].filter((s) => s && s.toLowerCase() !== normSlug);
    }
  } catch {}

  // 3. Check individual key if set
  try {
    const raw = localStorage.getItem(`bharatbn_profile_following_${normSlug}`);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list.filter((s) => s && s.toLowerCase() !== normSlug);
    }
  } catch {}

  // 4. Derive from followerMap: find all target profiles where normSlug is in their followers
  try {
    const followerMap = getStoredFollowerMap();
    const derived: string[] = [];
    for (const [target, followers] of Object.entries(followerMap)) {
      if (Array.isArray(followers)) {
        const hasFollower = followers.some((f) => {
          const clean = (f || '').replace(/^@/, '').toLowerCase().trim();
          return clean === normSlug;
        });
        if (hasFollower && !derived.includes(target) && target !== normSlug) {
          derived.push(target);
        }
      }
    }
    if (derived.length > 0) return derived;
  } catch {}

  return [];
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
  if (num >= 10000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString('en-IN');
}

export interface AdminFollowerOverride {
  baseCount: number;
  setAtNatural: number;
  updatedAt: string;
}

export const DEFAULT_ADMIN_FOLLOWER_OVERRIDES: Record<string, AdminFollowerOverride> = {
  kashish: {
    baseCount: 1000,
    setAtNatural: 0,
    updatedAt: '2026-11-25T12:00:00.000Z',
  },
};

export function getAdminFollowerOverrides(): Record<string, AdminFollowerOverride> {
  const defaults: Record<string, AdminFollowerOverride> = { ...DEFAULT_ADMIN_FOLLOWER_OVERRIDES };
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem('bharatbn_admin_followers_override');
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    const normalized: Record<string, AdminFollowerOverride> = { ...defaults };
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === 'number') {
        normalized[k.toLowerCase().trim()] = {
          baseCount: Math.max(0, v),
          setAtNatural: 0,
          updatedAt: new Date().toISOString(),
        };
      } else if (v && typeof (v as any).baseCount === 'number') {
        normalized[k.toLowerCase().trim()] = {
          baseCount: Math.max(0, (v as any).baseCount),
          setAtNatural: Math.max(0, (v as any).setAtNatural || 0),
          updatedAt: (v as any).updatedAt || new Date().toISOString(),
        };
      }
    }
    return normalized;
  } catch {
    return defaults;
  }
}

export function setAdminFollowerOverride(slug: string, newCount: number | null): void {
  if (typeof window === 'undefined') return;
  const normSlug = (slug || '').toLowerCase().trim();
  if (!normSlug) return;
  try {
    const currentMap = getAdminFollowerOverrides();
    const followerMap = getStoredFollowerMap();
    const naturalCount = (followerMap[normSlug] || []).filter(
      (f) => f && f !== '@visitor' && f !== '@user'
    ).length;

    if (newCount === null || isNaN(newCount)) {
      delete currentMap[normSlug];
      delete DEFAULT_ADMIN_FOLLOWER_OVERRIDES[normSlug];
    } else {
      const overrideObj = {
        baseCount: Math.max(0, Math.round(newCount)),
        setAtNatural: naturalCount,
        updatedAt: new Date().toISOString(),
      };
      currentMap[normSlug] = overrideObj;
      DEFAULT_ADMIN_FOLLOWER_OVERRIDES[normSlug] = overrideObj;
    }
    localStorage.setItem('bharatbn_admin_followers_override', JSON.stringify(currentMap));

    // Sync to bharatbn_owner_session if active user matches this slug
    try {
      const sessStr = localStorage.getItem('bharatbn_owner_session');
      if (sessStr) {
        const sess = JSON.parse(sessStr);
        const sSlug = (sess.slug || sess.handle?.replace(/^@/, '') || '').toLowerCase().trim();
        if (sSlug === normSlug) {
          sess.followersCount = String(newCount !== null ? Math.max(0, Math.round(newCount)) : naturalCount);
          localStorage.setItem('bharatbn_owner_session', JSON.stringify(sess));
          window.dispatchEvent(new Event('bharatbn_auth_changed'));
        }
      }
    } catch {}

    // Sync to bharatbn_people_store so people directory updates instantly
    try {
      const pStore = localStorage.getItem('bharatbn_people_store');
      if (pStore) {
        const parsedPeople = JSON.parse(pStore);
        if (Array.isArray(parsedPeople)) {
          const updated = parsedPeople.map((p: any) => {
            const pSlug = (p.slug || '').toLowerCase().trim();
            if (pSlug === normSlug) {
              const displayCount =
                newCount !== null ? Math.max(0, Math.round(newCount)) : naturalCount;
              return {
                ...p,
                followersCount: String(displayCount),
              };
            }
            return p;
          });
          localStorage.setItem('bharatbn_people_store', JSON.stringify(updated));
        }
      }
    } catch {}

    // Broadcast across app
    window.dispatchEvent(new Event('bharatbn_metrics_updated'));
    window.dispatchEvent(new Event('bharatbn_people_updated'));
    window.dispatchEvent(new Event('bharatbn_follow_changed'));

    // Sync to backend /api/sync
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'admin_set_followers',
        targetSlug: normSlug,
        followersCount: newCount !== null ? Math.max(0, Math.round(newCount)) : null,
      }),
    }).catch(() => null);
  } catch (err) {
    console.error('Failed to set admin follower override:', err);
  }
}

export function getBaseFollowers(slug: string): number {
  const normSlug = (slug || '').toLowerCase().trim();
  const overrides = getAdminFollowerOverrides();
  if (normSlug in overrides) {
    return overrides[normSlug].baseCount;
  }
  return 0; // Pure authentic BharatBN real followers by default
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
  const sessionActive = typeof window !== 'undefined' && Boolean(localStorage.getItem('bharatbn_owner_session'));
  const myFollowing = sessionActive ? getStoredFollowingList() : [];
  const viewsMap = getStoredViewsMap();
  const likesMap = getStoredLikesMap();
  const currentUser = getCurrentUserHandle();

  // Filter out any legacy invalid/visitor handles
  followers = followers.filter((f) => f && f !== '@visitor' && f !== '@user');

  // If current logged-in user is actively following this person, ensure follower list includes them
  if (sessionActive && myFollowing.includes(normSlug) && !followers.some((f) => f.toLowerCase() === currentUser.toLowerCase())) {
    followers = [...followers, currentUser];
    followerMap[normSlug] = followers;
    try {
      localStorage.setItem('bharatbn_real_followers', JSON.stringify(followerMap));
    } catch {}
  } else if ((!sessionActive || !myFollowing.includes(normSlug)) && followers.some((f) => f.toLowerCase() === currentUser.toLowerCase())) {
    followers = followers.filter((f) => f.toLowerCase() !== currentUser.toLowerCase());
    followerMap[normSlug] = followers;
    try {
      localStorage.setItem('bharatbn_real_followers', JSON.stringify(followerMap));
    } catch {}
  }

  const naturalCount = followers.length;
  const overrides = getAdminFollowerOverrides();
  let effectiveFollowersCount = naturalCount;

  // Check if Super Admin set a custom follower count for this profile
  if (normSlug in overrides) {
    const ov = overrides[normSlug];
    const newOrganicSinceSet = Math.max(0, naturalCount - (ov.setAtNatural || 0));
    effectiveFollowersCount = ov.baseCount + newOrganicSinceSet;
  }

  const profileFollowing = getProfileFollowingList(normSlug);

  return {
    followersCount: effectiveFollowersCount,
    followers,
    followingCount: profileFollowing.length,
    following: profileFollowing,
    viewsCount: viewsMap[normSlug] || 0,
    likesCount: likesMap[normSlug] || 0,
  };
}

export async function toggleRealFollow(targetSlug: string, isCurrentlyFollowing: boolean): Promise<RealMetrics> {
  const normSlug = (targetSlug || '').toLowerCase().trim();
  const currentUser = getCurrentUserHandle();

  if (currentUser === '@visitor') {
    throw new Error('Authentication required: Log in to follow on BharatBN');
  }

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

  // Update profile following map for current user
  const userSlug = currentUser.replace(/^@/, '').toLowerCase().trim();
  if (userSlug && userSlug !== 'visitor') {
    try {
      const followingMap = getStoredFollowingMap();
      followingMap[userSlug] = myFollowing;
      localStorage.setItem('bharatbn_real_following', JSON.stringify(followingMap));
      localStorage.setItem(`bharatbn_profile_following_${userSlug}`, JSON.stringify(myFollowing));
    } catch {}
  }

  // 3. Update in bharatbn_people_store so profile object holds real count
  try {
    const stored = localStorage.getItem('bharatbn_people_store');
    if (stored) {
      const people = JSON.parse(stored);
      if (Array.isArray(people)) {
        const idx = people.findIndex((p: any) => p.slug?.toLowerCase() === normSlug);
        if (idx !== -1) {
          people[idx].followersCount = String(followers.length);
          localStorage.setItem('bharatbn_people_store', JSON.stringify(people));
        }
      }
    }
  } catch {}

  try {
    const sessRaw = localStorage.getItem('bharatbn_owner_session');
    if (sessRaw) {
      const sess = JSON.parse(sessRaw);
      if (sess && (sess.slug?.toLowerCase() === normSlug || sess.handle?.toLowerCase().replace(/^@/, '') === normSlug)) {
        sess.followersCount = String(followers.length);
        localStorage.setItem('bharatbn_owner_session', JSON.stringify(sess));
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
      const rawList = Array.isArray(data.followers[normSlug]) ? data.followers[normSlug] : [];
      const cleanList = rawList.filter((f: any) => typeof f === 'string' && f.trim() !== '' && f !== '@visitor' && f !== '@user');
      followerMap[normSlug] = cleanList;
      localStorage.setItem('bharatbn_real_followers', JSON.stringify(followerMap));
      hasChanges = true;
    }

    if (data.views && data.views[normSlug] !== undefined) {
      const viewsMap = getStoredViewsMap();
      viewsMap[normSlug] = Math.max(viewsMap[normSlug] || 0, Number(data.views[normSlug]));
      localStorage.setItem('bharatbn_real_views', JSON.stringify(viewsMap));
      hasChanges = true;
    }

    if (data.adminFollowerOverrides && typeof data.adminFollowerOverrides === 'object') {
      try {
        localStorage.setItem(
          'bharatbn_admin_followers_override',
          JSON.stringify(data.adminFollowerOverrides)
        );
        hasChanges = true;
      } catch {}
    }

    if (hasChanges) {
      window.dispatchEvent(new Event('bharatbn_metrics_updated'));
    }
    return getRealMetrics(normSlug);
  } catch {
    return null;
  }
}
