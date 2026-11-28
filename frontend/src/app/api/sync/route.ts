import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Global cache for lambda environment
const g = globalThis as any;
if (!g.__BHARATBN_SYNC_STORE__) {
  g.__BHARATBN_SYNC_STORE__ = null;
}

const DEFAULT_OVERRIDE_STORE = {
  kashish: {
    baseCount: 1000,
    setAtNatural: 0,
    updatedAt: '2026-11-25T12:00:00.000Z',
  },
};

function getStorePaths(): string[] {
  const paths: string[] = [];
  try {
    paths.push(path.join(os.tmpdir(), 'bharatbn_sync_cache.json'));
  } catch {}
  try {
    paths.push(path.resolve(process.cwd(), '.sync_cache.json'));
  } catch {}
  try {
    paths.push(path.resolve(process.cwd(), '..', '.sync_cache.json'));
  } catch {}
  return paths;
}

function readStore() {
  try {
    for (const p of getStorePaths()) {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.followers) parsed.followers = {};
        if (!parsed.views) parsed.views = {};
        if (!parsed.messages) parsed.messages = {};
        if (!parsed.adminFollowerOverrides) parsed.adminFollowerOverrides = { ...DEFAULT_OVERRIDE_STORE };
        g.__BHARATBN_SYNC_STORE__ = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read sync cache', e);
  }
  if (g.__BHARATBN_SYNC_STORE__) {
    return g.__BHARATBN_SYNC_STORE__;
  }
  const fallback = {
    people: {},
    businesses: {},
    followers: {},
    views: {},
    messages: {},
    adminFollowerOverrides: { ...DEFAULT_OVERRIDE_STORE },
    updatedAt: new Date().toISOString(),
  };
  g.__BHARATBN_SYNC_STORE__ = fallback;
  return fallback;
}

function writeStore(data: any) {
  g.__BHARATBN_SYNC_STORE__ = data;
  try {
    const jsonStr = JSON.stringify(data, null, 2);
    for (const p of getStorePaths()) {
      try {
        fs.writeFileSync(p, jsonStr, 'utf-8');
      } catch {}
    }
  } catch (e) {
    console.error('Failed to write sync cache', e);
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  const store = readStore();
  return NextResponse.json(store, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const store = readStore();
    if (!store.people) store.people = {};
    if (!store.businesses) store.businesses = {};
    if (!store.followers) store.followers = {};
    if (!store.views) store.views = {};
    if (!store.messages) store.messages = {};

    // 1. Follow / Unfollow Actions
    if (body.action === 'follow' || body.action === 'unfollow') {
      const target = (body.targetSlug || '').toLowerCase().trim();
      const follower = body.followerId || '';
      if (target && follower && follower !== '@visitor' && follower !== '@user') {
        let list: string[] = Array.isArray(store.followers[target]) ? store.followers[target] : [];
        list = list.filter((f: string) => f && f !== '@visitor' && f !== '@user');
        if (body.action === 'follow') {
          if (!list.some((f: string) => f.toLowerCase() === follower.toLowerCase())) {
            list.push(follower);
          }
        } else {
          list = list.filter((f: string) => f.toLowerCase() !== follower.toLowerCase());
        }
        store.followers[target] = list;
        if (store.people[target]) {
          store.people[target].followersCount = list.length;
        }
      }
    }
    // 2. Profile View Actions
    else if (body.action === 'view') {
      const target = (body.targetSlug || '').toLowerCase().trim();
      if (target) {
        const current = Number(store.views[target]) || 0;
        store.views[target] = body.viewsCount !== undefined ? Number(body.viewsCount) : current + 1;
        if (store.people[target]) {
          store.people[target].viewsCount = store.views[target];
        }
      }
    }
    // 3. Super Admin Set Followers Action
    else if (body.action === 'admin_set_followers') {
      const target = (body.targetSlug || '').toLowerCase().trim();
      const count =
        body.followersCount !== undefined && body.followersCount !== null
          ? Number(body.followersCount)
          : null;
      if (!store.adminFollowerOverrides) store.adminFollowerOverrides = {};
      if (count === null || isNaN(count)) {
        delete store.adminFollowerOverrides[target];
      } else {
        const followerMap = store.followers || {};
        const naturalCount = Array.isArray(followerMap[target]) ? followerMap[target].length : 0;
        store.adminFollowerOverrides[target] = {
          baseCount: Math.max(0, Math.round(count)),
          setAtNatural: naturalCount,
          updatedAt: new Date().toISOString(),
        };
      }
      if (store.people && store.people[target]) {
        store.people[target].followersCount = count !== null ? String(count) : '0';
      }
    }
    // 3. Direct Message Actions (Send, Read, Delete)
    else if (body.action === 'send_message' && body.message) {
      const target = (body.targetSlug || body.message.recipientSlug || '').toLowerCase().trim();
      if (target) {
        if (!Array.isArray(store.messages[target])) store.messages[target] = [];
        const exists = store.messages[target].some((m: any) => m.id === body.message.id);
        if (!exists) {
          store.messages[target].unshift(body.message);
        }
      }
    }
    else if (body.action === 'mark_message_read' && body.messageId) {
      const target = (body.targetSlug || body.recipientSlug || '').toLowerCase().trim();
      if (target && Array.isArray(store.messages[target])) {
        store.messages[target] = store.messages[target].map((m: any) =>
          m.id === body.messageId ? { ...m, isRead: true } : m
        );
      }
    }
    else if (body.action === 'delete_message' && body.messageId) {
      const target = (body.targetSlug || body.recipientSlug || '').toLowerCase().trim();
      if (target && Array.isArray(store.messages[target])) {
        store.messages[target] = store.messages[target].filter((m: any) => m.id !== body.messageId);
      }
    }
    // 3. Person Profile Updates
    else if (body.type === 'person') {
      const key = (body.slug || body.id || body.handle?.replace(/^@/, '') || '').toLowerCase();
      if (key) {
        store.people[key] = {
          ...store.people[key],
          ...body,
          updatedAt: new Date().toISOString(),
        };
      }
    }
    // 4. Business Claim / Entity Updates
    else if (body.type === 'business') {
      const key = (body.businessSlug || body.slug || body.id || body.businessName || '').toLowerCase();
      if (key) {
        store.businesses[key] = {
          ...store.businesses[key],
          ...body,
          updatedAt: new Date().toISOString(),
        };
      }
    }
    // 5. Home Banner Update
    else if (body.action === 'update_home_banner' && body.homeBanner) {
      store.homeBanner = {
        ...(store.homeBanner || {}),
        ...body.homeBanner,
        updatedAt: new Date().toISOString(),
      };
    }
    // 6. Bulk Updates
    else if (body.people || body.claims) {
      if (Array.isArray(body.people)) {
        body.people.forEach((p: any) => {
          const k = (p.slug || p.id || p.handle?.replace(/^@/, '') || '').toLowerCase();
          if (k) store.people[k] = { ...store.people[k], ...p };
        });
      }
      if (Array.isArray(body.claims)) {
        body.claims.forEach((c: any) => {
          const k = (c.businessSlug || c.slug || c.id || c.businessName || '').toLowerCase();
          if (k) store.businesses[k] = { ...store.businesses[k], ...c };
        });
      }
    }

    store.updatedAt = new Date().toISOString();
    writeStore(store);

    return NextResponse.json({ success: true, store }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400, headers: corsHeaders });
  }
}
