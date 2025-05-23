import { NextResponse } from "next/server";
import { chatLLM } from "@/lib/llmClient";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    const response = await chatLLM("groq", "llama3-8b-8192", [
      { role: "system", content: "You are a strict interviewer evaluating the candidate's answer. Provide a score (0-10) and improvement tips." },
      { role: "user", content: prompt }
    ]);

    // Parse the response to extract score and tips
    const result = JSON.parse(response.content || "{}");
    const { score, tips } = result;

    return NextResponse.json({ score, tips });
  } catch (error) {
    console.error("Scoring error:", error);
    return NextResponse.json({ error: "Failed to score the answer" }, { status: 500 });
  }
} 