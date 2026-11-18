'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
  Building2,
  Download,
  Eye,
  FileCheck,
  UserCheck,
  Phone,
  Mail,
  FileCode,
  CheckSquare,
} from 'lucide-react';

interface ClaimItem {
  id: string;
  businessName: string;
  businessSlug: string;
  logoUrl?: string;
  logoBase64?: string;
  city: string;
  category: string;
  claimantName: string;
  workEmail: string;
  phone: string;
  gstin: string;
  gstinMatch: number;
  docType: string;
  fileName: string;
  fileSize: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  reviewerNotes?: string;
}

const defaultClaims: ClaimItem[] = [
  {
    id: 'BBN-CLM-982104',
    businessName: 'Choco Delights & Confectionery (Cadboury)',
    businessSlug: 'choco-delights-confectionery-andheri-mumbai',
    city: 'Mumbai, MH',
    category: 'Food, Bakeries & Confectionery',
    claimantName: 'Cadboury Admin',
    workEmail: 'cad@gmail.com',
    phone: '+91 89653 26578',
    gstin: '27AABCC8921N1Z3',
    gstinMatch: 98,
    docType: 'Commercial Electricity / Phone Bill',
    fileName: 'Cadboury_Commercial_Bill.pdf',
    fileSize: '1.2 MB',
    submittedAt: 'Just now (Recently Submitted)',
    status: 'pending',
  },
  {
    id: 'BBN-CLM-849102',
    businessName: 'Apex Super Speciality Dental Clinic',
    businessSlug: 'apex-super-speciality-dental-clinic-andheri-mumbai',
    city: 'Mumbai, MH',
    category: 'Healthcare & Clinics',
    claimantName: 'Dr. Rajesh Sharma',
    workEmail: 'rajesh@apexclinic.com',
    phone: '+91 98200 12345',
    gstin: '27AABCS1429B1Z8',
    gstinMatch: 99,
    docType: 'GST Registration Certificate',
    fileName: 'Apex_GST_Registration_2026.pdf',
    fileSize: '1.4 MB',
    submittedAt: 'Today, 10:14 IST',
    status: 'pending',
  },
  {
    id: 'BBN-CLM-623194',
    businessName: 'Little Elly Preschool & Daycare',
    businessSlug: 'little-elly-preschool-indiranagar-bengaluru',
    city: 'Bengaluru, KA',
    category: 'Preschools & Education',
    claimantName: 'Sunita Rao',
    workEmail: 'director@littleellyindiranagar.com',
    phone: '+91 98450 67890',
    gstin: '29AAACL9201D1ZU',
    gstinMatch: 95,
    docType: 'Govt Shop & Establishment License',
    fileName: 'LittleElly_Govt_License_KA.pdf',
    fileSize: '2.8 MB',
    submittedAt: 'Today, 09:30 IST',
    status: 'pending',
  },
  {
    id: 'BBN-CLM-419082',
    businessName: 'Greenfield EV Motors & Spares',
    businessSlug: 'greenfield-ev-motors-kothrud-pune',
    city: 'Pune, MH',
    category: 'Automobile & EV',
    claimantName: 'Anil Deshmukh',
    workEmail: 'anil@greenfieldev.in',
    phone: '+91 97654 32100',
    gstin: '27AAHFG4821M1ZX',
    gstinMatch: 88,
    docType: 'Commercial Electricity Bill',
    fileName: 'MSEDCL_Power_Bill_Jan2026.jpg',
    fileSize: '820 KB',
    submittedAt: 'Yesterday, 18:45 IST',
    status: 'pending',
  },
  {
    id: 'BBN-CLM-310928',
    businessName: 'Dr Batra’s Positive Health Clinic',
    businessSlug: 'dr-batras-positive-health-clinic-bandra-mumbai',
    city: 'Mumbai, MH',
    category: 'Healthcare & Clinics',
    claimantName: 'Dr. Neha Kapoor',
    workEmail: 'dr.neha@drbatras.com',
    phone: '+91 98200 99999',
    gstin: '27AAACD9218F1ZC',
    gstinMatch: 100,
    docType: 'GST Registration Certificate',
    fileName: 'DrBatras_Corporate_GST.pdf',
    fileSize: '3.1 MB',
    submittedAt: '14 Nov 2026',
    status: 'approved',
    reviewerNotes: 'Verified against MCA corporate registration registry.',
  },
  {
    id: 'BBN-CLM-109283',
    businessName: 'Kalyan Jewellers Showroom',
    businessSlug: 'kalyan-jewellers-t-nagar-chennai',
    city: 'Chennai, TN',
    category: 'Retail & Jewellery',
    claimantName: 'R. Ramachandran',
    workEmail: 'ram@randommail.com',
    phone: '+91 94440 12345',
    gstin: '33AAACK4812K1Z0',
    gstinMatch: 42,
    docType: 'Personal Electricity Bill',
    fileName: 'personal_bill.png',
    fileSize: '450 KB',
    submittedAt: '12 Nov 2026',
    status: 'rejected',
    rejectionReason: 'Personal residential bill submitted instead of commercial ROC/GSTIN proof.',
    reviewerNotes: 'Address mismatch between claimant document and registered listing.',
  },
];

