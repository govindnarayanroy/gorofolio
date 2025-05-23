import { getAvailableDomains, getDomainTitle } from "@/lib/interview";
import Link from "next/link";

export default function InterviewLobby() {
  const domains = getAvailableDomains();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Choose Interview Domain</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {domains.map((domain) => (
          <Link
            key={domain}
            href={`/dashboard/interview/session?domain=${domain}`}
            className="p-4 border rounded hover:bg-gray-100"
          >
            {getDomainTitle(domain)}
          </Link>
        ))}
      </div>
    </div>
  );
} 