import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  try {
    console.log("STT API called");
    
    const formData = await request.formData();
    const file = formData.get("audio") as File;

    console.log("Received file:", {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      lastModified: file?.lastModified
    });

    if (!file) {
      console.error("No audio file provided");
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      console.error("Empty audio file");
      return NextResponse.json(
        { error: "Empty audio file" },
        { status: 400 }
      );
    }

    // Groq whisper-large-v3 supports: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm (up to 19.5MB)
    const validTypes = ['audio/webm', 'audio/mp4', 'audio/wav', 'audio/mpeg', 'audio/ogg', 'audio/flac', 'audio/m4a', 'audio/mpga'];
    const isValidType = validTypes.some(type => file.type.includes(type)) || file.type.startsWith("audio/");
    
    if (!isValidType) {
      console.error("Invalid file type:", file.type);
      return NextResponse.json(
        { error: `Not a valid audio file. Received type: ${file.type}` },
        { status: 400 }
      );
    }

    // Check file size limit (19.5MB for Groq)
    const maxSize = 19.5 * 1024 * 1024; // 19.5MB in bytes
    if (file.size > maxSize) {
      console.error("File too large:", file.size);
      return NextResponse.json(
        { error: `File too large. Maximum size is 19.5MB, received ${Math.round(file.size / (1024 * 1024))}MB` },
        { status: 400 }
      );
    }

    console.log("Audio file validation passed");
    console.log("Audio buffer size:", file.size);

    // Check if Groq API key is available
    const groqApiKey = process.env.GROQ_API_KEY;
    console.log("🔑 Environment variables check:");
    console.log("  - NODE_ENV:", process.env.NODE_ENV);
    console.log("  - GROQ_API_KEY exists:", !!groqApiKey);
    console.log("  - GROQ_API_KEY length:", groqApiKey?.length || 0);
    console.log("  - GROQ_API_KEY first 10 chars:", groqApiKey?.substring(0, 10) || 'undefined');
    console.log("  - All env keys with GROQ:", Object.keys(process.env).filter(key => key.includes('GROQ')));
    console.log("  - Current working directory:", process.cwd());
    
    if (!groqApiKey) {
      console.error("❌ GROQ_API_KEY not found in environment variables");
      console.log("🔄 Falling back to mock transcription due to missing API key");
      
      const mockTranscriptions = [
        "Thank you for the question. I have experience working with React and TypeScript to build scalable web applications.",
        "In my previous role, I worked on optimizing database queries which improved performance by 40%.",
        "I believe my background in full-stack development makes me a good fit for this position.",
        "I enjoy collaborating with cross-functional teams to deliver high-quality software solutions.",
        "My approach to problem-solving involves breaking down complex issues into manageable components."
      ];
      
      const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      console.log("Returning mock transcription:", randomTranscription);
      
      return NextResponse.json({ 
        text: randomTranscription,
        metadata: {
          fileSize: file.size,
          fileType: file.type,
          fileSizeMB: Math.round(file.size / (1024 * 1024) * 100) / 100,
          fallback: true,
          reason: "Missing GROQ_API_KEY",
          processed: true
        }
      });
    }

    try {
      // Initialize Groq client for whisper transcription
      const groq = new OpenAI({
        apiKey: groqApiKey,
        baseURL: "https://api.groq.com/openai/v1"
      });

      console.log("🎙️ Transcribing audio with Groq whisper-large-v3...");
      console.log("🔑 Using GROQ_API_KEY (length):", groqApiKey.length);

      // Convert file to the format expected by OpenAI SDK
      const audioFile = new File([await file.arrayBuffer()], file.name || "audio.webm", {
        type: file.type
      });

      console.log("📁 Prepared audio file for transcription:", {
        name: audioFile.name,
        size: audioFile.size,
        type: audioFile.type
      });

      // Call Groq's whisper-large-v3 for transcription
      const transcription = await groq.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-large-v3",
        language: "en", // Specify English for better accuracy
        response_format: "text"
      });

      console.log("✅ Groq transcription successful:", transcription);

      return NextResponse.json({ 
        text: transcription,
        metadata: {
          fileSize: file.size,
          fileType: file.type,
          fileSizeMB: Math.round(file.size / (1024 * 1024) * 100) / 100,
          model: "whisper-large-v3",
          provider: "groq",
          processed: true,
          realTranscription: true
        }
      });

    } catch (transcriptionError: any) {
      console.error("❌ Groq transcription failed:", transcriptionError);
      console.error("❌ Error details:", {
        message: transcriptionError.message,
        status: transcriptionError.status,
        code: transcriptionError.code,
        type: transcriptionError.type
      });
      
      // Fallback to mock transcription if Groq fails
      console.log("🔄 Falling back to mock transcription due to API error");
      
      const mockTranscriptions = [
        "Thank you for the question. I have experience working with React and TypeScript to build scalable web applications.",
        "In my previous role, I worked on optimizing database queries which improved performance by 40%.",
        "I believe my background in full-stack development makes me a good fit for this position.",
        "I enjoy collaborating with cross-functional teams to deliver high-quality software solutions.",
        "My approach to problem-solving involves breaking down complex issues into manageable components."
      ];
      
      const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      console.log("Returning mock transcription:", randomTranscription);
      
      return NextResponse.json({ 
        text: randomTranscription,
        metadata: {
          fileSize: file.size,
          fileType: file.type,
          fileSizeMB: Math.round(file.size / (1024 * 1024) * 100) / 100,
          fallback: true,
          error: transcriptionError.message,
          processed: true
        }
      });
    }
    
  } catch (error) {
    console.error("STT error:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio: " + (error as Error).message },
      { status: 500 }
    );
  }
} 