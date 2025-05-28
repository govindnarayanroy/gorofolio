'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Profile } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { BackToDashboard } from '@/components/BackToDashboard'

export default function IngestPage() {
  const [file, setFile] = useState<File | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function upload() {
    if (!file) return

    setIsLoading(true)
    setError('')
    setProfile(null)

    try {
      console.log('📤 Uploading file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      })

      const fd = new FormData()
      fd.append('file', file)

      const response = await fetch('/api/ingest', {
        method: 'POST',
        body: fd,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      console.log('✅ Upload successful:', data)
      setProfile(data.profile)

      // Show success message and navigate to editor after a short delay
      setTimeout(() => {
        router.push('/dashboard/editor')
      }, 2000)
    } catch (err) {
      console.error('❌ Upload failed:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      console.log('📁 File selected:', {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      })
      setFile(selectedFile)
      setError('')
      setProfile(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-purple-600/15"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
      <div className="absolute left-20 top-20 h-96 w-96 animate-pulse rounded-full bg-blue-500/25 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 h-[600px] w-[600px] rounded-full bg-purple-500/15 blur-3xl"></div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-white/20 bg-white/10 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-center justify-between">
              <BackToDashboard variant="header" />

              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 animate-pulse rounded-full bg-yellow-400"></div>
                <span className="font-medium text-white">Resume Upload</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-4xl px-6 py-12">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-yellow-400 to-orange-500 shadow-2xl">
              <svg
                className="h-10 w-10 text-slate-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h1 className="mb-4 text-4xl font-black text-white">Upload Your Resume</h1>
            <p className="mx-auto max-w-3xl text-xl text-blue-200/90">
              Upload your PDF resume and our AI will extract your information to create your
              professional profile.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Upload Section */}
            <div className="rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Upload Resume</h2>

              <div className="space-y-6">
                {/* File Input */}
                <div>
                  <label
                    htmlFor="resume"
                    className="mb-3 block text-sm font-semibold text-gray-700"
                  >
                    Select PDF Resume
                  </label>
                  <div className="relative">
                    <input
                      id="resume"
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 transition-all duration-300 file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-yellow-700 hover:file:bg-yellow-100 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  {file && (
                    <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
                      <div className="flex items-center">
                        <svg
                          className="mr-2 h-5 w-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-green-700">{file.name}</span>
                        <span className="ml-2 text-xs text-green-600">
                          ({Math.round(file.size / 1024)} KB)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Display */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center">
                      <svg
                        className="mr-2 h-5 w-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm text-red-600">{error}</span>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <button
                  onClick={upload}
                  disabled={!file || isLoading}
                  className="w-full rounded-xl bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 px-6 py-4 font-bold text-white transition-all duration-300 hover:scale-105 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 hover:shadow-2xl hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      Processing Resume...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Parse Resume with AI</span>
                      <svg
                        className="ml-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Instructions */}
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="font-semibold">Requirements:</p>
                  <ul className="list-inside list-disc space-y-1 text-xs">
                    <li>PDF format only</li>
                    <li>Maximum file size: 4MB</li>
                    <li>Text-based PDF (not scanned images)</li>
                    <li>Contains readable text content</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
              {profile ? (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Extracted Profile</h2>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(JSON.stringify(profile, null, 2))
                      }
                      className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 hover:bg-gray-200"
                    >
                      Copy JSON
                    </button>
                  </div>

                  {/* Profile Preview */}
                  <div className="mb-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                      <p className="text-gray-600">{profile.headline}</p>
                    </div>

                    {profile.summary && (
                      <div>
                        <h4 className="mb-1 font-medium text-gray-800">Summary</h4>
                        <p className="text-sm text-gray-600">{profile.summary}</p>
                      </div>
                    )}

                    {profile.experiences?.length > 0 && (
                      <div>
                        <h4 className="mb-1 font-medium text-gray-800">Experience</h4>
                        <p className="text-sm text-gray-600">
                          {profile.experiences.length} positions found
                        </p>
                      </div>
                    )}

                    {profile.skills?.length > 0 && (
                      <div>
                        <h4 className="mb-1 font-medium text-gray-800">Skills</h4>
                        <p className="text-sm text-gray-600">
                          {profile.skills.length} skills extracted
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Raw JSON */}
                  <details className="group">
                    <summary className="mb-2 cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      View Raw JSON
                    </summary>
                    <pre className="max-h-64 overflow-auto rounded bg-zinc-900 p-4 text-xs text-green-300">
                      {JSON.stringify(profile, null, 2)}
                    </pre>
                  </details>

                  {/* Next Steps */}
                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                      <div className="mb-2 flex items-center">
                        <svg
                          className="mr-2 h-5 w-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h4 className="font-semibold text-green-900">
                          Resume Parsed Successfully!
                        </h4>
                      </div>
                      <p className="mb-3 text-sm text-green-700">
                        Your resume has been processed and saved. You'll be redirected to the editor
                        automatically, or click below to continue.
                      </p>
                      <Link
                        href="/dashboard/editor"
                        className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors duration-300 hover:bg-green-700"
                      >
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit Resume
                      </Link>
                    </div>

                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                      <h4 className="mb-2 font-semibold text-blue-900">Other Options</h4>
                      <div className="space-y-2">
                        <Link
                          href="/dashboard/preview"
                          className="block text-sm text-blue-700 transition-colors hover:text-blue-900"
                        >
                          → Generate Resume Preview
                        </Link>
                        <Link
                          href="/dashboard/cover"
                          className="block text-sm text-blue-700 transition-colors hover:text-blue-900"
                        >
                          → Create Cover Letter
                        </Link>
                        <Link
                          href="/dashboard/profile/123"
                          className="block text-sm text-blue-700 transition-colors hover:text-blue-900"
                        >
                          → Build Portfolio
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-yellow-100 to-orange-100">
                    <svg
                      className="h-8 w-8 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Your profile will appear here
                  </h3>
                  <p className="text-gray-600">
                    Upload a PDF resume to extract your professional information with AI.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
