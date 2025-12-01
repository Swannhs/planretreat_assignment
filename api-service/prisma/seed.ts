import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const adjectives = ['Peaceful', 'Serene', 'Majestic', 'Cozy', 'Luxury', 'Hidden', 'Grand', 'Rustic', 'Modern', 'Secluded', 'Tranquil', 'Vibrant', 'Exclusive', 'Private', 'Charming']
const nouns = ['Retreat', 'Haven', 'Lodge', 'Sanctuary', 'Villa', 'Manor', 'Cottage', 'Estate', 'Hideaway', 'Oasis', 'Resort', 'Chateau', 'Bungalow', 'Cabin', 'Loft']
const locations = ['Bali', 'Costa Rica', 'Swiss Alps', 'Tuscany', 'Kyoto', 'Sedona', 'Maui', 'Santorini', 'Aspen', 'Patagonia', 'Lake Tahoe', 'Banff', 'Phuket', 'Amalfi Coast', 'Maldives', 'Bora Bora', 'Reykjavik', 'Queenstown', 'Marrakech', 'Cape Town']
const images = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469796466635-60b8e72a1e53?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop'
]

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

async function main() {
    console.log('Start seeding ...')

    // Clear existing data to avoid duplicates and FK violations
    try {
        await prisma.bookingInquiry.deleteMany()
        await prisma.venue.deleteMany()
    } catch (e) {
        console.log('Database might be empty or not initialized yet, continuing...')
    }

    const venues = []

    // Generate 50 venues
    for (let i = 0; i < 50; i++) {
        const name = `${getRandomElement(adjectives)} ${getRandomElement(nouns)}`
        const location = getRandomElement(locations)

        venues.push({
            name,
            description: `Experience the ultimate relaxation at ${name}. A stunning property located in the heart of ${location}, offering breathtaking views and top-tier amenities for your corporate retreat or team building event.`,
            location,
            pricePerNight: getRandomInt(500, 5000),
            capacity: getRandomInt(10, 200),
            imageUrl: getRandomElement(images),
        })
    }

    for (const venue of venues) {
        const v = await prisma.venue.create({
            data: venue,
        })
        console.log(`Created venue with id: ${v.id}`)

        // Generate 1-3 random bookings for each venue to demonstrate availability checking
        const numBookings = getRandomInt(1, 3)
        for (let j = 0; j < numBookings; j++) {
            const startDate = new Date()
            startDate.setDate(startDate.getDate() + getRandomInt(1, 60)) // Start 1-60 days from now

            const endDate = new Date(startDate)
            endDate.setDate(endDate.getDate() + getRandomInt(2, 7)) // Duration 2-7 days

            await prisma.bookingInquiry.create({
                data: {
                    venueId: v.id,
                    companyName: `Test Company ${getRandomInt(1, 1000)}`,
                    email: `contact@company${getRandomInt(1, 1000)}.com`,
                    startDate,
                    endDate,
                    attendeeCount: getRandomInt(5, v.capacity),
                }
            })
        }
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
