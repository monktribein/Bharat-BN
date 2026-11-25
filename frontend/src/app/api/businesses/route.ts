import { NextResponse } from 'next/server';
import { realMigratedBusinesses } from '@/data/migratedBusinesses';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase().trim() || '';
  const city = searchParams.get('city')?.toLowerCase().trim() || '';
  const category = searchParams.get('category')?.toLowerCase().trim() || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
  const offset = (page - 1) * limit;

  let results = realMigratedBusinesses;

  if (q) {
    const tokens = q
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2 && !['and', 'for', 'the', 'with', 'in'].includes(t));

    results = results.filter((b) => {
      const bServices = (b.services || []).join(' ').toLowerCase();
      const bTags = (b.tags || []).join(' ').toLowerCase();
      const text = `${b.name} ${b.category} ${b.city} ${b.address || ''} ${b.slug} ${bServices} ${bTags}`.toLowerCase();
      if (text.includes(q)) return true;
      if (tokens.length > 0 && tokens.some((token) => text.includes(token))) return true;
      return false;
    });
  }

  if (city && city !== 'all' && !city.includes('all')) {
    results = results.filter(
      (b) =>
        b.city.toLowerCase().includes(city) ||
        (b.citySlug && b.citySlug.toLowerCase().includes(city))
    );
  }

  if (category && category !== 'all' && !category.includes('all')) {
    results = results.filter(
      (b) =>
        b.category.toLowerCase().includes(category) ||
        (b.categorySlug && b.categorySlug.toLowerCase().includes(category))
    );
  }

  return NextResponse.json({
    total: results.length,
    page,
    limit,
    totalPages: Math.ceil(results.length / limit),
    businesses: results.slice(offset, offset + limit),
  });
}
