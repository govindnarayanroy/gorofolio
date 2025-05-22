"use client";

import { useRef } from "react";
import ResumePreview from "@/components/ResumePreview";
import { PdfDownloadButton } from "@/components/PdfDownloadButton";
import { Profile } from "@/lib/types";

const mock: Profile = { /* …same as before… */ };

export default function PreviewPage() {
  const resumeRef = useRef<HTMLDivElement>(null);

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <PdfDownloadButton targetRef={resumeRef}>Download PDF</PdfDownloadButton>

      {/* Attach the ref here */}
      <div ref={resumeRef}>
        <ResumePreview profile={mock} />
      </div>
    </main>
  );
}