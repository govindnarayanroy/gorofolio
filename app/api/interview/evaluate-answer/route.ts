import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, questionId, questionText, answer, category, difficulty, domain } = await request.json()
    
    // For now, provide basic evaluation without LLM
    // In the future, this could integrate with LLM for detailed feedback
    const evaluation = {
      score: Math.floor(Math.random() * 3) + 3, // Random score between 3-5 for demo
      feedback: {
        tips: [
          "Consider providing more specific examples",
          "Try to structure your answer with clear points",
          "Think about the business impact of your solution"
        ],
        detailed_feedback: "Your answer shows good understanding of the topic. Consider adding more concrete examples to strengthen your response.",
        strengths: ["Clear communication", "Good technical knowledge"],
        improvements: ["Add more specific examples", "Consider edge cases"]
      }
    }

    return NextResponse.json({ 
      success: true, 
      evaluation,
      message: "Answer evaluated successfully"
    })
  } catch (error) {
    console.error('Error evaluating answer:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
} 