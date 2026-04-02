import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (for API routes)
export function getServerSupabase() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// ─── Database helpers ───────────────────────────────────────

export async function getAllSchemes({ category, state, search, page = 1, limit = 20 } = {}) {
  let query = supabase
    .from('schemes')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (category) query = query.eq('category', category);
  if (state) query = query.or(`state.eq.${state},is_central.eq.true`);
  if (search) query = query.ilike('name', `%${search}%`);

  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getSchemeBySlug(slug) {
  const { data, error } = await supabase
    .from('schemes')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  if (error) return null;
  return data;
}

export async function getSchemeCount() {
  const { count } = await supabase
    .from('schemes')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);
  return count || 0;
}

export async function saveAlert({ email, whatsapp, profile }) {
  const { error } = await supabase.from('alerts').insert({
    email: email || null,
    whatsapp: whatsapp || null,
    profile_json: profile,
    created_at: new Date().toISOString(),
  });
  if (error) throw error;
  return true;
}
