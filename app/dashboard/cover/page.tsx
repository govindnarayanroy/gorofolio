"use client";

import { useState } from "react";
import { Profile } from "@/lib/types";

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
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <h1 className="text-2xl font-bold">Cover Letter Generator</h1>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
            Tone
          </label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value as typeof tone)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="enthusiastic">Enthusiastic</option>
          </select>
        </div>

        <div>
          <label htmlFor="jd" className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            id="jd"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
            placeholder="Paste the job description here..."
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
        >
          {isLoading ? "Generating..." : "Generate Cover Letter"}
        </button>
      </div>

      {coverLetter && (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Generated Cover Letter</h2>
          <div className="prose prose-sm max-w-none">
            {coverLetter.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </main>
  );
} 