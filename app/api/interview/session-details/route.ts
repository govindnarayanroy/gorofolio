import { NextRequest, NextResponse } from 'next/server'
import { getServerInterviewSessionWithDetails } from '@/lib/interview-database'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    
    if (!sessionId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Session ID is required' 
      }, { status: 400 })
    }

    // Create server-side Supabase client with proper authentication
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('Authentication error:', authError)
      return NextResponse.json({ 
        success: false, 
        error: 'User not authenticated' 
      }, { status: 401 })
    }

    // Use server-side function with user ID
    const sessionData = await getServerInterviewSessionWithDetails(sessionId, user.id)
    
    if (!sessionData) {
      return NextResponse.json({ 
        success: false, 
        error: 'Session not found or access denied' 
      }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      data: sessionData 
    })
  } catch (error) {
    console.error('Error fetching interview session details:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
} 