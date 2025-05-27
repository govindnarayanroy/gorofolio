"use client";

import { useRef, useEffect, useState } from "react";
import ResumePreview from "@/components/ResumePreview";
import { ResumeOptimizer } from "@/components/ResumeOptimizer";
import { Profile } from "@/lib/types";
import { getUserResume } from "@/lib/database";
import { BackToDashboard } from "@/components/BackToDashboard";
import { Button } from "@/components/ui/button";
import { Target, Eye, Download, Edit } from "lucide-react";

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
  const [showOptimizer, setShowOptimizer] = useState(false);
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
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
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
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
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
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <BackToDashboard variant="minimal" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Preview & Optimization</h1>
        <p className="text-gray-600">
          {profile.name === defaultProfile.name 
            ? "Upload a resume or use the editor to add your information."
            : "Your resume is ready! You can download it as a PDF, make changes, or optimize it for specific jobs."
          }
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 print:hidden">
        <Button
          onClick={() => window.print()}
          className="bg-sky-600 hover:bg-sky-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        
        <Button
          onClick={() => window.location.href = '/dashboard/editor'}
          variant="outline"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Resume
        </Button>

        {profile.name !== defaultProfile.name && (
          <Button
            onClick={() => setShowOptimizer(!showOptimizer)}
            variant={showOptimizer ? "default" : "outline"}
            className={showOptimizer ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            <Target className="w-4 h-4 mr-2" />
            {showOptimizer ? "Hide Optimizer" : "Optimize for Jobs"}
          </Button>
        )}
      </div>

      <div className={`${showOptimizer ? 'flex flex-col xl:flex-row gap-6' : 'flex justify-center'}`}>
        {/* Resume Preview */}
        <div className={`${showOptimizer ? 'xl:flex-1 xl:max-w-4xl' : 'w-full max-w-4xl mx-auto'} space-y-4`}>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Eye className="w-4 h-4" />
            Resume Preview
          </div>
          <div className="overflow-x-auto">
            <ResumePreview ref={resumeRef} profile={profile} />
          </div>
        </div>

        {/* Resume Optimizer */}
        {showOptimizer && profile.name !== defaultProfile.name && (
          <div className="xl:w-96 xl:flex-shrink-0 space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              Resume Optimization
            </div>
            <div className="sticky top-6">
              <ResumeOptimizer profile={profile} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 