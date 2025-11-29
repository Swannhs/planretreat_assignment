'use client'

import { useState } from 'react'
import { Venue } from '@prisma/client'
import VenueCard from './VenueCard'
import BookingForm from './BookingForm'

import { useRouter, useSearchParams } from 'next/navigation'

export default function ClientPageWrapper({
    venues,
    page,
    totalPages
}: {
    venues: Venue[]
    page: number
    totalPages: number
}) {
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', newPage.toString())
        router.push(`/?${params.toString()}`)
    }

    return (
        <>
            {venues.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No venues found matching your criteria.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {venues.map((venue) => (
                            <VenueCard
                                key={venue.id}
                                venue={venue}
                                onBook={setSelectedVenue}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-12">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page <= 1}
                                className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm hover:shadow-md disabled:hover:border-gray-200 disabled:hover:text-gray-700"
                            >
                                ← Previous
                            </button>
                            <span className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= totalPages}
                                className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm hover:shadow-md disabled:hover:border-gray-200 disabled:hover:text-gray-700"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}

            {selectedVenue && (
                <BookingForm
                    venue={selectedVenue}
                    onClose={() => setSelectedVenue(null)}
                />
            )}
        </>
    )
}
