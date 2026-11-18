'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import { MapPin, Phone, MessageSquare, ShieldCheck, ArrowRight, Clock } from 'lucide-react';

interface DirectoryListing {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  city: string;
  citySlug: string;
  address: string;
  phone: string;
  whatsapp: string;
  services: string[];
  isVerified: boolean;
  isClaimed: boolean;
}

const mockListings: DirectoryListing[] = [
  {
    id: 'BBN-CLM-982104',
    name: 'Choco Delights & Confectionery (Cadboury)',
    slug: 'choco-delights-confectionery-andheri-mumbai',
    category: 'Food, Bakeries & Confectionery',
    categorySlug: 'food-confectionery',
    city: 'Mumbai',
    citySlug: 'mumbai',
    address: 'Shop 12, Crystal Plaza, New Link Road, Andheri West',
    phone: '+91 89653 26578',
    whatsapp: '918965326578',
    services: ['Artisan Dark Chocolates', 'Belgian Truffles', 'Custom Corporate Hampers', 'Same-Day Delivery'],
    isVerified: true,
    isClaimed: true,
  },
  {
    id: '55555555-5555-5555-5555-555555555001',
    name: 'Apex Super Speciality Dental Clinic',
    slug: 'apex-super-speciality-dental-clinic-andheri-mumbai',
    category: 'Healthcare & Clinics',
    categorySlug: 'healthcare-clinics',
    city: 'Mumbai',
    citySlug: 'mumbai',
    address: 'Shop 4, Greenfield Heights, Lokhandwala Complex, Andheri West',
    phone: '+91 98200 12345',
    whatsapp: '919820012345',
    services: ['Invisalign', 'Root Canal', 'Dental Implants', 'Teeth Whitening'],
    isVerified: true,
    isClaimed: true,
  },
  {
    id: '55555555-5555-5555-5555-555555555002',
    name: 'Little Elly International Preschool',
    slug: 'little-elly-international-preschool-indiranagar-bengaluru',
    category: 'Preschools & Education',
    categorySlug: 'education-preschools',
    city: 'Bengaluru',
    citySlug: 'bengaluru',
    address: '12th Main Road, HAL 2nd Stage, Indiranagar',
    phone: '+91 98450 12345',
    whatsapp: '919845012345',
    services: ['Toddler Care', 'Pre-K Program', 'Daycare', 'Activity Club'],
    isVerified: true,
    isClaimed: false,
  },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const city = searchParams.get('city') || '';

  const [listings, setListings] = useState<DirectoryListing[]>(mockListings);

  // Hydrate user-submitted listings (like Apple) from localStorage
  useEffect(() => {
    const syncListings = () => {
      if (typeof window === 'undefined') return;
      try {
        const stored = localStorage.getItem('bharatbn_claims_store');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const dynamic: DirectoryListing[] = parsed.map((c: any) => ({
              id: c.id,
              name: c.businessName,
              slug: c.businessSlug || 'business',
              category: c.category || 'Automobile & EV',
              categorySlug: (c.category || 'automobile-ev').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              city: c.city || 'Noida',
              citySlug: (c.city || 'noida').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              address: c.addressLine || `${c.city || 'Local'}, ${c.state || ''}`,
              phone: c.phone || '+91 97170 56860',
              whatsapp: (c.phone || c.whatsapp || '919717056860').replace(/[^0-9]/g, ''),
              services:
                Array.isArray(c.services) && c.services.length > 0
                  ? c.services
                  : ['Verified Business Profile', 'Direct Customer Inquiries'],
              isVerified: c.status === 'approved',
              isClaimed: true,
            }));

            setListings((prev) => {
              const map = new Map<string, DirectoryListing>();
              dynamic.forEach((item) => map.set(item.id, item));
              prev.forEach((item) => {
                if (!map.has(item.id)) map.set(item.id, item);
              });
              return Array.from(map.values());
            });
          }
        }
      } catch (err) {
        console.error('Error hydrating search listings:', err);
      }
    };

    syncListings();
    window.addEventListener('bharatbn_claims_updated', syncListings);
    return () => window.removeEventListener('bharatbn_claims_updated', syncListings);
  }, []);

  let filtered = [...listings];
  if (city) {
    filtered = filtered.filter((b) => b.citySlug.toLowerCase().includes(city.toLowerCase()));
  }
  if (category) {
    filtered = filtered.filter((b) =>
      b.categorySlug.toLowerCase().includes(category.toLowerCase()) ||
      b.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query) ||
        b.city.toLowerCase().includes(query) ||
        b.services.some((s) => s.toLowerCase().includes(query)),
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Directory Search Results
        </h1>
        <SearchBar initialCity={city || 'mumbai'} initialQuery={q} compact={true} />
      </div>

      {/* Results & Filter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-semibold text-sm text-slate-900 uppercase tracking-wider">
              Filter by City
            </h3>
            <div className="space-y-2 text-sm">
              {['mumbai', 'noida', 'new-delhi', 'bengaluru', 'pune', 'hyderabad'].map((c) => (
                <Link
                  key={c}
                  href={`/search?city=${c}${category ? `&category=${category}` : ''}`}
                  className={`block px-3 py-1.5 rounded-lg capitalize transition ${
                    city === c
                      ? 'bg-[#F95700]/10 text-[#F95700] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c.replace('-', ' ')}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
            <span>Showing {filtered.length} listings</span>
            <span>Verified directory results</span>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <p className="text-base font-semibold text-slate-700">No matching businesses found</p>
              <p className="text-sm text-slate-500">
                Try searching in a different city or category, or browse the entire directory.
              </p>
              <Link
                href="/search"
                className="inline-block bg-[#07213A] text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Reset Search Filters
              </Link>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#F95700] hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#F95700] uppercase tracking-wider">
                        {item.category}
                      </span>
                      {item.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Audited &amp; Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Under Verification
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/biz/${item.slug}`}
                      className="text-lg sm:text-xl font-bold text-slate-900 hover:text-[#F95700] transition block"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>
                        {item.address}, {item.city}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/biz/${item.slug}`}
                    className="inline-flex items-center justify-center gap-1 bg-[#07213A] hover:bg-[#0c2a49] text-white text-xs font-semibold px-4 py-2 rounded-lg transition whitespace-nowrap self-start cursor-pointer shadow-xs"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.services.map((service) => (
                    <span
                      key={service}
                      className="text-[11px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-mono flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {item.phone}
                  </span>

                  <a
                    href={`https://wa.me/${item.whatsapp}?text=Hi%2C+I+found+${encodeURIComponent(item.name)}+on+BharatBN`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Inquire via WhatsApp
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-400">
          Loading directory search...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
