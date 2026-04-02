-- ============================================================
--  YojanaDarpan - Complete Database Schema
--  Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── SCHEMES TABLE ─────────────────────────────────────────
create table if not exists schemes (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null,
  slug             text unique not null,
  ministry         text,
  category         text not null,
  benefit_type     text,
  benefit_amount   text,
  benefit_value    bigint default 0,
  description      text,
  eligibility_json jsonb default '{}'::jsonb,
  documents_json   jsonb default '[]'::jsonb,
  how_to_apply_json jsonb default '[]'::jsonb,
  tags             text[] default '{}',
  apply_url        text,
  is_central       boolean default true,
  state            text,
  last_date        text,
  is_active        boolean default true,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Index for fast search
create index if not exists idx_schemes_category on schemes(category);
create index if not exists idx_schemes_slug on schemes(slug);
create index if not exists idx_schemes_is_active on schemes(is_active);
create index if not exists idx_schemes_state on schemes(state);
create index if not exists idx_schemes_name_search on schemes using gin(to_tsvector('english', name || ' ' || description));

-- ─── ALERTS TABLE ──────────────────────────────────────────
create table if not exists alerts (
  id           uuid primary key default uuid_generate_v4(),
  email        text,
  whatsapp     text,
  profile_json jsonb default '{}'::jsonb,
  is_active    boolean default true,
  created_at   timestamptz default now(),
  constraint email_or_whatsapp check (email is not null or whatsapp is not null)
);

create index if not exists idx_alerts_email on alerts(email);
create index if not exists idx_alerts_whatsapp on alerts(whatsapp);

-- ─── SEARCHES TABLE (analytics) ───────────────────────────
create table if not exists searches (
  id              uuid primary key default uuid_generate_v4(),
  profile_json    jsonb default '{}'::jsonb,
  results_count   int default 0,
  total_benefit   bigint default 0,
  created_at      timestamptz default now()
);

-- ─── BLOG POSTS TABLE ──────────────────────────────────────
create table if not exists blog_posts (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  slug        text unique not null,
  excerpt     text,
  content     text,
  category    text,
  author      text default 'YojanaDarpan Team',
  published   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists idx_blog_slug on blog_posts(slug);
create index if not exists idx_blog_published on blog_posts(published);

-- ─── PREMIUM SUBSCRIBERS ───────────────────────────────────
create table if not exists premium_subscribers (
  id              uuid primary key default uuid_generate_v4(),
  email           text unique not null,
  plan            text default 'basic',  -- basic, pro
  amount_paid     int default 0,
  valid_until     date,
  payment_ref     text,
  created_at      timestamptz default now()
);

-- ─── UPDATED_AT trigger ────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger schemes_updated_at
  before update on schemes
  for each row execute function update_updated_at();

create trigger blog_updated_at
  before update on blog_posts
  for each row execute function update_updated_at();

-- ─── ROW LEVEL SECURITY ────────────────────────────────────
alter table schemes enable row level security;
alter table alerts enable row level security;
alter table searches enable row level security;
alter table blog_posts enable row level security;
alter table premium_subscribers enable row level security;

-- Public read access for schemes and published blog posts
create policy "Public read schemes"
  on schemes for select
  using (is_active = true);

create policy "Public read blog"
  on blog_posts for select
  using (published = true);

-- Anyone can insert alerts and searches (anonymous signups)
create policy "Anyone can signup for alerts"
  on alerts for insert
  with check (true);

create policy "Anyone can log searches"
  on searches for insert
  with check (true);

-- Service role has full access (for scraper and API routes)
-- This is automatic for service role key in Supabase

-- ─── ANALYTICS VIEW ────────────────────────────────────────
create or replace view daily_stats as
select
  date_trunc('day', created_at) as day,
  count(*) as searches,
  avg(results_count)::int as avg_matches,
  avg(total_benefit)::bigint as avg_benefit
from searches
group by 1
order by 1 desc;

-- ─── SAMPLE DATA: Insert first 5 schemes ──────────────────
-- Run this to seed initial data
insert into schemes (name, slug, ministry, category, benefit_type, benefit_amount, benefit_value, description, eligibility_json, tags, apply_url, is_central)
values
  (
    'PM Kisan Samman Nidhi',
    'pm-kisan-samman-nidhi',
    'Ministry of Agriculture',
    'Agriculture',
    'cash',
    '₹6,000/year',
    6000,
    'Direct income support of ₹6,000 per year to small and marginal farmers.',
    '{"occupation":["farmer"],"income_max":300000,"age_min":18,"land_required":true,"states":"all","categories":["GEN","SC","ST","OBC"]}'::jsonb,
    ARRAY['Farmer','Direct Benefit','Cash Transfer'],
    'https://pmkisan.gov.in',
    true
  ),
  (
    'PM Awas Yojana (Urban)',
    'pm-awas-yojana-urban',
    'Ministry of Housing and Urban Affairs',
    'Housing',
    'subsidy',
    'Up to ₹2.67 Lakh subsidy',
    267000,
    'Credit linked subsidy on home loans for EWS/LIG/MIG households.',
    '{"occupation":["any"],"income_max":1800000,"age_min":18,"no_pucca_house":true,"states":"all","categories":["GEN","SC","ST","OBC"]}'::jsonb,
    ARRAY['Housing','Subsidy','Home Loan'],
    'https://pmaymis.gov.in',
    true
  )
on conflict (slug) do nothing;
