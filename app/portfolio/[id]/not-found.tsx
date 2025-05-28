import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8">
          <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">Portfolio Not Found</h2>
          <p className="mb-8 text-gray-600">
            The portfolio you're looking for doesn't exist or has been unpublished.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Go to Homepage
          </Link>

          <div>
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-800">
              Create Your Own Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
