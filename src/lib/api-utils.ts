import { NextResponse } from 'next/server'
import { ApiErrorResponse, ApiSuccessResponse } from './api-types'
import { ZodError } from 'zod'

/**
 * Error Codes
 */
export const ErrorCodes = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    BAD_REQUEST: 'BAD_REQUEST',
} as const

/**
 * Create a success response
 */
export function successResponse<T>(
    data: T,
    meta?: Record<string, any>,
    status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            data,
            ...(meta && { meta }),
        },
        { status }
    )
}

/**
 * Create an error response
 */
export function errorResponse(
    code: string,
    message: string,
    status: number = 400,
    details?: Record<string, any>
): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
        {
            success: false,
            error: {
                code,
                message,
                ...(details && { details }),
            },
        },
        { status }
    )
}

/**
 * Handle Zod validation errors
 */
export function handleZodError(error: ZodError): NextResponse<ApiErrorResponse> {
    const formattedErrors = error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
    }))

    return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Validation failed',
        400,
        { errors: formattedErrors }
    )
}

/**
 * Pagination helper
 */
export function getPaginationParams(searchParams: URLSearchParams) {
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')))
    const skip = (page - 1) * limit

    return { page, limit, skip }
}

/**
 * Create pagination meta
 */
export function createPaginationMeta(total: number, page: number, limit: number) {
    const totalPages = Math.ceil(total / limit)
    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    }
}
