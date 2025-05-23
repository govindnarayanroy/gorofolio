import { useSearchParams } from "next/navigation";
import { getRandomQuestionSet } from "@/lib/interview";
import { Domain } from "@/lib/types/interview";
import { Recorder } from "@/components/Recorder";
import { InterviewCoach } from "@/components/InterviewCoach";
import { useState } from "react";

export default function InterviewSession() {
  const searchParams = useSearchParams();
  const domain = (searchParams.get("domain") || "backend") as Domain;
  const questions = getRandomQuestionSet(domain);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordingComplete = async (blob: Blob) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("audio", blob);

    try {
      const response = await fetch("/api/interview/stt", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setTranscript(data.text);
    } catch (error) {
      console.error("Error processing audio:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecordingStateChange = (recording: boolean) => {
    setIsRecording(recording);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTranscript("");
    }
  };

  const handleStop = () => {
    // Navigate to the scorecard page
    window.location.href = "/dashboard/interview/result";
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Interview Session</h1>
      <InterviewCoach isRecording={isRecording} isProcessing={isProcessing} />
      <div className="mb-4">
        <h2 className="text-xl">Question {currentQuestionIndex + 1} of {questions.length}</h2>
        <p className="text-lg">{questions[currentQuestionIndex].text}</p>
      </div>
      <Recorder 
        onRecordingComplete={handleRecordingComplete} 
        onRecordingStateChange={handleRecordingStateChange}
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Transcript:</h3>
        <p>{transcript}</p>
      </div>
      <div className="mt-4 flex gap-4">
        <button onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded">
          Next Question
        </button>
        <button onClick={handleStop} className="px-4 py-2 bg-red-500 text-white rounded">
          Stop Interview
        </button>
      </div>
    </div>
  );
} 