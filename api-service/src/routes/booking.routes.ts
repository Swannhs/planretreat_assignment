import { Router } from 'express'
import { createBooking, getBookings } from '../controllers/booking.controller'

const router = Router()

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking inquiry
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - venueId
 *               - companyName
 *               - email
 *               - startDate
 *               - endDate
 *               - attendeeCount
 *             properties:
 *               venueId:
 *                 type: integer
 *               companyName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               attendeeCount:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/BookingInquiry'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Booking conflict
 */
router.post('/', createBooking)

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get bookings for a venue
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: venueId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the venue to fetch bookings for
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BookingInquiry'
 */
router.get('/', getBookings)

export const bookingRoutes = router
