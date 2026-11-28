'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import allBlogsRaw from '@/data/allBlogs.json';

interface BlogPost {
  id: string;
  wpId: number;
  title: string;
  slug: string;
  date: string;
  formattedDate: string;
  author: string;
  category: string;
  categories: string[];
  tags: string[];
  excerpt: string;
  contentHtml: string;
  image: string;
  readTime: string;
}

const ALL_BLOGS: BlogPost[] = allBlogsRaw as BlogPost[];

export default function BlogIndexPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_BLOGS.forEach((b) => {
      const c = b.category || 'Business Insights';
      counts[c] = (counts[c] || 0) + 1;
    });
    return ['All', ...Object.keys(counts).sort((a, b) => counts[b] - counts[a])];
  }, []);

  const filteredBlogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_BLOGS.filter((b) => {
      const matchCat =
        selectedCategory === 'All' ||
        b.category === selectedCategory ||
        (b.categories || []).includes(selectedCategory);
      if (!matchCat) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        (b.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 pt-12 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#c2410c]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>BharatBN™ Editorial &amp; Business Journal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0d1c2f] tracking-tight">
            Insights, Guides &amp; Business Stories
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Explore {ALL_BLOGS.length} curated guides on local SEO, verified healthcare &amp; education hubs, manufacturing exports, and MSME growth across India.
          </p>

          {/* Search Input */}
          <div className="max-w-xl mx-auto pt-2">
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus-within:bg-white focus-within:border-[#c2410c] transition">
              <Search className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics, cities..."
                className="w-full bg-transparent text-sm text-[#0d1c2f] placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
            {categories.slice(0, 10).map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    active
                      ? 'bg-[#c2410c] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
            <p className="text-base font-bold text-slate-800">No articles found</p>
            <p className="text-xs text-slate-500">Try clearing your search or selecting All categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-[#c2410c]/50 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Featured Image */}
                  <div className="relative h-48 w-full bg-slate-100 border-b border-slate-100 overflow-hidden flex items-center justify-center">
                    {post.image && !failedImages[post.id] ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        onError={() => setFailedImages((prev) => ({ ...prev, [post.id]: true }))}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                        <BookOpen className="w-8 h-8 mb-1.5 text-slate-300" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {post.category}
                        </span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-white/95 text-[#0d1c2f] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs border border-slate-200/80">
                      {post.category}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {post.formattedDate}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="font-extrabold text-base sm:text-lg text-[#0d1c2f] group-hover:text-[#c2410c] transition line-clamp-2 leading-snug">
                      {post.title}
                    </h2>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#c2410c]">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
