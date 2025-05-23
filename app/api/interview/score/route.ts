import { NextResponse } from "next/server";
import { chatLLM } from "@/lib/llmClient";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    let result;
    try {
      console.log("🧠 Attempting to score answer with LLM...");
      
      const response = await chatLLM("groq", "llama3-8b-8192", [
        { 
          role: "system", 
          content: "You are a strict interviewer evaluating the candidate's answer. Respond with ONLY a JSON object containing 'score' (0-10) and 'tips' (array of strings). Example: {\"score\": 7, \"tips\": [\"Be more specific\", \"Add examples\"]}" 
        },
        { role: "user", content: prompt }
      ]);

      console.log("✅ LLM scoring successful");
      
      try {
        // Try to parse as JSON first
        result = JSON.parse(response.content || "{}");
      } catch (parseError) {
        // If JSON parsing fails, extract score and tips from text
        const content = response.content || "";
        
        // Extract score using regex
        const scoreMatch = content.match(/score[\"']?\s*:\s*[\"']?(\d+)/i) || content.match(/(\d+)\/10/);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 5; // Default to 5 if no score found
        
        // Extract tips - look for bullet points, numbered lists, or sentences with "tip" or "improve"
        const tips = [];
        const lines = content.split('\n');
        for (const line of lines) {
          if (line.match(/^[•\-\*]\s+/) || line.match(/^\d+\.\s+/) || line.toLowerCase().includes('tip') || line.toLowerCase().includes('improve')) {
            const cleanTip = line.replace(/^[•\-\*\d\.\s]+/, '').trim();
            if (cleanTip) tips.push(cleanTip);
          }
        }
        
        // If no tips found, provide a generic one
        if (tips.length === 0) {
          tips.push("Practice your communication skills and provide more detailed answers.");
        }
        
        result = { score, tips };
      }

    } catch (llmError: any) {
      console.warn("⚠️ LLM scoring failed:", llmError.message);
      
      // Handle rate limiting with fallback mock scoring
      if (llmError.message?.includes("429") || llmError.message?.includes("Rate limit")) {
        console.log("📊 Using fallback scoring due to rate limit");
        result = generateMockScore(prompt);
      } else {
        // For other errors, still provide a fallback
        console.log("📊 Using fallback scoring due to API error");
        result = generateMockScore(prompt);
      }
    }

    const { score = 5, tips = [] } = result;

    return NextResponse.json({ score, tips });
  } catch (error) {
    console.error("Scoring error:", error);
    
    // Final fallback - provide a reasonable mock score
    const fallbackResult = generateMockScore("");
    return NextResponse.json(fallbackResult);
  }
}

function generateMockScore(prompt: string): { score: number; tips: string[] } {
  // Generate a reasonable score based on answer length and content
  const answerLength = prompt.length;
  let score = 5; // Base score
  
  // Adjust score based on answer characteristics
  if (answerLength > 200) score += 2; // Detailed answer
  else if (answerLength > 100) score += 1; // Good length
  else if (answerLength < 30) score -= 2; // Too short
  
  if (prompt.toLowerCase().includes("experience")) score += 1;
  if (prompt.toLowerCase().includes("project")) score += 1;
  if (prompt.toLowerCase().includes("team")) score += 1;
  if (prompt.toLowerCase().includes("challenge")) score += 1;
  
  // Ensure score is within bounds
  score = Math.max(1, Math.min(10, score));
  
  // Generate contextual tips
  const tips = [];
  if (answerLength < 50) {
    tips.push("Provide more detailed examples to support your answer");
  }
  if (!prompt.toLowerCase().includes("example")) {
    tips.push("Include specific examples from your experience");
  }
  if (answerLength > 300) {
    tips.push("Keep your answers concise and focused on key points");
  } else {
    tips.push("Consider elaborating on the impact of your work");
  }
  
  tips.push("Practice speaking clearly and at an appropriate pace");
  
  return { score, tips: tips.slice(0, 3) }; // Limit to 3 tips
} 