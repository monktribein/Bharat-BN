import Link from 'next/link';
import { Building2, UploadCloud, Users, BarChart3, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function EnterprisePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="relative pt-10 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-50/70 via-slate-50/50 to-white overflow-hidden">
        {/* Subtle decorative background gradient circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-r from-brand-500/10 via-brandGold-400/10 to-indiaGreen-500/10 blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full border border-brand-200 shadow-sm text-xs font-semibold text-navy-900">
            <span className="text-brandGold-500 font-bold">✦</span>
            <span className="tracking-wide">Enterprise Franchise Network (M05)</span>
            <span className="text-brandGold-500 font-bold">✦</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-navy-900 leading-tight">
            One Brand HQ. <br className="hidden sm:inline" />
            <span className="text-brand-500">500+ Outlets Globally Visible.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Manage corporate franchise branches with isolated manager roles, aggregated local visibility, 
            and unified lead routing across every Indian pincode.
          </p>

          <div className="pt-2 flex flex-wrap justify-center items-center gap-4">
            <Link
              href="/dashboard/branches"
              className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition shadow-md shadow-brand-500/20"
            >
              Launch Franchise Portal
            </Link>
            <a
              href="#features"
              className="bg-white hover:bg-slate-50 text-navy-900 border border-slate-200 font-semibold text-sm px-6 py-3 rounded-xl transition shadow-xs"
            >
              Explore Capabilities
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Sections - Same max-w-7xl width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Feature Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-brand-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900">Bulk CSV Branch Importer</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Upload your entire branch master file with automated validation, duplicate outlet detection, 
              and error preview reports before committing to database.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-brand-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-navy-50 text-navy-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900">Tenant &amp; Role Isolation</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Corporate HQ Admin oversees the full brand portfolio; branch managers access only their assigned outlet leads and local operational hours.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-indiaGreen-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-indiaGreen-50 text-indiaGreen-500 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy-900">Unified Lead Attribution</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every customer enquiry and WhatsApp click is routed to the exact geographic branch with source UTM tracking and automated delivery reports.
            </p>
          </div>
        </div>

        {/* Bulk Import Preview Card */}
        <div 
          style={{ backgroundColor: '#07213A' }}
          className="relative overflow-hidden bg-[#07213A] bg-gradient-to-r from-[#041424] via-[#07213A] to-[#0c2a49] rounded-3xl p-8 sm:p-12 text-white border border-slate-700/50 shadow-xl"
        >
          {/* Subtle logo accent line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-brandGold-400 to-[#128807]" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-brandGold-400 text-xs font-semibold uppercase tracking-wider">
                <span>✦</span> Instant Scale
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">Ready to onboard your outlets?</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Import 10 to 500 branches simultaneously in less than 3 minutes. BharatBN ensures exact canonical slug generation and schema compliance for each location.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/dashboard/branches"
                  className="bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs px-5 py-3 rounded-xl transition shadow-md shadow-brand-500/20"
                >
                  Go to Branch Master &amp; Import
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/15 space-y-3 font-mono text-xs">
              <div className="text-slate-400">// Sample CSV Schema Format</div>
              <div className="text-[#4ade80]">outlet_name, outlet_code, city, phone, manager_email</div>
              <div className="text-slate-200">&quot;Dr Batras Bandra West&quot;, &quot;DB-MUM-01&quot;, &quot;mumbai&quot;, &quot;+919820011111&quot;, &quot;bandra@brand.com&quot;</div>
              <div className="text-slate-200">&quot;Dr Batras Koramangala&quot;, &quot;DB-BLR-04&quot;, &quot;bengaluru&quot;, &quot;+919845022222&quot;, &quot;koramangala@brand.com&quot;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

