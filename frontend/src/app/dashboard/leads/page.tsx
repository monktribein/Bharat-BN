import { MessageSquare, Phone, CheckCircle, ShieldCheck } from 'lucide-react';

const mockLeads = [
  {
    id: 'lead-01',
    name: 'Anjali Verma',
    phone: '+91 98201 54321',
    businessName: 'Apex Dental Care - Andheri West',
    message: 'Looking for Invisalign consultation appointment this Saturday.',
    sourceUrl: '/biz/apex-super-speciality-dental-clinic-andheri-mumbai',
    utmSource: 'google_organic',
    consentAt: '2026-11-14T09:15:00Z',
    status: 'new',
  },
  {
    id: 'lead-02',
    name: 'Vikram Sethi',
    phone: '+91 98451 98765',
    businessName: 'Little Elly Preschool - Indiranagar',
    message: 'Need fee structure and daycare timing details for toddler.',
    sourceUrl: '/biz/little-elly-international-preschool-indiranagar-bengaluru',
    utmSource: 'whatsapp_campaign',
    consentAt: '2026-11-14T08:30:00Z',
    status: 'contacted',
  },
];

export default function LeadsDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Inquiries & Verified Leads
        </h1>
        <p className="text-sm text-slate-500">
          DPDP Act compliant consent log with full UTM and branch attribution
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Lead Contact</th>
                <th className="px-6 py-4 font-semibold">Business / Outlet</th>
                <th className="px-6 py-4 font-semibold">Message Requirement</th>
                <th className="px-6 py-4 font-semibold">Source & UTM</th>
                <th className="px-6 py-4 font-semibold">Consent Timestamp</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {mockLeads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{l.name}</div>
                    <div className="text-slate-500">{l.phone}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{l.businessName}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{l.message}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                      {l.utmSource}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <div className="flex items-center gap-1 text-emerald-600 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> Consented
                    </div>
                    <div className="text-[10px]">
                      {new Date(l.consentAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize bg-brand-50 text-brand-700 font-semibold px-2.5 py-1 rounded-full text-[11px]">
                      {l.status}
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

