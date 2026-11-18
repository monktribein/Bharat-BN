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
} from 'lucide-react';

interface SearchBarProps {
  initialCity?: string;
  initialCategory?: string;
  initialQuery?: string;
  compact?: boolean;
}

const CITIES = [
  { id: 'mumbai', name: 'Mumbai', state: 'MH', label: 'Mumbai, MH' },
  { id: 'new-delhi', name: 'Delhi NCR', state: 'DL', label: 'Delhi NCR' },
  { id: 'bengaluru', name: 'Bengaluru', state: 'KA', label: 'Bengaluru, KA' },
  { id: 'pune', name: 'Pune', state: 'MH', label: 'Pune, MH' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'TS', label: 'Hyderabad, TS' },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'GJ', label: 'Ahmedabad, GJ' },
  { id: 'kolkata', name: 'Kolkata', state: 'WB', label: 'Kolkata, WB' },
  { id: 'chennai', name: 'Chennai', state: 'TN', label: 'Chennai, TN' },
];

const CATEGORIES = [
  { id: '', name: 'All Categories', icon: '🏷️' },
  { id: 'it-software-technology', name: 'IT & Software Services', icon: '💻' },
  { id: 'healthcare-clinics', name: 'Healthcare & Clinics', icon: '🏥' },
  { id: 'food-confectionery', name: 'Food & Confectionery', icon: '🍫' },
  { id: 'education-preschools', name: 'Preschools & Education', icon: '🎓' },
  { id: 'automobile-ev-showrooms', name: 'Automobile & EV', icon: '⚡' },
  { id: 'restaurants-cafes', name: 'Restaurants & Cafes', icon: '🍽️' },
  { id: 'legal-financial-services', name: 'CA & Legal Services', icon: '⚖️' },
  { id: 'real-estate-builders', name: 'Real Estate & Builders', icon: '🏢' },
  { id: 'manufacturing-industrial', name: 'Manufacturing & Wholesale', icon: '🏭' },
  { id: 'digital-marketing-media', name: 'Digital Marketing & Media', icon: '📢' },
  { id: 'retail-shopping', name: 'Retail & Supermarkets', icon: '🛍️' },
  { id: 'home-services-maintenance', name: 'Home & Repair Services', icon: '🔧' },
  { id: 'beauty-salons-spas', name: 'Beauty & Spas', icon: '✨' },
  { id: 'logistics-packers-movers', name: 'Logistics & Packers', icon: '🚚' },
];

const TRENDING_TAGS = [
  { label: 'Software & IT', q: 'software', icon: '💻' },
  { label: 'Dentists', q: 'dental', icon: '🦷' },
  { label: 'Artisan Chocolates', q: 'choco', icon: '🍫' },
  { label: 'Preschools', q: 'preschool', icon: '🎓' },
  { label: 'EV Showrooms', q: 'ev', icon: '⚡' },
  { label: 'CA & Tax Experts', q: 'ca', icon: '⚖️' },
];

