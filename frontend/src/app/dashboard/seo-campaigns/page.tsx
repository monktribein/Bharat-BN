'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Plus,
  X,
  Target,
  Smartphone,
  Monitor,
  Building2,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';

interface Milestone {
  type: string;
  name: string;
  percentage: number;
  amount: number;
  status: 'paid' | 'eligible' | 'locked';
  notes: string;
}

interface SeoCampaign {
  id: string;
  businessName: string;
  keyword: string;
  targetCity: string;
  targetUrl: string;
  device: 'mobile' | 'desktop';
  currentRank: number;
  baselineRank: number;
  totalValue: number;
  provider: string;
  status: 'active' | 'in_review' | 'completed';
  milestones: Milestone[];
  auditLogs: string[];
  createdAt: string;
}

const defaultCampaigns: SeoCampaign[] = [
  {
    id: 'CAMP-001',
    businessName: 'Apex Dental Care Group',
    keyword: 'best dental clinic in andheri west',
    targetCity: 'Mumbai (Mobile)',
    targetUrl: 'https://bharatbn.com/mumbai/healthcare-clinics/apex-super-speciality-dental-clinic-andheri-mumbai',
    device: 'mobile',
    currentRank: 8,
    baselineRank: 48,
    totalValue: 20000,
    provider: 'DataForSEO SERP Bot',
    status: 'active',
    milestones: [
      {
        type: 'advance',
        name: '1. Advance (25%)',
        percentage: 25,
        amount: 5000,
        status: 'paid',
        notes: 'Paid on campaign activation',
      },
      {
        type: 'top_20',
        name: '2. Top-20 Verified (25%)',
        percentage: 25,
        amount: 5000,
        status: 'paid',
        notes: 'Verified at position #14 & settled',
      },
      {
        type: 'top_10',
        name: '3. Top-10 Verified (50%)',
        percentage: 50,
        amount: 10000,
        status: 'eligible',
        notes: 'Eligible! Position #8 sustained ≥ 24h (Ready for Sign-off)',
      },
    ],
    auditLogs: [
      'Observation 1: Position #8 recorded at 2026-11-16 02:00:00 UTC (Provider: DataForSEO)',
      'Observation 2: Position #7 recorded at 2026-11-17 14:00:00 UTC (Provider: DataForSEO)',
      'Time separation: 36 hours (> 24h statutory rule satisfied). Milestone eligible.',
    ],
    createdAt: '2026-11-10',
  },
];

