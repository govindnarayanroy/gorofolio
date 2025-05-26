export const runtime = "nodejs";

import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import { chatLLM } from "@/lib/llmClient";
import { Profile } from "@/lib/types";
import fs from "node:fs/promises";
import path from "node:path";

const MAX_SIZE = 4 * 1024 * 1024; // 4 MB

export async function POST(req: Request) {
  try {
    console.log("📥 Ingest API called");
    const form = await req.formData();
    const file = form.get("file") as File;

    console.log("📋 FormData entries:", Array.from(form.entries()).map(([key, value]) => [
      key, 
      typeof value, 
      value instanceof File ? `File(${value.name}, ${value.size}b)` : value
    ]));

    console.log("📁 File details:", {
      exists: !!file,
      name: file?.name,
      size: file?.size,
      type: file?.type,
      lastModified: file?.lastModified
    });

    if (!file || file.size > MAX_SIZE) {
      console.log("❌ File validation failed");
      return NextResponse.json({ error: "Missing or too‑large file" }, { status: 400 });
    }

    console.log("✅ File validation passed");
    console.log("📄 Extracting text from PDF...");

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("📦 Buffer size:", buffer.length);
    
    const { text } = await pdf(buffer);

    console.log("📝 Extracted text length:", text.length);
    console.log("📝 Text preview:", text.slice(0, 200) + "...");

    console.log("🤖 Building LLM prompt...");
    const tpl = await fs.readFile(
      path.join(process.cwd(), "prompts/parse-resume.md"),
      "utf8"
    );
    const prompt = tpl.replace("{{resume_text}}", text.slice(0, 60000));
    console.log("📝 Prompt length:", prompt.length);

    console.log("🧠 Calling LLM for parsing...");
    const res = await chatLLM("groq", "llama3-8b-8192", [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ]);

    console.log("🤖 LLM response length:", res.content?.length);
    console.log("🤖 LLM response preview:", res.content?.slice(0, 200) + "...");

    let profile: Profile;
    try {
      // Clean the response to extract JSON
      let jsonStr = res.content ?? "";
      
      // Remove markdown code blocks if present
      jsonStr = jsonStr.replace(/```json\s*/g, "").replace(/```\s*/g, "");
      
      // Find the JSON object
      const jsonStart = jsonStr.indexOf("{");
      const jsonEnd = jsonStr.lastIndexOf("}");
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        jsonStr = jsonStr.slice(jsonStart, jsonEnd + 1);
      }
      
      console.log("🔧 Sanitized JSON length:", jsonStr.length);
      console.log("🔧 Sanitized JSON preview:", jsonStr.slice(0, 200) + "...");
      
      profile = JSON.parse(jsonStr);
      console.log("✅ JSON parsing successful");
      console.log("👤 Parsed profile:", {
        name: profile.name,
        headline: profile.headline,
        experienceCount: profile.experiences?.length || 0,
        skillsCount: profile.skills?.length || 0
      });
    } catch (parseError) {
      console.error("❌ JSON parsing failed:", parseError);
      throw new Error("LLM did not return valid JSON");
    }

    console.log("🎉 Ingestion successful!");
    return NextResponse.json({ profile });
  } catch (err) {
    console.error("Ingestion error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
} 