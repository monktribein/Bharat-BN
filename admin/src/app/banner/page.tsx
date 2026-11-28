'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface HomeBannerConfig {
  enabled: boolean;
  heroTheme: 'dark' | 'light';
  imageUrl: string;
  updatedAt?: string;
}

const DEFAULT_BANNER: HomeBannerConfig = {
  enabled: true,
  heroTheme: 'dark',
  imageUrl: '/hero-bg.jpg',
};

export default function AdminBannerPage() {
  const [banner, setBanner] = useState<HomeBannerConfig>(DEFAULT_BANNER);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadBanner = async () => {
      try {
        const res = await fetch('/api/sync', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data?.homeBanner) {
            setBanner({
              enabled: data.homeBanner.enabled ?? true,
              heroTheme: data.homeBanner.heroTheme === 'light' ? 'light' : 'dark',
              imageUrl: data.homeBanner.imageUrl || '',
              updatedAt: data.homeBanner.updatedAt,
            });
          }
        }
      } catch (err) {
        console.error('Failed to load banner config:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadBanner();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage('');
    if (file.size > 3 * 1024 * 1024) {
      setErrorMessage('Image size must be under 3 MB for fast homepage loading.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBanner((prev) => ({ ...prev, imageUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (configToSave: HomeBannerConfig = banner) => {
    setIsSaving(true);
    setSaveMessage('');
    setErrorMessage('');

    const payload = {
      action: 'update_home_banner',
      homeBanner: {
        ...configToSave,
        updatedAt: new Date().toISOString(),
      },
    };

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save hero background banner.');
      }

      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
      try {
        await fetch(`${frontendUrl}/api/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        // Shared .sync_cache.json already updated
      }

      setSaveMessage('Hero background banner published! Refresh the BharatBN homepage to view.');
      setTimeout(() => setSaveMessage(''), 5000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error saving banner.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setBanner(DEFAULT_BANNER);
    await handleSave(DEFAULT_BANNER);
  };

  const isDark = banner.heroTheme !== 'light';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c2410c]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Homepage Hero Background</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Hero Background Banner Manager
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload a background banner image to display behind the Hero headline &amp; search bar on the BharatBN homepage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
          >
            <span>View Homepage</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving || isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c2410c] hover:bg-[#9b2f00] disabled:opacity-60 text-white text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Editor + Live Hero Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Controls */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Background Settings</h2>
            <button
              type="button"
              onClick={() => setBanner((prev) => ({ ...prev, enabled: !prev.enabled }))}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                banner.enabled
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {banner.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{banner.enabled ? 'Active' : 'Disabled'}</span>
            </button>
          </div>

          {/* Overlay Theme */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Text &amp; Overlay Contrast
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setBanner((prev) => ({ ...prev, heroTheme: 'dark' }))}
                className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer text-left ${
                  isDark
                    ? 'border-[#c2410c] bg-orange-50/70 text-[#c2410c]'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Dark Scrim + White Text
              </button>
              <button
                type="button"
                onClick={() => setBanner((prev) => ({ ...prev, heroTheme: 'light' }))}
                className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer text-left ${
                  !isDark
                    ? 'border-[#c2410c] bg-orange-50/70 text-[#c2410c]'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Light Wash + Navy Text
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Hero Background Image
            </label>
            <div className="flex flex-wrap items-center gap-2.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Image File</span>
              </button>
              {banner.imageUrl && (
                <button
                  type="button"
                  onClick={() => setBanner((prev) => ({ ...prev, imageUrl: '' }))}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-bold text-red-700 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>
            <input
              type="text"
              value={banner.imageUrl.startsWith('data:') ? '' : banner.imageUrl}
              onChange={(e) => setBanner((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="Or paste an image URL (e.g. /hero-banner.jpg)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#c2410c]"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Clean White</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d1c2f] hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Publishing...' : 'Publish Changes'}</span>
            </button>
          </div>
        </div>

        {/* Right: Live Hero Preview */}
        <div className="lg:col-span-7">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#c2410c]" />
                Live Hero Background Preview
              </span>
              {(!banner.enabled || !banner.imageUrl) && (
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Default White Grid
                </span>
              )}
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-200 min-h-[260px] flex flex-col items-center justify-center p-6 text-center bg-white">
              {banner.enabled && banner.imageUrl ? (
                <>
                  <img
                    src={banner.imageUrl}
                    alt="Hero Background Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 ${
                      isDark
                        ? 'bg-gradient-to-b from-slate-950/75 via-slate-950/60 to-slate-950/85'
                        : 'bg-gradient-to-b from-white/85 via-white/75 to-white/90'
                    }`}
                  />
                </>
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(#d5e3fd_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
              )}

              <div className="relative z-10 space-y-3 max-w-lg">
                <h3
                  className={`text-xl font-extrabold leading-tight ${
                    banner.enabled && banner.imageUrl && isDark ? 'text-white' : 'text-[#0d1c2f]'
                  }`}
                >
                  Discover Verified Businesses.{' '}
                  <span
                    className={
                      banner.enabled && banner.imageUrl && isDark
                        ? 'text-[#fb923c]'
                        : 'text-[#c2410c]'
                    }
                  >
                    Grow High-Intent Visibility.
                  </span>
                </h3>
                <p
                  className={`text-xs leading-relaxed ${
                    banner.enabled && banner.imageUrl && isDark
                      ? 'text-slate-200'
                      : 'text-slate-600'
                  }`}
                >
                  Directly connect with 120,000+ audited clinics, schools, manufacturers, and franchise outlets across India.
                </p>
                <div className="mx-auto max-w-md h-10 rounded-xl bg-white shadow-md border border-slate-200 flex items-center justify-between px-3 text-[11px] text-slate-400">
                  <span>All India (120+ Cities) • All Categories</span>
                  <span className="px-3 py-1 rounded-lg bg-[#c2410c] text-white font-bold">
                    Search Hub
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
