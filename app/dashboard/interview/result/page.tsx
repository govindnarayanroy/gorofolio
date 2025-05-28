'use client'

import { useState, useEffect } from 'react'
import { sessionManager, InterviewSession, QuestionAnswer } from '@/lib/sessionStorage'
import { useRouter } from 'next/navigation'

export default function InterviewResult() {
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadSession = async () => {
      setLoading(true)
      try {
        // Load the current session from storage
        const currentSession = sessionManager.loadSession() || sessionManager.getCurrentSession()

        if (!currentSession) {
          setError('No interview session found. Please take an interview first.')
          return
        }

        setSession(currentSession)
      } catch (err) {
        setError('Failed to load interview results')
        console.error('Error loading session:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [])

  const calculateOverallScore = (answers: QuestionAnswer[]): number => {
    const answersWithScores = answers.filter(a => a.score !== undefined)
    if (answersWithScores.length === 0) return 0

    const total = answersWithScores.reduce((sum, answer) => sum + (answer.score || 0), 0)
    return Math.round(total / answersWithScores.length)
  }

  const handleNewInterview = () => {
    sessionManager.clearSession()
    router.push('/dashboard/interview')
  }

  const handleBackToDashboard = () => {
    sessionManager.clearSession()
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="mb-4 text-2xl font-bold">Interview Results</h1>
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="text-lg">Loading your results...</div>
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="mb-4 text-2xl font-bold">Interview Results</h1>
        <div className="rounded border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">{error || 'No session data found'}</p>
          <button
            onClick={handleNewInterview}
            className="mt-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Start New Interview
          </button>
        </div>
      </div>
    )
  }

  const overallScore = calculateOverallScore(session.answers)

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-4 text-2xl font-bold">Interview Results</h1>

      <div className="mb-6 rounded border border-blue-200 bg-blue-50 p-4">
        <h2 className="text-xl font-semibold">Overall Score: {overallScore}/10</h2>
        <p className="mt-1 text-gray-600">
          Domain: {session.domain} | Questions answered: {session.answers.length}
        </p>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Per-Question Results:</h3>
        {session.answers && session.answers.length > 0 ? (
          session.answers.map((answer, index) => (
            <div key={index} className="mt-4 rounded border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2">
                <h4 className="font-medium text-blue-600">Question {answer.questionIndex + 1}:</h4>
                <p className="mb-2 text-gray-700">{answer.question}</p>
              </div>

              <div className="mb-2">
                <h5 className="font-medium text-green-600">Your Answer:</h5>
                <p className="rounded bg-white p-2 italic text-gray-700">
                  {answer.transcript || 'No transcript available'}
                </p>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">
                    Score: {answer.score !== undefined ? `${answer.score}/10` : 'Pending...'}
                  </p>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-gray-600">
                    <strong>Tips:</strong>{' '}
                    {answer.tips && Array.isArray(answer.tips)
                      ? answer.tips.join(', ')
                      : 'Scoring in progress...'}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No answers recorded yet.</div>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleNewInterview}
          className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
        >
          Take Another Interview
        </button>
        <button
          onClick={handleBackToDashboard}
          className="rounded bg-gray-500 px-6 py-2 text-white hover:bg-gray-600"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
