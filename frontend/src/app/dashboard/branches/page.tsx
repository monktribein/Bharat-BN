'use client';

import { useState } from 'react';
import { Building2, UploadCloud, CheckCircle, AlertCircle, Plus } from 'lucide-react';

interface BranchItem {
  id: string;
  outletName: string;
  outletCode: string;
  city: string;
  phone: string;
  managerEmail: string;
}

export default function BranchesDashboardPage() {
  const [branches, setBranches] = useState<BranchItem[]>([
    {
      id: 'br-1',
      outletName: 'Dr. Batra’s Clinics - Bandra West',
      outletCode: 'DB-MUM-01',
      city: 'Mumbai',
      phone: '+919820011111',
      managerEmail: 'bandra@drbatras.com',
    },
    {
      id: 'br-2',
      outletName: 'Dr. Batra’s Clinics - Koramangala',
      outletCode: 'DB-BLR-04',
      city: 'Bengaluru',
      phone: '+919845022222',
      managerEmail: 'koramangala@drbatras.com',
    },
    {
      id: 'br-3',
      outletName: 'Dr. Batra’s Clinics - Connaught Place',
      outletCode: 'DB-DEL-02',
      city: 'New Delhi',
      phone: '+919811033333',
      managerEmail: 'cp@drbatras.com',
    },
  ]);

  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSimulateBulkImport = () => {
    const newBranch: BranchItem = {
      id: `br-${Date.now()}`,
      outletName: 'Dr. Batra’s Clinics - Kothrud',
      outletCode: 'DB-PUN-03',
      city: 'Pune',
      phone: '+919822044444',
      managerEmail: 'kothrud@drbatras.com',
    };
    setBranches((prev) => [newBranch, ...prev]);
    setImportStatus('Successfully validated & imported 1 new branch. (0 duplicates found)');
    setTimeout(() => setImportStatus(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Franchise Branch Master
          </h1>
          <p className="text-sm text-slate-500">
            Brand: Dr. Batra’s Healthcare (Total Outlets: {branches.length})
          </p>
        </div>

        <button
          onClick={handleSimulateBulkImport}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
        >
          <UploadCloud className="w-4 h-4" /> Bulk Import Branches (CSV)
        </button>
      </div>

      {importStatus && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-medium text-emerald-800">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Table of Branches */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Outlet Code</th>
                <th className="px-6 py-4 font-semibold">Outlet Name</th>
                <th className="px-6 py-4 font-semibold">City</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold">Branch Manager</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {branches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{b.outletCode}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{b.outletName}</td>
                  <td className="px-6 py-4">{b.city}</td>
                  <td className="px-6 py-4">{b.phone}</td>
                  <td className="px-6 py-4 text-slate-500">{b.managerEmail}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium text-[11px]">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

