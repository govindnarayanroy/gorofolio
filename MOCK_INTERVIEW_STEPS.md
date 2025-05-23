# 🟣 Mock-Interview Module Sprint

Build an AI-powered interview practice loop:

1. **Record** candidate audio in the browser  
2. **Transcribe** with Whisper (wasm)  
3. **Score** each answer with Groq / Llama 3 and return tips  
4. **Display** a final scorecard; allow retry

---

## 0 · Install core deps

```bash
# audio recording & MP3 encode
pnpm add @ffmpeg/ffmpeg            # wasm build

# in‑browser speech‑to‑text (Whisper tiny/base)
pnpm add @xenova/transformers

# (optional) waveform visualiser
pnpm add react-waveform-playlist
```

---

## 1 · Question engine

| # | Task | File | Commit msg |
|---|------|------|------------|
| 1 | Static question sets | `data/questions/backend.json`, etc. | `feat(data): backend interview Q set` |
| 2 | Utility to pick 10 unique questions | `lib/interview.ts` | `feat(lib): randomQuestionSet()` |

---

## 2 · Recorder component

| # | Functionality | File |
|---|---------------|------|
| 1 | `useRecorder` hook (`start`, `stop`, `blob`) | `hooks/useRecorder.ts` |
| 2 | Encode WAV→MP3 via FFmpeg‑wasm | inside hook |
| 3 | UI with record/stop & countdown | `components/Recorder.tsx` |

---

## 3 · STT API route

```
app/api/interview/stt/route.ts
```

* Accept `multipart/form-data` audio blob  
* Run Whisper via `@xenova/transformers`  
* Return `{ text }`

---

## 4 · Scoring route

```
app/api/interview/score/route.ts
```

```ts
chatLLM("groq","llama3-8b-8192",[
  { role:"system",content:"You are a strict interviewer…" },
  { role:"user",content: promptWithAnswer }
]);
```

Return `{ score: 0-10, tips }`.

---

## 5 · Dashboard UI pages

| Page | Path | Features |
|------|------|----------|
| **Lobby** | `/dashboard/interview` | Pick domain (backend / frontend / PM) |
| **Session** | `/dashboard/interview/session` | Show current Q, recorder, live transcript, next/stop |
| **Scorecard** | `/dashboard/interview/result` | Per-Q scores, overall, tips |

---

## 6 · Nice‑to‑haves

* Lottie coach animation while asking questions  
* Timer ring around the record button  
* LocalStorage cache of past sessions

---

## Execution order

1. **Question JSON & helper util**  
2. **Recorder hook + basic UI** (offline)  
3. **STT route & live transcript**  
4. **Scoring route**  
5. **Scorecard polish**

Happy building! 🚀
