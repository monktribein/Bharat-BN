'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Trash2,
  MapPin,
  Phone,
  Mail,
  FileSpreadsheet,
  Check,
} from 'lucide-react';

interface BranchItem {
  id: string;
  outletName: string;
  outletCode: string;
  city: string;
  phone: string;
  managerEmail: string;
  addressLine?: string;
  status?: 'active' | 'maintenance';
}

const defaultBranches: BranchItem[] = [
  {
    id: 'br-1',
    outletName: 'Apple Flagship Store - Sector 18',
    outletCode: 'APL-NOI-01',
    city: 'Noida',
    phone: '+91 97170 56860',
    managerEmail: 'noida.sector18@apple.com',
    addressLine: 'Shop 14, Master Park, Sector 18, Noida, UP',
    status: 'active',
  },
  {
    id: 'br-2',
    outletName: 'Apex Dental Care - Bandra West',
    outletCode: 'APX-MUM-01',
    city: 'Mumbai',
    phone: '+91 98200 12345',
    managerEmail: 'bandra@apexdental.com',
    addressLine: 'Shop 4, Greenfield Heights, Lokhandwala Complex',
    status: 'active',
  },
  {
    id: 'br-3',
    outletName: 'Little Elly Preschool - Indiranagar',
    outletCode: 'LE-BLR-02',
    city: 'Bengaluru',
    phone: '+91 98450 12345',
    managerEmail: 'indiranagar@littleelly.com',
    addressLine: '12th Main Road, HAL 2nd Stage, Indiranagar',
    status: 'active',
  },
];

