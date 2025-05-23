import { useState, useEffect } from "react";
import { useRecorder } from "@/hooks/useRecorder";
import { Mic, Square } from "lucide-react";

interface RecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  onRecordingStateChange?: (recording: boolean) => void;
  maxDuration?: number; // in seconds
}

export function Recorder({ onRecordingComplete, onRecordingStateChange, maxDuration = 120 }: RecorderProps) {
  const { isRecording, startRecording, stopRecording, error, audioBlob } = useRecorder();
  const [timeLeft, setTimeLeft] = useState(maxDuration);
  const [isCountdown, setIsCountdown] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsCountdown(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording, timeLeft]);

  useEffect(() => {
    if (isCountdown) {
      handleStop();
    }
  }, [isCountdown]);

  useEffect(() => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
    }
  }, [audioBlob, onRecordingComplete]);

  useEffect(() => {
    onRecordingStateChange?.(isRecording);
  }, [isRecording, onRecordingStateChange]);

  const handleStart = async () => {
    setTimeLeft(maxDuration);
    setIsCountdown(false);
    await startRecording();
  };

  const handleStop = async () => {
    const blob = await stopRecording();
    if (blob) {
      onRecordingComplete(blob);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <button
          onClick={isRecording ? handleStop : handleStart}
          disabled={isCountdown}
          className={`
            relative flex h-16 w-16 items-center justify-center rounded-full
            ${isRecording 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-blue-500 hover:bg-blue-600"
            }
            transition-colors disabled:opacity-50
          `}
        >
          {isRecording ? (
            <Square className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
        </button>
        
        {isRecording && (
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 text-lg font-medium">
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 