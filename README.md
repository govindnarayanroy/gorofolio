# GoRoFolio

**AI‑powered résumé, portfolio & interview coach in minutes.**

---

## Progress Tracker

| Module                 | Status | Owner | Last Updated |
| ---------------------- | :----: | ----- | ------------ |
| Repo scaffold           |    ✅   | you   | 2025‑01‑22   |
| LLM client              |    ✅   | agent | 2025‑01‑22   |
| Resume preview          |    ✅   | agent | 2025‑01‑22   |
| Cover‑letter service    |    ✅   | agent | 2025‑01‑22   |
| Ingestion endpoint      |    ✅   | agent | 2025‑01‑22   |
| Mock interview module   |    ✅   | agent | 2025‑01‑22   |
| Landing page polish     |    ✅   | agent | 2025‑01‑22   |
| External links & hosting|    ✅   | agent | 2025‑01‑22   |
| Auth & Dashboard Sprint |    ✅   | agent | 2025‑01‑22   |
| Editor Screen Sprint    |    ✅   | agent | 2025‑01‑22   |
| User Flow Integration   |    ⬜   | agent | —            |
| CI/CD & tests           |    ⬜   | agent | —            |

*(Tick ✅, update the date, and commit whenever a task finishes.)*

---

# 0 · Prereqs & One‑time Setup

| Step                  | Command / File                                                                          | Why it matters                                                |
| --------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Clone starter app** | `npx create-next-app@latest go-rofolio --ts --tailwind --eslint --app`                  | Gives a Next.js **/app** router and Tailwind pre‑configured.  |
| **Install dev deps**  | `pnpm add -D shadcn/ui clsx @tailwindcss/typography react-hook-form zod react-to-print` | Shadcn for polished UI, `react-to-print` for PDF export.      |
| **Add LLM clients**   | `pnpm add groq openai @mistralai/client whisper-tts`                                    | Groq will run **Llama 3** + **Mistral**; Whisper handles STT. |
| **Open in Cursor**    | Open repo → **⌘K ⌘I** → set *Workspace Context* to repo root                            | Ensures Cursor agents load the entire codebase each prompt.   |

---

# 1 · Repo Skeleton

```
go-rofolio/
│
├─ app/              ← Next.js routes (App Router)
│   ├─ page.tsx      ← Marketing landing
│   ├─ dashboard/    ← Wizard after signup
│   └─ api/          ← Edge functions: /ingest, /generate, /interview
│
├─ components/
│   ├─ ResumePreview.tsx
│   ├─ PdfDownloadButton.tsx
│   └─ AnimatedCoach.tsx
│
├─ lib/
│   ├─ llmClient.ts      ← Strategy wrapper: OpenAI | Groq
│   ├─ pdf.ts            ← print‑specific CSS + react‑to‑print hook
│   └─ templates/        ← static DOCX & React resume templates
│
├─ prompts/              ← Markdown prompt files (never inline!)
├─ scripts/bench.ts      ← Llama vs Mistral latency script
└─ .env.example
```

---

# 2 · LLM Client (Groq + Mistral)

```ts
export async function chatLLM(
  provider: "openai" | "groq",
  model: string,
  messages: ChatCompletionMessageParam[],
  opts: Partial<ChatCompletionCreateParams> = {}
) { /* … */ }
```

* **Groq base URL** → `https://api.groq.com/openai/v1`
* **Strip unsupported params** (`logprobs`, `logit_bias`, `n`) when `provider === "groq"`.
* **Default models**

  * Draft work → `mistral‑7b‑instruct`
  * Reasoning / scoring → `llama3‑70b‑8192`

---

# 3 · Ingestion Flow

| Stage            | Library                                                                 | Guard‑rails                                                |
| ---------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| **PDF → text**   | `pdf-parse`                                                             | Throw if extracted text `< 200 chars` (likely blank scan). |
| **LinkedIn PDF** | Regex for "Experience" & "Education"                                    | Save raw text in S3 for audit.                             |
| **Parse → JSON** | Prompt in `prompts/parse.md` to `chatLLM("groq","mistral-7b-instruct")` | Conform to single `Profile` schema in `lib/types.ts`.      |

