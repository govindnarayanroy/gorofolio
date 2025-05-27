"use client";

import { useState, useEffect } from "react";
import { Profile } from "@/lib/types";
import { getUserResume } from "@/lib/database";
import { extractDomainsFromProfile } from "@/lib/interview";
import Link from "next/link";
import { BackToDashboard } from "@/components/BackToDashboard";
import { Badge } from "@/components/ui/badge";
import { User, Briefcase, FileText, Sparkles } from "lucide-react";

export default function CoverLetterPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileDomains, setProfileDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [jd, setJd] = useState("");
  const [tone, setTone] = useState<"professional" | "friendly" | "enthusiastic">("professional");
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const resumeData = await getUserResume();
        if (resumeData?.data) {
          setProfile(resumeData.data);
          const domains = extractDomainsFromProfile(resumeData.data);
          setProfileDomains(domains);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleGenerate = async () => {
    if (!jd.trim()) {
      setError("Please enter a job description");
      return;
    }

    if (!profile) {
      setError("Profile data not available. Please complete your profile first.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate/cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, jd, tone }),
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

  const handleQuickFill = (domain: string) => {
    const templates = {
      'Software Engineering': 'We are looking for a Software Engineer to join our team. You will be responsible for developing and maintaining software applications, collaborating with cross-functional teams, and ensuring high-quality code delivery.',
      'Frontend Development': 'We are seeking a Frontend Developer to create engaging user interfaces. You will work with React, JavaScript, and modern web technologies to build responsive and interactive web applications.',
      'Backend Development': 'We are hiring a Backend Developer to build robust server-side applications. You will work with APIs, databases, and cloud services to create scalable backend systems.',
      'Product Management': 'We are looking for a Product Manager to drive product strategy and execution. You will work with engineering, design, and business teams to deliver products that meet customer needs.',
      'Data Science': 'We are seeking a Data Scientist to analyze complex datasets and derive actionable insights. You will use machine learning, statistics, and data visualization to solve business problems.',
      'UX/UI Design': 'We are hiring a UX/UI Designer to create intuitive and beautiful user experiences. You will conduct user research, create wireframes, and design interfaces that delight users.',
      'Marketing': 'We are looking for a Marketing professional to drive growth and brand awareness. You will develop marketing strategies, manage campaigns, and analyze performance metrics.',
      'Sales': 'We are seeking a Sales professional to drive revenue growth. You will build relationships with prospects, manage the sales pipeline, and close deals.'
    };
    
    setJd(templates[domain as keyof typeof templates] || templates['Software Engineering']);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading your profile...</p>
        </div>
      </div>
    );
  }

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
              <BackToDashboard variant="header" />
              
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
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white mb-4">
              Personalized Cover Letters
            </h1>
            <p className="text-xl text-blue-200/90 max-w-3xl mx-auto">
              {profile 
                ? `Generate cover letters tailored to ${profile.name}'s experience and skills`
                : 'Complete your profile to generate personalized cover letters'
              }
            </p>
          </div>

          {!profile ? (
            <div className="text-center py-12">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl max-w-md mx-auto p-8">
                <User className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Profile Required</h3>
                <p className="text-blue-200 mb-6">
                  Complete your profile to generate personalized cover letters with your experience and skills.
                </p>
                <Link 
                  href="/dashboard/editor"
                  className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Complete Profile
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Profile Summary */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
                    <p className="text-blue-200">{profile.headline}</p>
                  </div>
                </div>
                
                {profileDomains.length > 0 && (
                  <div>
                    <p className="text-blue-200 text-sm mb-3">Your expertise areas:</p>
                    <div className="flex flex-wrap gap-2">
                      {profileDomains.map((domain) => (
                        <Badge 
                          key={domain}
                          className="bg-green-500/20 text-green-300 border-green-500/30 cursor-pointer hover:bg-green-500/30 transition-colors"
                          onClick={() => handleQuickFill(domain)}
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          {domain}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-blue-300 text-xs mt-2">Click on any domain to auto-fill a sample job description</p>
                  </div>
                )}
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
                          <Sparkles className="w-5 h-5 ml-2" />
                        </div>
                      )}
                    </button>

                    {/* Quick Actions */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">Quick Actions</span>
                      </div>
                      <div className="flex gap-2">
                        <Link 
                          href="/dashboard/interview"
                          className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium text-center"
                        >
                          <Briefcase className="w-4 h-4 inline mr-1" />
                          Practice Interview
                        </Link>
                        <Link 
                          href="/dashboard/preview"
                          className="flex-1 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors text-sm font-medium text-center"
                        >
                          <FileText className="w-4 h-4 inline mr-1" />
                          View Resume
                        </Link>
                      </div>
                    </div>
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
                        <FileText className="w-8 h-8 text-purple-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cover letter will appear here</h3>
                      <p className="text-gray-600">Fill in the job description and click generate to create your personalized cover letter.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
} 