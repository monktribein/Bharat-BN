import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getStorePath(): string {
  const rootPath = path.resolve(process.cwd(), '..', '.sync_cache.json');
  if (fs.existsSync(rootPath)) return rootPath;
  const localPath = path.resolve(process.cwd(), '.sync_cache.json');
  if (fs.existsSync(localPath)) return localPath;
  return rootPath;
}

function readStore() {
  try {
    const storePath = getStorePath();
    if (fs.existsSync(storePath)) {
      const raw = fs.readFileSync(storePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.followers) parsed.followers = {};
      if (!parsed.views) parsed.views = {};
      return parsed;
    }
  } catch (e) {
    console.error('Failed to read sync cache', e);
  }
  return {
    people: {},
    businesses: {},
    followers: {},
    views: {},
    updatedAt: new Date().toISOString(),
  };
}

function writeStore(data: any) {
  try {
    const rootPath = path.resolve(process.cwd(), '..', '.sync_cache.json');
    const localPath = path.resolve(process.cwd(), '.sync_cache.json');
    const jsonStr = JSON.stringify(data, null, 2);
    try { fs.writeFileSync(rootPath, jsonStr, 'utf-8'); } catch {}
    try { fs.writeFileSync(localPath, jsonStr, 'utf-8'); } catch {}
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
    // 4. Business Claim Updates
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
    // 5. Bulk Updates
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