export default function SearchBar({
  initialCity = 'mumbai',
  initialCategory = '',
  initialQuery = '',
  compact = false,
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

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (city) params.set('city', city);
    if (category) params.set('category', category);
    router.push(`/search?${params.toString()}`);
  };

  const handleTagClick = (tagQuery: string) => {
    setQuery(tagQuery);
    const params = new URLSearchParams();
    params.set('q', tagQuery);
    if (city) params.set('city', city);
    if (category) params.set('category', category);
    router.push(`/search?${params.toString()}`);
  };

  const selectedCityObj = CITIES.find((c) => c.id === city) || CITIES[0];
  const selectedCatObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-3.5">
      {/* Cool Interactive Command Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-40"
      >
        {/* Ambient Gradient Glow Background */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F95700]/30 via-brandGold-400/20 to-[#07213A]/20 rounded-full blur-md opacity-40 group-hover:opacity-75 transition duration-300 pointer-events-none -z-10" />

        <form
          onSubmit={handleSearch}
          className="relative z-40 bg-white/95 backdrop-blur-xl rounded-full border border-slate-200/90 shadow-[0_12px_36px_-10px_rgba(7,33,58,0.14),0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_46px_-10px_rgba(7,33,58,0.2)] focus-within:shadow-[0_20px_50px_-10px_rgba(249,87,0,0.25)] focus-within:border-[#F95700]/80 transition-all duration-300 p-1.5 sm:p-2 flex flex-col md:flex-row items-center gap-1 sm:gap-2"
        >
          {/* 1. Location Pill Selector */}
          <div ref={cityDropdownRef} className="relative w-full md:w-auto flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsCityOpen(!isCityOpen);
                setIsCatOpen(false);
              }}
              className="w-full md:w-auto h-12 px-4 rounded-full bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/70 hover:border-slate-300 flex items-center justify-between md:justify-start gap-2.5 transition text-left group"
            >
              <div className="w-7 h-7 rounded-full bg-[#F95700]/10 flex items-center justify-center text-[#F95700] group-hover:bg-[#F95700] group-hover:text-white transition">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 leading-none">
                  City Hub
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 leading-tight mt-0.5">
                  {selectedCityObj.label}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 ml-1 ${
                  isCityOpen ? 'rotate-180 text-[#F95700]' : ''
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
                  className="absolute left-0 top-[56px] w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-[100] text-left"
                >
                  <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 flex items-center justify-between">
                    <span>Select Local Hub</span>
                    <span className="text-[#F95700] font-bold">India</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-0.5 py-1">
                    {CITIES.map((c) => {
                      const isActive = c.id === city;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setCity(c.id);
                            setIsCityOpen(false);
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                            isActive
                              ? 'bg-[#F95700]/10 text-[#F95700] font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">📍</span>
                            <span>{c.label}</span>
                          </div>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F95700]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hairline Divider (Desktop) */}
          <div className="hidden md:block h-7 w-[1px] bg-slate-200/80 mx-1 flex-shrink-0" />

          {/* 2. Category Selector */}
          <div ref={catDropdownRef} className="relative w-full md:w-auto flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsCatOpen(!isCatOpen);
                setIsCityOpen(false);
              }}
              className="w-full md:w-auto h-12 px-3.5 rounded-full hover:bg-slate-50 transition flex items-center justify-between md:justify-start gap-2 text-left group"
            >
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:text-slate-900 transition">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col text-left max-w-[130px] sm:max-w-[150px]">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 leading-none">
                  Category
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-tight mt-0.5 truncate">
                  {selectedCatObj.name}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 ${
                  isCatOpen ? 'rotate-180 text-[#F95700]' : ''
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
                  className="absolute left-0 top-[56px] w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-[100] text-left"
                >
                  <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    Filter by Industry
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-0.5 py-1">
                    {CATEGORIES.map((cat) => {
                      const isActive = cat.id === category;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setCategory(cat.id);
                            setIsCatOpen(false);
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                            isActive
                              ? 'bg-[#F95700]/10 text-[#F95700] font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span className="truncate">{cat.name}</span>
                          </div>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F95700]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hairline Divider (Desktop) */}
          <div className="hidden md:block h-7 w-[1px] bg-slate-200/80 mx-1 flex-shrink-0" />

          {/* 3. Main Search Input Field */}
          <div className="relative flex-1 w-full flex items-center px-3 py-1">
            <Search className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clinic, preschool, chocolates, brand or service..."
              className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition mr-1 flex-shrink-0"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 4. High-Craft Saffron Search Button */}
          <div className="w-full md:w-auto flex-shrink-0 p-0.5">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 450, damping: 24 }}
              className="w-full md:w-auto h-12 px-7 rounded-full bg-gradient-to-r from-[#F95700] via-[#FF6200] to-[#E54800] text-white font-extrabold text-sm tracking-wide shadow-md shadow-[#F95700]/30 hover:shadow-lg hover:shadow-[#F95700]/45 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search</span>
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Modern Trending Pills */}
      {!compact && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-1">
            <Flame className="w-3.5 h-3.5 text-[#F95700]" />
            <span className="tracking-wide text-slate-600">Trending Now:</span>
          </div>

          {TRENDING_TAGS.map((tag) => (
            <motion.button
              key={tag.label}
              type="button"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleTagClick(tag.q)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 hover:bg-white border border-slate-200/90 hover:border-[#F95700]/50 text-xs font-semibold text-slate-700 hover:text-[#F95700] transition shadow-xs hover:shadow-sm"
            >
              <span>{tag.icon}</span>
              <span>{tag.label}</span>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
