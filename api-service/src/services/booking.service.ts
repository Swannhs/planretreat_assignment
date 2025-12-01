import { bookingRepository } from '../repositories/booking.repository'
import { venueRepository } from '../repositories/venue.repository'
import { prisma } from '../lib/prisma'

function parseDateOnly(value: string) {
    const normalized = value.includes('T') ? value : `${value}T00:00:00Z`
    const parsed = new Date(normalized)

    if (Number.isNaN(parsed.getTime())) {
        throw new Error('INVALID_DATE')
    }

    return parsed
}

export class BookingService {
    async createBooking(data: {
        venueId: number
        companyName: string
        email: string
        startDate: string
        endDate: string
        attendeeCount: number
    }) {
        const venue = await venueRepository.findById(data.venueId)

        if (!venue) {
            throw new Error('VENUE_NOT_FOUND')
        }

        if (data.attendeeCount > venue.capacity) {
            throw new Error('CAPACITY_EXCEEDED')
        }

        const startDate = parseDateOnly(data.startDate)
        const endDate = parseDateOnly(data.endDate)

        const booking = await prisma.$transaction(
            async (tx) => {
                const overlappingBooking = await bookingRepository.findOverlapping(
                    tx,
                    data.venueId,
                    startDate,
                    endDate
                )

                if (overlappingBooking) {
                    throw new Error('BOOKING_CONFLICT')
                }

                return bookingRepository.create(tx, {
                    venueId: data.venueId,
                    companyName: data.companyName,
                    email: data.email,
                    startDate,
                    endDate,
                    attendeeCount: data.attendeeCount,
                })
            },
            {
                isolationLevel: 'Serializable',
            }
        )

        return booking
    }

    async getBookingById(id: number) {
        return bookingRepository.findById(id)
    }

    async getBookingsByVenueId(venueId: number) {
        return bookingRepository.findByVenueId(venueId)
    }
}

export const bookingService = new BookingService()
