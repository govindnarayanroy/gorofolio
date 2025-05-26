-- Create resumes table
create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create portfolios table
create table if not exists portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  url text,
  resume_id uuid references resumes(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table resumes enable row level security;
alter table portfolios enable row level security;

-- Policies for resumes
drop policy if exists "Allow user to read their own resumes" on resumes;
drop policy if exists "Allow user to insert their own resumes" on resumes;
drop policy if exists "Allow user to update their own resumes" on resumes;
drop policy if exists "Allow user to delete their own resumes" on resumes;

create policy "Allow user to read their own resumes"
  on resumes for select
  using (auth.uid() = user_id);

create policy "Allow user to insert their own resumes"
  on resumes for insert
  with check (auth.uid() = user_id);

create policy "Allow user to update their own resumes"
  on resumes for update
  using (auth.uid() = user_id);

create policy "Allow user to delete their own resumes"
  on resumes for delete
  using (auth.uid() = user_id);

-- Policies for portfolios
drop policy if exists "Allow user to read their own portfolios" on portfolios;
drop policy if exists "Allow user to insert their own portfolios" on portfolios;
drop policy if exists "Allow user to update their own portfolios" on portfolios;
drop policy if exists "Allow user to delete their own portfolios" on portfolios;

create policy "Allow user to read their own portfolios"
  on portfolios for select
  using (auth.uid() = user_id);

create policy "Allow user to insert their own portfolios"
  on portfolios for insert
  with check (auth.uid() = user_id);

create policy "Allow user to update their own portfolios"
  on portfolios for update
  using (auth.uid() = user_id);

create policy "Allow user to delete their own portfolios"
  on portfolios for delete
  using (auth.uid() = user_id);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add triggers for updated_at
drop trigger if exists update_resumes_updated_at on resumes;
drop trigger if exists update_portfolios_updated_at on portfolios;

create trigger update_resumes_updated_at
  before update on resumes
  for each row
  execute function update_updated_at_column();

create trigger update_portfolios_updated_at
  before update on portfolios
  for each row
  execute function update_updated_at_column(); 