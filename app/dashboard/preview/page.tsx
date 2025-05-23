// app/dashboard/preview/page.tsx
"use client";

import { useRef } from "react";
import ResumePreview from "@/components/ResumePreview";
import { Profile } from "@/lib/types";

const mock: Profile = {
  name: "Jane Doe",
  headline: "Frontend Engineer",
  summary: "Passionate developer with 4+ years building React apps.",
  experiences: [],
  education: [],
  skills: [],
  links: [],
};

export default function PreviewPage() {
  // not even needed for printing, but keep if you later scroll to view
  const resumeRef = useRef<HTMLElement>(null);

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <ResumePreview ref={resumeRef} profile={mock} />

      <button
        onClick={() => window.print()}     // ← native print
        className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 print:hidden"
      >
        Download PDF
      </button>
    </main>
  );
}