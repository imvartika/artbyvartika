-- Vartika Collection: core schema
-- Run once in Supabase Dashboard > SQL Editor (or via `supabase db push` once linked).

create extension if not exists "pgcrypto";

-- ── categories ──────────────────────────────────────────────
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ── artworks (portfolio pieces + shop products) ────────────
create table if not exists artworks (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  title text not null,
  description text,
  images text[] not null default '{}',
  is_for_sale boolean not null default false,
  price numeric(10, 2),
  currency text not null default 'INR',
  status text not null default 'showcase'
    check (status in ('showcase', 'available', 'reserved', 'sold')),
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists artworks_category_idx on artworks(category_id);
create index if not exists artworks_status_idx on artworks(status);

-- ── order_requests (buy reservations + commission inquiries) ─
create table if not exists order_requests (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid references artworks(id) on delete set null,
  type text not null check (type in ('buy', 'commission')),
  buyer_name text not null,
  buyer_email text,
  buyer_phone text,
  message text,
  budget_range text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists order_requests_status_idx on order_requests(status);

-- ── admins (allow-list of auth.users who can manage the site) ─
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- security-definer helper so RLS policies can check admin status
-- without needing direct table grants
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- ── RLS ─────────────────────────────────────────────────────
alter table categories enable row level security;
alter table artworks enable row level security;
alter table order_requests enable row level security;
alter table admins enable row level security;

create policy "categories are publicly readable"
  on categories for select using (true);
create policy "admins manage categories"
  on categories for all using (is_admin()) with check (is_admin());

create policy "artworks are publicly readable"
  on artworks for select using (true);
create policy "admins manage artworks"
  on artworks for all using (is_admin()) with check (is_admin());

-- narrow, security-definer path for a buyer to self-reserve a listing
-- (avoids granting public UPDATE on the artworks table itself)
create or replace function reserve_artwork(target_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated boolean;
begin
  update artworks set status = 'reserved', updated_at = now()
  where id = target_id and status = 'available';
  updated := found;
  return updated;
end;
$$;

grant execute on function reserve_artwork(uuid) to anon, authenticated;

create policy "anyone can submit an order request"
  on order_requests for insert with check (true);
create policy "admins read order requests"
  on order_requests for select using (is_admin());
create policy "admins update order requests"
  on order_requests for update using (is_admin());
create policy "admins delete order requests"
  on order_requests for delete using (is_admin());

create policy "admins can see the admin list"
  on admins for select using (is_admin());

-- ── seed categories ─────────────────────────────────────────
insert into categories (slug, name, description, sort_order) values
  ('pottery', 'Pottery & Clay', 'Hand-shaped clay pieces, figures, and sculpts.', 1),
  ('painting', 'Paintings', 'Poster colour and watercolour on paper & canvas.', 2),
  ('sketches', 'Sketches', 'Hand-drawn portraits and sketches from photos.', 3),
  ('crochet', 'Crochet', 'Crocheted pieces, amigurumi, and wearables.', 4),
  ('photography', 'Photography', 'Original photography.', 5),
  ('other', 'New & Experimental', 'Whatever she picks up next.', 6)
on conflict (slug) do nothing;

-- ── storage bucket for artwork images ───────────────────────
insert into storage.buckets (id, name, public)
values ('artwork-images', 'artwork-images', true)
on conflict (id) do nothing;

create policy "public read artwork images"
  on storage.objects for select
  using (bucket_id = 'artwork-images');

create policy "admins upload artwork images"
  on storage.objects for insert
  with check (bucket_id = 'artwork-images' and is_admin());

create policy "admins update artwork images"
  on storage.objects for update
  using (bucket_id = 'artwork-images' and is_admin());

create policy "admins delete artwork images"
  on storage.objects for delete
  using (bucket_id = 'artwork-images' and is_admin());
