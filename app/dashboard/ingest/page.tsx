"use client";

import { useState } from "react";
import Link from "next/link";

export default function IngestPage() {
  const [file, setFile] = useState<File>();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function upload() {
    if (!file) return;
    
    setIsLoading(true);
    setError("");
    setProfile(null);

    try {
      console.log("📤 Uploading file:", {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });

      const fd = new FormData();
      fd.append("file", file);
      
      const response = await fetch("/api/ingest", { 
        method: "POST", 
        body: fd 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      console.log("✅ Upload successful:", data);
      setProfile(data.profile);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      console.log("📁 File selected:", {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      });
      setFile(selectedFile);
      setError("");
      setProfile(null);
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
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">Resume Upload</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl mb-6 shadow-2xl">
              <svg className="w-10 h-10 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-white mb-4">
              Upload Your Resume
            </h1>
            <p className="text-xl text-blue-200/90 max-w-3xl mx-auto">
              Upload your PDF resume and our AI will extract your information to create your professional profile.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Resume</h2>
              
              <div className="space-y-6">
                {/* File Input */}
                <div>
                  <label htmlFor="resume" className="block text-sm font-semibold text-gray-700 mb-3">
                    Select PDF Resume
                  </label>
                  <div className="relative">
                    <input
                      id="resume"
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                    />
                  </div>
                  {file && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-green-700 font-medium">{file.name}</span>
                        <span className="text-xs text-green-600 ml-2">({Math.round(file.size / 1024)} KB)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-red-600">{error}</span>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <button
                  onClick={upload}
                  disabled={!file || isLoading}
                  className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Processing Resume...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Parse Resume with AI</span>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Instructions */}
                <div className="text-sm text-gray-600 space-y-2">
                  <p className="font-semibold">Requirements:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>PDF format only</li>
                    <li>Maximum file size: 4MB</li>
                    <li>Text-based PDF (not scanned images)</li>
                    <li>Contains readable text content</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
              {profile ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Extracted Profile</h2>
                    <button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(profile, null, 2))}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-300 text-sm font-medium"
                    >
                      Copy JSON
                    </button>
                  </div>
                  
                  {/* Profile Preview */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                      <p className="text-gray-600">{profile.headline}</p>
                    </div>
                    
                    {profile.summary && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Summary</h4>
                        <p className="text-sm text-gray-600">{profile.summary}</p>
                      </div>
                    )}
                    
                    {profile.experiences?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Experience</h4>
                        <p className="text-sm text-gray-600">{profile.experiences.length} positions found</p>
                      </div>
                    )}
                    
                    {profile.skills?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Skills</h4>
                        <p className="text-sm text-gray-600">{profile.skills.length} skills extracted</p>
                      </div>
                    )}
                  </div>

                  {/* Raw JSON */}
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 mb-2">
                      View Raw JSON
                    </summary>
                    <pre className="overflow-auto rounded bg-zinc-900 p-4 text-xs text-green-300 max-h-64">
                      {JSON.stringify(profile, null, 2)}
                    </pre>
                  </details>

                  {/* Next Steps */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
                    <div className="space-y-2">
                      <Link 
                        href="/dashboard/preview"
                        className="block text-sm text-blue-700 hover:text-blue-900 transition-colors"
                      >
                        → Generate Resume Preview
                      </Link>
                      <Link 
                        href="/dashboard/cover"
                        className="block text-sm text-blue-700 hover:text-blue-900 transition-colors"
                      >
                        → Create Cover Letter
                      </Link>
                      <Link 
                        href="/dashboard/profile/123"
                        className="block text-sm text-blue-700 hover:text-blue-900 transition-colors"
                      >
                        → Build Portfolio
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your profile will appear here</h3>
                  <p className="text-gray-600">Upload a PDF resume to extract your professional information with AI.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 