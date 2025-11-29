import { prisma } from '@/lib/prisma'
import VenueCard from '@/components/VenueCard'
import SearchFilters from '@/components/SearchFilters'
import ClientPageWrapper from '@/components/ClientPageWrapper'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const city = typeof params.city === 'string' ? params.city : undefined
  const capacity = typeof params.capacity === 'string' ? params.capacity : undefined
  const price = typeof params.price === 'string' ? params.price : undefined

  const where: any = {}

  if (city) {
    where.location = {
      contains: city,
      mode: 'insensitive',
    }
  }

  if (capacity) {
    where.capacity = {
      gte: parseInt(capacity),
    }
  }

  if (price) {
    where.pricePerNight = {
      lte: parseFloat(price),
    }
  }

  const page = typeof params.page === 'string' ? parseInt(params.page) : 1
  const limit = typeof params.limit === 'string' ? parseInt(params.limit) : 6
  const skip = (page - 1) * limit

  const [venues, total] = await Promise.all([
    prisma.venue.findMany({
      where,
      orderBy: {
        id: 'asc',
      },
      skip,
      take: limit,
    }),
    prisma.venue.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32">
          <div className="text-center space-y-6">
            <h1 className="text-6xl sm:text-7xl font-bold text-white tracking-tight">
              Retreat Venues
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-2xl mx-auto font-light">
              Discover exceptional spaces for unforgettable team experiences
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <Suspense fallback={<div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 h-32 animate-pulse" />}>
          <SearchFilters />
        </Suspense>

        <ClientPageWrapper
          venues={venues}
          page={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  )
}
