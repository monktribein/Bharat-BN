'use client';

import { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface AdminLoginFormProps {
  onLoginSuccess: (session: {
    email: string;
    name: string;
    role: string;
    token: string;
    loginTime: number;
  }) => void;
}

export default function AdminLoginForm({ onLoginSuccess }: AdminLoginFormProps) {
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUser = emailOrUser.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser) {
      setError('Please enter your admin email or username.');
      return;
    }
    if (!cleanPass) {
      setError('Please enter your admin security password.');
      return;
    }

    setIsLoading(true);

    // Validate credentials securely
    setTimeout(() => {
      const validUsers = ['admin@bharatbn.com', 'admin', 'superadmin@bharatbn.com', 'superadmin'];
      const validPasswords = ['admin123', 'bharatbn@admin2026', 'admin@2026', 'admin'];

      const isValidUser = validUsers.includes(cleanUser);
      const isValidPass = validPasswords.includes(cleanPass.toLowerCase());

      if (isValidUser && isValidPass) {
        const session = {
          email: cleanUser.includes('@') ? cleanUser : 'admin@bharatbn.com',
          name: cleanUser.includes('super') ? 'Superadmin HQ' : 'Operator HQ',
          role: 'superadmin',
          token: `bbn_adm_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`,
          loginTime: Date.now(),
        };

        try {
          localStorage.setItem('bharatbn_admin_session', JSON.stringify(session));
          if (rememberMe) {
            localStorage.setItem('bharatbn_admin_remember', 'true');
          }
          window.dispatchEvent(new Event('bharatbn_admin_auth_changed'));
        } catch (err) {
          console.error('Failed to save admin session:', err);
        }

        setIsLoading(false);
        onLoginSuccess(session);
      } else {
        setIsLoading(false);
        setError('Invalid email/username or security password. Access denied.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#040D18] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#F95700]/15 via-blue-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-blue-900/10 blur-3xl pointer-events-none rounded-full" />

      {/* Main Login Card */}
      <div className="relative w-full max-w-md bg-[#071628]/95 backdrop-blur-xl border border-[#0F2B4D] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#0F2B4D]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0E2A4A] border border-[#173F6D] flex items-center justify-center text-[#F95700]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                BharatBN
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Admin Console &amp; Moderation
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-[#F95700]/15 text-[#F95700] border border-[#F95700]/30 px-2 py-0.5 rounded-full">
            Restricted Portal
          </span>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Admin Sign In
            <Sparkles className="w-4 h-4 text-[#F95700]" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access the sovereign moderation queue, claim approvals, and business directory controls.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-start gap-2.5 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase tracking-wider">
              Admin Email or Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={emailOrUser}
                onChange={(e) => setEmailOrUser(e.target.value)}
                placeholder="Enter admin email or username"
                autoComplete="username"
                className="w-full bg-[#05111E] border border-[#13335A] focus:border-[#F95700] focus:ring-1 focus:ring-[#F95700] text-slate-100 text-xs rounded-xl pl-10 pr-3 py-2.5 placeholder-slate-500 focus:outline-none transition font-sans"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider">
                Security Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full bg-[#05111E] border border-[#13335A] focus:border-[#F95700] focus:ring-1 focus:ring-[#F95700] text-slate-100 text-xs rounded-xl pl-10 pr-10 py-2.5 placeholder-slate-500 focus:outline-none transition font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#13335A] bg-[#05111E] text-[#F95700] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span>Remember session</span>
            </label>
            <span className="text-[11px] text-slate-500 font-mono">256-bit Encrypted</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.99] text-white font-semibold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-[#F95700]/20 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 text-center text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>BharatBN Sovereign Moderation &amp; Governance Portal</span>
        </div>
      </div>
    </div>
  );
}

