'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  ChevronDown,
  X,
  Sparkles,
  Building2,
  Stethoscope,
  GraduationCap,
  Car,
  UtensilsCrossed,
  Briefcase,
  Flame,
  ArrowRight,
  Laptop,
  Coffee,
  Zap,
  Scale,
  Tag,
  Store,
  Factory,
} from 'lucide-react';

interface SearchBarProps {
  initialCity?: string;
  initialCategory?: string;
  initialQuery?: string;
  compact?: boolean;
  darkBg?: boolean;
  onSearch?: (query: string, city: string, category: string) => void;
}

const CITIES = [
  { id: '', name: 'All India', state: 'IN', label: 'All India (120+ Cities)' },
  { id: 'bengaluru', name: 'Bengaluru', state: 'KA', label: 'Bengaluru (Tech Belt)' },
  { id: 'mumbai', name: 'Mumbai', state: 'MH', label: 'Mumbai MMR' },
  { id: 'new-delhi', name: 'Delhi-NCR', state: 'DL', label: 'Delhi-NCR Corridor' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'TS', label: 'Hyderabad Hub' },
  { id: 'pune', name: 'Pune', state: 'MH', label: 'Pune Industrial' },
  { id: 'chennai', name: 'Chennai', state: 'TN', label: 'Chennai Auto Belt' },
  { id: 'noida', name: 'Noida', state: 'UP', label: 'Noida / Greater Noida' },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'GJ', label: 'Ahmedabad, GJ' },
  { id: 'kolkata', name: 'Kolkata', state: 'WB', label: 'Kolkata, WB' },
];

const CATEGORIES = [
  { id: '', name: 'All Categories', Icon: Tag },
  { id: 'healthcare-clinics', name: 'Healthcare & Clinics', Icon: Stethoscope },
  { id: 'education-preschools', name: 'CBSE & ICSE Schools', Icon: GraduationCap },
  { id: 'retail-shopping', name: 'Franchise & Retail Hubs', Icon: Store },
  { id: 'manufacturing-industrial', name: 'Precision Manufacturing', Icon: Factory },
  { id: 'legal-financial-services', name: 'Legal & Chartered Acc.', Icon: Scale },
  { id: 'it-software-technology', name: 'IT & Software Services', Icon: Laptop },
  { id: 'food-confectionery', name: 'Artisan Food & Cafes', Icon: Coffee },
  { id: 'automobile-ev-showrooms', name: 'Automobile & EV Hubs', Icon: Zap },
  { id: 'real-estate-builders', name: 'Real Estate & Builders', Icon: Building2 },
];

const TRENDING_TAGS = [
  { label: 'Software & IT', q: 'software', Icon: Laptop, color: 'text-blue-500' },
  { label: 'Dentists & Dental Care', q: 'dental', Icon: Stethoscope, color: 'text-emerald-500' },
  { label: 'Artisan Roasters', q: 'artisan', Icon: Coffee, color: 'text-amber-600' },
  { label: 'Preschools & Daycares', q: 'preschool', Icon: GraduationCap, color: 'text-indigo-500' },
  { label: 'EV Dealerships', q: 'ev', Icon: Zap, color: 'text-emerald-500' },
  { label: 'CA & Auditing Desks', q: 'ca', Icon: Scale, color: 'text-orange-500' },
];

