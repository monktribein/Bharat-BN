'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Do not render public footer on dedicated admin console routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-navy-950 text-slate-400 py-14 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo-dark.png"
                alt="BharatBN - India's Local Business Network"
                width={260}
                height={96}
                className="h-14 sm:h-16 w-auto object-contain hover:opacity-95 transition"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              AI-Powered Business Discovery & Enterprise Visibility Platform. Audited listings, guaranteed NAP, and local rank growth across Bharat.
            </p>
            <p className="text-xs text-slate-500">
              © 2026 BharatBN.com. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Top Discovery Cities</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/search?city=mumbai" className="hover:text-brand-400 transition">Mumbai</Link></li>
              <li><Link href="/search?city=new-delhi" className="hover:text-brand-400 transition">Delhi NCR</Link></li>
              <li><Link href="/search?city=bengaluru" className="hover:text-brand-400 transition">Bengaluru</Link></li>
              <li><Link href="/search?city=pune" className="hover:text-brand-400 transition">Pune</Link></li>
              <li><Link href="/search?city=hyderabad" className="hover:text-brand-400 transition">Hyderabad</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Core Taxonomy</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/search?category=healthcare-clinics" className="hover:text-brand-400 transition">Healthcare & Clinics</Link></li>
              <li><Link href="/search?category=education-preschools" className="hover:text-brand-400 transition">Preschools & Education</Link></li>
              <li><Link href="/search?category=automobile-ev-showrooms" className="hover:text-brand-400 transition">Automobile & EV</Link></li>
              <li><Link href="/search?category=real-estate-builders" className="hover:text-brand-400 transition">Real Estate & Builders</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Governance & Verification</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-brand-400 transition">DPDP Act & Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-400 transition">Pay-As-You-Rank™ Terms</Link></li>
              <li><Link href="/editorial-standards" className="hover:text-brand-400 transition">Editorial Ranking Standards</Link></li>
              <li><Link href="/claim/new" className="text-brand-400 hover:text-brand-300 font-medium transition flex items-center gap-1">Claim Your Business →</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}


