import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
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
        error: 'User not authenticated',
        user: user ? 'exists' : 'null',
        authError: authError?.message
      }, { status: 401 })
    }

    // Test database tables
    const results: Record<string, any> = {}

    // Test interview_sessions table
    try {
      const { data: sessions, error: sessionsError } = await supabase
        .from('interview_sessions')
        .select('*')
        .limit(1)
      
      results.interview_sessions = {
        exists: !sessionsError,
        error: sessionsError?.message,
        count: sessions?.length || 0
      }
    } catch (err) {
      results.interview_sessions = {
        exists: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test interview_questions table
    try {
      const { data: questions, error: questionsError } = await supabase
        .from('interview_questions')
        .select('*')
        .limit(1)
      
      results.interview_questions = {
        exists: !questionsError,
        error: questionsError?.message,
        count: questions?.length || 0
      }
    } catch (err) {
      results.interview_questions = {
        exists: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test interview_answers table
    try {
      const { data: answers, error: answersError } = await supabase
        .from('interview_answers')
        .select('*')
        .limit(1)
      
      results.interview_answers = {
        exists: !answersError,
        error: answersError?.message,
        count: answers?.length || 0
      }
    } catch (err) {
      results.interview_answers = {
        exists: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email
      },
      tables: results
    })
  } catch (error) {
    console.error('Error testing database:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
} 