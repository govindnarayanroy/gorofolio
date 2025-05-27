import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { domain, jobDescription, customJobPosition } = await request.json()
    
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

    // Create interview session
    const { data, error } = await supabase
      .from('interview_sessions')
      .insert({
        user_id: user.id,
        domain,
        job_description: jobDescription,
        custom_job_position: customJobPosition,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating interview session:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create interview session' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      data 
    })
  } catch (error) {
    console.error('Error creating interview session:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
} 