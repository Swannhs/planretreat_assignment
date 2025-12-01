'use client'

import ClientPageWrapper from '@/components/ClientPageWrapper'
import ErrorState from '@/components/ErrorState'
import Hero from '@/components/Hero'
import SearchFilters from '@/components/SearchFilters'
import { fetchVenues } from '@/lib/api'
import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'


function HomeContent() {
  const searchParams = useSearchParams()
  const [venues, setVenues] = useState<any[] | null>(null)
  const [meta, setMeta] = useState<any | null>(null)
  const [error, setError] = useState<{ message: string; code?: string; status?: number } | null>(null)
  const [loading, setLoading] = useState(true)

  const paramsObject = useMemo(() => {
    const obj: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      obj[key] = value
    })
    if (!obj.limit) obj.limit = '6'
    return obj
  }, [searchParams])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchVenues(paramsObject).then(({ venues, meta, error }) => {
      if (cancelled) return
      if (error) {
        setError(error)
        setVenues(null)
        setMeta(null)
      } else {
        setVenues(venues)
        setMeta(meta)
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [paramsObject])

  if (error) {
    return <ErrorState message={error.message} code={error.code} status={error.status} />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Hero />

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <SearchFilters />

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-96" />
            ))}
          </div>
        )}

        {!loading && venues && meta && (
          <ClientPageWrapper
            venues={venues}
            page={meta.page}
            totalPages={meta.totalPages}
          />
        )}

        {!loading && !venues && !error && (
          <ErrorState message="Unexpected response from the API." />
        )}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <HomeContent />
    </Suspense>
  )
}
