# 🟡 Ingestion Endpoint Sprint (`/api/ingest`)

This guide walks you through building the résumé‑to‑Profile ingestion feature.  
Follow each bullet in order, commit after every section, and you'll have a working endpoint plus a demo upload page.

---

## 0 · Install helper libs

```bash
pnpm add pdf-parse                 # lightweight text extractor
pnpm add -D @types/pdf-parse       # TS types (optional)
# If you'll store profiles in Supabase later:
# pnpm add @supabase/supabase-js
```

---

## 1 · Prompt template

Create **`prompts/parse-resume.md`**

```md
## System

You are an AI that converts raw résumé text into valid JSON matching the `Profile` schema.

## Instructions

SRC:
```

{{resume_text}}

````

Return **ONLY** this JSON:

```json
{
  "name": "",
  "headline": "",
  "summary": "",
  "experiences": [
    {
      "company": "",
      "role": "",
      "start": "YYYY-MM",
      "end": "YYYY-MM or null",
      "bullets": []
    }
  ],
  "education": [
    { "school": "", "degree": "", "year": "" }
  ],
  "skills": [],
  "links": []
}
````

_Do not wrap in Markdown fences; no additional keys._

````

Commit:

```bash
git add prompts/parse-resume.md
git commit -m "docs(prompts): resume-parse template"
````

---

## 2 · API route skeleton

Create **`app/api/ingest/route.ts`**

```ts
import { NextResponse } from 'next/server'
import pdf from 'pdf-parse'
import { chatLLM } from '@/lib/llmClient'
import { Profile } from '@/lib/types'
import fs from 'node:fs/promises'
import path from 'node:path'

const MAX_SIZE = 4 * 1024 * 1024 // 4 MB

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File

    if (!file || file.size > MAX_SIZE)
      return NextResponse.json({ error: 'Missing or too‑large file' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const { text } = await pdf(buffer)

    const tpl = await fs.readFile(path.join(process.cwd(), 'prompts/parse-resume.md'), 'utf8')
    const prompt = tpl.replace('{{resume_text}}', text.slice(0, 60000))

    const res = await chatLLM('groq', 'llama3-8b-8192', [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt },
    ])

    let profile: Profile
    try {
      profile = JSON.parse(res.content ?? '')
    } catch {
      throw new Error('LLM did not return valid JSON')
    }

    return NextResponse.json({ profile })
  } catch (err) {
    console.error('Ingestion error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

Commit:

```bash
git add app/api/ingest/route.ts
git commit -m "feat(api): initial résumé ingestion route"
```

---

## 3 · Demo upload page

Create **`app/dashboard/ingest/page.tsx`**

```tsx
'use client'
import { useState } from 'react'

export default function IngestPage() {
  const [file, setFile] = useState<File>()
  const [profile, setProfile] = useState<any>(null)

  async function upload() {
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/ingest', { method: 'POST', body: fd }).then(r => r.json())
    setProfile(res.profile)
  }

  return (
    <main className="mx-auto max-w-xl space-y-4 p-6">
      <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0])} />
      <button
        onClick={upload}
        disabled={!file}
        className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
      >
        Parse Résumé
      </button>

      {profile && (
        <pre className="mt-4 overflow-auto rounded bg-zinc-900 p-4 text-xs text-green-300">
          {JSON.stringify(profile, null, 2)}
        </pre>
      )}
    </main>
  )
}
```

Commit:

```bash
git add app/dashboard/ingest/page.tsx
git commit -m "feat(ui): résumé ingestion demo page"
```

---

## 4 · Manual test

- `pnpm run dev`
- Visit **/dashboard/ingest**
- Upload any PDF résumé → should display parsed JSON.

---

## 5 · (Opt.) Store to Supabase

```ts
// after parsing
await supabase.from('profiles').insert({ profile })
```

---

## 6 · Docs tick ✅

Update progress tables:

```markdown
| Ingestion endpoint | ✅ | agent | 2024-03-26 |
```

Commit:

```bash
git add README.md NEXT_STEPS.md
git commit -m "docs: ✔ ingestion endpoint complete"
git push
```

Happy building! 🚀
