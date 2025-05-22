// app/dashboard/preview/page.tsx
"use client";

import { useRef } from "react";
import ReactToPrint from "react-to-print";          // <- switch to component
import ResumePreview from "@/components/ResumePreview";
import { Profile } from "@/lib/types";

const mock: Profile = {
  name: "Jane Doe",
  headline: "Frontend Engineer",
  summary: "Passionate developer with 4+ years building React & Next.js apps.",
  experiences: [],
  education: [],
  skills: [],
  links: [],
};

export default function PreviewPage() {
  const resumeRef = useRef<HTMLElement>(null);

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      {/* résumé – must render first so ref is ready */}
      <ResumePreview ref={resumeRef} profile={mock} />

      {/* print button handled by ReactToPrint */}
      <ReactToPrint
        trigger={() => (
          <button className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 print:hidden">
            Download PDF
          </button>
        )}
        content={() => resumeRef.current}       // never null after mount
        documentTitle="resume"
        pageStyle="@page { size: A4; margin: 12mm 14mm; }"
      />
    </main>
  );
}