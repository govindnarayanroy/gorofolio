# 🚀 Next Steps Roadmap

> Follow each bullet top-to-bottom, commit after every section, and you'll ship each module without losing context.

---

## 1 · Cover-Letter Generator (`/api/generate/cover`)

### Overview

- **Input** `POST` `{ profile, jd, tone? }`
- **LLM** `chatLLM("groq", "mistral-7b-instruct")`
- **Output** Markdown cover letter (3 paragraphs, ≤ 180 words)

### Sprint Breakdown

| #     | Task                         | Files / Commands                                   | Commit msg example                        |
| ----- | ---------------------------- | -------------------------------------------------- | ----------------------------------------- |
| **1** | ✏️ Add prompt file           | `prompts/cover-letter.md` → _(see template below)_ | `docs(prompts): cover-letter template`    |
| **2** | 🏗 Create API route skeleton | `app/api/generate/cover/route.ts`                  | `feat(api): initial cover-letter route`   |
| **3** | 📜 Validate body with Zod    | add `Body` schema in route                         | _part of step 2 commit_                   |
| **4** | 🤖 Call `chatLLM`            | interpolate prompt + send to LLM                   | `feat(api): call LLM and return Markdown` |
| **5** | 🔎 Demo page                 | `app/dashboard/cover/page.tsx` (textarea + button) | `feat(ui): cover-letter generator demo`   |
| **6** | ✅ E2E test                  | open page → generate → see Markdown rendered       | `test(api): cover-letter route e2e`       |

#### Prompt Template (`prompts/cover-letter.md`)

````md
## System

You are an AI career assistant that writes concise, three-paragraph cover letters.

## User Instructions

**Profile JSON**

```json
{{profile}}
```
````

**Job Description**

```
{{jd}}
```

- Tone: {{tone}}
- Paragraph 1 – Hook: mention company + role
- Paragraph 2 – 2–3 quantified achievements that match JD keywords
- Paragraph 3 – Call to action + thank you

**Output:** _Pure Markdown_, no front-matter, max 180 words.

````

---

## 2 · Ingestion Endpoint (`/api/ingest`)

| # | Task | Key Libs |
|---|------|----------|
| **1** | Upload PDF via `multipart/form-data` | `app/api/ingest/route.ts` |
| **2** | Extract text | `pdf-parse` |
| **3** | Prompt `prompts/parse-resume.md` → `chatLLM("groq","mistral-7b-instruct")` |
| **4** | Validate against `Profile` schema (`zod`) |
| **5** | Store JSON in Supabase (or local file during dev) |
| **6** | Return `{ id, profile }` |

---

## 3 · Mock-Interview Module

| # | Component | Stack |
|---|-----------|-------|
| **Recorder** | `MediaRecorder` + `@ffmpeg/wasm` (mp3) |
| **STT** | `@xenova/transformers` Whisper (browser) |
| **Q&A loop** | static question set → send answers to Llama 3 via `chatLLM` |
| **Scoring route** | `app/api/interview/score/route.ts` |
| **UI** | Lottie coach animation + live transcript + score card |

*(Build once ingestion + profile pages are solid.)*

---

## 4 · Global Print / Tailwind Setup (already done)

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@media print {
  @page { size: A4 portrait; margin: 12mm 14mm; }
  nav, button { display: none !important; }
  html, body { background: white; }
}
````

```js
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('@tailwindcss/typography')],
}
```

---

## 5 · Milestone Checklist

- [ ] Cover-letter route returns Markdown in < 3 s
- [ ] Ingestion endpoint parses LinkedIn PDF → `Profile` JSON
- [ ] Interview module records audio, shows score card
- [ ] README progress table updated after each module

Happy building! 🚀
