"use client";

import { useRef, useEffect, useState } from "react";
import ResumePreview from "@/components/ResumePreview";
import { Profile } from "@/lib/types";
import { getUserResume } from "@/lib/database";

const defaultProfile: Profile = {
  name: "Your Name",
  headline: "Your Professional Title",
  summary: "Add your professional summary in the editor to see it here.",
  experiences: [],
  education: [],
  skills: [],
  links: [],
};

export default function PreviewPage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resumeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setError(null);
        
        const resumeData = await getUserResume();
        
        if (resumeData?.data) {
          setProfile(resumeData.data);
        } else {
          // No resume data found, keep default
          setProfile(defaultProfile);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load resume data");
        setProfile(defaultProfile);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your resume...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Preview</h1>
        <p className="text-gray-600">
          {profile.name === defaultProfile.name 
            ? "Upload a resume or use the editor to add your information."
            : "Your resume is ready! You can download it as a PDF or make changes in the editor."
          }
        </p>
      </div>

      <ResumePreview ref={resumeRef} profile={profile} />

      <div className="flex gap-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
        >
          Download PDF
        </button>
        
        <button
          onClick={() => window.location.href = '/dashboard/editor'}
          className="rounded bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
        >
          Edit Resume
        </button>
        
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </main>
  );
} 