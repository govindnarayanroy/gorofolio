'use client'

import { Suspense } from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { BackToDashboard } from '@/components/BackToDashboard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Trophy,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Star,
  BarChart3,
  Lightbulb,
  RefreshCw,
  Download,
  Share2,
} from 'lucide-react'

// Define types locally to avoid importing from server-side module
interface InterviewAnswer {
  id: string
  session_id: string
  question_id: string
  question_index: number
  answer_text: string
  transcript?: string
  score?: number
  feedback?: {
    strengths?: string[]
    improvements?: string[]
    tips?: string[]
    detailed_feedback?: string
  }
  created_at: string
}

interface InterviewQuestion {
  id: string
  session_id: string
  question_text: string
  category: string
  difficulty: string
  difficulty_level?: string
  question_index: number
  created_at: string
}

interface InterviewSessionWithDetails {
  id: string
  user_id: string
  domain: string
  job_description?: string
  custom_job_position?: string
  overall_score?: number
  is_complete: boolean
  start_time: string
  end_time?: string
  created_at: string
  updated_at: string
  questions: InterviewQuestion[]
  answers: InterviewAnswer[]
}

function InterviewResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session')

  const [session, setSession] = useState<InterviewSessionWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSessionResults = useCallback(async () => {
    try {
      setIsLoading(true)

      // Fetch session details via API
      const response = await fetch(`/api/interview/session-details?sessionId=${sessionId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch session details')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch session details')
      }

      const sessionData = result.data
      if (!sessionData) {
        throw new Error('Session not found')
      }

      setSession(sessionData)

      // Complete the session if not already completed
      if (!sessionData.is_complete && sessionData.answers.length > 0) {
        const averageScore = calculateAverageScore(sessionData.answers)

        const completeResponse = await fetch('/api/interview/complete-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionId!,
            overallScore: averageScore,
          }),
        })

        if (!completeResponse.ok) {
          console.warn('Failed to complete session, but continuing...')
        }
      }
    } catch (err) {
      console.error('Error loading session results:', err)
      setError(err instanceof Error ? err.message : 'Failed to load results')
    } finally {
      setIsLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided')
      setIsLoading(false)
      return
    }

    loadSessionResults()
  }, [sessionId, loadSessionResults])

  const calculateAverageScore = (answers: InterviewAnswer[]): number => {
    const scoredAnswers = answers.filter(
      answer => answer.score !== null && answer.score !== undefined
    )
    if (scoredAnswers.length === 0) return 7 // Default score

    const totalScore = scoredAnswers.reduce((sum, answer) => sum + (answer.score || 0), 0)
    return Math.round(totalScore / scoredAnswers.length)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 8) return 'from-green-500 to-emerald-600'
    if (score >= 6) return 'from-yellow-500 to-orange-600'
    return 'from-red-500 to-pink-600'
  }

  const formatDuration = (startTime: string, endTime?: string) => {
    // For interview duration, use the first and last answer timestamps if available
    if (session && session.answers && session.answers.length > 0) {
      const firstAnswer = session.answers[0]
      const lastAnswer = session.answers[session.answers.length - 1]

      if (firstAnswer && lastAnswer) {
        const start = new Date(firstAnswer.created_at)
        const end = new Date(lastAnswer.created_at)
        const diff = Math.floor((end.getTime() - start.getTime()) / 1000)

        const hours = Math.floor(diff / 3600)
        const minutes = Math.floor((diff % 3600) / 60)
        const seconds = diff % 60

        if (hours > 0) {
          return `${hours}h ${minutes}m ${seconds}s`
        } else if (minutes > 0) {
          return `${minutes}m ${seconds}s`
        } else {
          return `${seconds}s`
        }
      }
    }

    // Fallback to session times if no answers available
    const start = new Date(startTime)
    const end = endTime ? new Date(endTime) : new Date()
    const diff = Math.floor((end.getTime() - start.getTime()) / 1000)

    const hours = Math.floor(diff / 3600)
    const minutes = Math.floor((diff % 3600) / 60)
    const seconds = diff % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center text-white">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
            <p>Loading interview results...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <BackToDashboard variant="minimal" />
          </div>

          <div className="mx-auto max-w-2xl text-center">
            <Card className="border-white/20 bg-white/10 text-white backdrop-blur-md">
              <CardContent className="p-8">
                <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
                <h2 className="mb-2 text-2xl font-bold">Results Not Found</h2>
                <p className="mb-6 text-blue-200">{error || 'Could not load interview results'}</p>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const averageScore = calculateAverageScore(session.answers)
  const completedQuestions = session.answers.length
  const totalQuestions = session.questions.length
  const completionRate = (completedQuestions / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <BackToDashboard variant="minimal" />
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="border-white/40 bg-white/10 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/20"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              className="border-white/40 bg-white/10 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/20"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div
            className={`h-20 w-20 bg-gradient-to-br ${getScoreGradient(averageScore)} mx-auto mb-4 flex items-center justify-center rounded-full`}
          >
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white">Interview Complete!</h1>
          <p className="text-blue-200">
            {session.domain} • {formatDuration(session.start_time, session.end_time)}
          </p>
        </div>

        {/* Overall Score */}
        <div className="mx-auto mb-8 max-w-4xl">
          <Card className="border-white/20 bg-white/10 text-white backdrop-blur-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Overall Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(averageScore)} mb-2`}>
                    {averageScore}/10
                  </div>
                  <div className="text-blue-200">Average Score</div>
                  <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                      style={{ width: `${averageScore * 10}%` }}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="mb-2 text-4xl font-bold text-blue-300">
                    {completedQuestions}/{totalQuestions}
                  </div>
                  <div className="text-blue-200">Questions Completed</div>
                  <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="mb-2 text-4xl font-bold text-purple-300">
                    {formatDuration(session.start_time, session.end_time)}
                  </div>
                  <div className="text-blue-200">Total Duration</div>
                  <div className="mt-2 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question-by-Question Results */}
        <div className="mx-auto max-w-4xl space-y-6">
          <h2 className="mb-4 text-2xl font-bold text-white">Question Analysis</h2>

          {session.questions.map((question, index) => {
            const answer = session.answers.find(a => a.question_index === index)
            const hasAnswer = !!answer
            const score = answer?.score || 0
            const feedback = answer?.feedback

            return (
              <Card
                key={question.id}
                className="border-white/20 bg-white/10 text-white backdrop-blur-md"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                        <div className="mt-1 flex items-center space-x-2">
                          <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                            {question.category}
                          </Badge>
                          <Badge variant="outline" className="border-yellow-500/30 text-yellow-300">
                            {question.difficulty_level || question.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {hasAnswer ? (
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                          {score}/10
                        </div>
                        <div className="text-sm text-blue-200">Score</div>
                      </div>
                    ) : (
                      <div className="text-right">
                        <div className="text-lg text-gray-400">—</div>
                        <div className="text-sm text-blue-200">Not answered</div>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-white/10 p-4">
                    <p className="text-blue-100">{question.question_text}</p>
                  </div>

                  {hasAnswer && (
                    <>
                      <div>
                        <h4 className="mb-2 font-semibold text-blue-200">Your Answer:</h4>
                        <div className="rounded-lg bg-white/5 p-3">
                          <p className="text-sm text-blue-100">
                            {answer.transcript || answer.answer_text}
                          </p>
                        </div>
                      </div>

                      {feedback && (
                        <div className="space-y-3">
                          {feedback.strengths && feedback.strengths.length > 0 && (
                            <div>
                              <h4 className="mb-2 flex items-center font-semibold text-green-300">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Strengths
                              </h4>
                              <ul className="space-y-1">
                                {feedback.strengths.map((strength: string, i: number) => (
                                  <li key={i} className="flex items-start text-sm text-green-200">
                                    <Star className="mr-2 mt-0.5 h-3 w-3 flex-shrink-0" />
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {feedback.improvements && feedback.improvements.length > 0 && (
                            <div>
                              <h4 className="mb-2 flex items-center font-semibold text-yellow-300">
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Areas for Improvement
                              </h4>
                              <ul className="space-y-1">
                                {feedback.improvements.map((improvement: string, i: number) => (
                                  <li key={i} className="flex items-start text-sm text-yellow-200">
                                    <Target className="mr-2 mt-0.5 h-3 w-3 flex-shrink-0" />
                                    {improvement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {feedback.tips && feedback.tips.length > 0 && (
                            <div>
                              <h4 className="mb-2 flex items-center font-semibold text-blue-300">
                                <Lightbulb className="mr-2 h-4 w-4" />
                                Tips for Next Time
                              </h4>
                              <ul className="space-y-1">
                                {feedback.tips.map((tip: string, i: number) => (
                                  <li key={i} className="flex items-start text-sm text-blue-200">
                                    <MessageSquare className="mr-2 mt-0.5 h-3 w-3 flex-shrink-0" />
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {feedback.detailed_feedback && (
                            <div>
                              <h4 className="mb-2 font-semibold text-purple-300">
                                Detailed Feedback
                              </h4>
                              <p className="rounded-lg bg-white/5 p-3 text-sm text-purple-200">
                                {feedback.detailed_feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="mx-auto mt-8 flex max-w-4xl justify-center space-x-4">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="border-white/40 bg-white/10 px-6 py-2 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/20"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={() => router.push('/dashboard/interview')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 text-white shadow-lg hover:from-blue-600 hover:to-purple-700"
          >
            Practice Again
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function InterviewResults() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
          <div className="mx-auto max-w-4xl">
            <div className="text-center text-white">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
              <p>Loading interview results...</p>
            </div>
          </div>
        </div>
      }
    >
      <InterviewResultsContent />
    </Suspense>
  )
}
