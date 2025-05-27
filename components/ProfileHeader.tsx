import { Profile } from "@/lib/types";
import { ProfileImage } from "./ProfileImage";

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <header className="text-center mb-8">
      {/* Profile Photo */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <ProfileImage 
          imageUrl={profile.image_url}
          name={profile.name}
          size="xl"
          className="w-32 h-32"
        />
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