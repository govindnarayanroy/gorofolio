"use client";
import React, { forwardRef } from "react";
import { Profile } from "@/lib/types";

/**
 * A4-print-safe résumé preview.
 * Wrapped with forwardRef so react-to-print can grab the DOM node.
 */
const ResumePreview = forwardRef<HTMLElement, { profile: Profile }>(
  ({ profile }, ref) => {
    return (
      <article
        ref={ref}
        className="prose prose-zinc mx-auto w-[210mm] bg-white px-10 py-8 print:px-0 print:py-0"
        style={{ minHeight: "297mm" }}
      >
        {/* Header */}
        <header className="mb-4 border-b pb-2">
          <h1 className="m-0 text-3xl font-extrabold">{profile.name}</h1>
          <p className="m-0 text-lg text-zinc-600">{profile.headline}</p>
        </header>

        {/* Summary */}
        <section className="mb-4">
          <h2 className="mb-1 text-base font-semibold tracking-wide text-sky-700">
            Summary
          </h2>
          <p className="m-0 leading-6">{profile.summary}</p>
        </section>

        {/* Experience */}
        <section className="mb-4">
          <h2 className="mb-1 text-base font-semibold tracking-wide text-sky-700">
            Experience
          </h2>
          {(profile.experiences ?? []).map((exp) => (
            <div key={exp.company + exp.role} className="mb-3 last:mb-0">
              <div className="flex justify-between">
                <strong>{exp.role}</strong>
                <span className="text-sm text-zinc-500">
                  {exp.start} – {exp.end ?? "Present"}
                </span>
              </div>
              <div className="italic text-zinc-600">{exp.company}</div>
              <ul className="my-1 list-disc pl-5 text-sm leading-5">
                {exp.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="mb-4">
          <h2 className="mb-1 text-base font-semibold tracking-wide text-sky-700">
            Education
          </h2>
          {(profile.education ?? []).map((ed) => (
            <p key={ed.school} className="m-0 text-sm leading-5">
              <strong>{ed.school}</strong>, {ed.degree} ({ed.year})
            </p>
          ))}
        </section>

        {/* Skills */}
        <section>
          <h2 className="mb-1 text-base font-semibold tracking-wide text-sky-700">
            Skills
          </h2>
          <p className="flex flex-wrap gap-2 text-sm">
            {(profile.skills ?? []).map((s) => (
              <span
                key={s}
                className="rounded bg-zinc-100 px-2 py-0.5 leading-none"
              >
                {s}
              </span>
            ))}
          </p>
        </section>
      </article>
    );
  }
);

ResumePreview.displayName = "ResumePreview";
export default ResumePreview;