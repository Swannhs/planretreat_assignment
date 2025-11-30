import { z } from 'zod'

export const venueQuerySchema = z.object({
    city: z.string().optional(),
    capacity: z.coerce.number().int().positive().optional(),
    price: z.coerce.number().positive().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
})

export type VenueQuery = z.infer<typeof venueQuerySchema>

const parseDateInput = (value: string) => {
    const normalized = value.includes('T') ? value : `${value}T00:00:00Z`
    return new Date(normalized)
}

export const createBookingSchema = z.object({
    venueId: z.number().int().positive({
        message: 'Venue ID must be a positive integer',
    }),
    companyName: z.string().min(1, 'Company name is required').max(200),
    email: z.string().email('Invalid email format'),
    startDate: z.string().datetime({ message: 'Invalid start date format' }).or(
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    ),
    endDate: z.string().datetime({ message: 'Invalid end date format' }).or(
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    ),
    attendeeCount: z.number().int().positive({
        message: 'Attendee count must be a positive integer',
    }),
}).refine(
    (data) => {
        const start = parseDateInput(data.startDate)
        const end = parseDateInput(data.endDate)
        return !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end > start
    },
    {
        message: 'End date must be after start date',
        path: ['endDate'],
    }
)

export type CreateBookingRequest = z.infer<typeof createBookingSchema>
