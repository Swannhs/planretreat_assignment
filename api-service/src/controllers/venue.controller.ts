import { Request, Response } from 'express'
import { venueService } from '../services/venue.service'
import {
    successResponse,
    errorResponse,
    ErrorCodes,
    handleZodError,
} from '../lib/api-utils'
import { venueQuerySchema } from '../lib/validations'

export const getVenues = async (req: Request, res: Response) => {
    try {
        // Validate query parameters
        const validationResult = venueQuerySchema.safeParse(req.query)

        if (!validationResult.success) {
            return handleZodError(res, validationResult.error)
        }

        // Delegate to service
        const result = await venueService.getVenues(validationResult.data)

        return successResponse(res, result.venues, result.meta)
    } catch (error) {
        console.error('[API] Error fetching venues:', error)
        return errorResponse(res, ErrorCodes.INTERNAL_ERROR, 'An unexpected error occurred', 500)
    }
}

export const getCitySuggestions = async (req: Request, res: Response) => {
    try {
        const query = (req.query.query as string | undefined) ?? ''

        if (!query.trim()) {
            return successResponse(res, [])
        }

        const suggestions = await venueService.getCitySuggestions(query)
        return successResponse(res, suggestions)
    } catch (error) {
        console.error('[API] Error fetching city suggestions:', error)
        return errorResponse(res, ErrorCodes.INTERNAL_ERROR, 'An unexpected error occurred', 500)
    }
}
