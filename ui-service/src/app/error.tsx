'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[UI] Global error boundary', error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-red-100 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white text-2xl font-bold mb-4">
          !
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Something went wrong</h1>
        <p className="text-slate-600 mb-4">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
        {error?.digest && (
          <p className="text-slate-400 text-xs mb-4">Error ID: {error.digest}</p>
        )}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-blue-600 transition-colors shadow-md"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-5 py-3 rounded-xl bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 transition-colors border border-slate-200"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}
