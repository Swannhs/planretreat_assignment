import request from 'supertest'
import app from '../app'
import { bookingService } from '../services/booking.service'

// Mock the bookingService
jest.mock('../services/booking.service')

describe('POST /api/bookings', () => {
    const mockBookingData = {
        venueId: 1,
        companyName: 'Test Company',
        email: 'test@example.com',
        startDate: '2025-01-01',
        endDate: '2025-01-05',
        attendeeCount: 10,
    }

    beforeEach(() => {
        jest.clearAllMocks()
        jest.spyOn(console, 'error').mockImplementation(() => { })
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should create a booking successfully', async () => {
        // Mock successful creation
        (bookingService.createBooking as jest.Mock).mockResolvedValue({
            id: 1,
            ...mockBookingData,
            createdAt: new Date(),
        })

        const res = await request(app)
            .post('/api/bookings')
            .send(mockBookingData)

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toHaveProperty('id', 1)
    })

    it('should return 404 if venue not found', async () => {
        (bookingService.createBooking as jest.Mock).mockRejectedValue(new Error('VENUE_NOT_FOUND'))

        const res = await request(app)
            .post('/api/bookings')
            .send(mockBookingData)

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.error.code).toBe('NOT_FOUND')
    })

    it('should return 400 if capacity exceeded', async () => {
        (bookingService.createBooking as jest.Mock).mockRejectedValue(new Error('CAPACITY_EXCEEDED'))

        const res = await request(app)
            .post('/api/bookings')
            .send(mockBookingData)

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })

    it('should return 409 if booking conflict', async () => {
        (bookingService.createBooking as jest.Mock).mockRejectedValue(new Error('BOOKING_CONFLICT'))

        const res = await request(app)
            .post('/api/bookings')
            .send(mockBookingData)

        expect(res.status).toBe(409)
        expect(res.body.success).toBe(false)
        expect(res.body.error.code).toBe('CONFLICT')
    })

    it('should return 400 for invalid input', async () => {
        const invalidData = { ...mockBookingData, email: 'invalid-email' }

        const res = await request(app)
            .post('/api/bookings')
            .send(invalidData)

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })
})
