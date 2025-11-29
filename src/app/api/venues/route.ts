import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
    successResponse,
    errorResponse,
    ErrorCodes,
    createPaginationMeta,
    handleZodError,
} from '@/lib/api-utils'
import { venueQuerySchema } from '@/lib/validations'

/**
 * GET /api/venues
 * Retrieve venues with optional filtering and pagination
 * 
 * Query Parameters:
 * - city: Filter by location (case-insensitive)
 * - capacity: Minimum capacity required
 * - price: Maximum price per night
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 100)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // Parse and validate query parameters with Zod
        const queryParams = Object.fromEntries(searchParams.entries())
        const validationResult = venueQuerySchema.safeParse(queryParams)

        if (!validationResult.success) {
            return handleZodError(validationResult.error)
        }

        const { city, capacity, price, page, limit } = validationResult.data

        // Build where clause
        const where: any = {}

        if (city) {
            where.location = {
                contains: city,
                mode: 'insensitive',
            }
        }

        if (capacity) {
            where.capacity = { gte: capacity }
        }

        if (price) {
            where.pricePerNight = { lte: price }
        }

        // Calculate pagination
        const skip = (page - 1) * limit

        // Fetch venues and total count
        const [venues, total] = await Promise.all([
            prisma.venue.findMany({
                where,
                skip,
                take: limit,
                orderBy: { id: 'asc' },
            }),
            prisma.venue.count({ where }),
        ])

        // Create pagination metadata
        const paginationMeta = createPaginationMeta(total, page, limit)

        return successResponse(venues, paginationMeta, 200)
    } catch (error) {
        console.error('[API] Error fetching venues:', error)
        return errorResponse(
            ErrorCodes.INTERNAL_ERROR,
            'An unexpected error occurred while fetching venues.',
            500
        )
    }
}
