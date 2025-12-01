import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
    {
        name: 'Historic Manor',
        description: 'Elegant manor with rich history and classic architecture.',
        location: 'Charleston',
        pricePerNight: 2500,
        capacity: 40,
        imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop',
    },
    {
        name: 'Tropical Villa',
        description: 'Luxurious villa with private beach access.',
        location: 'Maui',
        pricePerNight: 4000,
        capacity: 12,
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
    },
    {
        name: 'Ski Chalet',
        description: 'Premium chalet with ski-in/ski-out access.',
        location: 'Whistler',
        pricePerNight: 3000,
        capacity: 18,
        imageUrl: 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=800&auto=format&fit=crop',
    },
    {
        name: 'Vineyard Estate',
        description: 'Sprawling estate in the heart of wine country.',
        location: 'Napa Valley',
        pricePerNight: 3500,
        capacity: 60,
        imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
    },
    {
        name: 'Tech Hub Space',
        description: 'Modern workspace designed for hackathons and sprints.',
        location: 'San Francisco',
        pricePerNight: 5000,
        capacity: 150,
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop',
    },
    {
        name: 'Zen Garden Retreat',
        description: 'Minimalist retreat focused on mindfulness and meditation.',
        location: 'Kyoto',
        pricePerNight: 2200,
        capacity: 20,
        imageUrl: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&auto=format&fit=crop',
    },
]

async function main() {
    console.log('Start seeding ...')
    // Clear existing data to avoid duplicates and FK violations
    await prisma.bookingInquiry.deleteMany()
    await prisma.venue.deleteMany()

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
