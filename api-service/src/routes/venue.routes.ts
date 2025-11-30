import { Router } from 'express'
import { getVenues, getCitySuggestions } from '../controllers/venue.controller'

const router = Router()

router.get('/', getVenues)
router.get('/suggestions', getCitySuggestions)

export const venueRoutes = router
