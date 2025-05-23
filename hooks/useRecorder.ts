"use client";

import { useState, useRef, useCallback } from "react";

interface UseRecorderReturn {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  error: string | null;
  audioBlob: Blob | null;
  clearError: () => void;
  audioLevel: number;
}

export function useRecorder(): UseRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const cleanup = useCallback(() => {
    console.log("🧹 Cleaning up...");
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn("Error stopping MediaRecorder:", e);
      }
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    mediaRecorderRef.current = null;
    setAudioLevel(0);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      console.log("🎤 Starting recording...");
      
      // Reset everything
      setError(null);
      setAudioBlob(null);
      cleanup();
      chunksRef.current = [];
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      streamRef.current = stream;
      console.log("✅ Got media stream");

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        console.log("📦 Data chunk received:", event.data.size, "bytes");
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle stop
      mediaRecorder.onstop = () => {
        console.log("⏹️ MediaRecorder stopped, chunks:", chunksRef.current.length);
        
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          console.log("✅ Created blob:", blob.size, "bytes");
          setAudioBlob(blob);
        } else {
          console.error("❌ No chunks available");
          setError("No audio data recorded");
        }
      };

      // Handle errors
      mediaRecorder.onerror = (event) => {
        console.error("❌ MediaRecorder error:", event);
        setError("Recording failed");
        setIsRecording(false);
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every 1 second
      setIsRecording(true);
      console.log("🔴 Recording started");

    } catch (err) {
      console.error("❌ Start recording error:", err);
      setError(`Failed to start recording: ${(err as Error).message}`);
      setIsRecording(false);
      cleanup();
    }
  }, [cleanup]);

  const stopRecording = useCallback(() => {
    console.log("⏹️ Stop recording called");
    
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') {
      console.warn("⚠️ MediaRecorder not recording");
      setIsRecording(false);
      return;
    }

    try {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("✅ Recording stopped");
    } catch (err) {
      console.error("❌ Stop recording error:", err);
      setError(`Failed to stop recording: ${(err as Error).message}`);
      setIsRecording(false);
    }
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
    error,
    audioBlob,
    clearError,
    audioLevel
  };
} 