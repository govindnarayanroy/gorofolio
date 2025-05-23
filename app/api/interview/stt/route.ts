import { NextResponse } from "next/server";
import { pipeline } from "@xenova/transformers";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioBlob = formData.get("audio") as Blob;

    if (!audioBlob) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Convert Blob to ArrayBuffer, then to Float32Array
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioData = new Float32Array(arrayBuffer);

    // Load Whisper model and transcribe
    const transcriber = await pipeline("automatic-speech-recognition", "Xenova/whisper-tiny");
    const result = await transcriber(audioData);

    // Handle result type
    const text = Array.isArray(result) ? result[0].text : result.text;

    return NextResponse.json({ text });
  } catch (error) {
    console.error("STT error:", error);
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
} 