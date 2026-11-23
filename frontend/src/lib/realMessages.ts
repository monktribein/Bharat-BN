/**
 * BharatBN Real Messaging Engine
 * Handles persistent direct messages between visitors/creators and profile owners.
 * Syncs seamlessly across localStorage and /api/sync.
 */

export interface BharatBNMessage {
  id: string;
  recipientSlug: string;
  recipientName: string;
  senderName: string;
  senderHandle: string;
  senderEmail?: string;
  senderPhone?: string;
  senderAvatar?: string;
  subject: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  isStarred?: boolean;
}

const STORAGE_KEY = 'bharatbn_messages';

function getDefaultSeedMessages(slug: string): BharatBNMessage[] {
  const norm = (slug || '').toLowerCase().trim();
  if (norm === 'kashish' || norm === 'kashish-saxena') {
    return [
      {
        id: 'msg-seed-1',
        recipientSlug: 'kashish',
        recipientName: 'Kashish Saxena',
        senderName: 'Dr. Priya Sharma',
        senderHandle: '@dr_priya',
        senderEmail: 'priya.sharma@aiims.edu.in',
        senderPhone: '+91 98100 23456',
        senderAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        subject: 'Speaking Invitation: Youth Digital Leadership Summit',
        content: 'Dear Kashish, we are organizing the Northern India Healthcare & Digital Leadership Summit in Delhi next month. We would be honored to invite you as our keynote speaker on youth digital innovation and community networking.',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        isRead: false,
        isStarred: true,
      },
      {
        id: 'msg-seed-2',
        recipientSlug: 'kashish',
        recipientName: 'Kashish Saxena',
        senderName: 'Anand Sahu',
        senderHandle: '@anandsahu',
        senderEmail: 'anand.sahu@bjp-india.org',
        senderPhone: '+91 98110 54321',
        senderAvatar: '/people/anand-sahu-avatar.jpg',
        subject: 'Collaboration: Hyperlocal North India Outreach',
        content: 'Namaste Kashish ji, reviewed your recent initiatives on BharatBN. Would love to connect and explore collaborative community building for self-reliant businesses across North India.',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        isRead: true,
        isStarred: false,
      },
    ];
  }

  if (norm === 'anand-sahu' || norm === 'anand') {
    return [
      {
        id: 'msg-seed-anand-1',
        recipientSlug: 'anand-sahu',
        recipientName: 'Anand Sahu',
        senderName: 'Kashish Saxena',
        senderHandle: '@kashish',
        senderEmail: 'kashish.saxena.123056@gmail.com',
        senderAvatar: '/people/kashish-avatar.png',
        subject: 'Inquiry: National Youth Conclave Session',
        content: 'Namaste Anand ji, following your nationalist discourse series on BharatBN. We would love to feature your upcoming speech and updates on our community channels.',
        createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        isRead: false,
        isStarred: true,
      },
    ];
  }

  return [];
}

export function getAllStoredMessagesMap(): Record<string, BharatBNMessage[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function getStoredMessages(recipientSlug: string): BharatBNMessage[] {
  const norm = (recipientSlug || '').toLowerCase().trim();
  const map = getAllStoredMessagesMap();

  if (!map[norm] || map[norm].length === 0) {
    const defaults = getDefaultSeedMessages(norm);
    if (defaults.length > 0) {
      map[norm] = defaults;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
      } catch {}
      return defaults;
    }
    return [];
  }

  return map[norm];
}

