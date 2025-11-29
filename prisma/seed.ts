import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'planretreat',
    ssl: false,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const venues = [
    {
        name: 'Coastal Retreat Center',
        description: 'A beautiful center located on the coast with stunning ocean views.',
        location: 'Santa Cruz',
        pricePerNight: 2000,
        capacity: 50,
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
    },
    {
        name: 'Mountain Lodge',
        description: 'Cozy lodge nestled in the mountains, perfect for winter retreats.',
        location: 'Aspen',
        pricePerNight: 1500,
        capacity: 20,
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
    },
    {
        name: 'Urban Loft',
        description: 'Modern loft in the heart of the city, great for creative workshops.',
        location: 'New York',
        pricePerNight: 5000,
        capacity: 100,
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop',
    },
    {
        name: 'Desert Oasis',
        description: 'Relaxing oasis in the desert with a pool and palm trees.',
        location: 'Palm Springs',
        pricePerNight: 1800,
        capacity: 30,
        imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop',
    },
    {
        name: 'Lakeside Cabin',
        description: 'Peaceful cabin by the lake, ideal for small team bonding.',
        location: 'Lake Tahoe',
        pricePerNight: 1200,
        capacity: 15,
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
    },
    {
        name: 'Forest Hideaway',
        description: 'Secluded hideaway surrounded by tall trees and nature.',
        location: 'Portland',
        pricePerNight: 1000,
        capacity: 25,
        imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop',
    },
]

async function main() {
    console.log('Start seeding ...')
    for (const venue of venues) {
        const v = await prisma.venue.create({
            data: venue,
        })
        console.log(`Created venue with id: ${v.id} `)
    }
    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
