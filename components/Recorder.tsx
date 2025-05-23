"use client";

import { useState, useEffect } from "react";
import { useRecorder } from "@/hooks/useRecorder";
import { Mic, Square } from "lucide-react";

interface RecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  onRecordingStateChange?: (recording: boolean) => void;
  maxDuration?: number; // in seconds
}

export function Recorder({ onRecordingComplete, onRecordingStateChange, maxDuration = 120 }: RecorderProps) {
  const { isRecording, startRecording, stopRecording, error, audioBlob, clearError } = useRecorder();
  const [timeLeft, setTimeLeft] = useState(maxDuration);

  // Debug logging
  useEffect(() => {
    console.log("🔘 Recorder state:", { isRecording, hasError: !!error, hasAudioBlob: !!audioBlob });
  }, [isRecording, error, audioBlob]);

  // Timer for recording duration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording, timeLeft, stopRecording]);

  // Handle recording completion
  useEffect(() => {
    if (audioBlob) {
      console.log("🎯 Audio blob received, calling onRecordingComplete");
      onRecordingComplete(audioBlob);
    }
  }, [audioBlob, onRecordingComplete]);

  // Notify parent about recording state changes
  useEffect(() => {
    onRecordingStateChange?.(isRecording);
  }, [isRecording, onRecordingStateChange]);

  const handleStart = async () => {
    console.log("🔘 START button clicked");
    clearError();
    setTimeLeft(maxDuration);
    await startRecording();
  };

  const handleStop = () => {
    console.log("🔘 STOP button clicked");
    stopRecording();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Simple debug display */}
      <div className="text-sm bg-gray-100 px-3 py-1 rounded-full border">
        Status: <span className={isRecording ? "text-red-600 font-bold" : "text-green-600"}>{isRecording ? "RECORDING" : "READY"}</span>
        {error && <span className="text-red-500 ml-2">| ERROR</span>}
      </div>
      
      {/* Main recording button */}
      <div className="relative">
        <button
          onClick={isRecording ? handleStop : handleStart}
          className={`
            w-24 h-24 rounded-full border-4 transition-all duration-200 flex items-center justify-center text-white font-bold
            ${isRecording 
              ? "bg-red-500 hover:bg-red-600 border-red-300 shadow-lg" 
              : "bg-blue-500 hover:bg-blue-600 border-blue-300 shadow-md hover:shadow-lg"
            }
          `}
        >
          {isRecording ? (
            <div className="flex flex-col items-center">
              <Square className="h-8 w-8 mb-1" fill="white" />
              <span className="text-xs">STOP</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Mic className="h-8 w-8 mb-1" />
              <span className="text-xs">START</span>
            </div>
          )}
        </button>
        
        {/* Timer display */}
        {isRecording && (
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200">
            <div className="text-sm font-mono">{formatTime(timeLeft)}</div>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="max-w-md text-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 font-medium mb-2">❌ {error}</p>
          <button 
            onClick={clearError}
            className="text-xs text-blue-500 hover:text-blue-700 underline"
          >
            Clear error and try again
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center max-w-md">
        {isRecording ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 font-medium">🔴 Recording in progress</p>
            <p className="text-red-600 text-sm mt-1">Click the STOP button when you're finished speaking</p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-700 font-medium">🎤 Ready to record</p>
            <p className="text-blue-600 text-sm mt-1">Click the START button to begin recording your answer</p>
          </div>
        )}
      </div>
    </div>
  );
} 