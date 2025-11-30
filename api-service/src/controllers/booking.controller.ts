import { Request, Response } from 'express'
import { bookingService } from '../services/booking.service'
import {
    successResponse,
    errorResponse,
    ErrorCodes,
    handleZodError,
} from '../lib/api-utils'
import { createBookingSchema } from '../lib/validations'

export const createBooking = async (req: Request, res: Response) => {
    try {
        const validationResult = createBookingSchema.safeParse(req.body)

        if (!validationResult.success) {
            return handleZodError(res, validationResult.error)
        }

        const booking = await bookingService.createBooking(validationResult.data)

        return successResponse(res, booking, undefined, 201)
    } catch (error: any) {
        console.error('[API] Error creating booking:', error)

        if (error.message === 'VENUE_NOT_FOUND') {
            return errorResponse(
                res,
                ErrorCodes.NOT_FOUND,
                `Venue with ID ${req.body.venueId} not found`,
                404
            )
        }

        if (error.message === 'CAPACITY_EXCEEDED') {
            return errorResponse(
                res,
                ErrorCodes.VALIDATION_ERROR,
                `Attendee count exceeds venue capacity`,
                400
            )
        }

        if (error.message === 'BOOKING_CONFLICT') {
            return errorResponse(
                res,
                ErrorCodes.CONFLICT,
                'Venue is not available for the selected dates',
                409
            )
        }

        if (error.message === 'INVALID_DATE') {
            return errorResponse(
                res,
                ErrorCodes.VALIDATION_ERROR,
                'Invalid date provided',
                400
            )
        }

        return errorResponse(res, ErrorCodes.INTERNAL_ERROR, 'An unexpected error occurred', 500)
    }
}
