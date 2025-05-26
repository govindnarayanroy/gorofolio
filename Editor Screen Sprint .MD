Sprint: Resume Editor & Cross-Page Connection (with Database Schema)

Objective

Enable a seamless workflow where users can upload a resume, ingest and edit all data fields via an editor page, and then generate/download a PDF or publish a portfolio site. Ensure that dashboard links route users based on their data state (first-time or returning). Connect everything to Supabase for data persistence, and include the full database schema for backend setup.

⸻

Core Flow
	1.	Upload Resume: User uploads a PDF/DOCX resume. File is parsed and all fields extracted.
	2.	Editor Page: Parsed data pre-fills an editor page (see data fields below). User edits/adds any info, cross-links profiles (LinkedIn, GitHub, etc.).
	•	Save button: Saves changes to Supabase.
	•	Next button: Proceeds to Portfolio Builder preview page.
	3.	Portfolio Builder Page: Displays a live preview. User can:
	•	Download PDF
	•	Publish Portfolio (host on Vercel or similar)
	4.	Dashboard Routing: Dashboard Resume/Portfolio links:
	•	Route to editor if no data exists (first time)
	•	Route to portfolio preview if already created (with Edit option)
	5.	Persistence & Edit Flow: Edits anywhere update the user’s single source of truth. If data already exists, user can update or view current info.

⸻

Data Fields (Editor & Portfolio)
	•	Avatar/Initials: User profile picture or initials
	•	Name: Full name
	•	Title: Professional headline
	•	External Links: GitHub, LinkedIn, Portfolio, Twitter, others
	•	Summary: Short intro/professional summary
	•	Experience:
	•	Job title
	•	Company name
	•	Date range
	•	Key achievements (bullet points)
	•	Education:
	•	Degree
	•	Institution
	•	Date range
	•	Skills: Array/list of skills (badges)
	•	Action Buttons: Download PDF, Publish Portfolio

⸻

Supabase Connection (Backend Persistence)
	•	Store resume data as a single JSON field for flexibility, or normalized if preferred
	•	Store published portfolio data (link to resume)
	•	All data CRUD operations via Supabase client
	•	Only authenticated users can create/edit/view their data

⸻

Database Schema (SQL)

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
delete policy if exists "Allow user to read their own resumes" on resumes;
delete policy if exists "Allow user to insert their own resumes" on resumes;
delete policy if exists "Allow user to update their own resumes" on resumes;
create policy "Allow user to read their own resumes"
  on resumes for select
  using (auth.uid() = user_id);

create policy "Allow user to insert their own resumes"
  on resumes for insert
  with check (auth.uid() = user_id);

create policy "Allow user to update their own resumes"
  on resumes for update
  using (auth.uid() = user_id);

-- Policies for portfolios
delete policy if exists "Allow user to read their own portfolios" on portfolios;
delete policy if exists "Allow user to insert their own portfolios" on portfolios;
delete policy if exists "Allow user to update their own portfolios" on portfolios;
create policy "Allow user to read their own portfolios"
  on portfolios for select
  using (auth.uid() = user_id);

create policy "Allow user to insert their own portfolios"
  on portfolios for insert
  with check (auth.uid() = user_id);

create policy "Allow user to update their own portfolios"
  on portfolios for update
  using (auth.uid() = user_id);


⸻

New Features & UX Enhancements
	•	Single Source of Truth: Editing resume or portfolio updates the same data
	•	Auto-Save: Optionally auto-save fields as user types
	•	Field Validation: Required fields must be filled before moving to Portfolio Builder
	•	User Feedback: Show ‘Saved!’ or error states
	•	If Data Exists: Dashboard links open portfolio/resume with option to Edit
	•	Loading & Error States: Feedback for async ops (uploads, saves, publish)
	•	Optional (Future): Undo/redo, versioning, analytics

⸻

Cursor IDE Prompts
	•	“Build an editor page that pre-fills all portfolio fields from uploaded/parsed resume data, with Save and Next buttons. On Save, persist data to Supabase. On Next, route to Portfolio Builder preview.”
	•	“In the dashboard, link Resume Generator and Portfolio Builder cards to: (a) the editor page if no resume exists, or (b) the portfolio preview if one exists, with an Edit button.”
	•	“Use TailwindCSS for all styling. Responsive, modern, card-based layout. Add validation and loading states.”

⸻

Checklist

Task	Status
Resume upload/parse flow	⬜
Editor page with all fields	⬜
Save to Supabase (CRUD)	⬜
Portfolio Builder preview page	⬜
PDF download and Portfolio publish actions	⬜
Dashboard routing logic	⬜
Loading, validation, user feedback	⬜


⸻

Dev Notes
	•	Resume and portfolio data should not fork—keep one editable source.
	•	Route users based on whether they have data (first time vs. returning).
	•	Protect all endpoints/routes with authentication.
	•	Data can be extended with analytics, versions, undo/redo in the future.

⸻
