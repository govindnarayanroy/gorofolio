"use client";

import { User } from 'lucide-react';

interface ProfileImageProps {
  imageUrl?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
  xl: 'w-24 h-24 text-lg'
};

export function ProfileImage({ 
  imageUrl, 
  name = '', 
  size = 'md', 
  className = '' 
}: ProfileImageProps) {
  const getInitials = (fullName: string) => {
    if (!fullName) return '';
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-white shadow-lg flex items-center justify-center ${className}`}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={name || 'Profile'} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Hide image on error and show fallback
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : initials ? (
        <span className="font-semibold text-gray-700">
          {initials}
        </span>
      ) : (
        <User className="w-1/2 h-1/2 text-gray-400" />
      )}
    </div>
  );
} 