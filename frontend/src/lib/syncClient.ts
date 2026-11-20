/**
 * BharatBN Cross-App & Central Sync Client
 * Ensures changes made on localhost:3000 (Dashboards) immediately sync to
 * localhost:3001 (Admin Console) and backend in real-time.
 */

export async function broadcastAssetUpdate(payload: {
  type: 'person' | 'business';
  id?: string;
  slug?: string;
  name?: string;
  businessName?: string;
  businessSlug?: string;
  handle?: string;
  avatarUrl?: string;
  logoUrl?: string;
  logoBase64?: string;
  coverUrl?: string;
  role?: string;
  badge?: string;
  location?: string;
  category?: string;
  city?: string;
  email?: string;
  phone?: string;
  quote?: string;
  aboutText?: string;
  status?: string;
  isVerified?: boolean;
  [key: string]: any;
}) {
  const promises: Promise<any>[] = [];

  // 1. Post to Frontend local sync API
  promises.push(
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => null)
  );

  // 2. Post directly to Admin Console port (3001)
  promises.push(
    fetch('http://localhost:3001/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => null)
  );

  // 3. Post to NestJS Core Backend (port 4000)
  if (payload.type === 'business') {
    const slugOrId = payload.businessSlug || payload.id || payload.slug;
    if (slugOrId) {
      promises.push(
        fetch(`http://localhost:4000/api/v1/businesses/${slugOrId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            logoUrl: payload.logoUrl || payload.logoBase64,
            name: payload.businessName,
          }),
        }).catch(() => null)
      );
    }
  }

  await Promise.allSettled(promises);
}