export default function ClaimModerationPage() {
  const [claims, setClaims] = useState<ClaimItem[]>(defaultClaims);
  const [selectedClaim, setSelectedClaim] = useState<ClaimItem | null>(defaultClaims[0]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedReason, setSelectedReason] = useState('Personal utility bill instead of commercial proof');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Load dynamically submitted claims from localStorage
  useEffect(() => {
    const loadStoredClaims = () => {
      try {
        const stored = localStorage.getItem('bharatbn_claims_store');
        if (stored) {
          const parsed: ClaimItem[] = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setClaims((prev) => {
              const map = new Map<string, ClaimItem>();
              parsed.forEach((c) => map.set(c.id, c));
              prev.forEach((c) => {
                if (!map.has(c.id)) map.set(c.id, c);
              });
              return Array.from(map.values());
            });
          }
        }
      } catch (e) {
        console.error('Failed to load local claims', e);
      }
    };

    loadStoredClaims();
    window.addEventListener('bharatbn_claims_updated', loadStoredClaims);
    return () => window.removeEventListener('bharatbn_claims_updated', loadStoredClaims);
  }, []);

  const filteredClaims = claims.filter((c) => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.businessName.toLowerCase().includes(q) ||
        c.claimantName.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.gstin.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = claims.filter((c) => c.status === 'pending').length;
  const approvedCount = claims.filter((c) => c.status === 'approved').length;
  const rejectedCount = claims.filter((c) => c.status === 'rejected').length;

  const handleDecision = (decision: 'approved' | 'rejected') => {
    if (!selectedClaim) return;

    const updated = claims.map((c) => {
      if (c.id === selectedClaim.id) {
        return {
          ...c,
          status: decision,
          rejectionReason: decision === 'rejected' ? selectedReason : undefined,
          reviewerNotes: notes || (decision === 'approved' ? 'Verified by Admin review.' : selectedReason),
        };
      }
      return c;
    });

    setClaims(updated);
    const updatedSelected = updated.find((c) => c.id === selectedClaim.id) || null;
    setSelectedClaim(updatedSelected);
    setShowRejectModal(false);
    setNotes('');

    try {
      localStorage.setItem('bharatbn_claims_store', JSON.stringify(updated));
    } catch {}

    setActionSuccess(`Claim ${selectedClaim.id} (${selectedClaim.businessName}) marked as ${decision.toUpperCase()}.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const filterTabs: {
    id: 'all' | 'pending' | 'approved' | 'rejected';
    label: string;
    count: number;
    highlight?: boolean;
  }[] = [
    { id: 'all', label: 'All', count: claims.length, highlight: false },
    { id: 'pending', label: 'Pending', count: pendingCount, highlight: true },
    { id: 'approved', label: 'Approved', count: approvedCount, highlight: false },
    { id: 'rejected', label: 'Rejected', count: rejectedCount, highlight: false },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Business Claim Approvals
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              {pendingCount} Awaiting Review
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Review uploaded proof documents, verify GSTIN details, and approve ownership claims.
          </p>
        </div>

        {/* Filter Pills with Framer Motion LayoutId */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
          {filterTabs.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className="relative px-3 py-1 rounded text-[11px] font-medium transition"
              >
                {isActive && (
                  <motion.div
                    layoutId="claimsFilterPill"
                    className="absolute inset-0 bg-white rounded shadow-xs"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className={`relative z-10 ${isActive ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                  {tab.label}{' '}
                  <span className={`font-mono text-[10px] ${tab.highlight && isActive ? 'text-amber-600' : 'text-slate-400'}`}>
                    ({tab.count})
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated Action Notification */}
      <AnimatePresence>
        {actionSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2.5 rounded-md flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-medium">{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Claims Queue Table / List (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
          {/* Quick Search */}
          <div className="p-2.5 border-b border-slate-200 bg-slate-50/70">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search business, 'choco', GSTIN..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-brand-500 bg-white"
              />
            </div>
          </div>

          {/* List items */}
          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
            {filteredClaims.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No claim records matching the current filter.
              </div>
            ) : (
              filteredClaims.map((claim) => {
                const isSelected = selectedClaim?.id === claim.id;
                return (
                  <motion.div
                    key={claim.id}
                    onClick={() => setSelectedClaim(claim)}
                    whileHover={{ backgroundColor: isSelected ? undefined : 'rgba(248, 250, 252, 0.8)' }}
                    className={`p-3 cursor-pointer transition text-xs space-y-1.5 ${
                      isSelected
                        ? 'bg-slate-100/90 border-l-[3px] border-[#F95700]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-slate-600">{claim.id}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                          claim.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : claim.status === 'rejected'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-900 truncate">
                      {claim.businessName}
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between font-mono">
                      <span>{claim.claimantName}</span>
                      <span>{claim.submittedAt}</span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Document Inspector Dossier (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200/90 shadow-xs p-5 space-y-5">
          <AnimatePresence mode="wait">
            {selectedClaim ? (
              <motion.div
                key={selectedClaim.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Dossier Header */}
                <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-500 font-semibold">{selectedClaim.id}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-[11px] text-slate-500 font-mono">{selectedClaim.submittedAt}</span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 mt-1">
                      {selectedClaim.businessName}
                    </h2>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {selectedClaim.city} &bull; {selectedClaim.category}
                      </span>
                      <span className="text-slate-300">|</span>
                      <a
                        href={`/biz/${selectedClaim.businessSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1"
                      >
                        View Live Listing <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      selectedClaim.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : selectedClaim.status === 'rejected'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {selectedClaim.status}
                  </span>
                </div>

                {/* Applicant Credentials Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-md border border-slate-200/80">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Claimant Name &amp; Contact</span>
                    <div className="font-semibold text-slate-900">{selectedClaim.claimantName}</div>
                    <div className="text-slate-600 font-mono flex items-center gap-1 text-[11px]">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {selectedClaim.workEmail}
                    </div>
                    <div className="text-slate-600 font-mono flex items-center gap-1 text-[11px]">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {selectedClaim.phone}
                    </div>
                  </div>

                  <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-3">
                    <span className="text-[10px] font-mono uppercase text-slate-400">GSTIN Match Audit</span>
                    <div className="font-mono font-bold text-slate-900">{selectedClaim.gstin}</div>
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full ${
                            selectedClaim.gstinMatch >= 90
                              ? 'bg-emerald-500'
                              : selectedClaim.gstinMatch >= 70
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${selectedClaim.gstinMatch}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-slate-700">
                        {selectedClaim.gstinMatch}% match
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">Sandpoint MCA Data Registry</div>
                  </div>
                </div>

                {/* Document Proof Inspector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">Uploaded Evidence Document</span>
                    <span className="text-[11px] text-slate-500 font-mono">{selectedClaim.fileSize}</span>
                  </div>

                  <div className="border border-slate-200 rounded-md p-3 flex items-center justify-between bg-white hover:border-slate-300 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{selectedClaim.fileName}</div>
                        <div className="text-[11px] text-slate-500">{selectedClaim.docType}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => alert(`Opening preview for ${selectedClaim.fileName}`)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded flex items-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => alert(`Downloading ${selectedClaim.fileName}`)}
                        className="p-1 text-slate-500 hover:text-slate-800 border border-slate-200 rounded hover:bg-slate-50 transition"
                        title="Download file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Rejection / Reviewer Notes */}
                {selectedClaim.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-md text-xs text-red-800 space-y-1">
                    <div className="font-semibold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                      Rejection Reason
                    </div>
                    <p className="text-[11px] text-red-700">{selectedClaim.rejectionReason}</p>
                  </div>
                )}

                {selectedClaim.reviewerNotes && (
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-md text-xs text-slate-700 space-y-0.5 font-mono">
                    <span className="text-[10px] text-slate-400 uppercase">Reviewer Audit Note</span>
                    <div className="text-[11px]">{selectedClaim.reviewerNotes}</div>
                  </div>
                )}

                {/* Actions Desk */}
                {selectedClaim.status === 'pending' ? (
                  <div className="pt-2 border-t border-slate-200 space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-slate-700">
                        Internal Audit Note (Logged to audit trail)
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Cross-verified with Maharashtra ROC portal"
                        className="w-full text-xs p-2 rounded border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowRejectModal(true)}
                        className="px-3.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded transition"
                      >
                        Reject Claim
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleDecision('approved')}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition flex items-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve &amp; Assign Listing</span>
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>Decision locked by Operator</span>
                    <button
                      onClick={() => {
                        const updated = claims.map((c) =>
                          c.id === selectedClaim.id ? { ...c, status: 'pending' as const } : c
                        );
                        setClaims(updated);
                        setSelectedClaim({ ...selectedClaim, status: 'pending' });
                      }}
                      className="text-brand-600 hover:underline"
                    >
                      Reopen for review
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-400">
                Select a claim ticket from the queue on the left to inspect documents.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Reject Modal with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {showRejectModal && selectedClaim && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Reject Claim: {selectedClaim.id}
                </h3>
                <button onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  Select the rejection reason. An automated email with re-upload instructions will be sent to{' '}
                  <span className="font-mono font-semibold text-slate-800">{selectedClaim.workEmail}</span>.
                </p>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-700">Rejection Reason</label>
                  <select
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-brand-500"
                  >
                    <option value="Personal utility bill instead of commercial proof">Personal utility bill instead of commercial proof</option>
                    <option value="GSTIN mismatch with corporate registry">GSTIN mismatch with corporate registry</option>
                    <option value="Document unreadable or low resolution">Document unreadable or low resolution</option>
                    <option value="Authorization letter missing director sign-off">Authorization letter missing director sign-off</option>
                    <option value="Suspected duplicate or unauthorized takeover attempt">Suspected duplicate or unauthorized takeover attempt</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDecision('rejected')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
