import { prisma } from '../lib/prisma'
import { Prisma } from '@prisma/client'

export class VenueRepository {
    async findAll(
        filters: {
            city?: string
            capacity?: number
            price?: number
        },
        pagination: {
            skip: number
            take: number
        }
    ) {
        const where: Prisma.VenueWhereInput = {}

        if (filters.city) {
            where.location = {
                contains: filters.city,
            }
        }

        if (filters.capacity) {
            where.capacity = { gte: filters.capacity }
        }

        if (filters.price) {
            where.pricePerNight = { lte: filters.price }
        }

        return prisma.venue.findMany({
            where,
            skip: pagination.skip,
            take: pagination.take,
            orderBy: { id: 'asc' },
        })
    }

    async count(filters: {
        city?: string
        capacity?: number
        price?: number
    }) {
        const where: Prisma.VenueWhereInput = {}

        if (filters.city) {
            where.location = {
                contains: filters.city,
            }
        }

        if (filters.capacity) {
            where.capacity = { gte: filters.capacity }
        }

        if (filters.price) {
            where.pricePerNight = { lte: filters.price }
        }

        return prisma.venue.count({ where })
    }

    async findById(id: number) {
        return prisma.venue.findUnique({
            where: { id },
        })
    }

    async findCitySuggestions(query: string, limit = 5) {
        return prisma.venue.findMany({
            where: {
                location: {
                    contains: query,
                },
            },
            select: { location: true },
            distinct: ['location'],
            orderBy: { location: 'asc' },
            take: limit,
        })
    }
}

export const venueRepository = new VenueRepository()
