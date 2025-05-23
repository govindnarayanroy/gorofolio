// components/PdfDownloadButton.tsx
"use client";
import { RefObject } from "react";
import { useReactToPrint } from "react-to-print";

export function PdfDownloadButton({
  targetRef,
  children,
}: {
  targetRef: RefObject<HTMLElement>;
  children: React.ReactNode;
}) {
  const handlePrint = useReactToPrint({
    content: () => targetRef.current,
  });

  return (
    <button
      onClick={handlePrint}
      className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 print:hidden"
    >
      {children}
    </button>
  );
}