import { notFound } from "next/navigation";
import { getProfileById } from "@/lib/profiles";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ExperienceSection } from "@/components/ExperienceSection";
import { EducationSection } from "@/components/EducationSection";
import { SkillsSection } from "@/components/SkillsSection";
import { LinksList } from "@/components/LinksList";
import { PublishButton } from "@/components/PublishButton";
import { DownloadButton } from "@/components/DownloadButton";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const profile = getProfileById(id);

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-8 print:hidden">
          <DownloadButton profileId={id} />
          <PublishButton profileId={id} />
        </div>

        {/* Profile Content */}
        <div 
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 lg:p-12 print:shadow-none print:bg-white print:p-0"
          id="profile-content"
        >
          <ProfileHeader profile={profile} />
          
          {/* External Links */}
          <LinksList links={profile.links} />
          
          {/* Summary Section */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 print:text-xl">Summary</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              {profile.summary}
            </p>
          </section>

          {/* Experience Section */}
          <ExperienceSection experiences={profile.experiences} />
          
          {/* Education Section */}
          <EducationSection education={profile.education} />
          
          {/* Skills Section */}
          <SkillsSection skills={profile.skills} />
        </div>
      </div>
    </div>
  );
} 