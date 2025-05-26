Auth & Dashboard Sprint

## Objective

Integrate all completed modules (Portfolio Builder, Resume Generator, Cover Letter Writer, Mock Interview) into a modern, cohesive main dashboard. Modernize each page’s UI, ensure smooth, single-sign-on navigation, and connect authentication using Supabase.

---

## What’s Already Complete

* [x] Portfolio Builder module (fully functional)
* [x] Resume Generator module (fully functional)
* [x] Cover Letter Writer module (fully functional)
* [x] Mock Interview module (fully functional)

---

## This Sprint — Key Tasks

### 1. **Dashboard Integration**

* [ ] Create `/dashboard` route/page as the single entry point after login.
* [ ] Add sidebar or top navigation linking to each of the four modules.
* [ ] Ensure dashboard loads user’s name/avatar and a welcoming message.

**Cursor Prompt:**

> “Create a modern dashboard page in React+Tailwind. Add sidebar links to Portfolio Builder, Resume Generator, Cover Letter Writer, and Mock Interview. Show a welcome header with user info.”

---

### 2. **Connect Existing Modules**

* [ ] Each navigation link on the dashboard should route to its existing page/component (no rebuilds).
* [ ] Use Next.js `Link` or equivalent for navigation.

**Cursor Prompt:**

> “For each dashboard link, connect to the existing module route/component (e.g., `/portfolio`, `/resume`, `/cover-letter`, `/mock-interview`). Do not duplicate or recreate module logic.”

---

### 3. **Modernize UI Across All Pages**

* [ ] Apply a unified, modern visual style using TailwindCSS across dashboard and modules.
* [ ] Ensure consistent spacing, font hierarchy, and responsive design.
* [ ] Add hover and focus effects to navigation and action buttons.
* [ ] Clean up any legacy styling or layout issues in module pages.

**Cursor Prompt:**

> “Polish each module page to use a consistent modern UI:
>
> * Use Tailwind for layout, spacing, and colors
> * Large, bold headings
> * Subtle card backgrounds for form/feature areas
> * Primary buttons with hover effect
> * Responsive on all devices.”

---

### 4. **Navigation & Auth Flow**

* [ ] “Get Started Free” button on landing should route to `/login`, which then redirects to `/dashboard` after successful auth.
* [ ] Ensure session persists and `/dashboard` is protected.

**Cursor Prompt:**

> “Connect ‘Get Started Free’ CTA to `/login`, and ensure successful login routes to `/dashboard`. Make `/dashboard` protected for logged-in users only.”

---

### 5. **Supabase Integration (Required for Auth)**

* [ ] Add Supabase project credentials to `.env` (use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
* [ ] Initialize Supabase client in the app
* [ ] Use Supabase Auth for login, registration, and session handling
* [ ] Protect `/dashboard` with auth middleware or client-side checks
* [ ] Fetch and display user info (name, avatar, email) on dashboard

**Sample .env entries:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
```

**Sample initialization:**

```js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

---

## Exclusions (For Future Sprints)

* [ ] Job Alert Module
* [ ] Progress Tracker & Tips
  *(Do not build or scaffold these yet; skip for now)*

---

## Final Checklist

| Task                                | Status |
| ----------------------------------- | :----: |
| Dashboard created and styled        |    ⬜   |
| All modules linked (no duplication) |    ⬜   |
| UI modernized on all pages          |    ⬜   |
| Navigation/auth flow tested         |    ⬜   |
| Supabase integration working        |    ⬜   |
| User info loads on dashboard        |    ⬜   |

---

## Notes for Developers (Cursor IDE)

* Do **not** duplicate or rewrite existing module logic—only connect via navigation/routing.
* Use Tailwind utility classes for all new styles.
* Use the provided prompts for any AI code generation inside Cursor IDE to avoid redundant work.
* Landing > Login > Dashboard is the only intended new flow in this sprint.

---

## Dashboard & Module Marketing Copy

### 🏠 Dashboard Welcome Message
> **Welcome back, [User]! 🚀**  
> You’re one step closer to your dream job. Pick a tool below to get started, or follow your personalized checklist.

---

### 🌐 Portfolio Builder Module
> **Build Your Online Presence Instantly**  
> Showcase your skills in a professional, fully-hosted site—no code needed! Your portfolio is your personal billboard. Go live in seconds.

---

### 📄 Resume Generator Module
> **Create a Resume That Stands Out**  
> Impress recruiters and pass every filter! Our AI auto-formats your résumé for success and keeps you ready for any opportunity.

---

### ✍️ Cover Letter Writer Module
> **Never Stress Over Cover Letters Again**  
> Write a job-specific, personalized letter with just one click. Let your motivation shine through, every time.

---

### 🧠 Mock Interview Module
> **Boost Your Confidence Before the Real Interview**  
> Practice with our AI interviewer and get instant, actionable feedback. Ace your next interview with tailored practice sessions.

---

### 💡 Encouragement or Empty State Message
> Not sure where to begin?  
> Try the AI Portfolio Builder, or chat with our onboarding bot for help!

---

**How to use:**  
- Add these as headings/descriptions in each respective module page or feature card.
- Cursor IDE prompt example:  
  > “Insert the above copy as the main heading and description for each module. Make sure it’s styled with bold, large font for headings and subtle color for descriptions.”

---

*Feel free to tweak the copy to match your brand’s personality!*
