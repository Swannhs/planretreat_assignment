import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { venueRoutes } from './routes/venue.routes'
import { bookingRoutes } from './routes/booking.routes'

const app = express()

app.use(helmet())
app.use(cors({ origin: '*' }))
app.use(express.json())

app.use('/api/venues', venueRoutes)
app.use('/api/bookings', bookingRoutes)

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

export default app
