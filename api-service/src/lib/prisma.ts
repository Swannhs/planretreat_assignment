import { PrismaClient } from '@prisma/client'

import fs from 'fs'
import path from 'path'

const prismaClientSingleton = () => {
    // Check if running on Vercel
    if (process.env.VERCEL) {
        const dbFile = 'dev.db'
        // In Vercel, files included via includeFiles are usually relative to process.cwd()
        const source = path.join(process.cwd(), 'prisma', dbFile)
        const dest = path.join('/tmp', dbFile)

        try {
            // Always copy to ensure we have the latest seeded data if it's a fresh instance
            // or if we want to reset. But for persistence within the same instance, check existence.
            if (!fs.existsSync(dest)) {
                if (fs.existsSync(source)) {
                    fs.copyFileSync(source, dest)
                    console.log(`Copied database from ${source} to ${dest}`)
                } else {
                    console.error(`Source database not found at ${source}`)
                }
            }
        } catch (error) {
            console.error('Error copying database file:', error)
        }

        return new PrismaClient({
            datasources: {
                db: {
                    url: `file:${dest}`
                }
            }
        })
    }

    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
