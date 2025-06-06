'use client'

import { useState } from 'react'
import { Share2, Globe, Copy, Check, Eye, EyeOff, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from './ui/switch'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface PortfolioPublishProps {
  profileId: string
  className?: string
}

export function PortfolioPublish({ profileId, className = '' }: PortfolioPublishProps) {
  const [isPublished, setIsPublished] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [customSlug, setCustomSlug] = useState('')
  const [copied, setCopied] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null)

  // Generate portfolio URL - use deployment URL if available, otherwise fallback to local
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const portfolioUrl =
    deploymentUrl ||
    (customSlug ? `${baseUrl}/portfolio/${customSlug}` : `${baseUrl}/portfolio/${profileId}`)

  const handlePublish = async () => {
    setIsPublishing(true)

    try {
      console.log('🚀 Publishing portfolio...', { profileId, customSlug })

      // Call the deploy API
      const response = await fetch('/api/portfolio/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          customSlug: customSlug || undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `Deploy failed: ${response.status}`)
      }

      console.log('✅ Portfolio published successfully:', result)

      setIsPublished(true)
      setDeploymentUrl(result.url)

      // Show success message
      toast.success(result.message || 'Portfolio published successfully!')

      // Redirect to the portfolio page
      window.open(result.url, '_blank')
    } catch (error) {
      console.error('❌ Publishing failed:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to publish portfolio')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleUnpublish = async () => {
    setIsPublishing(true)

    try {
      console.log('🔄 Unpublishing portfolio...', { profileId })

      // For now, we'll just update the local state
      // In the future, you might want to add an unpublish API endpoint
      setIsPublished(false)
      setDeploymentUrl(null) // Clear the deployment URL
      toast.success('Portfolio unpublished successfully')
    } catch (error) {
      console.error('❌ Unpublishing failed:', error)
      toast.error('Failed to unpublish portfolio')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
      toast.error('Failed to copy link')
    }
  }

  const handleSlugChange = (value: string) => {
    // Clean the slug: lowercase, replace spaces with hyphens, remove special chars
    const cleanSlug = value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    setCustomSlug(cleanSlug)
  }

  return (
    <Card className={`border-0 bg-white/95 shadow-2xl backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Share2 className="h-5 w-5" />
          Portfolio Publishing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Publishing Status */}
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            {isPublished ? (
              <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
            ) : (
              <div className="h-3 w-3 rounded-full bg-gray-400"></div>
            )}
            <div>
              <div className="font-medium text-slate-800">
                {isPublished ? 'Portfolio is Live' : 'Portfolio is Private'}
              </div>
              <div className="text-sm text-slate-600">
                {isPublished
                  ? 'Your portfolio is publicly accessible via the link below'
                  : 'Your portfolio is only visible to you'}
              </div>
            </div>
          </div>
          {isPublished ? (
            <Eye className="h-5 w-5 text-green-500" />
          ) : (
            <EyeOff className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {/* Portfolio URL */}
        {isPublished && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Portfolio URL</label>
            <div className="flex gap-2">
              <Input value={portfolioUrl} readOnly className="flex-1 border-gray-200 bg-gray-50" />
              <Button onClick={handleCopyLink} variant="outline" size="sm" className="px-3">
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Advanced Settings */}
        <div className="space-y-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            <Settings className="h-4 w-4" />
            Advanced Settings
          </button>

          {showAdvanced && (
            <div className="space-y-4 rounded-lg bg-gray-50 p-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Custom URL Slug (Optional)
                </label>
                <Input
                  value={customSlug}
                  onChange={e => handleSlugChange(e.target.value)}
                  placeholder="your-name"
                  className="border-gray-200"
                />
                <p className="text-xs text-slate-500">
                  Create a custom URL like: {baseUrl}/portfolio/{customSlug || 'your-name'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-700">SEO Optimization</div>
                  <div className="text-xs text-slate-500">
                    Include meta tags for better search visibility
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-700">Analytics Tracking</div>
                  <div className="text-xs text-slate-500">Track portfolio views and engagement</div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isPublished ? (
            <>
              <Button
                onClick={handleUnpublish}
                disabled={isPublishing}
                variant="outline"
                className="flex-1"
              >
                {isPublishing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                    Unpublishing...
                  </>
                ) : (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Make Private
                  </>
                )}
              </Button>
              <Button
                onClick={() => window.open(portfolioUrl, '_blank')}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
              >
                <Globe className="mr-2 h-4 w-4" />
                View Live
              </Button>
            </>
          ) : (
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
            >
              {isPublishing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  Publishing Portfolio...
                </>
              ) : (
                <>
                  <Share2 className="mr-2 h-4 w-4" />
                  Publish Live
                </>
              )}
            </Button>
          )}
        </div>

        {/* Publishing Info */}
        <div className="space-y-1 text-xs text-slate-500">
          <p>• Published portfolios are indexed by search engines</p>
          <p>• You can update your portfolio anytime after publishing</p>
          <p>• Analytics and visitor insights available for published portfolios</p>
        </div>
      </CardContent>
    </Card>
  )
}
