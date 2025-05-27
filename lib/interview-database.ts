import { createClient } from './supabase'
import { createClient as createServerClient } from './supabase-server'

export interface InterviewSession {
  id: string
  user_id: string
  domain: string
  job_description?: string
  custom_job_position?: string
  start_time: string
  end_time?: string
  overall_score?: number
  is_complete: boolean
  created_at: string
  updated_at: string
}

export interface InterviewQuestion {
  id: string
  session_id: string
  question_index: number
  question_text: string
  category?: string
  difficulty_level: string
  generated_by: string
  created_at: string
}

export interface InterviewAnswer {
  id: string
  session_id: string
  question_id: string
  question_index: number
  transcript: string
  score?: number
  feedback?: {
    tips: string[]
    detailed_feedback?: string
    strengths?: string[]
    improvements?: string[]
  }
  audio_duration?: number
  created_at: string
  updated_at: string
}

export interface InterviewSessionWithDetails extends InterviewSession {
  questions: InterviewQuestion[]
  answers: InterviewAnswer[]
}

// Client-side functions
export async function createInterviewSession(
  domain: string,
  jobDescription?: string,
  customJobPosition?: string
): Promise<InterviewSession | null> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

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
    return null
  }

  return data
}

export async function updateInterviewSession(
  sessionId: string,
  updates: Partial<InterviewSession>
): Promise<InterviewSession | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('interview_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single()

  if (error) {
    console.error('Error updating interview session:', error)
    return null
  }

  return data
}

export async function completeInterviewSession(
  sessionId: string,
  overallScore: number
): Promise<InterviewSession | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('interview_sessions')
    .update({
      end_time: new Date().toISOString(),
      overall_score: overallScore,
      is_complete: true,
    })
    .eq('id', sessionId)
    .select()
    .single()

  if (error) {
    console.error('Error completing interview session:', error)
    return null
  }

  return data
}

export async function addInterviewQuestion(
  sessionId: string,
  questionIndex: number,
  questionText: string,
  category?: string,
  difficultyLevel: string = 'medium'
): Promise<InterviewQuestion | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('interview_questions')
    .insert({
      session_id: sessionId,
      question_index: questionIndex,
      question_text: questionText,
      category,
      difficulty_level: difficultyLevel,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding interview question:', error)
    return null
  }

  return data
}

export async function addInterviewAnswer(
  sessionId: string,
  questionId: string,
  questionIndex: number,
  transcript: string,
  audioDuration?: number
): Promise<InterviewAnswer | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('interview_answers')
    .insert({
      session_id: sessionId,
      question_id: questionId,
      question_index: questionIndex,
      transcript,
      audio_duration: audioDuration,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding interview answer:', error)
    return null
  }

  return data
}

export async function updateInterviewAnswer(
  answerId: string,
  score: number,
  feedback: InterviewAnswer['feedback']
): Promise<InterviewAnswer | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('interview_answers')
    .update({
      score,
      feedback,
    })
    .eq('id', answerId)
    .select()
    .single()

  if (error) {
    console.error('Error updating interview answer:', error)
    return null
  }

  return data
}

export async function getUserInterviewSessions(
  limit: number = 10
): Promise<InterviewSession[]> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching interview sessions:', error)
    return []
  }

  return data || []
}

export async function getInterviewSessionWithDetails(
  sessionId: string
): Promise<InterviewSessionWithDetails | null> {
  const supabase = createClient()

  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error('User not authenticated')
      return null
    }

    // Get session with user verification
    const { data: session, error: sessionError } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id) // Ensure user owns this session
      .maybeSingle() // Use maybeSingle instead of single to handle no results

    if (sessionError) {
      console.error('Error fetching interview session:', sessionError)
      return null
    }

    if (!session) {
      console.error('Interview session not found or access denied:', sessionId)
      return null
    }

    // Get questions
    const { data: questions, error: questionsError } = await supabase
      .from('interview_questions')
      .select('*')
      .eq('session_id', sessionId)
      .order('question_index')

    if (questionsError) {
      console.error('Error fetching interview questions:', questionsError)
      return null
    }

    // Get answers
    const { data: answers, error: answersError } = await supabase
      .from('interview_answers')
      .select('*')
      .eq('session_id', sessionId)
      .order('question_index')

    if (answersError) {
      console.error('Error fetching interview answers:', answersError)
      return null
    }

    return {
      ...session,
      questions: questions || [],
      answers: answers || [],
    }
  } catch (error) {
    console.error('Unexpected error in getInterviewSessionWithDetails:', error)
    return null
  }
}

// Server-side functions
export async function getServerUserInterviewSessions(
  userId: string,
  limit: number = 10
): Promise<InterviewSession[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching interview sessions:', error)
    return []
  }

  return data || []
}

export async function getServerInterviewSessionWithDetails(
  sessionId: string,
  userId: string
): Promise<InterviewSessionWithDetails | null> {
  const supabase = await createServerClient()

  // Get session
  const { data: session, error: sessionError } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single()

  if (sessionError) {
    console.error('Error fetching interview session:', sessionError)
    return null
  }

  // Get questions
  const { data: questions, error: questionsError } = await supabase
    .from('interview_questions')
    .select('*')
    .eq('session_id', sessionId)
    .order('question_index')

  if (questionsError) {
    console.error('Error fetching interview questions:', questionsError)
    return null
  }

  // Get answers
  const { data: answers, error: answersError } = await supabase
    .from('interview_answers')
    .select('*')
    .eq('session_id', sessionId)
    .order('question_index')

  if (answersError) {
    console.error('Error fetching interview answers:', answersError)
    return null
  }

  return {
    ...session,
    questions: questions || [],
    answers: answers || [],
  }
} 