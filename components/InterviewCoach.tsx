'use client'

import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'

interface InterviewCoachProps {
  isRecording: boolean
  isProcessing: boolean
}

export function InterviewCoach({ isRecording, isProcessing }: InterviewCoachProps) {
  const [animationData, setAnimationData] = useState<any>(null)

  useEffect(() => {
    // Load the animation data
    fetch('/animations/coach.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading animation:', error))
  }, [])

  if (!animationData) {
    return null
  }

  return (
    <div className="mx-auto mb-4 h-64 w-64">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{
          width: '100%',
          height: '100%',
          opacity: isRecording ? 1 : isProcessing ? 0.7 : 0.5,
        }}
      />
    </div>
  )
}
