'use client'

import { FaDownload } from 'react-icons/fa'

interface DownloadButtonProps {
  profileId: string
}

export function DownloadButton({ profileId }: DownloadButtonProps) {
  const handlePrint = () => {
    // Use the same approach as the resume preview page
    window.print()
  }

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
    >
      <FaDownload size={16} />
      Download PDF
    </button>
  )
}
