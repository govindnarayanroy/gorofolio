'use client'

import { useState, useEffect } from 'react'
import { useRecorder } from '@/hooks/useRecorder'
import { Mic, Square } from 'lucide-react'

interface RecorderProps {
  onRecordingComplete: (blob: Blob) => void
  onRecordingStateChange?: (recording: boolean) => void
  maxDuration?: number // in seconds
}

export function Recorder({
  onRecordingComplete,
  onRecordingStateChange,
  maxDuration = 120,
}: RecorderProps) {
  const { isRecording, startRecording, stopRecording, error, audioBlob, clearError } = useRecorder()
  const [timeLeft, setTimeLeft] = useState(maxDuration)

  // Debug logging
  useEffect(() => {
    console.log('🔘 Recorder state:', { isRecording, hasError: !!error, hasAudioBlob: !!audioBlob })
  }, [isRecording, error, audioBlob])

  // Timer for recording duration
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            stopRecording()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isRecording, timeLeft, stopRecording])

  // Handle recording completion
  useEffect(() => {
    if (audioBlob) {
      console.log('🎯 Audio blob received, calling onRecordingComplete')
      onRecordingComplete(audioBlob)
    }
  }, [audioBlob, onRecordingComplete])

  // Notify parent about recording state changes
  useEffect(() => {
    onRecordingStateChange?.(isRecording)
  }, [isRecording, onRecordingStateChange])

  const handleStart = async () => {
    console.log('🔘 START button clicked')
    clearError()
    setTimeLeft(maxDuration)
    await startRecording()
  }

  const handleStop = () => {
    console.log('🔘 STOP button clicked')
    stopRecording()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Simple debug display */}
      <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-sm">
        Status:{' '}
        <span className={isRecording ? 'font-bold text-red-300' : 'text-green-300'}>
          {isRecording ? 'RECORDING' : 'READY'}
        </span>
        {error && <span className="ml-2 text-red-300">| ERROR</span>}
      </div>

      {/* Main recording button */}
      <div className="relative">
        <button
          onClick={isRecording ? handleStop : handleStart}
          className={`
            flex h-24 w-24 items-center justify-center rounded-full border-4 font-bold text-white transition-all duration-200
            ${
              isRecording
                ? 'border-red-300 bg-red-500 shadow-lg hover:bg-red-600'
                : 'border-blue-300 bg-blue-500 shadow-md hover:bg-blue-600 hover:shadow-lg'
            }
          `}
        >
          {isRecording ? (
            <div className="flex flex-col items-center">
              <Square className="mb-1 h-8 w-8" fill="white" />
              <span className="text-xs">STOP</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Mic className="mb-1 h-8 w-8" />
              <span className="text-xs">START</span>
            </div>
          )}
        </button>

        {/* Timer display */}
        {isRecording && (
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 rounded-full border border-red-500/30 bg-red-500/20 px-3 py-1 text-red-300 backdrop-blur-sm">
            <div className="font-mono text-sm">{formatTime(timeLeft)}</div>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="max-w-md rounded-lg border border-red-500/30 bg-red-500/20 p-3 text-center backdrop-blur-sm">
          <p className="mb-2 text-sm font-medium text-red-300">❌ {error}</p>
          <button
            onClick={clearError}
            className="text-xs text-blue-300 underline hover:text-blue-100"
          >
            Clear error and try again
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="max-w-md text-center">
        {isRecording ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/20 p-3 backdrop-blur-sm">
            <p className="font-medium text-red-300">🔴 Recording in progress</p>
            <p className="mt-1 text-sm text-red-200">
              Click the STOP button when you're finished speaking
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/20 p-3 backdrop-blur-sm">
            <p className="font-medium text-blue-300">🎤 Ready to record</p>
            <p className="mt-1 text-sm text-blue-200">
              Click the START button to begin recording your answer
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
