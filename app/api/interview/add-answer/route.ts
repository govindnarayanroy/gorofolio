import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, questionId, questionIndex, answer, score, feedback } = await request.json()

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
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not authenticated',
        },
        { status: 401 }
      )
    }

    // Prepare the data to insert
    const insertData: any = {
      session_id: sessionId,
      question_id: null, // Set to null since we're not storing questions separately yet
      question_index: questionIndex,
      transcript: answer,
    }

    // Add score and feedback if provided
    if (score !== undefined && score !== null) {
      insertData.score = score
    }

    if (feedback !== undefined && feedback !== null) {
      // Convert feedback array to JSONB format expected by database
      if (Array.isArray(feedback)) {
        insertData.feedback = { tips: feedback }
      } else if (typeof feedback === 'object') {
        insertData.feedback = feedback
      }
    }

    // Add interview answer with score and feedback
    const { data, error } = await supabase
      .from('interview_answers')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Error adding interview answer:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to add interview answer',
        },
        { status: 500 }
      )
    }

    console.log('✅ Answer submitted successfully:', data)

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Error adding interview answer:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
