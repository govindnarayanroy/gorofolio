'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { BackToDashboard } from '@/components/BackToDashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Recorder } from '@/components/Recorder'
import {
  Mic,
  MicOff,
  Play,
  Pause,
  SkipForward,
  CheckCircle,
  Clock,
  Target,
  Briefcase,
  FileText,
  Loader2,
  AlertCircle,
  Trophy,
  Volume2,
} from 'lucide-react'

interface Question {
  question: string
  category: string
  difficulty: string
  reasoning?: string
}

interface InterviewState {
  sessionId: string | null
  questions: Question[]
  currentQuestionIndex: number
  answers: string[]
  isRecording: boolean
  isLoading: boolean
  isComplete: boolean
  startTime: Date | null
}

function InterviewSessionContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const domain = searchParams.get('domain') || 'backend'

  const [jobDescription, setJobDescription] = useState('')
  const [customJobPosition, setCustomJobPosition] = useState('')
  const [showJobInputs, setShowJobInputs] = useState(true)
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isScoring, setIsScoring] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string[]>([])
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [interviewState, setInterviewState] = useState<InterviewState>({
    sessionId: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    isRecording: false,
    isLoading: false,
    isComplete: false,
    startTime: null,
  })

  // Initialize from URL parameters (for cover letter integration)
  useEffect(() => {
    const role = searchParams.get('role')
    const jd = searchParams.get('jd')

    if (role) {
      setCustomJobPosition(decodeURIComponent(role))
    }

    if (jd) {
      setJobDescription(decodeURIComponent(jd))
    }
  }, [searchParams])

  const startInterview = async () => {
    setInterviewState(prev => ({ ...prev, isLoading: true }))
    setError('')

    try {
      // Create interview session
      const sessionResponse = await fetch('/api/interview/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          domain,
          jobDescription: jobDescription.trim() || null,
          customJobPosition: customJobPosition.trim() || null,
        }),
      })

      if (!sessionResponse.ok) {
        throw new Error('Failed to create interview session')
      }

      const sessionResult = await sessionResponse.json()
      if (!sessionResult.success) {
        throw new Error(sessionResult.error || 'Failed to create interview session')
      }

      const sessionId = sessionResult.data.id

      // Generate questions (this will now save them to the database)
      const questionsResponse = await fetch('/api/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          domain,
          jobDescription: jobDescription.trim() || null,
          customJobPosition: customJobPosition.trim() || null,
          sessionId,
        }),
      })

      if (!questionsResponse.ok) {
        throw new Error('Failed to generate questions')
      }

      const questionsResult = await questionsResponse.json()
      if (!questionsResult.success) {
        throw new Error(questionsResult.error || 'Failed to generate questions')
      }

      // Fetch questions from database to ensure we have the complete data
      const dbQuestionsResponse = await fetch(
        `/api/interview/session-details?sessionId=${sessionId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      )

      let questionsFromDb = questionsResult.questions // fallback to API response

      if (dbQuestionsResponse.ok) {
        const dbResult = await dbQuestionsResponse.json()
        if (
          dbResult.success &&
          dbResult.data &&
          dbResult.data.questions &&
          dbResult.data.questions.length > 0
        ) {
          // Transform database questions to match frontend format
          questionsFromDb = dbResult.data.questions.map((q: any) => ({
            question: q.question_text,
            category: q.category || 'General',
            difficulty: q.difficulty_level || 'medium',
            reasoning: `Question ${q.question_index + 1} for ${domain} interview`,
          }))
          console.log(`✅ Loaded ${questionsFromDb.length} questions from database`)
        } else {
          console.log('⚠️ No questions found in database, using API response')
        }
      } else {
        console.log('⚠️ Failed to fetch from database, using API response')
      }

      // Ensure we have questions before starting
      if (!questionsFromDb || questionsFromDb.length === 0) {
        throw new Error('No questions available for interview')
      }

      // Start interview
      setInterviewState({
        sessionId,
        questions: questionsFromDb,
        currentQuestionIndex: 0,
        answers: [],
        isRecording: false,
        isLoading: false,
        isComplete: false,
        startTime: new Date(),
      })

      setShowJobInputs(false)
    } catch (err) {
      console.error('Error starting interview:', err)
      setError(err instanceof Error ? err.message : 'Failed to start interview')
      setInterviewState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handleRecordingComplete = async (audioBlob: Blob) => {
    // Prevent duplicate processing
    if (isProcessing || hasRecorded) {
      console.log('⚠️ Already processing or recorded, skipping...')
      return
    }

    console.log('🎤 Recording completed, processing audio...')
    setIsProcessing(true)
    setHasRecorded(true)

    try {
      // Create unique filename
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 8)
      const filename = `recording-${timestamp}-${randomId}.webm`

      // Send to STT API
      const formData = new FormData()
      formData.append('audio', audioBlob, filename)

      console.log('📤 Sending audio to STT API...')
      const sttResponse = await fetch('/api/interview/stt', {
        method: 'POST',
        body: formData,
      })

      if (!sttResponse.ok) {
        throw new Error('Failed to transcribe audio')
      }

      const sttResult = await sttResponse.json()
      const transcriptText = sttResult.text || 'Error: Could not transcribe audio'

      console.log(
        `✅ Transcription received for question ${interviewState.currentQuestionIndex}:`,
        transcriptText
      )
      setTranscript(transcriptText)
      setIsProcessing(false)

      // Score the answer
      if (transcriptText && !transcriptText.startsWith('Error:')) {
        setIsScoring(true)
        await scoreAnswer(transcriptText)
      }
    } catch (err) {
      console.error('❌ Error processing recording:', err)
      setError('Failed to process recording. Please try again.')
      setIsProcessing(false)
      setHasRecorded(false) // Allow retry
    }
  }

  const scoreAnswer = async (transcriptText: string) => {
    try {
      const currentQuestion = interviewState.questions[interviewState.currentQuestionIndex]

      const prompt = `Evaluate this interview answer for the question: "${currentQuestion.question}"

Answer: "${transcriptText}"

Please provide a score from 1-10 and 2-3 actionable tips for improvement.`

      console.log('🧠 Scoring answer with LLM...')
      const scoreResponse = await fetch('/api/interview/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (scoreResponse.ok) {
        const scoreResult = await scoreResponse.json()
        console.log('✅ Scoring completed:', scoreResult)

        if (scoreResult.score !== undefined) {
          setScore(scoreResult.score)
        }
        if (scoreResult.tips && Array.isArray(scoreResult.tips)) {
          setFeedback(scoreResult.tips)
        }
      } else {
        console.warn('⚠️ Scoring failed, using fallback')
        setScore(7) // Fallback score
        setFeedback(['Good effort! Keep practicing to improve your answers.'])
      }
    } catch (err) {
      console.error('❌ Error scoring answer:', err)
      setScore(7) // Fallback score
      setFeedback(['Answer recorded successfully. Keep practicing!'])
    } finally {
      setIsScoring(false)
    }
  }

  const submitAnswer = async () => {
    if (!interviewState.sessionId || !transcript.trim() || isSubmitting) return

    setIsSubmitting(true)
    setError('')

    try {
      const currentQuestion = interviewState.questions[interviewState.currentQuestionIndex]

      // Add answer to database via API with score and feedback
      const answerResponse = await fetch('/api/interview/add-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          sessionId: interviewState.sessionId,
          questionId: `question_${interviewState.currentQuestionIndex}`,
          questionIndex: interviewState.currentQuestionIndex,
          answer: transcript.trim(),
          score: score, // Include the score
          feedback: feedback, // Include the feedback
        }),
      })

      if (!answerResponse.ok) {
        throw new Error('Failed to save answer')
      }

      const answerResult = await answerResponse.json()
      if (!answerResult.success) {
        throw new Error(answerResult.error || 'Failed to save answer')
      }

      console.log('✅ Answer submitted successfully')

      // Move to next question or complete
      const newAnswers = [...interviewState.answers, transcript.trim()]
      const nextIndex = interviewState.currentQuestionIndex + 1

      if (nextIndex >= interviewState.questions.length) {
        // Interview complete
        setInterviewState(prev => ({
          ...prev,
          answers: newAnswers,
          isComplete: true,
        }))
      } else {
        // Next question - manually reset states
        setHasRecorded(false)
        setTranscript('')
        setScore(null)
        setFeedback([])
        setError('')
        setIsProcessing(false)
        setIsScoring(false)
        setIsSubmitting(false)
        
        setInterviewState(prev => ({
          ...prev,
          answers: newAnswers,
          currentQuestionIndex: nextIndex,
        }))
      }
    } catch (err) {
      console.error('Error submitting answer:', err)
      setError('Failed to submit answer. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    const minutes = Math.floor(diff / 60)
    const seconds = diff % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Handle interview abort
  const handleInterviewAbort = async () => {
    if (interviewState.sessionId) {
      try {
        // Optionally notify the server that the interview was aborted
        await fetch('/api/interview/abort-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ sessionId: interviewState.sessionId }),
        }).catch(console.error) // Don't block on this
      } catch (err) {
        console.error('Error aborting interview:', err)
      }
    }
    // Reset the interview state
    setInterviewState({
      sessionId: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      isRecording: false,
      isLoading: false,
      isComplete: false,
      startTime: null,
    })
  }

  if (showJobInputs) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <BackToDashboard variant="header" />
          </div>

          <div className="mx-auto max-w-2xl">
            <Card className="border-white/20 bg-white/10 text-white backdrop-blur-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Setup Your Interview</CardTitle>
                <CardDescription className="text-blue-200">
                  Customize your {domain} interview for better question relevance
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-blue-200">
                    Job Position (Optional)
                  </label>
                  <Input
                    placeholder="e.g., Senior Backend Engineer, Full Stack Developer"
                    value={customJobPosition}
                    onChange={e => setCustomJobPosition(e.target.value)}
                    className="border-white/20 bg-white/10 text-white placeholder:text-blue-300"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-blue-200">
                    Job Description (Optional)
                  </label>
                  <Textarea
                    placeholder="Paste the job description here to get more targeted questions..."
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    rows={6}
                    className="border-white/20 bg-white/10 text-white placeholder:text-blue-300"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                      {domain}
                    </Badge>
                    <Badge variant="outline" className="border-green-500/30 text-green-300">
                      10 Questions
                    </Badge>
                  </div>

                  <Button
                    onClick={startInterview}
                    disabled={interviewState.isLoading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {interviewState.isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Questions...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start Interview
                      </>
                    )}
                  </Button>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 rounded-lg border border-red-500/30 bg-red-500/20 p-3">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <span className="text-red-300">{error}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (interviewState.isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto p-6">
          <div className="mx-auto max-w-2xl text-center">
            <Card className="border-white/20 bg-white/10 text-white backdrop-blur-md">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-600">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl">Interview Complete!</CardTitle>
                <CardDescription className="text-blue-200">
                  Great job! You've completed all {interviewState.questions.length} questions.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-white/10 p-4">
                    <div className="text-2xl font-bold text-blue-300">
                      {interviewState.questions.length}
                    </div>
                    <div className="text-sm text-blue-200">Questions Answered</div>
                  </div>
                  <div className="rounded-lg bg-white/10 p-4">
                    <div className="text-2xl font-bold text-green-300">
                      {interviewState.startTime ? formatTime(interviewState.startTime) : '0:00'}
                    </div>
                    <div className="text-sm text-blue-200">Total Time</div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={() => {
                      try {
                        router.push('/dashboard')
                      } catch (error) {
                        console.error('Navigation error:', error)
                        // Fallback for production issues
                        window.location.href = '/dashboard'
                      }
                    }}
                    variant="outline"
                    className="flex-1 border-white/20 bg-white text-black hover:bg-gray-100"
                  >
                    Back to Dashboard
                  </Button>
                  <Button
                    onClick={() =>
                      router.push(
                        `/dashboard/interview/results?session=${interviewState.sessionId}`
                      )
                    }
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    View Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = interviewState.questions[interviewState.currentQuestionIndex]
  const progress =
    ((interviewState.currentQuestionIndex + 1) / interviewState.questions.length) * 100
  const canSubmit = hasRecorded && transcript && !isProcessing && !isScoring && !isSubmitting

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <BackToDashboard 
            variant="header" 
            isInterviewActive={interviewState.startTime !== null && !interviewState.isComplete}
            onConfirmExit={handleInterviewAbort}
          />
          <div className="flex items-center space-x-4">
            {interviewState.startTime && (
              <div className="flex items-center space-x-2 text-blue-200">
                <Clock className="h-4 w-4" />
                <span>{formatTime(interviewState.startTime)}</span>
              </div>
            )}
            <Badge variant="outline" className="border-blue-500/30 text-blue-300">
              {interviewState.currentQuestionIndex + 1} / {interviewState.questions.length}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 w-full rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mx-auto max-w-4xl">
          <Card className="border-white/20 bg-white/10 text-white backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    Question {interviewState.currentQuestionIndex + 1}
                  </CardTitle>
                  <div className="mt-2 flex items-center space-x-2">
                    <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                      {currentQuestion?.category}
                    </Badge>
                    <Badge variant="outline" className="border-yellow-500/30 text-yellow-300">
                      {currentQuestion?.difficulty}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`${hasRecorded ? 'border-green-500/30 text-green-300' : 'border-orange-500/30 text-orange-300'}`}
                    >
                      {hasRecorded ? '✅ Answered' : '⏳ Waiting for answer'}
                    </Badge>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Question Display */}
              <div className="rounded-lg bg-white/10 p-6">
                <p className="text-lg leading-relaxed text-blue-100">{currentQuestion?.question}</p>
              </div>

              {/* Voice Recording Section */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="mb-4 text-lg font-medium text-blue-200">Record Your Answer</h3>
                  <Recorder
                    key={`recorder-${interviewState.currentQuestionIndex}`}
                    onRecordingComplete={handleRecordingComplete}
                    onRecordingStateChange={recording =>
                      setInterviewState(prev => ({ ...prev, isRecording: recording }))
                    }
                    maxDuration={120}
                  />
                </div>

                {/* Processing Status */}
                {isProcessing && (
                  <div className="flex items-center justify-center space-x-2 rounded-lg border border-blue-500/30 bg-blue-500/20 p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span className="text-blue-300">Transcribing your answer...</span>
                  </div>
                )}

                {isScoring && (
                  <div className="flex items-center justify-center space-x-2 rounded-lg border border-purple-500/30 bg-purple-500/20 p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                    <span className="text-purple-300">AI is scoring your answer...</span>
                  </div>
                )}

                {/* Transcript Display */}
                {transcript && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="h-5 w-5 text-green-400" />
                      <span className="font-medium text-green-300">Your Answer (Transcribed)</span>
                    </div>
                    <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                      <p className="text-green-100">{transcript}</p>
                    </div>

                    {/* Score and Feedback */}
                    {score !== null && (
                      <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium text-purple-300">AI Score</span>
                          <span className="text-2xl font-bold text-purple-200">{score}/10</span>
                        </div>
                        {feedback.length > 0 && (
                          <div>
                            <p className="mb-2 text-sm text-purple-300">Feedback:</p>
                            <ul className="space-y-1 text-sm text-purple-200">
                              {feedback.map((tip, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="text-purple-400">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={submitAnswer}
                        disabled={!canSubmit}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : interviewState.currentQuestionIndex ===
                          interviewState.questions.length - 1 ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Complete Interview
                          </>
                        ) : (
                          <>
                            <SkipForward className="mr-2 h-4 w-4" />
                            Submit Answer & Next Question
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center space-x-2 rounded-lg border border-red-500/30 bg-red-500/20 p-3">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <span className="text-red-300">{error}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function InterviewSession() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
          <div className="mx-auto max-w-4xl">
            <div className="text-center text-white">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
              <p>Loading interview session...</p>
            </div>
          </div>
        </div>
      }
    >
      <InterviewSessionContent />
    </Suspense>
  )
}
