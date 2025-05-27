import { NextRequest, NextResponse } from 'next/server'
import { completeInterviewSession } from '@/lib/interview-database'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, overallScore } = await request.json()
    
    if (!sessionId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Session ID is required' 
      }, { status: 400 })
    }
    
    const result = await completeInterviewSession(sessionId, overallScore)
    
    return NextResponse.json({ 
      success: true, 
      data: result 
    })
  } catch (error) {
    console.error('Error completing interview session:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
} 