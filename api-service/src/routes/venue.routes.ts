import { Router } from 'express'
import { getVenues, getCitySuggestions } from '../controllers/venue.controller'

const router = Router()

/**
 * @swagger
 * /api/venues:
 *   get:
 *     summary: Retrieve a list of venues
 *     tags: [Venues]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: capacity
 *         schema:
 *           type: integer
 *         description: Filter by minimum capacity
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *         description: Filter by maximum price per night
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of venues
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Venue'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPreviousPage:
 *                       type: boolean
 */
router.get('/', getVenues)

/**
 * @swagger
 * /api/venues/suggestions:
 *   get:
 *     summary: Get city suggestions
 *     tags: [Venues]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query for city names
 *     responses:
 *       200:
 *         description: List of city suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/suggestions', getCitySuggestions)

export const venueRoutes = router
