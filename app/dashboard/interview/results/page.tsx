'use client'

import { useState, useEffect } from 'react'
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
  Share2
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

export default function InterviewResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session')

  const [session, setSession] = useState<InterviewSessionWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided')
      setIsLoading(false)
      return
    }

    loadSessionResults()
  }, [sessionId])

  const loadSessionResults = async () => {
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
            overallScore: averageScore
          })
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
  }

  const calculateAverageScore = (answers: InterviewAnswer[]): number => {
    const scoredAnswers = answers.filter(answer => answer.score !== null && answer.score !== undefined)
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white p-8">
          <div className="flex items-center space-x-4">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold">Loading Results...</h3>
              <p className="text-blue-200">Analyzing your interview performance</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <BackToDashboard variant="minimal" />
          </div>
          
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-8">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Results Not Found</h2>
                <p className="text-blue-200 mb-6">{error || 'Could not load interview results'}</p>
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
        <div className="flex items-center justify-between mb-6">
          <BackToDashboard variant="minimal" />
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="border-white/40 text-white hover:bg-white/20 hover:border-white/60 bg-white/10 backdrop-blur-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              className="border-white/40 text-white hover:bg-white/20 hover:border-white/60 bg-white/10 backdrop-blur-sm"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 bg-gradient-to-br ${getScoreGradient(averageScore)} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Interview Complete!</h1>
          <p className="text-blue-200">
            {session.domain} • {formatDuration(session.start_time, session.end_time)}
          </p>
        </div>

        {/* Overall Score */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Overall Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(averageScore)} mb-2`}>
                    {averageScore}/10
                  </div>
                  <div className="text-blue-200">Average Score</div>
                  <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${averageScore * 10}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-300 mb-2">
                    {completedQuestions}/{totalQuestions}
                  </div>
                  <div className="text-blue-200">Questions Completed</div>
                  <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-300 mb-2">
                    {formatDuration(session.start_time, session.end_time)}
                  </div>
                  <div className="text-blue-200">Total Duration</div>
                  <div className="mt-2 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question-by-Question Results */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-white mb-4">Question Analysis</h2>
          
          {session.questions.map((question, index) => {
            const answer = session.answers.find(a => a.question_index === index)
            const hasAnswer = !!answer
            const score = answer?.score || 0
            const feedback = answer?.feedback

            return (
              <Card key={question.id} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
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
                  <div className="p-4 bg-white/10 rounded-lg">
                    <p className="text-blue-100">{question.question_text}</p>
                  </div>

                  {hasAnswer && (
                    <>
                      <div>
                        <h4 className="font-semibold text-blue-200 mb-2">Your Answer:</h4>
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-sm text-blue-100">{answer.transcript || answer.answer_text}</p>
                        </div>
                      </div>

                      {feedback && (
                        <div className="space-y-3">
                          {feedback.strengths && feedback.strengths.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-green-300 mb-2 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Strengths
                              </h4>
                              <ul className="space-y-1">
                                {feedback.strengths.map((strength: string, i: number) => (
                                  <li key={i} className="text-sm text-green-200 flex items-start">
                                    <Star className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {feedback.improvements && feedback.improvements.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-yellow-300 mb-2 flex items-center">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Areas for Improvement
                              </h4>
                              <ul className="space-y-1">
                                {feedback.improvements.map((improvement: string, i: number) => (
                                  <li key={i} className="text-sm text-yellow-200 flex items-start">
                                    <Target className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                                    {improvement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {feedback.tips && feedback.tips.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-blue-300 mb-2 flex items-center">
                                <Lightbulb className="w-4 h-4 mr-2" />
                                Tips for Next Time
                              </h4>
                              <ul className="space-y-1">
                                {feedback.tips.map((tip: string, i: number) => (
                                  <li key={i} className="text-sm text-blue-200 flex items-start">
                                    <MessageSquare className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {feedback.detailed_feedback && (
                            <div>
                              <h4 className="font-semibold text-purple-300 mb-2">Detailed Feedback</h4>
                              <p className="text-sm text-purple-200 bg-white/5 p-3 rounded-lg">
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
        <div className="max-w-4xl mx-auto mt-8 flex justify-center space-x-4">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="border-white/40 text-white hover:bg-white/20 hover:border-white/60 bg-white/10 backdrop-blur-sm px-6 py-2"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={() => router.push('/dashboard/interview')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 shadow-lg"
          >
            Practice Again
          </Button>
        </div>
      </div>
    </div>
  )
} 