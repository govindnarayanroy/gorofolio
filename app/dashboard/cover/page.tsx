"use client";

import { useState } from "react";
import { Profile } from "@/lib/types";
import Link from "next/link";

// Using the same mock profile as preview page for consistency
const mock: Profile = {
  name: "Jane Doe",
  headline: "Frontend Engineer",
  summary: "Passionate developer with 4+ years building React apps.",
  experiences: [],
  education: [],
  skills: [],
  links: [],
};

export default function CoverLetterPage() {
  const [jd, setJd] = useState("");
  const [tone, setTone] = useState<"professional" | "friendly" | "enthusiastic">("professional");
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!jd.trim()) {
      setError("Please enter a job description");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate/cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: mock, jd, tone }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate cover letter");
      }

      const data = await res.json();
      setCoverLetter(data.markdown);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-purple-600/15"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-3xl"></div>

      <div className="relative">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center space-x-3 text-white hover:text-blue-200 transition-colors duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-lg font-semibold">Back to Dashboard</span>
              </Link>
              
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">Cover Letter Writer</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-400 rounded-3xl mb-6 shadow-2xl">
              <span className="text-4xl">✍️</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-4">
              Never Stress Over Cover Letters Again
            </h1>
            <p className="text-xl text-blue-200/90 max-w-3xl mx-auto">
              Write a job-specific, personalized letter with just one click. Let your motivation shine through, every time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Your Cover Letter</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="tone" className="block text-sm font-semibold text-gray-700 mb-3">
                    Tone & Style
                  </label>
                  <select
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value as typeof tone)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="enthusiastic">Enthusiastic</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="jd" className="block text-sm font-semibold text-gray-700 mb-3">
                    Job Description
                  </label>
                  <textarea
                    id="jd"
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Paste the job description here..."
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:from-purple-500 hover:via-pink-400 hover:to-purple-400 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Generate Cover Letter</span>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Output Section */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
              {coverLetter ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Generated Cover Letter</h2>
                    <button
                      onClick={() => navigator.clipboard.writeText(coverLetter)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-300 text-sm font-medium"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="prose prose-gray max-w-none">
                    {coverLetter.split("\n").map((line, i) => (
                      <p key={i} className="mb-4 text-gray-700 leading-relaxed">{line}</p>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cover letter will appear here</h3>
                  <p className="text-gray-600">Fill in the job description and click generate to create your personalized cover letter.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 