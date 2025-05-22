// app/dashboard/preview/page.tsx
"use client";

import ResumePreview from "@/components/ResumePreview";
import { PdfDownloadButton } from "@/components/PdfDownloadButton";
import { Profile } from "@/lib/types";

const mock: Profile = {
  name: "Jane Doe",
  headline: "Frontend Engineer",
  summary:
    "Passionate developer with 4+ years building scalable React & Next.js applications.",
  experiences: [
    {
      company: "Acme Corp",
      role: "Software Engineer",
      start: "2022-01",
      end: undefined,
      bullets: [
        "Led migration to Next.js 14 and Turbopack.",
        "Improved Core Web Vitals (LCP 1.9s → 1.2s).",
      ],
    },
  ],
  education: [
    {
      school: "State University",
      degree: "B.Tech Computer Science",
      year: "2021",
    },
  ],
  skills: ["React", "TypeScript", "Next.js", "TailwindCSS"],
  links: [
    { label: "GitHub", url: "https://github.com/janedoe" },
    { label: "Portfolio", url: "https://janedoe.dev" },
  ],
};

export default function PreviewPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <PdfDownloadButton>Download PDF</PdfDownloadButton>

      {/* Resume itself */}
      <ResumePreview profile={mock} />
    </main>
  );
}