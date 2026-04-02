import { NextResponse } from 'next/server';
import { SCHEMES } from '@/data/schemes';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const state = searchParams.get('state') || '';
  const limit = parseInt(searchParams.get('limit') || '20');
  const page = parseInt(searchParams.get('page') || '1');

  let results = [...SCHEMES];

  // Filter by search query
  if (q) {
    const lower = q.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.description.toLowerCase().includes(lower) ||
        s.tags.some((t) => t.toLowerCase().includes(lower)) ||
        s.category.toLowerCase().includes(lower)
    );
  }

  // Filter by category
  if (category) {
    results = results.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by state (state schemes + central)
  if (state) {
    results = results.filter(
      (s) => s.is_central || s.state?.toLowerCase() === state.toLowerCase()
    );
  }

  // Pagination
  const total = results.length;
  const start = (page - 1) * limit;
  const data = results.slice(start, start + limit);

  return NextResponse.json({
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
