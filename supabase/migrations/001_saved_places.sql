-- ==============================================================================
-- Mapporae Database Migration: Profiles, Place Lists & Cloud Saved Places
-- ==============================================================================

-- 1. Create Profiles table linked to Supabase Auth users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- 2. Create Place Lists table (Custom & Default collections per user)
create table if not exists public.place_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  icon_name text default 'Bookmark',
  created_at timestamptz default now()
);

-- 3. Create Saved Places table (Items saved inside user lists)
create table if not exists public.saved_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null,
  list_id uuid not null references public.place_lists(id) on delete cascade,
  notes text,
  saved_at timestamptz default now(),
  constraint unique_user_place_list unique (user_id, place_id, list_id)
);

-- ==============================================================================
-- Row Level Security (RLS) & Strict Scoped Policies (Optimized InitPlan)
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.place_lists enable row level security;
alter table public.saved_places enable row level security;

-- Profiles Policies
create policy "Users can view their own profile"
  on public.profiles for select
  using ((select auth.uid()) = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can delete their own profile"
  on public.profiles for delete
  using ((select auth.uid()) = id);

-- Place Lists Policies
create policy "Users can view their own lists"
  on public.place_lists for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own lists"
  on public.place_lists for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own lists"
  on public.place_lists for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own lists"
  on public.place_lists for delete
  using ((select auth.uid()) = user_id);

-- Saved Places Policies
create policy "Users can view their saved places"
  on public.saved_places for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert their saved places"
  on public.saved_places for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update their saved places"
  on public.saved_places for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their saved places"
  on public.saved_places for delete
  using ((select auth.uid()) = user_id);

-- ==============================================================================
-- Automatic Profile Provisioning Trigger on Signup
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Revoke direct REST RPC execution for security hardening
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Drop trigger if already exists to ensure idempotency
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- Performance & Lookup Indexes (Covering Foreign Keys)
-- ==============================================================================

create index if not exists idx_place_lists_user_id on public.place_lists(user_id);
create index if not exists idx_saved_places_user_list on public.saved_places(user_id, list_id);
create index if not exists idx_saved_places_user_place on public.saved_places(user_id, place_id);
create index if not exists idx_saved_places_list_id on public.saved_places(list_id);
