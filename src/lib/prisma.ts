import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient; pool: Pool }

if (!globalForPrisma.pool) {
    // Use direct connection parameters to avoid URL parsing issues
    globalForPrisma.pool = new Pool({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'planretreat',
        ssl: false,
    })
}

const adapter = new PrismaPg(globalForPrisma.pool)

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
