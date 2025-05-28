'use client'

import { useState } from 'react'
import { FaRocket, FaSpinner } from 'react-icons/fa'

interface PublishButtonProps {
  profileId: string
}

export function PublishButton({ profileId }: PublishButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePublish = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/portfolio/export?id=${profileId}`)

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)

        // Create download link
        const a = document.createElement('a')
        a.href = url
        a.download = `portfolio-${profileId}.zip`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
      } else {
        throw new Error('Failed to export portfolio')
      }
    } catch (error) {
      console.error('Error publishing portfolio:', error)
      alert('Failed to publish portfolio. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePublish}
      disabled={loading}
      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-emerald-700 hover:shadow-lg disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:hover:scale-100"
    >
      {loading ? (
        <>
          <FaSpinner className="animate-spin" size={16} />
          Publishing...
        </>
      ) : (
        <>
          <FaRocket size={16} />
          Publish Portfolio
        </>
      )}
    </button>
  )
}
