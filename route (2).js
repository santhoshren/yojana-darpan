import { NextResponse } from 'next/server';
import { matchSchemes, calculateTotalBenefit } from '@/lib/eligibility';

export async function POST(request) {
  try {
    const profile = await request.json();

    // Validate required fields
    if (!profile.age || !profile.state) {
      return NextResponse.json(
        { error: 'Age and state are required' },
        { status: 400 }
      );
    }

    // Run matching engine
    const matched = matchSchemes(profile);
    const totalBenefit = calculateTotalBenefit(matched);

    // Optional: log search to Supabase for analytics
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      await supabase.from('searches').insert({
        profile_json: profile,
        results_count: matched.length,
        total_benefit: totalBenefit,
        created_at: new Date().toISOString(),
      });
    } catch {
      // Analytics failure is non-blocking
    }

    return NextResponse.json({
      matched: matched.length,
      totalBenefit,
      schemes: matched,
    });
  } catch (err) {
    console.error('Eligibility API error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
