import { Profile } from '@/lib/types'
import { ProfileImage } from './ProfileImage'

interface ProfileHeaderProps {
  profile: Profile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <header className="mb-8 text-center">
      {/* Profile Photo */}
      <div className="relative mx-auto mb-6 h-32 w-32">
        <ProfileImage
          imageUrl={profile.image_url}
          name={profile.name}
          size="xl"
          className="h-32 w-32"
        />
      </div>

      {/* Name */}
      <h1 className="mb-3 text-4xl font-bold text-gray-900 lg:text-5xl print:text-3xl">
        {profile.name}
      </h1>

      {/* Headline */}
      <h2 className="text-xl font-medium text-gray-600 lg:text-2xl print:text-lg">
        {profile.headline}
      </h2>
    </header>
  )
}
