import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Update the session status to aborted
    const { error: updateError } = await supabase
      .from('interview_sessions')
      .update({ 
        status: 'aborted',
        completed: true,
        end_time: new Date().toISOString()
      })
      .eq('id', sessionId)
      .eq('user_id', session.user.id)

    if (updateError) {
      console.error('Error updating session status:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update session status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in abort-session route:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 