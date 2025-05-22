import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import { chatLLM } from "@/lib/llmClient";
import { Profile } from "@/lib/types";
import fs from "node:fs/promises";
import path from "node:path";

const MAX_SIZE = 4 * 1024 * 1024; // 4 MB

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file || file.size > MAX_SIZE)
      return NextResponse.json({ error: "Missing or too‑large file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const { text } = await pdf(buffer);

    const tpl = await fs.readFile(
      path.join(process.cwd(), "prompts/parse-resume.md"),
      "utf8"
    );
    const prompt = tpl.replace("{{resume_text}}", text.slice(0, 60000));

    const res = await chatLLM("groq", "llama3-8b-8192", [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ]);

    let profile: Profile;
    try {
      profile = JSON.parse(res.content ?? "");
    } catch {
      throw new Error("LLM did not return valid JSON");
    }

    return NextResponse.json({ profile });
  } catch (err) {
    console.error("Ingestion error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
} 