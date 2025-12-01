import { venueRepository } from '../repositories/venue.repository'
import { createPaginationMeta } from '../lib/api-utils'

export class VenueService {
    async getVenues(query: {
        city?: string
        capacity?: number
        price?: number
        page: number
        limit: number
    }) {
        const filters = {
            city: query.city,
            capacity: query.capacity,
            price: query.price,
        }

        const skip = (query.page - 1) * query.limit

        const [venues, total] = await Promise.all([
            venueRepository.findAll(filters, { skip, take: query.limit }),
            venueRepository.count(filters),
        ])

        const paginationMeta = createPaginationMeta(total, query.page, query.limit)

        return {
            venues,
            meta: paginationMeta,
        }
    }

    async getVenueById(id: number) {
        return venueRepository.findById(id)
    }

    async getCitySuggestions(query: string) {
        if (!query.trim()) {
            return []
        }

        const results = await venueRepository.findCitySuggestions(query, 5)
        return results.map((r) => r.location)
    }
}

export const venueService = new VenueService()
