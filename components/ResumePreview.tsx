"use client";
import React, { forwardRef } from "react";
import { Profile } from "@/lib/types";
import { ProfileImage } from "./ProfileImage";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

/**
 * Modern A4-print-safe résumé preview with contemporary styling.
 * Wrapped with forwardRef so react-to-print can grab the DOM node.
 */
const ResumePreview = forwardRef<HTMLElement, { profile: Profile }>(
  ({ profile }, ref) => {
    const getContactIcon = (label: string | undefined | null) => {
      // Handle undefined, null, or empty labels
      if (!label || typeof label !== 'string' || label.trim() === '') {
        return <Globe className="w-4 h-4" />;
      }
      
      try {
        const lower = label.toLowerCase();
        if (lower.includes('email') || lower.includes('mail')) return <Mail className="w-4 h-4" />;
        if (lower.includes('phone') || lower.includes('mobile')) return <Phone className="w-4 h-4" />;
        if (lower.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
        if (lower.includes('github')) return <Github className="w-4 h-4" />;
        if (lower.includes('website') || lower.includes('portfolio')) return <Globe className="w-4 h-4" />;
        return <Globe className="w-4 h-4" />;
      } catch (error) {
        console.warn('Error processing label in getContactIcon:', error);
        return <Globe className="w-4 h-4" />;
      }
    };

    return (
      <article
        ref={ref}
        className="mx-auto w-full max-w-[210mm] bg-white print:px-0 print:py-0 print:w-[210mm] shadow-lg border border-gray-200"
        style={{ minHeight: "297mm" }}
      >
        {/* Modern Header with Accent Color */}
        <header className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-8 print:px-6 print:py-6">
          <div className="flex items-start gap-6">
            <ProfileImage 
              imageUrl={profile.image_url}
              name={profile.name}
              size="xl"
              className="print:w-20 print:h-20 border-4 border-white/20 shadow-xl"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 print:text-3xl tracking-tight">
                {profile.name}
              </h1>
              <p className="text-xl text-slate-200 mb-4 print:text-lg font-light">
                {profile.headline}
              </p>
              
              {/* Contact Information */}
              {profile.links && profile.links.length > 0 && (
                <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                  {profile.links.slice(0, 3).filter(link => link && link.url).map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {getContactIcon(link.label)}
                      <span className="print:text-xs">{link.url.replace(/^https?:\/\//, '')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Decorative accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        </header>

        <div className="px-8 py-6 print:px-6 print:py-4">
          {/* Professional Summary */}
          <section className="mb-8 print:mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-3 pb-2 border-b-2 border-slate-200 print:text-base">
              Professional Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify print:text-sm">
              {profile.summary}
            </p>
          </section>

          {/* Experience Section */}
          {(profile.experiences ?? []).length > 0 && (
            <section className="mb-8 print:mb-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-200 print:text-base">
                Professional Experience
              </h2>
              <div className="space-y-6 print:space-y-4">
                {profile.experiences.map((exp, index) => (
                  <div key={exp.company + exp.role} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-2 top-2 w-3 h-3 bg-blue-500 rounded-full print:hidden"></div>
                    
                    <div className="pl-6 print:pl-0">
                      <div className="flex justify-between items-start mb-2 print:mb-1">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 print:text-base">
                            {exp.role}
                          </h3>
                          <p className="text-blue-600 font-medium print:text-sm">
                            {exp.company}
                          </p>
                        </div>
                        <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full print:text-xs print:bg-transparent print:px-0">
                          {exp.start} – {exp.end ?? "Present"}
                        </span>
                      </div>
                      
                      <ul className="space-y-2 print:space-y-1">
                        {exp.bullets.map((bullet, i) => (
                          <li key={i} className="text-slate-700 leading-relaxed print:text-sm flex items-start">
                            <span className="text-blue-500 mr-3 mt-1.5 print:mt-1">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Two-column layout for Education and Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-2 print:gap-6">
            {/* Education */}
            {(profile.education ?? []).length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-200 print:text-base">
                  Education
                </h2>
                <div className="space-y-3 print:space-y-2">
                  {profile.education.map((ed, index) => (
                    <div key={ed.school} className="bg-slate-50 p-4 rounded-lg print:bg-transparent print:p-0">
                      <h3 className="font-semibold text-slate-800 print:text-sm">
                        {ed.degree}
                      </h3>
                      <p className="text-blue-600 font-medium print:text-sm">
                        {ed.school}
                      </p>
                      <p className="text-sm text-slate-500 print:text-xs">
                        {ed.year}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {(profile.skills ?? []).length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-200 print:text-base">
                  Core Competencies
                </h2>
                <div className="grid grid-cols-2 gap-2 print:grid-cols-1">
                  {profile.skills.map((skill, index) => (
                    <div
                      key={skill}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium print:bg-transparent print:border print:border-slate-300 print:text-xs"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Additional Links */}
          {profile.links && profile.links.length > 3 && (
            <section className="mt-8 print:mt-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-200 print:text-base">
                Additional Links
              </h2>
              <div className="grid grid-cols-2 gap-3 print:grid-cols-1 print:gap-1">
                {profile.links.slice(3).filter(link => link && link.url).map((link, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-600 print:text-xs">
                    {getContactIcon(link.label)}
                    <span className="font-medium">{link.label || 'Link'}:</span>
                    <span className="text-blue-600">{link.url.replace(/^https?:\/\//, '')}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer with subtle branding */}
        <footer className="mt-auto px-8 py-4 border-t border-slate-200 print:px-6 print:py-2">
          <div className="text-center text-xs text-slate-400 print:hidden">
            Generated with Gorofolio • Professional Resume Builder
          </div>
        </footer>
      </article>
    );
  }
);

ResumePreview.displayName = "ResumePreview";
export default ResumePreview;