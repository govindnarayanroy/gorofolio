"use client";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export function PdfDownloadButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  return (
    <>
      <button
        onClick={handlePrint}
        className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 print:hidden"
      >
        {children}
      </button>
      {/* hidden clone; we'll fill it from a page component */}
      <div className="hidden">
        <div ref={ref} id="print-area" />
      </div>
    </>
  );
}
