-- Run this in the Supabase SQL editor to set up your schema

-- Profiles table (extends auth.users)
create table public.profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  email      text not null,
  is_pro     boolean not null default false,
  reminder_time time default '09:00',
  created_at timestamptz not null default now()
);

-- Check-ins table
create table public.checkins (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references public.profiles(id) on delete cascade not null,
  finished_yesterday  text not null,
  focus_today         text not null,
  blockers            text,
  created_at          timestamptz not null default now()
);

-- Indexes
create index checkins_user_id_created_at on public.checkins (user_id, created_at desc);

-- Row-level security: users only see their own data
alter table public.profiles  enable row level security;
alter table public.checkins  enable row level security;

create policy "own profile"
  on public.profiles for all
  using (auth.uid() = id);

create policy "own checkins"
  on public.checkins for all
  using (auth.uid() = user_id);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
