import { NextRequest, NextResponse } from 'next/server'
import { getRandomQuestionSet, getDomainTitle } from '@/lib/interview'
import { Domain } from '@/lib/types/interview'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { chatLLM } from '@/lib/llmClient'

// Define static domains that have predefined question sets
const STATIC_DOMAINS = ['backend', 'frontend', 'pm'];

async function generateDynamicQuestions(
  domain: string, 
  jobDescription?: string, 
  customJobPosition?: string
): Promise<Array<{ question: string; category: string; difficulty: string; reasoning: string }>> {
  try {
    const prompt = `You are an expert interview coach. Generate 10 high-quality interview questions for a ${domain} role.

${customJobPosition ? `## Target Position: ${customJobPosition}` : ''}
${jobDescription ? `## Job Description:\n${jobDescription}` : ''}

## Requirements:
- Generate exactly 10 questions
- Questions should be relevant to ${domain} domain
- Mix of behavioral, technical, and situational questions
- Include appropriate difficulty levels (easy, medium, hard)
- Categorize each question appropriately

## Response Format:
Return ONLY a valid JSON array with this exact structure:

[
  {
    "question": "Tell me about a challenging ${domain} project you worked on.",
    "category": "Experience",
    "difficulty": "medium",
    "reasoning": "Assesses practical experience and problem-solving skills"
  }
]

Generate questions that are:
1. Specific to ${domain} field
2. Relevant to the job description (if provided)
3. Progressive in difficulty
4. Cover different aspects of the role

Do not include any text outside the JSON array.`;

    const response = await chatLLM(
      "groq",
      "llama3-70b-8192",
      [{ role: "user", content: prompt }]
    );

    if (!response?.content) {
      throw new Error("No content in LLM response");
    }

    // Clean and parse the JSON response
    let jsonContent = response.content.trim();
    
    // Remove markdown code blocks if present
    const jsonMatch = jsonContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    }
    
    // Find the JSON array
    const arrayStart = jsonContent.indexOf('[');
    const arrayEnd = jsonContent.lastIndexOf(']');
    if (arrayStart !== -1 && arrayEnd !== -1) {
      jsonContent = jsonContent.substring(arrayStart, arrayEnd + 1);
    }

    const questions = JSON.parse(jsonContent);
    
    // Validate the structure
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Invalid questions format");
    }

    // Ensure each question has required fields
    return questions.map((q, index) => ({
      question: q.question || `Question ${index + 1} for ${domain}`,
      category: q.category || 'General',
      difficulty: q.difficulty || 'medium',
      reasoning: q.reasoning || `Generated question for ${domain} interview`
    }));

  } catch (error) {
    console.error('Error generating dynamic questions:', error);
    
    // Fallback to generic questions for the domain
    const fallbackQuestions = [
      {
        question: `Tell me about your experience in ${domain}.`,
        category: "Experience",
        difficulty: "easy",
        reasoning: `Basic experience question for ${domain}`
      },
      {
        question: `What are the biggest challenges in ${domain} today?`,
        category: "Industry Knowledge",
        difficulty: "medium", 
        reasoning: `Industry awareness for ${domain}`
      },
      {
        question: `Describe a successful project you've worked on in ${domain}.`,
        category: "Project Experience",
        difficulty: "medium",
        reasoning: `Project-based question for ${domain}`
      },
      {
        question: `How do you stay updated with the latest trends in ${domain}?`,
        category: "Professional Development",
        difficulty: "easy",
        reasoning: `Learning mindset for ${domain}`
      },
      {
        question: `What tools and technologies do you use in ${domain}?`,
        category: "Technical Skills",
        difficulty: "medium",
        reasoning: `Technical proficiency for ${domain}`
      },
      {
        question: `How do you handle tight deadlines in ${domain} projects?`,
        category: "Time Management",
        difficulty: "medium",
        reasoning: `Pressure handling for ${domain}`
      },
      {
        question: `Describe a time when you had to learn something new quickly in ${domain}.`,
        category: "Adaptability",
        difficulty: "medium",
        reasoning: `Learning agility for ${domain}`
      },
      {
        question: `What metrics do you use to measure success in ${domain}?`,
        category: "Performance Metrics",
        difficulty: "hard",
        reasoning: `Success measurement for ${domain}`
      },
      {
        question: `How do you collaborate with other teams in ${domain} projects?`,
        category: "Collaboration",
        difficulty: "medium",
        reasoning: `Teamwork skills for ${domain}`
      },
      {
        question: `Where do you see ${domain} heading in the next 5 years?`,
        category: "Future Vision",
        difficulty: "hard",
        reasoning: `Strategic thinking for ${domain}`
      }
    ];

    return fallbackQuestions;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { domain, jobDescription, customJobPosition, sessionId } = await request.json()
    
    if (!domain || !sessionId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Domain and session ID are required' 
      }, { status: 400 })
    }

    // Create server-side Supabase client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not authenticated' 
      }, { status: 401 })
    }

    let formattedQuestions;

    // Check if this is a static domain or custom domain
    if (STATIC_DOMAINS.includes(domain.toLowerCase())) {
      // Use static question sets for predefined domains
      const questions = getRandomQuestionSet(domain as Domain)
      
      formattedQuestions = questions.map((q, index) => ({
        question: q.text,
        category: q.category || 'General',
        difficulty: 'medium',
        reasoning: `Question ${index + 1} for ${getDomainTitle(domain as Domain)} interview`
      }))
    } else {
      // Generate dynamic questions for custom domains
      console.log(`🤖 Generating dynamic questions for custom domain: ${domain}`)
      formattedQuestions = await generateDynamicQuestions(domain, jobDescription, customJobPosition)
    }

    // Ensure we have questions
    if (!formattedQuestions || formattedQuestions.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to generate questions' 
      }, { status: 500 })
    }

    // Save questions to database
    const questionsToInsert = formattedQuestions.map((q, index) => ({
      session_id: sessionId,
      question_index: index,
      question_text: q.question,
      category: q.category,
      difficulty_level: q.difficulty,
      generated_by: STATIC_DOMAINS.includes(domain.toLowerCase()) ? 'static' : 'llm'
    }))

    const { data: savedQuestions, error: insertError } = await supabase
      .from('interview_questions')
      .insert(questionsToInsert)
      .select()

    if (insertError) {
      console.error('Error saving questions to database:', insertError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to save questions to database' 
      }, { status: 500 })
    }

    console.log(`✅ Successfully saved ${savedQuestions.length} questions to database for session ${sessionId}`)

    return NextResponse.json({ 
      success: true, 
      questions: formattedQuestions,
      domain,
      sessionId,
      questionType: STATIC_DOMAINS.includes(domain.toLowerCase()) ? 'static' : 'dynamic'
    })
  } catch (error) {
    console.error('Error generating questions:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
} 