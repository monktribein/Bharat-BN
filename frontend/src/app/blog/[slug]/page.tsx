import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Tag } from 'lucide-react';
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

export async function generateStaticParams() {
  return ALL_BLOGS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = decodeURIComponent(slug || '').toLowerCase().trim();
  const post = ALL_BLOGS.find((b) => b.slug.toLowerCase() === cleanSlug);
  if (!post) {
    return { title: 'Article Not Found | BharatBN™' };
  }
  return {
    title: `${post.title} | BharatBN™ Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cleanSlug = decodeURIComponent(slug || '').toLowerCase().trim();
  const post = ALL_BLOGS.find((b) => b.slug.toLowerCase() === cleanSlug);

  if (!post) {
    notFound();
  }

  const related = ALL_BLOGS.filter(
    (b) => b.slug !== post.slug && (b.category === post.category || true)
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 flex-wrap">
          <Link href="/" className="hover:text-[#c2410c] transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#c2410c] transition">
            Blog
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-semibold truncate max-w-xs sm:max-w-md">
            {post.title}
          </span>
        </div>

        {/* Article Header */}
        <header className="space-y-4">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#c2410c]">
            {post.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0d1c2f] tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500 font-medium pt-1">
            <span className="inline-flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {post.formattedDate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {post.readTime}
            </span>
          </div>
        </header>

        {/* Featured Image (Uncropped) */}
        {post.image && (
          <div className="w-full rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-xs flex items-center justify-center p-2 sm:p-4 max-h-[460px]">
            <img
              src={post.image}
              alt={post.title}
              className="max-h-[420px] w-auto object-contain rounded-xl"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-10">
          <div
            className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-[#0d1c2f] [&_h1]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#0d1c2f] [&_h2]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#0d1c2f] [&_h3]:mt-4 [&_p]:leading-relaxed [&_a]:text-[#c2410c] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5 [&_img]:rounded-xl [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto [&_blockquote]:border-l-4 [&_blockquote]:border-[#c2410c] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Back Link */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c2410c] hover:text-[#9b2f00] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </Link>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="pt-8 border-t border-slate-200/80 space-y-4">
            <h2 className="text-lg font-extrabold text-[#0d1c2f]">More from BharatBN™ Blog</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#c2410c]/50 hover:shadow-md transition flex flex-col justify-between space-y-2 group"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#c2410c]">
                      {r.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#0d1c2f] group-hover:text-[#c2410c] line-clamp-2">
                      {r.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 group-hover:text-[#c2410c]">
                    <span>Read</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
