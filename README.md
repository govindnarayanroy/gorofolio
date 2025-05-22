# GoRoFolio

**AI‑powered résumé, portfolio & interview coach in minutes.**

---

## Progress Tracker

| Module                 | Status | Owner | Last Updated |
| ---------------------- | :----: | ----- | ------------ |
| Repo scaffold          |    ✅   | you   | 2025‑05‑22   |
| LLM client             |    ⬜   | agent | —            |
| Resume preview         |    ⬜   | agent | —            |
| Cover‑letter service   |    ⬜   | agent | —            |
| Mock interview module  |    ⬜   | agent | —            |
| Landing page polish    |    ⬜   | agent | —            |
| External links section |    ⬜   | agent | —            |
| CI/CD & tests          |    ⬜   | agent | —            |

*(Tick ✅, update the date, and commit whenever a task finishes.)*

---

# 0 · Prereqs & One‑time Setup

| Step                  | Command / File                                                                          | Why it matters                                                |
| --------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Clone starter app** | `npx create-next-app@latest go-rofolio --ts --tailwind --eslint --app`                  | Gives a Next.js **/app** router and Tailwind pre‑configured.  |
| **Install dev deps**  | `pnpm add -D shadcn/ui clsx @tailwindcss/typography react-hook-form zod react-to-print` | Shadcn for polished UI, `react-to-print` for PDF export.      |
| **Add LLM clients**   | `pnpm add groq openai @mistralai/client whisper-tts`                                    | Groq will run **Llama 3** + **Mistral**; Whisper handles STT. |
| **Open in Cursor**    | Open repo → **⌘K ⌘I** → set *Workspace Context* to repo root                            | Ensures Cursor agents load the entire codebase each prompt.   |

---

# 1 · Repo Skeleton

```
go-rofolio/
│
├─ app/              ← Next.js routes (App Router)
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
│   ├─ llmClient.ts      ← Strategy wrapper: OpenAI | Groq
│   ├─ pdf.ts            ← print‑specific CSS + react‑to‑print hook
│   └─ templates/        ← static DOCX & React resume templates
│
├─ prompts/              ← Markdown prompt files (never inline!)
├─ scripts/bench.ts      ← Llama vs Mistral latency script
└─ .env.example
```

---

# 2 · LLM Client (Groq + Mistral)

```ts
export async function chatLLM(
  provider: "openai" | "groq",
  model: string,
  messages: ChatCompletionMessageParam[],
  opts: Partial<ChatCompletionCreateParams> = {}
) { /* … */ }
```

* **Groq base URL** → `https://api.groq.com/openai/v1`
* **Strip unsupported params** (`logprobs`, `logit_bias`, `n`) when `provider === "groq"`.
* **Default models**

  * Draft work → `mistral‑7b‑instruct`
  * Reasoning / scoring → `llama3‑70b‑8192`

---

# 3 · Ingestion Flow

| Stage            | Library                                                                 | Guard‑rails                                                |
| ---------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| **PDF → text**   | `pdf-parse`                                                             | Throw if extracted text `< 200 chars` (likely blank scan). |
| **LinkedIn PDF** | Regex for “Experience” & “Education”                                    | Save raw text in S3 for audit.                             |
| **Parse → JSON** | Prompt in `prompts/parse.md` to `chatLLM("groq","mistral-7b-instruct")` | Conform to single `Profile` schema in `lib/types.ts`.      |

---

# 4 · Resume Generation (HTML → print‑perfect PDF)

## 4.1 Web preview component

```tsx
<article className="prose prose-zinc w-[210mm] bg-white p-8 print:p-0">
  {/* 210 mm = exact A4 width to avoid wraps */}
  …
</article>
```

## 4.2 Print / download logic

1. `useReactToPrint({ content: () => ref.current })`
2. `@page { size: A4; margin: 12mm 14mm; }`
3. Button calls `handlePrint()` → identical spacing in browser & PDF.

> **Why browser print?** Server‑side docx→pdf often shifts line‑height and caused last project’s spacing bugs.

---

# 5 · Cover‑Letter Generator

`POST /api/generate/cover` → body `{ profileId, jdText, tone }`

Backend flow:

1. Prompt `prompts/cover-letter.md` → `chatLLM("groq","mistral-7b-instruct")`
2. Render with **React Email** template.
3. Return HTML; front‑end provides editable textarea + “Regenerate”.

Rules inside the prompt:

* Exactly 3 paragraphs
* 150–180 words
* Must mention company & role strings verbatim

---

# 6 · Mock Interview Module

| Component       | Stack                                                                     |
| --------------- | ------------------------------------------------------------------------- |
| **Recorder**    | `@ffmpeg/wasm` + `MediaRecorder`                                          |
| **STT**         | `whisper-tts` via Edge function                                           |
| **Q\&A loop**   | Each answer → `chatLLM("groq","llama3-70b-8192")` (function call `score`) |
| **Coach UI**    | `AnimatedCoach.tsx` uses a Lottie animation while LLM processes           |
| **Result card** | Total score (/10) + 3 improvement tips                                    |

---

# 7 · Landing Page Polish

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

# 8 · External Links Section (portfolio page)

```tsx
<ul className="grid sm:grid-cols-2 gap-4">
  {profile.links.map(l => (
    <li key={l.url} className="flex items-center gap-3">
      <Globe className="w-4 h-4 opacity-60" />
      <a href={l.url} target="_blank" className="underline">{l.label}</a>
    </li>
  ))}
</ul>
```

---

# 9 · WindSurf / Cursor Agent Workflow

1. Open README section for next unchecked item.
2. `⌥⌘P` → “Generate …” (small, precise ask).
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

# 10 · Learning Road‑map for You

| Week | Goal                  | Hands‑on                                               |
| ---- | --------------------- | ------------------------------------------------------ |
| 1    | LLM orchestration     | Benchmark Groq latency in `scripts/bench.ts`.          |
| 2    | Tailwind print design | Build two‑column résumé; print to PDF, tweak.          |
| 3    | Media + STT           | Record audio, stream to Whisper, show live transcript. |
| 4    | Prompt engineering    | A/B test cover‑letter prompt; track manual‑edit rate.  |

---

## Final Sanity Checklist (pre‑alpha)

* [ ] PDF export has no blank second page.
* [ ] Groq usage < 300 RPM (free tier).
* [ ] Three starter résumé templates (SW, Design, Data).
* [ ] Lottie coach animation looks fine in dark mode.

---

> **“Context is cash.”** Work through the README one block at a time, keep commits atomic, and you’ll ship a polished GoRoFolio v1—minus the spacing nightmares. 🚀
