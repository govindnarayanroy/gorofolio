"use client";
import { useState } from "react";

export default function IngestPage() {
  const [file, setFile] = useState<File>();
  const [profile, setProfile] = useState<any>(null);

  async function upload() {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/ingest", { method: "POST", body: fd }).then(r => r.json());
    setProfile(res.profile);
  }

  return (
    <main className="mx-auto max-w-xl space-y-4 p-6">
      <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0])} />
      <button
        onClick={upload}
        disabled={!file}
        className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
      >
        Parse Résumé
      </button>

      {profile && (
        <pre className="mt-4 overflow-auto rounded bg-zinc-900 p-4 text-xs text-green-300">
          {JSON.stringify(profile, null, 2)}
        </pre>
      )}
    </main>
  );
} 