---

# 4 · Resume Generation (HTML → print‑perfect PDF)

## 4.1 Web preview component

```tsx
<article className="prose prose-zinc w-[210mm] bg-white p-8 print:p-0">
  {/* 210 mm = exact A4 width to avoid wraps */}
  …
</article>
```

## 4.2 Print / download logic

1. `useReactToPrint({ content: () => ref.current })`
2. `@page { size: A4; margin: 12mm 14mm; }`
3. Button calls `handlePrint()` → identical spacing in browser & PDF.

> **Why browser print?** Server‑side docx→pdf often shifts line‑height and caused last project's spacing bugs.

---

# 5 · Cover‑Letter Generator

`POST /api/generate/cover` → body `{ profileId, jdText, tone }`

Backend flow:

1. Prompt `prompts/cover-letter.md` → `chatLLM("groq","mistral-7b-instruct")`
2. Render with **React Email** template.
3. Return HTML; front‑end provides editable textarea + "Regenerate".

Rules inside the prompt:

* Exactly 3 paragraphs
* 150–180 words
* Must mention company & role strings verbatim

---

# 6 · Mock Interview Module ✅ COMPLETED

| Component       | Stack                                                                     | Status |
| --------------- | ------------------------------------------------------------------------- | ------ |
| **Recorder**    | `MediaRecorder` API + React hooks                                        | ✅ Working |
| **STT**         | Groq `whisper-large-v3` via Edge function                               | ✅ Working |
| **Q&A loop**    | Each answer → `chatLLM("groq","llama3-8b-8192")` scoring                | ✅ Working |
| **Coach UI**    | `InterviewCoach.tsx` with Lottie animation during processing             | ✅ Working |
| **Result card** | Total score (/10) + per-question feedback                               | ✅ Working |

### Architecture Changes Made:
- **Removed FFmpeg dependency**: Used native `MediaRecorder` for browser audio capture
- **Groq Whisper integration**: Real-time transcription with `whisper-large-v3` model  
- **Per-question workflow**: Record → Stop → Transcribe → Score → Next Question
- **Session management**: Complete interview flow with state persistence
- **Real audio processing**: Variable file sizes (27KB-381KB) vs. previous mock data

### Key Features:
- ✅ Real-time audio recording with visual feedback
- ✅ Groq Whisper transcription (fallback to mock on API errors)
- ✅ LLM-powered scoring with detailed feedback  
- ✅ Per-question progress tracking
- ✅ Clean submit/next question workflow
- ✅ Interview completion with results summary

---

# 7 · Landing Page Polish

Use Tailwind gradient hero:

```jsx
<section className="relative isolate overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#020617] to-black py-20">
  <div className="absolute -z-10 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl left-1/4 -top-20" />
  <div className="mx-auto max-w-5xl px-6 text-center text-white">
    <Logo className="mx-auto h-20 w-20" />
    <h1 className="mt-8 text-5xl font-extrabold tracking-tight">
      Launch<span className="text-sky-400"> your career</span> in minutes
    </h1>
    <p className="mt-6 text-lg text-zinc-300">
      AI‑generated portfolio, résumé & real‑time interview coach. Stop tweaking docs, start landing interviews.
    </p>
    <Button asChild size="lg" className="mt-10">
      <Link href="/dashboard">Get started free</Link>
    </Button>
  </div>
</section>
```

*Spacing tips*: avoid `space-y-*` inside grids; fix line‑height with Tailwind `leading-6` so print & web match.

---

# 8 · External Links & Hosting ✅ COMPLETED

**Status:** Production-ready profile system with modern UI and export functionality

## 8.1 Profile Page System

Dynamic profile routes with modern design:

