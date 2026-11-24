import { NextResponse } from 'next/server';
import { realMigratedBusinesses } from '@/data/migratedBusinesses';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase().trim() || '';
  const city = searchParams.get('city')?.toLowerCase().trim() || '';
  const category = searchParams.get('category')?.toLowerCase().trim() || '';
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  let results = realMigratedBusinesses;

  if (q) {
    results = results.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        (b.tags && b.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }

  if (city && city !== 'all' && !city.includes('all')) {
    results = results.filter((b) => b.city.toLowerCase().includes(city));
  }

  if (category && category !== 'all' && !category.includes('all')) {
    results = results.filter((b) => b.category.toLowerCase().includes(category));
  }

  return NextResponse.json({
    total: results.length,
    businesses: results.slice(0, limit),
  });
}
