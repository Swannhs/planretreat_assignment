import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { venueRoutes } from './routes/venue.routes'
import { bookingRoutes } from './routes/booking.routes'

import swaggerUi from 'swagger-ui-express'
import { specs } from './config/swagger'

const app = express()

app.use(helmet({
    contentSecurityPolicy: false,
}))
app.use(cors({ origin: '*' }))
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
}))

app.use('/api/venues', venueRoutes)
app.use('/api/bookings', bookingRoutes)

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

export default app
