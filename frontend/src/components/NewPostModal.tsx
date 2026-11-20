'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Plus,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Calendar,
  Newspaper,
  Upload,
  Trash2,
} from 'lucide-react';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (newPost: any) => void;
}

export default function NewPostModal({ isOpen, onClose, onPostCreated }: NewPostModalProps) {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Posts' | 'News' | 'Events'>('Posts');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active creator profile info
  const [creator, setCreator] = useState({
    name: 'AI',
    handle: '@ai',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    slug: 'ai',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDesc('');
      setImageUrl('');
      setImagePreview(null);
      setSuccessMessage(null);
      setIsPublishing(false);

      try {
        const stored = localStorage.getItem('bharatbn_owner_session');
        if (stored) {
          const sess = JSON.parse(stored);
          setCreator({
            name: sess.name || 'AI',
            handle: sess.handle?.startsWith('@') ? sess.handle : `@${sess.handle || sess.slug || 'ai'}`,
            avatarUrl: sess.avatarUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
            slug: sess.slug || 'ai',
          });
        }
      } catch {}
    }
  }, [isOpen]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setImagePreview(dataUrl);
        setImageUrl('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsPublishing(true);

    const finalImage = imagePreview || imageUrl.trim() || undefined;

    const newPost = {
      id: `post-${Date.now()}`,
      type,
      title: title.trim(),
      desc: desc.trim(),
      imageUrl: finalImage,
      date: 'Just now',
      likes: 1,
      comments: 0,
      shares: 0,
    };

    // 1. Update owner session in localStorage
    try {
      const sessionStr = localStorage.getItem('bharatbn_owner_session');
      if (sessionStr) {
        const sess = JSON.parse(sessionStr);
        const existingUpdates = Array.isArray(sess.updates) ? sess.updates : [];
        sess.updates = [newPost, ...existingUpdates];
        localStorage.setItem('bharatbn_owner_session', JSON.stringify(sess));
      }
    } catch {}

    // 2. Update bharatbn_people_store in localStorage
    try {
      const storeStr = localStorage.getItem('bharatbn_people_store');
      if (storeStr) {
        const people = JSON.parse(storeStr);
        if (Array.isArray(people)) {
          const curSlug = (creator.slug || 'ai').toLowerCase();
          const idx = people.findIndex((p: any) => (p.slug || '').toLowerCase() === curSlug);
          if (idx !== -1) {
            const existingUpdates = Array.isArray(people[idx].updates) ? people[idx].updates : [];
            people[idx].updates = [newPost, ...existingUpdates];
            localStorage.setItem('bharatbn_people_store', JSON.stringify(people));
          }
        }
      }
    } catch {}

    // 3. Broadcast to server APIs (ports 3000 and 3001)
    const syncPayload = {
      type: 'person',
      slug: creator.slug || 'ai',
      newPost,
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

    // 4. Dispatch events so open tabs/components instantly refresh
    window.dispatchEvent(new CustomEvent('bharatbn_post_created', { detail: newPost }));
    window.dispatchEvent(new Event('bharatbn_auth_changed'));

    onPostCreated?.(newPost);

    setSuccessMessage('✓ Update published successfully to your BharatBN profile!');
    setIsPublishing(false);

    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1200);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto z-10"
        >
          {/* Top Header */}
          <div className="px-6 py-4.5 bg-gradient-to-r from-orange-50 via-amber-50 to-white border-b border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#F95700] text-white flex items-center justify-center shadow-sm">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Create New Post</h3>
                <p className="text-[11px] text-slate-500 font-medium">Publish instantly to your public profile and network feed</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handlePublish} className="p-6 space-y-4">
            {/* Active Creator Identity */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <img
                  src={creator.avatarUrl}
                  alt={creator.name}
                  className="w-9 h-9 rounded-full object-cover border border-white shadow-2xs"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{creator.name}</div>
                  <div className="text-[11px] font-semibold text-slate-500">{creator.handle}</div>
                </div>
              </div>

              {/* Post Type Selector */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                {(['Posts', 'News', 'Events'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      type === t
                        ? 'bg-[#07213A] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Headline / Title Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Headline / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What would you like to announce or share?"
                className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#F95700] transition"
              />
            </div>

            {/* Description / Story Textarea */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Content / Description</label>
              <textarea
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Write your article takeaways, insights, announcement details, or updates..."
                className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#F95700] transition"
              />
            </div>

            {/* Optional Image Attachment (URL or File Upload) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Featured Image (Optional)</span>
                <span className="text-[11px] font-normal text-slate-400">Paste URL or upload image</span>
              </label>

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 group max-h-48">
                  <img src={imagePreview} alt="Post preview" className="w-full h-44 object-cover" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition cursor-pointer"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste image URL (https://images.unsplash.com/...)"
                      className="flex-1 px-3.5 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#F95700] transition"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Success Message Banner */}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPublishing || !title.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#d94a00] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isPublishing ? 'Publishing...' : 'Publish Update'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