export function getSentMessages(senderHandleOrSlug: string, recipientSlug?: string): BharatBNMessage[] {
  const senderNorm = (senderHandleOrSlug || '').toLowerCase().replace(/^@/, '').trim();
  const recNorm = recipientSlug ? recipientSlug.toLowerCase().trim() : null;
  const map = getAllStoredMessagesMap();
  const sent: BharatBNMessage[] = [];

  Object.entries(map).forEach(([slug, messages]) => {
    if (recNorm && slug !== recNorm) return;
    messages.forEach((m) => {
      const sHandle = (m.senderHandle || '').toLowerCase().replace(/^@/, '').trim();
      if (sHandle === senderNorm || (m.senderEmail && m.senderEmail.toLowerCase().includes(senderNorm))) {
        sent.push(m);
      }
    });
  });

  return sent.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function sendDirectMessage(payload: {
  recipientSlug: string;
  recipientName: string;
  senderName: string;
  senderHandle?: string;
  senderEmail?: string;
  senderPhone?: string;
  senderAvatar?: string;
  subject?: string;
  content: string;
}): Promise<BharatBNMessage> {
  const norm = (payload.recipientSlug || '').toLowerCase().trim();
  const newMsg: BharatBNMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    recipientSlug: norm,
    recipientName: payload.recipientName,
    senderName: payload.senderName.trim(),
    senderHandle: payload.senderHandle?.trim() || '@visitor',
    senderEmail: payload.senderEmail?.trim(),
    senderPhone: payload.senderPhone?.trim(),
    senderAvatar: payload.senderAvatar,
    subject: payload.subject?.trim() || 'General Inquiry',
    content: payload.content.trim(),
    createdAt: new Date().toISOString(),
    isRead: false,
    isStarred: false,
  };

  // 1. Save to local storage
  const map = getAllStoredMessagesMap();
  const existing = map[norm] || getDefaultSeedMessages(norm);
  map[norm] = [newMsg, ...existing];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event('bharatbn_messages_updated'));
  } catch {}

  // 2. Sync to server /api/sync
  try {
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send_message',
        targetSlug: norm,
        message: newMsg,
      }),
    }).catch(() => null);
  } catch {}

  return newMsg;
}

export function markMessageRead(id: string, recipientSlug: string): void {
  const norm = (recipientSlug || '').toLowerCase().trim();
  const map = getAllStoredMessagesMap();
  if (!map[norm]) return;

  map[norm] = map[norm].map((m) => (m.id === id ? { ...m, isRead: true } : m));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event('bharatbn_messages_updated'));
  } catch {}

  try {
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'mark_message_read',
        targetSlug: norm,
        messageId: id,
      }),
    }).catch(() => null);
  } catch {}
}

export function deleteDirectMessage(id: string, recipientSlug: string): void {
  const norm = (recipientSlug || '').toLowerCase().trim();
  const map = getAllStoredMessagesMap();
  if (!map[norm]) return;

  map[norm] = map[norm].filter((m) => m.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event('bharatbn_messages_updated'));
  } catch {}

  try {
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_message',
        targetSlug: norm,
        messageId: id,
      }),
    }).catch(() => null);
  } catch {}
}

export function toggleStarMessage(id: string, recipientSlug: string): void {
  const norm = (recipientSlug || '').toLowerCase().trim();
  const map = getAllStoredMessagesMap();
  if (!map[norm]) return;

  map[norm] = map[norm].map((m) => (m.id === id ? { ...m, isStarred: !m.isStarred } : m));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event('bharatbn_messages_updated'));
  } catch {}
}

export function getUnreadMessageCount(recipientSlug: string): number {
  const messages = getStoredMessages(recipientSlug);
  return messages.filter((m) => !m.isRead).length;
}

export async function syncMessagesFromServer(recipientSlug: string): Promise<BharatBNMessage[]> {
  if (typeof window === 'undefined') return [];
  const norm = (recipientSlug || '').toLowerCase().trim();
  try {
    const res = await fetch('/api/sync');
    if (!res.ok) return getStoredMessages(norm);
    const data = await res.json();

    if (data?.messages && Array.isArray(data.messages[norm])) {
      const serverMsgs: BharatBNMessage[] = data.messages[norm];
      const map = getAllStoredMessagesMap();
      const localMsgs = map[norm] || [];

      // Merge server and local without duplicates
      const seen = new Set(localMsgs.map((m) => m.id));
      serverMsgs.forEach((sm) => {
        if (!seen.has(sm.id)) {
          localMsgs.push(sm);
          seen.add(sm.id);
        }
      });

      map[norm] = localMsgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
      window.dispatchEvent(new Event('bharatbn_messages_updated'));
      return map[norm];
    }
  } catch {}

  return getStoredMessages(norm);
}
