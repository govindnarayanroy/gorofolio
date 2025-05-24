import { Profile } from "@/lib/types";
import Image from "next/image";

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <header className="text-center mb-8">
      {/* Profile Photo Placeholder */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
      </div>

      {/* Name */}
      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 print:text-3xl">
        {profile.name}
      </h1>

      {/* Headline */}
      <h2 className="text-xl lg:text-2xl text-gray-600 font-medium print:text-lg">
        {profile.headline}
      </h2>
    </header>
  );
} 