export default function SearchBar({
  initialCity = '',
  initialCategory = '',
  initialQuery = '',
  compact = false,
  darkBg = false,
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const [city, setCity] = useState(initialCity);
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const catDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync state if props change (e.g. navigation / url update)
  useEffect(() => {
    if (initialQuery !== undefined) setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (initialCity !== undefined) setCity(initialCity);
  }, [initialCity]);

  useEffect(() => {
    if (initialCategory !== undefined) setCategory(initialCategory);
  }, [initialCategory]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setIsCityOpen(false);
      }
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target as Node)) {
        setIsCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (onSearch) {
      onSearch(val, city, category);
    }
    const cleanQ = val.trim();
    const params = new URLSearchParams();
    if (cleanQ) params.set('q', cleanQ);
    if (city && city !== 'all') params.set('city', city);
    if (category) params.set('category', category);
    const targetUrl = `/search${params.toString() ? `?${params.toString()}` : ''}`;
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', targetUrl);
    }
  };

  const handleSearch = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const cleanQ = query.trim();
    const params = new URLSearchParams();
    if (cleanQ) params.set('q', cleanQ);
    if (city && city !== 'all') params.set('city', city);
    if (category) params.set('category', category);

    if (onSearch) {
      onSearch(cleanQ, city, category);
    }

    const targetUrl = `/search${params.toString() ? `?${params.toString()}` : ''}`;
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', targetUrl);
    }
    router.push(targetUrl);
  };

  const handleTagClick = (tagQuery: string) => {
    setQuery(tagQuery);
    const params = new URLSearchParams();
    params.set('q', tagQuery);
    if (city && city !== 'all') params.set('city', city);
    if (category) params.set('category', category);

    if (onSearch) {
      onSearch(tagQuery, city, category);
    }

    const targetUrl = `/search?${params.toString()}`;
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', targetUrl);
    }
    router.push(targetUrl);
  };

  const selectedCityObj = CITIES.find((c) => c.id === city) || CITIES[0];
  const selectedCatObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Multi-Segment Integrated Search Console (Stitch Design) */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-40"
      >
        <form
          onSubmit={handleSearch}
          className="relative z-40 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 p-2 sm:p-2.5 grid grid-cols-1 md:grid-cols-12 gap-1.5 items-center"
        >
          {/* 1. City Hub Dropdown Selector */}
          <div ref={cityDropdownRef} className="relative md:col-span-3">
            <button
              type="button"
              onClick={() => {
                setIsCityOpen(!isCityOpen);
                setIsCatOpen(false);
              }}
              className="w-full flex items-center bg-slate-50 hover:bg-slate-100/90 rounded-xl px-3.5 py-2.5 transition-colors group cursor-pointer text-left"
            >
              <MapPin className="w-5 h-5 text-[#c2410c] mr-2.5 flex-shrink-0" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                  City Hub
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#0d1c2f] truncate leading-tight mt-0.5">
                  {selectedCityObj.label}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform ml-auto flex-shrink-0 ${
                  isCityOpen ? 'rotate-180 text-[#c2410c]' : ''
                }`}
              />
            </button>

            {/* City Dropdown Menu */}
            <AnimatePresence>
              {isCityOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="absolute left-0 top-[56px] w-64 sm:w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-[100] text-left"
                >
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 flex items-center justify-between">
                    <span>Select City Hub</span>
                    <span className="text-[#c2410c] font-bold">India</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto pr-1 space-y-0.5 py-1">
                    {CITIES.map((c) => {
                      const isActive = c.id === city;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setCity(c.id);
                            setIsCityOpen(false);
                            if (onSearch) {
                              onSearch(query.trim(), c.id, category);
                            }
                            const params = new URLSearchParams();
                            if (query.trim()) params.set('q', query.trim());
                            if (c.id && c.id !== 'all') params.set('city', c.id);
                            if (category) params.set('category', category);
                            const targetUrl = `/search${params.toString() ? `?${params.toString()}` : ''}`;
                            if (typeof window !== 'undefined') {
                              window.history.replaceState(null, '', targetUrl);
                            }
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                            isActive
                              ? 'bg-orange-50 text-[#c2410c] font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#c2410c]' : 'text-slate-400'}`} />
                            <span className="truncate">{c.label}</span>
                          </div>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c] flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Sector / Category Selector */}
          <div ref={catDropdownRef} className="relative md:col-span-3">
            <button
              type="button"
              onClick={() => {
                setIsCatOpen(!isCatOpen);
                setIsCityOpen(false);
              }}
              className="w-full flex items-center bg-slate-50 hover:bg-slate-100/90 rounded-xl px-3.5 py-2.5 transition-colors group cursor-pointer text-left"
            >
              <Building2 className="w-5 h-5 text-[#006c4a] mr-2.5 flex-shrink-0" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                  Sector
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#0d1c2f] truncate leading-tight mt-0.5">
                  {selectedCatObj.name}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform ml-auto flex-shrink-0 ${
                  isCatOpen ? 'rotate-180 text-[#006c4a]' : ''
                }`}
              />
            </button>

            {/* Category Dropdown Menu */}
            <AnimatePresence>
              {isCatOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="absolute left-0 top-[56px] w-64 sm:w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-[100] text-left"
                >
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    Select Industry Sector
                  </div>
                  <div className="max-h-64 overflow-y-auto pr-1 space-y-0.5 py-1">
                    {CATEGORIES.map((cat) => {
                      const isActive = cat.id === category;
                      const CatIcon = cat.Icon;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setCategory(cat.id);
                            setIsCatOpen(false);
                            if (onSearch) {
                              onSearch(query.trim(), city, cat.id);
                            }
                            const params = new URLSearchParams();
                            if (query.trim()) params.set('q', query.trim());
                            if (city && city !== 'all') params.set('city', city);
                            if (cat.id) params.set('category', cat.id);
                            const targetUrl = `/search${params.toString() ? `?${params.toString()}` : ''}`;
                            if (typeof window !== 'undefined') {
                              window.history.replaceState(null, '', targetUrl);
                            }
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                            isActive
                              ? 'bg-emerald-50 text-[#006c4a] font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <CatIcon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#006c4a]' : 'text-slate-400'}`} />
                            <span className="truncate">{cat.name}</span>
                          </div>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a] flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Enterprise or Service Search Input */}
          <div className="relative md:col-span-4 flex items-center bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/10 rounded-xl px-3.5 py-2.5 transition-all text-left border border-transparent">
            <Search className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                Enterprise or Service
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder="e.g. Maxillofacial, EuroKids, CNC Lathe"
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#0d1c2f] placeholder:text-slate-400/80 focus:outline-none truncate mt-0.5"
              />
            </div>
            {query && (
              <button
                type="button"
                onClick={() => {
                  handleQueryChange('');
                  inputRef.current?.focus();
                }}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition ml-1 flex-shrink-0 cursor-pointer"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 4. High-Impact Search CTA Button */}
          <div className="md:col-span-2 w-full">
            <button
              type="submit"
              onClick={handleSearch}
              className="w-full h-[52px] bg-[#c2410c] hover:bg-[#9b2f00] text-white rounded-xl flex items-center justify-center gap-2 font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.99] cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search Hub</span>
            </button>
          </div>
        </form>
      </motion.div>

      {/* Trending Search Badges Row (Single Line with Real Lucide Icons) */}
      {!compact && (
        <div className="w-full overflow-x-auto no-scrollbar pt-1">
          <div className="flex items-center justify-start lg:justify-center gap-2 text-xs min-w-max pb-1">
            <span className={`flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider shrink-0 mr-1 ${darkBg ? 'text-[#fb923c]' : 'text-[#c2410c]'}`}>
              <Flame className={`w-4 h-4 ${darkBg ? 'text-[#fb923c]' : 'text-[#c2410c]'}`} /> Trending Now:
            </span>
            {TRENDING_TAGS.map((tag) => {
              const TagIcon = tag.Icon;
              return (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => handleTagClick(tag.q)}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 transition-colors text-slate-800 flex items-center gap-1.5 shadow-xs text-xs font-semibold cursor-pointer border border-slate-200/60 shrink-0 whitespace-nowrap active:scale-95"
                >
                  <TagIcon className={`w-3.5 h-3.5 ${tag.color}`} />
                  <span>{tag.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