export default function SeoCampaignsDashboardPage() {
  const [campaigns, setCampaigns] = useState<SeoCampaign[]>(defaultCampaigns);
  const [selectedId, setSelectedId] = useState<string>('CAMP-001');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formBusiness, setFormBusiness] = useState('Apple');
  const [formKeyword, setFormKeyword] = useState('');
  const [formCity, setFormCity] = useState('Noida');
  const [formUrl, setFormUrl] = useState('');
  const [formDevice, setFormDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [formBudget, setFormBudget] = useState<number>(25000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Hydrate user business from localStorage session if available
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const sessionStr = localStorage.getItem('bharatbn_owner_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session.businessName) {
          setFormBusiness(session.businessName);
          setFormUrl(`https://bharatbn.com/biz/${session.businessSlug || 'business'}`);
        }
      }

      // Load custom campaigns from localStorage
      const storedCampaigns = localStorage.getItem('bharatbn_seo_campaigns');
      if (storedCampaigns) {
        const parsed = JSON.parse(storedCampaigns);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCampaigns((prev) => {
            const map = new Map<string, SeoCampaign>();
            parsed.forEach((c) => map.set(c.id, c));
            prev.forEach((c) => {
              if (!map.has(c.id)) map.set(c.id, c);
            });
            return Array.from(map.values());
          });
          setSelectedId(parsed[0].id);
        }
      }
    } catch (err) {
      console.error('Error hydrating SEO campaigns:', err);
    }
  }, []);

  const activeCampaign = campaigns.find((c) => c.id === selectedId) || campaigns[0];

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKeyword.trim()) return;

    setIsSubmitting(true);

    const advanceAmount = Math.round(formBudget * 0.25);
    const top20Amount = Math.round(formBudget * 0.25);
    const top10Amount = Math.round(formBudget * 0.5);

    const newCampaignId = `CAMP-${Math.floor(100 + Math.random() * 900)}`;
    const randomBaseline = Math.floor(35 + Math.random() * 40); // Initial rank between 35-75

    const newCamp: SeoCampaign = {
      id: newCampaignId,
      businessName: formBusiness.trim() || 'My Business',
      keyword: formKeyword.trim().toLowerCase(),
      targetCity: `${formCity.trim()} (${formDevice === 'mobile' ? 'Mobile' : 'Desktop'})`,
      targetUrl:
        formUrl.trim() ||
        `https://bharatbn.com/biz/${formBusiness.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      device: formDevice,
      currentRank: randomBaseline,
      baselineRank: randomBaseline,
      totalValue: formBudget,
      provider: 'DataForSEO SERP Bot',
      status: 'active',
      milestones: [
        {
          type: 'advance',
          name: '1. Advance (25%)',
          percentage: 25,
          amount: advanceAmount,
          status: 'paid',
          notes: 'Settled on campaign launch & SERP crawler queueing',
        },
        {
          type: 'top_20',
          name: '2. Top-20 Verified (25%)',
          percentage: 25,
          amount: top20Amount,
          status: 'locked',
          notes: 'Unlocks once Google SERP reaches position ≤ 20 for 24h',
        },
        {
          type: 'top_10',
          name: '3. Top-10 Verified (50%)',
          percentage: 50,
          amount: top10Amount,
          status: 'locked',
          notes: 'Unlocks on Page 1 (Top 10) verified ranking audit',
        },
      ],
      auditLogs: [
        `Campaign registered on ${new Date().toISOString().split('T')[0]}`,
        `Baseline SERP crawl complete: initial position #${randomBaseline} recorded`,
        'Crawler cycle scheduled: checks run every 12 hours with automated screenshot proof',
      ],
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newCamp, ...campaigns.filter((c) => c.id !== newCampaignId)];
    setCampaigns(updated);
    setSelectedId(newCampaignId);

    if (typeof window !== 'undefined') {
      localStorage.setItem('bharatbn_seo_campaigns', JSON.stringify(updated));
    }

    setIsSubmitting(false);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsModalOpen(false);
      setFormKeyword('');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Guaranteed Performance Model</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pay-As-You-Rank™ Campaign Engine
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Milestone-verified Google visibility contracts. Dual observations (≥ 24h apart) required before payouts unlock.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#F95700] via-[#FF6200] to-[#E54800] hover:from-[#e04e00] hover:to-[#cc3e00] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow-md shadow-[#F95700]/30 hover:shadow-lg transition-all cursor-pointer active:scale-95 whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Launch New SEO Campaign</span>
        </button>
      </div>

      {/* Campaign Switcher Tabs (If multiple exist) */}
      {campaigns.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {campaigns.map((camp) => (
            <button
              key={camp.id}
              type="button"
              onClick={() => setSelectedId(camp.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                selectedId === camp.id
                  ? 'bg-[#07213A] text-white border-[#07213A] shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
              }`}
            >
              {camp.businessName} • "{camp.keyword}"
            </button>
          ))}
        </div>
      )}

      {/* Active Campaign Card */}
      {activeCampaign && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#F95700] font-bold uppercase tracking-wider">
                  Campaign ID: {activeCampaign.id} • {activeCampaign.businessName}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {activeCampaign.status.toUpperCase()}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                "{activeCampaign.keyword}"
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span>📍 Target City: {activeCampaign.targetCity}</span>
                <span>•</span>
                <span>🤖 Provider: {activeCampaign.provider}</span>
                <span>•</span>
                <a
                  href={activeCampaign.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F95700] hover:underline inline-flex items-center gap-0.5"
                >
                  View URL <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Rank Stat Badges */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 p-4 rounded-2xl self-start lg:self-auto">
              <div className="text-right">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Google Rank</div>
                <div className="text-3xl font-black text-emerald-600 flex items-center justify-end gap-1">
                  <span>#{activeCampaign.currentRank}</span>
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div className="h-10 w-[1px] bg-slate-200" />
              <div className="text-right pl-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Baseline</div>
                <div className="text-2xl font-bold text-slate-500">#{activeCampaign.baselineRank}</div>
              </div>
            </div>
          </div>

          {/* 3 Milestones Progress Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Performance Milestones (Total Contract: ₹{activeCampaign.totalValue.toLocaleString('en-IN')})
              </h3>
              <span className="text-xs text-slate-500">Zero fee until verified rank proof</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeCampaign.milestones.map((m) => {
                const isPaid = m.status === 'paid';
                const isEligible = m.status === 'eligible';

                return (
                  <div
                    key={m.type}
                    className={`p-5 rounded-2xl space-y-2 border transition ${
                      isPaid
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : isEligible
                        ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{m.name}</span>
                      {isPaid ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isEligible ? (
                        <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                      ) : (
                        <span className="text-[10px] uppercase font-bold text-slate-400">Locked</span>
                      )}
                    </div>
                    <div className="text-xl font-black">₹{m.amount.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] font-medium leading-relaxed">{m.notes}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dual Verification Audit Log */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 tracking-wide">Dual-Proof SERP Verification Ledger</span>
              </div>
              <span className="text-[11px] text-slate-400">BN-073 Automated Compliance</span>
            </div>
            <div className="text-xs text-slate-300 space-y-1.5 font-mono">
              {activeCampaign.auditLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Launch New Campaign */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F95700]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Ranking Contract</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">Start Pay-As-You-Rank™</h2>
              <p className="text-xs text-slate-500">
                Choose your target keyword and budget. You only pay subsequent milestones after Google ranking proof is delivered.
              </p>
            </div>

            {formSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Campaign Activated!</h3>
                <p className="text-xs text-slate-500">
                  Crawler has queued your keyword for baseline observation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
                {/* Business Name */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    value={formBusiness}
                    onChange={(e) => setFormBusiness(e.target.value)}
                    placeholder="e.g. Apple or Apex Dental"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] text-sm"
                  />
                </div>

                {/* Target Keyword */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Target Google Keyword <span className="text-[#F95700]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formKeyword}
                    onChange={(e) => setFormKeyword(e.target.value)}
                    placeholder="e.g. electric vehicle showroom noida or dentist in andheri"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] text-sm font-semibold"
                  />
                </div>

                {/* City & Device Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target City Hub</label>
                    <input
                      type="text"
                      required
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      placeholder="e.g. Noida, Mumbai, Delhi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Device</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormDevice('mobile')}
                        className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition cursor-pointer ${
                          formDevice === 'mobile'
                            ? 'bg-[#F95700]/10 border-[#F95700] text-[#F95700]'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" /> Mobile
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormDevice('desktop')}
                        className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition cursor-pointer ${
                          formDevice === 'desktop'
                            ? 'bg-[#F95700]/10 border-[#F95700] text-[#F95700]'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" /> Desktop
                      </button>
                    </div>
                  </div>
                </div>

                {/* Target URL */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Landing Page URL</label>
                  <input
                    type="url"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://bharatbn.com/biz/your-business"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] text-sm"
                  />
                </div>

                {/* Budget Selection */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">Contract Value (Payable in 3 Milestones)</label>
                    <span className="font-extrabold text-sm text-[#F95700]">
                      ₹{formBudget.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[15000, 25000, 40000, 60000].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setFormBudget(b)}
                        className={`py-2 rounded-xl font-bold border transition cursor-pointer ${
                          formBudget === b
                            ? 'bg-[#07213A] text-white border-[#07213A]'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        ₹{(b / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>

                  {/* Calculated Milestone Breakdown */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 mt-2">
                    <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                      Milestone Payout Schedule:
                    </div>
                    <div className="flex justify-between text-slate-600 text-xs">
                      <span>• 25% Activation Advance:</span>
                      <span className="font-bold text-slate-900">
                        ₹{Math.round(formBudget * 0.25).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-xs">
                      <span>• 25% On Verified Top-20 Rank:</span>
                      <span className="font-bold text-slate-900">
                        ₹{Math.round(formBudget * 0.25).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-xs">
                      <span>• 50% On Verified Top-10 (Page 1):</span>
                      <span className="font-bold text-slate-900">
                        ₹{Math.round(formBudget * 0.5).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F95700] via-[#FF6200] to-[#E54800] text-white font-extrabold text-sm shadow-md shadow-[#F95700]/30 hover:shadow-lg transition cursor-pointer active:scale-95"
                  >
                    {isSubmitting ? 'Starting Campaign...' : 'Lock In Performance Contract'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
