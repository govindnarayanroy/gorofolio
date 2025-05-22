"use client";

import { useRef, useEffect, useState } from "react";
import ResumePreview from "@/components/ResumePreview";
import { PdfDownloadButton } from "@/components/PdfDownloadButton";
import { Profile } from "@/lib/types";

const mock: Profile = {
  name: "Jane Doe",
  headline: "Frontend Engineer",
  summary:
    "Passionate developer with 4+ years building scalable React & Next.js apps.",
  experiences: [],
  education: [],
  skills: [],
  links: [],
};

export default function PreviewPage() {
  const resumeRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  // 🔑  after first paint, ref will be set → enable button
  useEffect(() => {
    if (resumeRef.current) setReady(true);
  }, []);

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      {/* 1️⃣ résumé */}
      <ResumePreview ref={resumeRef} profile={mock} />

      {/* 2️⃣ button appears only when ref is ready */}
      {ready && (
        <PdfDownloadButton targetRef={resumeRef}>
          Download PDF
        </PdfDownloadButton>
      )}
    </main>
  );
}