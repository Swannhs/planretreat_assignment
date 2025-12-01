import { ApiErrorResponse, ApiSuccessResponse, VenueListResponse } from '@/lib/api-types'

const API_BASE_URL = process.env.API_URL || 'http://localhost:4000'

type FetchVenuesResult =
    | { venues: VenueListResponse['data']; meta: VenueListResponse['meta']; error: null }
    | { venues: null; meta: null; error: { message: string; code?: string; status?: number } }

export async function fetchVenues(searchParams: Record<string, any>): Promise<FetchVenuesResult> {
    const params = new URLSearchParams()
    if (searchParams.city) params.append('city', searchParams.city)
    if (searchParams.capacity) params.append('capacity', searchParams.capacity)
    if (searchParams.price) params.append('price', searchParams.price)
    if (searchParams.page) params.append('page', searchParams.page.toString())
    if (searchParams.limit) params.append('limit', searchParams.limit.toString())

    try {
        const res = await fetch(`${API_BASE_URL}/api/venues?${params.toString()}`, {
            cache: 'no-store',
        })

        const contentType = res.headers.get('content-type') || ''
        const isJson = contentType.includes('application/json')
        const payload = isJson ? await res.json() : await res.text()

        const apiError =
            typeof payload === 'object' && payload !== null && 'error' in payload
                ? (payload as ApiErrorResponse['error'])
                : undefined

        if (!res.ok || (payload as ApiErrorResponse)?.success === false) {
            return {
                venues: null,
                meta: null,
                error: {
                    message:
                        apiError?.message ||
                        (typeof payload === 'string' ? payload : 'Failed to fetch venues'),
                    code: apiError?.code,
                    status: res.status,
                },
            }
        }

        const successPayload = payload as ApiSuccessResponse<VenueListResponse['data']>

        return {
            venues: successPayload.data,
            meta: successPayload.meta as VenueListResponse['meta'],
            error: null,
        }
    } catch (err: any) {
        console.error('[UI] Failed to fetch venues, using mock data', err)
        return {
            venues: [
                {
                    id: 1,
                    name: 'Seaside Retreat',
                    description: 'A beautiful seaside retreat for your team.',
                    location: 'Malibu, CA',
                    pricePerNight: 1000,
                    capacity: 20,
                    imageUrl: 'https://images.unsplash.com/photo-1571896349842-6e5c48dc52e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                },
                {
                    id: 2,
                    name: 'Mountain Lodge',
                    description: 'Cozy mountain lodge with breathtaking views.',
                    location: 'Aspen, CO',
                    pricePerNight: 1500,
                    capacity: 30,
                    imageUrl: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                }
            ],
            meta: {
                total: 2,
                page: 1,
                limit: 6,
                totalPages: 1,
                hasNextPage: false,
                hasPreviousPage: false,
            },
            error: null,
        }
    }
}
