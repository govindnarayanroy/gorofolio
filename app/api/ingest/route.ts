export const runtime = "nodejs";

import { NextResponse } from "next/server";
import pdfParse from "pdf-parse/lib/pdf-parse.js";     // Node build
import { chatLLM } from "@/lib/llmClient";
import { Profile } from "@/lib/types";
import fs from "node:fs/promises";
import path from "node:path";
// import { ProfileSchema } from "@/lib/types";        // ← create if you’d like Zod validation

const MAX_SIZE = 4 * 1024 * 1024; // 4 MB
const MIN_TEXT = 500;             // at least 500 chars of extractable text

export async function POST(req: Request) {
  try {
    /*───────────── 1.  File guard ─────────────*/
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file || file.size > MAX_SIZE) {
      console.warn("Ingest 400 → no file or file > 4 MB");
      return NextResponse.json(
        { error: "Missing file or file too large" },
        { status: 400 }
      );
    }

    /*───────────── 2.  Extract text ───────────*/
    const buffer = Buffer.from(await file.arrayBuffer());
    const { text } = await pdfParse(buffer);

    if (text.length < MIN_TEXT) {
      console.warn("Ingest 400 → extracted text too short; likely scanned PDF");
      return NextResponse.json(
        { error: "Unable to extract readable text — is this a scanned PDF?" },
        { status: 400 }
      );
    }

    /*───────────── 3.  Build prompt ───────────*/
    const tpl = await fs.readFile(
      path.join(process.cwd(), "prompts/parse-resume.md"),
      "utf8"
    );
    const prompt = tpl.replace("{{resume_text}}", text.slice(0, 60_000));

    /*───────────── 4.  Call LLM ───────────────*/
    const res = await chatLLM("groq", "llama3-8b-8192", [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ]);

    /*───────────── 5.  Sanitize & parse JSON ──*/
    const raw = (res.content ?? "")
      .replace(/```json|```/gi, "")   // strip fences if any
      .replace(/^[^{]*?{/s, "{")      // drop leading prose before first {
      .trim();

    let profile: Profile = JSON.parse(raw);
    // profile = ProfileSchema.parse(profile);   // ← enable if you have a Zod schema

    /*───────────── 6.  Success ────────────────*/
    return NextResponse.json({ profile });

  } catch (err) {
    console.error("Ingestion error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}