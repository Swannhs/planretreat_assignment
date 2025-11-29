import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
    successResponse,
    errorResponse,
    ErrorCodes,
    handleZodError,
} from '@/lib/api-utils'
import { createBookingSchema } from '@/lib/validations'

/**
 * POST /api/bookings
 * Create a new booking inquiry
 * 
 * Request Body:
 * - venueId: ID of the venue to book
 * - companyName: Name of the company
 * - email: Contact email
 * - startDate: Booking start date (ISO 8601 or YYYY-MM-DD)
 * - endDate: Booking end date (ISO 8601 or YYYY-MM-DD)
 * - attendeeCount: Number of attendees
 */
export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json()

        // Validate with Zod
        const validationResult = createBookingSchema.safeParse(body)

        if (!validationResult.success) {
            return handleZodError(validationResult.error)
        }

        const { venueId, companyName, email, startDate, endDate, attendeeCount } = validationResult.data

        // Check if venue exists
        const venue = await prisma.venue.findUnique({
            where: { id: venueId },
        })

        if (!venue) {
            return errorResponse(
                ErrorCodes.NOT_FOUND,
                `Venue with ID ${venueId} not found`,
                404
            )
        }

        // Validate capacity
        if (attendeeCount > venue.capacity) {
            return errorResponse(
                ErrorCodes.VALIDATION_ERROR,
                `Attendee count (${attendeeCount}) exceeds venue capacity (${venue.capacity})`,
                400,
                {
                    attendeeCount,
                    venueCapacity: venue.capacity,
                }
            )
        }

        // Check for overlapping bookings
        const overlappingBooking = await prisma.bookingInquiry.findFirst({
            where: {
                venueId,
                OR: [
                    {
                        startDate: {
                            lte: new Date(endDate),
                        },
                        endDate: {
                            gte: new Date(startDate),
                        },
                    },
                ],
            },
        })

        if (overlappingBooking) {
            return errorResponse(
                ErrorCodes.CONFLICT,
                'Venue is not available for the selected dates',
                409,
                {
                    conflictingBooking: {
                        id: overlappingBooking.id,
                        startDate: overlappingBooking.startDate,
                        endDate: overlappingBooking.endDate,
                    },
                }
            )
        }

        // Create booking inquiry
        const booking = await prisma.bookingInquiry.create({
            data: {
                venueId,
                companyName,
                email,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                attendeeCount,
            },
            include: {
                venue: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        pricePerNight: true,
                    },
                },
            },
        })

        return successResponse(booking, undefined, 201)
    } catch (error) {
        console.error('[API] Error creating booking:', error)

        // Handle JSON parse errors
        if (error instanceof SyntaxError) {
            return errorResponse(
                ErrorCodes.BAD_REQUEST,
                'Invalid JSON in request body',
                400
            )
        }

        return errorResponse(
            ErrorCodes.INTERNAL_ERROR,
            'An unexpected error occurred while creating the booking',
            500
        )
    }
}
