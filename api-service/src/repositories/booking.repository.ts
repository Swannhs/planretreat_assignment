import { prisma } from '../lib/prisma'
import { Prisma, PrismaClient } from '@prisma/client'

type DbClient = PrismaClient | Prisma.TransactionClient

export class BookingRepository {
    async create(
        client: DbClient = prisma,
        data: {
        venueId: number
        companyName: string
        email: string
        startDate: Date
        endDate: Date
        attendeeCount: number
    }) {
        return client.bookingInquiry.create({
            data,
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
    }

    async findOverlapping(
        client: DbClient = prisma,
        venueId: number,
        startDate: Date,
        endDate: Date
    ) {
        return client.bookingInquiry.findFirst({
            where: {
                venueId,
                startDate: {
                    lte: endDate,
                },
                endDate: {
                    gte: startDate,
                },
            },
        })
    }

    async findById(id: number) {
        return prisma.bookingInquiry.findUnique({
            where: { id },
            include: {
                venue: true,
            },
        })
    }
}

export const bookingRepository = new BookingRepository()
