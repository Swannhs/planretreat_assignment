import { Response } from 'express'
import { ZodError } from 'zod'

export const ErrorCodes = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    BAD_REQUEST: 'BAD_REQUEST',
} as const

export function successResponse(res: Response, data: any, meta?: any, status = 200) {
    return res.status(status).json({
        success: true,
        data,
        ...(meta && { meta }),
    })
}

export function errorResponse(res: Response, code: string, message: string, status = 400, details?: any) {
    return res.status(status).json({
        success: false,
        error: {
            code,
            message,
            ...(details && { details }),
        },
    })
}

export function handleZodError(res: Response, error: ZodError) {
    const formattedErrors = error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
    }))

    return errorResponse(res, ErrorCodes.VALIDATION_ERROR, 'Validation failed', 400, { errors: formattedErrors })
}

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
