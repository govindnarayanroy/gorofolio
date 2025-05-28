'use client'

import { useState, useRef } from 'react'
import { Upload, X, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ImageUploadProps {
  currentImageUrl?: string | null
  onImageUploaded: (imageUrl: string) => void
  onImageRemoved: () => void
  className?: string
}

export function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  className = '',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file must be smaller than 5MB')
      return
    }

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()

      // Clean up object URL
      URL.revokeObjectURL(objectUrl)

      // Update with actual uploaded URL
      setPreviewUrl(data.imageUrl)
      onImageUploaded(data.imageUrl)

      toast.success('Profile image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload image')

      // Revert preview on error
      URL.revokeObjectURL(objectUrl)
      setPreviewUrl(currentImageUrl || null)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onImageRemoved()
    toast.success('Profile image removed')
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        {/* Image Preview */}
        <div className="relative">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-blue-100 to-purple-100 shadow-lg">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Loading overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}

          {/* Remove button */}
          {previewUrl && !isUploading && (
            <button
              onClick={handleRemoveImage}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
              title="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <Button
              onClick={handleUploadClick}
              disabled={isUploading}
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Upload className="mr-2 h-4 w-4" />
              {previewUrl ? 'Change Photo' : 'Upload Photo'}
            </Button>

            {previewUrl && (
              <Button
                onClick={handleRemoveImage}
                disabled={isUploading}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Remove
              </Button>
            )}
          </div>

          <p className="text-xs text-gray-500">JPEG, PNG, or WebP • Max 5MB</p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