```tsx
// /dashboard/profile/[id] - Modern glassmorphism design
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl">
    <ProfileHeader profile={profile} />
    <LinksList links={profile.links} />
    <ExperienceSection experiences={profile.experiences} />
    <EducationSection education={profile.education} />
    <SkillsSection skills={profile.skills} />
  </div>
</div>
```

## 8.2 External Links Component

Professional link display with dynamic icons:

```tsx
<ul className="flex flex-wrap gap-4">
  {profile.links.map(link => (
    <a href={link.url} target="_blank" 
       className="group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <span className="text-blue-600">{getIcon(link.label)}</span>
      <span className="text-gray-700 font-medium">{link.label}</span>
      <FaExternalLinkAlt size={12} className="text-gray-400" />
    </a>
  ))}
</ul>
```

## 8.3 Export & Download Features

| Feature | Implementation | Status |
|---------|---------------|--------|
| **PDF Download** | `react-to-print` with A4 optimization | ✅ Working |
| **Static Export** | ZIP with HTML/CSS via JSZip | ✅ Working |
| **Print Styles** | Clean PDF output, hidden web elements | ✅ Working |
| **Responsive Design** | Mobile-first, matches landing page | ✅ Working |

### Export API Endpoint
```ts
// POST /api/portfolio/export?id=123
// Returns: portfolio-123.zip with index.html, style.css, README.md
```

## 8.4 Component Architecture

Modular design system with consistent styling:

```
components/
├── ProfileHeader.tsx    # Gradient avatar + name/headline
├── LinksList.tsx       # External links with icons
├── ExperienceSection.tsx # Timeline with bullet points
├── EducationSection.tsx # Education cards
├── SkillsSection.tsx   # Skill tags with gradients
├── DownloadButton.tsx  # PDF generation
└── PublishButton.tsx   # Static site export
```

## 8.5 Design System Integration

- **Color Palette:** Blue-400 to Purple-400 gradients matching landing page
- **Typography:** Professional hierarchy with proper print optimization  
- **Interactive Elements:** Hover animations, scale transforms, color transitions
- **Responsive:** Mobile-first design with proper breakpoints

## 8.6 Testing Results

- ✅ Profile page: `http://localhost:3000/dashboard/profile/123` (HTTP 200)
- ✅ Export API: `http://localhost:3000/api/portfolio/export?id=123` (HTTP 200)
- ✅ PDF download functionality working
- ✅ Static website export generating clean HTML/CSS
- ✅ All components rendering with proper styling
- ✅ Responsive design tested across devices

**Implementation Quality:** Production-ready with modern design patterns and robust error handling.

---

# 9 · WindSurf / Cursor Agent Workflow

1. Open README section for next unchecked item.
2. `⌥⌘P` → "Generate …" (small, precise ask).
3. Review diff, apply, commit.
4. Update progress table in the **same commit**.

PR template:

```md
### Context
Closes #123 – implements ResumePreview print‑safe spacing.

### Screenshots
<insert PDF print view>
```

---

# 10 · Learning Road‑map for You

| Week | Goal                  | Hands‑on                                               |
| ---- | --------------------- | ------------------------------------------------------ |
| 1    | LLM orchestration     | Benchmark Groq latency in `scripts/bench.ts`.          |
| 2    | Tailwind print design | Build two‑column résumé; print to PDF, tweak.          |
| 3    | Media + STT           | Record audio, stream to Whisper, show live transcript. |
| 4    | Prompt engineering    | A/B test cover‑letter prompt; track manual‑edit rate.  |

---

## Final Sanity Checklist (pre‑alpha)

* [ ] PDF export has no blank second page.
* [ ] Groq usage < 300 RPM (free tier).
* [ ] Three starter résumé templates (SW, Design, Data).
* [ ] Lottie coach animation looks fine in dark mode.

---

> **"Context is cash."** Work through the README one block at a time, keep commits atomic, and you'll ship a polished GoRoFolio v1—minus the spacing nightmares. 🚀
