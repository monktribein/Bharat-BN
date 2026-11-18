import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import { MapPin, Phone, MessageSquare, CheckCircle, ShieldCheck, ArrowRight, Star } from 'lucide-react';

const mockListings = [
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
    phone: '+919820012345',
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
    phone: '+919845012345',
    whatsapp: '919845012345',
    services: ['Toddler Care', 'Pre-K Program', 'Daycare', 'Activity Club'],
    isVerified: true,
    isClaimed: false,
  },
];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; city?: string }>;
}) {
  const { q = '', category = '', city = '' } = await searchParams;

  let filtered = [...mockListings];
  if (city) {
    filtered = filtered.filter((b) => b.citySlug.toLowerCase() === city.toLowerCase());
  }
  if (category) {
    filtered = filtered.filter((b) => b.categorySlug.toLowerCase() === category.toLowerCase());
  }
  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
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
              {['mumbai', 'new-delhi', 'bengaluru', 'pune', 'hyderabad'].map((c) => (
                <Link
                  key={c}
                  href={`/search?city=${c}${category ? `&category=${category}` : ''}`}
                  className={`block px-3 py-1.5 rounded-lg capitalize transition ${
                    city === c
                      ? 'bg-brand-50 text-brand-700 font-semibold'
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
            <span>Showing {filtered.length} verified businesses</span>
            <span>Deterministic relevance sort</span>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <p className="text-base font-semibold text-slate-700">No matching businesses found</p>
              <p className="text-sm text-slate-500">
                Try searching in a different city or category, or browse the entire directory.
              </p>
              <Link
                href="/search"
                className="inline-block bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Reset Search Filters
              </Link>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-400 hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
                        {item.category}
                      </span>
                      {item.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Audited &amp; Verified
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/biz/${item.slug}`}
                      className="text-lg sm:text-xl font-bold text-slate-900 hover:text-brand-600 transition block"
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
                    className="inline-flex items-center justify-center gap-1 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition whitespace-nowrap self-start"
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
                    href={`https://wa.me/${(item.phone).replace(/[^0-9]/g, '')}?text=Hi%2C+I+found+${encodeURIComponent(item.name)}+on+BharatBN`}
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