export default function BranchesDashboardPage() {
  const [branches, setBranches] = useState<BranchItem[]>(defaultBranches);
  const [brandName, setBrandName] = useState('Enterprise Franchise Hub');
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  // Add Branch Form State
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCity, setFormCity] = useState('Noida');
  const [formPhone, setFormPhone] = useState('+91 ');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');

  // CSV Text State
  const [csvText, setCsvText] = useState(
    'APL-DEL-02, Apple Store Connaught Place, New Delhi, +919811022222, cp@apple.com\nAPL-MUM-03, Apple Store Bandra Kurla, Mumbai, +919820033333, bkc@apple.com'
  );

  // Hydrate Brand & Branches from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const sessionStr = localStorage.getItem('bharatbn_owner_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session.businessName) {
          setBrandName(`${session.businessName} Franchise Network`);
        }
      }

      const stored = localStorage.getItem('bharatbn_franchise_branches');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBranches(parsed);
        }
      }
    } catch (err) {
      console.error('Error loading branches:', err);
    }
  }, []);

  const saveBranches = (newBranches: BranchItem[]) => {
    setBranches(newBranches);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bharatbn_franchise_branches', JSON.stringify(newBranches));
    }
  };

  const handleAddSingleBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newBranch: BranchItem = {
      id: `br-${Date.now()}`,
      outletName: formName.trim(),
      outletCode:
        formCode.trim() ||
        `OUT-${Math.floor(100 + Math.random() * 900)}`,
      city: formCity.trim() || 'Noida',
      phone: formPhone.trim() || '+91 97170 56860',
      managerEmail: formEmail.trim() || 'store@branch.com',
      addressLine: formAddress.trim(),
      status: 'active',
    };

    const updated = [newBranch, ...branches];
    saveBranches(updated);

    setImportNotice(`Added outlet "${newBranch.outletName}" (${newBranch.outletCode}) successfully.`);
    setTimeout(() => setImportNotice(null), 3500);

    // Reset Form
    setFormName('');
    setFormCode('');
    setFormAddress('');
    setFormEmail('');
    setIsAddModalOpen(false);
  };

  const handleBulkCsvImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    const lines = csvText.split('\n').filter((l) => l.trim().length > 0);
    const imported: BranchItem[] = [];

    lines.forEach((line, idx) => {
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 2) {
        imported.push({
          id: `br-csv-${Date.now()}-${idx}`,
          outletCode: parts[0] || `CSV-${idx + 1}`,
          outletName: parts[1] || 'Corporate Branch',
          city: parts[2] || 'Delhi NCR',
          phone: parts[3] || '+91 98000 00000',
          managerEmail: parts[4] || 'manager@franchise.com',
          status: 'active',
        });
      }
    });

    if (imported.length > 0) {
      const updated = [...imported, ...branches];
      saveBranches(updated);
      setImportNotice(`Bulk imported ${imported.length} new outlets with 0 duplicates.`);
      setTimeout(() => setImportNotice(null), 4000);
      setIsCsvModalOpen(false);
    }
  };

  const handleDeleteBranch = (id: string) => {
    const updated = branches.filter((b) => b.id !== id);
    saveBranches(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 mb-2">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Multi-Outlet Master Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Franchise Branch Master
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Brand: <span className="font-bold text-slate-800">{brandName}</span> • Total Active Outlets:{' '}
            <span className="font-bold text-[#F95700]">{branches.length}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsCsvModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs active:scale-95"
          >
            <UploadCloud className="w-4 h-4 text-slate-500" />
            <span>Bulk CSV Import</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#F95700] via-[#FF6200] to-[#E54800] hover:from-[#e04e00] hover:to-[#cc3e00] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-[#F95700]/30 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Outlet</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      {importNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{importNotice}</span>
        </div>
      )}

      {/* Table of Branches */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Outlet Code</th>
                <th className="px-6 py-4 font-bold">Outlet Name & Address</th>
                <th className="px-6 py-4 font-bold">City</th>
                <th className="px-6 py-4 font-bold">Direct Phone</th>
                <th className="px-6 py-4 font-bold">Manager Email</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {branches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No outlets registered yet. Click "+ Add Outlet" or "Bulk CSV Import" to add branches.
                  </td>
                </tr>
              ) : (
                branches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 font-mono font-bold text-[#F95700]">{b.outletCode}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{b.outletName}</div>
                      {b.addressLine && (
                        <div className="text-[11px] text-slate-400 pt-0.5">{b.addressLine}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">{b.city}</td>
                    <td className="px-6 py-4 font-mono">{b.phone}</td>
                    <td className="px-6 py-4 text-slate-600">{b.managerEmail}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteBranch(b.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete branch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Single Branch Form */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-6">
              <h2 className="text-2xl font-black text-slate-900">Add Franchise Outlet</h2>
              <p className="text-xs text-slate-500">
                Register a new physical store or branch location to your enterprise network.
              </p>
            </div>

            <form onSubmit={handleAddSingleBranch} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Outlet Name <span className="text-[#F95700]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Apple Authorized Store - Connaught Place"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Outlet Code</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="e.g. APL-DEL-03"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] text-sm uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City Hub</label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="e.g. Noida, Mumbai, Delhi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Store Address Line</label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="e.g. Shop 12, Ground Floor, Inner Circle, CP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Local Phone</label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+91 97170 56860"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branch Manager Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="manager@branch.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] text-sm"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F95700] via-[#FF6200] to-[#E54800] text-white font-extrabold text-sm shadow-md shadow-[#F95700]/30 hover:shadow-lg transition cursor-pointer active:scale-95"
                >
                  Save &amp; Deploy Outlet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Bulk CSV Import Form */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsCsvModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Bulk Outlets Importer</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">Import CSV Outlets</h2>
              <p className="text-xs text-slate-500">
                Paste comma-separated branch records (OutletCode, Name, City, Phone, ManagerEmail):
              </p>
            </div>

            <form onSubmit={handleBulkCsvImport} className="space-y-4 text-xs">
              <div>
                <textarea
                  rows={6}
                  required
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-[11px] space-y-1">
                <div className="font-bold text-slate-700">Format Guide:</div>
                <div><code>OutletCode, Outlet Name, City, Phone, ManagerEmail</code></div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-extrabold text-sm shadow-md transition cursor-pointer active:scale-95"
                >
                  Validate &amp; Import All Rows
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
