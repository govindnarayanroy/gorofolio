"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { getRandomQuestionSet } from "@/lib/interview";
import { Domain } from "@/lib/types/interview";
import { Recorder } from "@/components/Recorder";
import { InterviewCoach } from "@/components/InterviewCoach";
import { useState, useEffect, useRef } from "react";
import { sessionManager } from "@/lib/sessionStorage";

export default function InterviewSession() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const domain = (searchParams.get("domain") || "backend") as Domain;
  const questions = getRandomQuestionSet(domain);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  
  // Single processing lock to prevent ALL duplicate operations
  const [isLocked, setIsLocked] = useState(false);
  const processedBlobsRef = useRef(new Set<string>());

  useEffect(() => {
    // Start a new session when component mounts
    sessionManager.startSession(domain);
  }, [domain]);

  // Reset ALL state when moving to next question
  useEffect(() => {
    console.log("🔄 Question changed to:", currentQuestionIndex + 1);
    setTranscript("");
    setHasRecorded(false);
    setIsProcessing(false);
    setIsScoring(false);
    setIsLocked(false);
    // Don't clear processedBlobsRef - keep it to prevent cross-question duplicates
  }, [currentQuestionIndex]);

  const handleRecordingComplete = async (blob: Blob) => {
    // Create unique identifier for this blob
    const blobData = await blob.arrayBuffer();
    const blobHash = Array.from(new Uint8Array(blobData.slice(0, 200)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    console.log("🎯 Recording complete - blob details:", {
      size: blob.size,
      type: blob.type,
      hash: blobHash.substring(0, 20) + "...",
      hasBeenProcessed: processedBlobsRef.current.has(blobHash),
      isLocked
    });

    // Ultimate duplicate prevention
    if (isLocked || processedBlobsRef.current.has(blobHash)) {
      console.log("🚫 DUPLICATE DETECTED - Ignoring this blob");
      return;
    }

    // Lock everything immediately
    setIsLocked(true);
    processedBlobsRef.current.add(blobHash);

    if (!blob || blob.size === 0) {
      console.error("❌ Invalid blob received!");
      setTranscript("Error: No audio data received");
      setIsLocked(false);
      return;
    }

    setIsProcessing(true);
    setTranscript("Processing audio...");
    
    try {
      console.log("📤 Sending audio to STT API...");
      
      const formData = new FormData();
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substr(2, 9);
      const uniqueFilename = `recording-${timestamp}-${randomId}.webm`;
      
      formData.append("audio", blob, uniqueFilename);

      const response = await fetch("/api/interview/stt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const transcriptText = data.text || "No transcription available";
      console.log("✅ STT response:", transcriptText.substring(0, 50) + "...");
      
      setTranscript(transcriptText);
      setHasRecorded(true);
      setIsProcessing(false);

      // Save the answer
      sessionManager.addAnswer({
        questionIndex: currentQuestionIndex,
        question: questions[currentQuestionIndex].text,
        audioBlob: blob,
        transcript: transcriptText,
      });

      // Score the answer (don't wait for it)
      scoreAnswer(transcriptText);

    } catch (error) {
      console.error("❌ Error processing audio:", error);
      const errorMessage = "Error: Could not transcribe audio - " + (error as Error).message;
      setTranscript(errorMessage);
      setHasRecorded(false);
      setIsProcessing(false);
      setIsLocked(false);
    }
  };

  const scoreAnswer = async (transcriptText: string) => {
    setIsScoring(true);
    try {
      const prompt = `Evaluate this interview answer for the question: "${questions[currentQuestionIndex].text}"

Answer: "${transcriptText}"

Please provide a score from 1-10 and 2-3 actionable tips for improvement.`;

      const response = await fetch("/api/interview/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("📊 Score response received");
        sessionManager.updateAnswerScore(
          currentQuestionIndex, 
          data.score || 5, 
          data.tips || ["Good effort!", "Keep practicing"]
        );
      }
    } catch (error) {
      console.error("❌ Error scoring answer:", error);
      sessionManager.updateAnswerScore(currentQuestionIndex, 5, ["Answer recorded", "Try again next time"]);
    } finally {
      setIsScoring(false);
      setIsLocked(false); // Only unlock after scoring is complete
    }
  };

  const handleRecordingStateChange = (recording: boolean) => {
    console.log("🎙️ Recording state changed:", recording);
    setIsRecording(recording);
  };

  const handleNext = () => {
    console.log("➡️ Moving to next question from:", currentQuestionIndex + 1);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitAnswer = () => {
    if (isLocked || !canSubmit) {
      console.log("🚫 Cannot submit: locked or not ready");
      return;
    }
    
    console.log("✅ Submitting answer and moving to next question");
    handleNext();
  };

  const handleStop = () => {
    console.log("🛑 Stopping interview");
    sessionManager.completeSession();
    router.push("/dashboard/interview/result");
  };

  // Simplified button logic
  const canSubmit = hasRecorded && 
                   transcript && 
                   !transcript.startsWith("Error:") && 
                   !transcript.startsWith("Processing") &&
                   !isProcessing &&
                   !isScoring &&
                   !isLocked;

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= questions.length - 1;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Interview Session - {domain.charAt(0).toUpperCase() + domain.slice(1)}</h1>
      <InterviewCoach isRecording={isRecording} isProcessing={isProcessing} />
      
      {/* Question Display */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="text-xl font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            canSubmit ? "bg-green-100 text-green-800" : 
            hasRecorded ? "bg-blue-100 text-blue-800" :
            "bg-yellow-100 text-yellow-800"
          }`}>
            {canSubmit ? "✅ Ready to Submit" : 
             hasRecorded ? "⏳ Processing..." :
             "⏳ Waiting for answer"}
          </div>
        </div>
        <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
          <p className="text-lg text-blue-900">{currentQuestion.text}</p>
        </div>
      </div>

      {/* Recorder Component */}
      <div className="mb-6">
        <Recorder 
          onRecordingComplete={handleRecordingComplete} 
          onRecordingStateChange={handleRecordingStateChange}
          maxDuration={120}
        />
      </div>

      {/* Transcript Display */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Your Answer:</h3>
        <div className={`min-h-[4rem] p-3 rounded-lg border-2 ${
          transcript.startsWith("Error:") ? "bg-red-50 border-red-200 text-red-700" :
          transcript.startsWith("Processing") || isProcessing ? "bg-blue-50 border-blue-200 text-blue-700" :
          canSubmit ? "bg-green-50 border-green-200 text-green-800" :
          hasRecorded ? "bg-yellow-50 border-yellow-200 text-yellow-700" :
          "bg-gray-50 border-gray-200 text-gray-500"
        }`}>
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              Processing your recording...
            </div>
          ) : isScoring ? (
            <div className="flex items-center gap-2">
              <div className="animate-pulse h-4 w-4 bg-yellow-500 rounded-full"></div>
              Evaluating your answer with AI...
            </div>
          ) : transcript ? (
            <p className="text-base">{transcript}</p>
          ) : isRecording ? (
            <div className="flex items-center gap-2">
              <div className="animate-pulse h-4 w-4 bg-red-500 rounded-full"></div>
              Recording your answer... Click stop when finished.
            </div>
          ) : (
            <p className="text-center text-gray-500">🎤 Record your answer to this question to continue</p>
          )}
        </div>
      </div>

      {/* Action Buttons - Always visible */}
      <div className="mt-6 flex gap-4">
        <button 
          onClick={isLastQuestion ? handleStop : handleSubmitAnswer} 
          disabled={!canSubmit}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            !canSubmit 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : isLastQuestion
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {!canSubmit ? 
            (isLocked ? "Processing..." : "Record your answer first") :
            (isLastQuestion ? "Complete Interview ✓" : "Submit & Next Question →")
          }
        </button>
        
        <button 
          onClick={handleStop} 
          disabled={isLocked}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          End Interview Early
        </button>
      </div>
      
      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{currentQuestionIndex + (canSubmit ? 1 : 0)} of {questions.length} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + (canSubmit ? 1 : 0)) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Debug info */}
      <div className="mt-4 p-2 bg-gray-100 text-xs">
        <strong>Debug:</strong> Q{currentQuestionIndex + 1} | Recording: {isRecording ? "Yes" : "No"} | 
        Processing: {isProcessing ? "Yes" : "No"} | 
        Scoring: {isScoring ? "Yes" : "No"} | 
        Has Recorded: {hasRecorded ? "Yes" : "No"} |
        Can Submit: {canSubmit ? "Yes" : "No"} |
        Locked: {isLocked ? "Yes" : "No"}
      </div>
    </div>
  );
} 