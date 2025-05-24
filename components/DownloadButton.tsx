"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { FaDownload } from "react-icons/fa";

interface DownloadButtonProps {
  profileId: string;
}

export function DownloadButton({ profileId }: DownloadButtonProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `profile-${profileId}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  // Find the profile content element when printing
  const triggerPrint = () => {
    const profileContent = document.getElementById('profile-content');
    if (profileContent) {
      // Temporarily assign the profile content to our ref
      printRef.current = profileContent as HTMLDivElement;
      handlePrint();
    }
  };

  return (
    <>
      <button
        onClick={triggerPrint}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
      >
        <FaDownload size={16} />
        Download PDF
      </button>
      {/* Hidden ref for react-to-print */}
      <div ref={printRef} style={{ display: 'none' }} />
    </>
  );
} 