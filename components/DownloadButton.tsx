"use client";

import { FaDownload } from "react-icons/fa";

interface DownloadButtonProps {
  profileId: string;
}

export function DownloadButton({ profileId }: DownloadButtonProps) {
  const handlePrint = () => {
    // Use the same approach as the resume preview page
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
    >
      <FaDownload size={16} />
      Download PDF
    </button>
  );
} 