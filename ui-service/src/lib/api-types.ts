import { Venue } from '@/types'

/**
 * API Response Types
 */
export interface ApiSuccessResponse<T> {
    success: true
    data: T
    meta?: Record<string, any>
}

export interface ApiErrorResponse {
    success: false
    error: {
        code: string
        message: string
        details?: Record<string, any>
    }
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

/**
 * Pagination Meta
 */
export interface PaginationMeta {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

export interface VenueListResponse {
    data: Venue[]
    meta: PaginationMeta
}

/**
 * Booking Request
 */
export interface CreateBookingRequest {
    venueId: number
    companyName: string
    email: string
    startDate: string
    endDate: string
    attendeeCount: number
}
