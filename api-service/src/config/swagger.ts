import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PlanRetreat API',
            version: '1.0.0',
            description: 'API documentation for PlanRetreat application',
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Local Development Server',
            },
            {
                url: 'https://api-service-two-pi.vercel.app',
                description: 'Production Server',
            },
        ],
        paths: {
            '/api/venues': {
                get: {
                    summary: 'Retrieve a list of venues',
                    tags: ['Venues'],
                    parameters: [
                        { in: 'query', name: 'city', schema: { type: 'string' }, description: 'Filter by city' },
                        { in: 'query', name: 'capacity', schema: { type: 'integer' }, description: 'Filter by minimum capacity' },
                        { in: 'query', name: 'price', schema: { type: 'number' }, description: 'Filter by maximum price per night' },
                        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 }, description: 'Page number' },
                        { in: 'query', name: 'limit', schema: { type: 'integer', default: 6 }, description: 'Number of items per page' },
                    ],
                    responses: {
                        200: {
                            description: 'A list of venues',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            data: { type: 'array', items: { $ref: '#/components/schemas/Venue' } },
                                            meta: {
                                                type: 'object',
                                                properties: {
                                                    total: { type: 'integer' },
                                                    page: { type: 'integer' },
                                                    limit: { type: 'integer' },
                                                    totalPages: { type: 'integer' },
                                                    hasNextPage: { type: 'boolean' },
                                                    hasPreviousPage: { type: 'boolean' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            '/api/venues/suggestions': {
                get: {
                    summary: 'Get city suggestions',
                    tags: ['Venues'],
                    parameters: [
                        { in: 'query', name: 'query', schema: { type: 'string' }, required: true, description: 'Search query for city names' },
                    ],
                    responses: {
                        200: {
                            description: 'List of city suggestions',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            data: { type: 'array', items: { type: 'string' } },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            '/api/bookings': {
                post: {
                    summary: 'Create a new booking inquiry',
                    tags: ['Bookings'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['venueId', 'companyName', 'email', 'startDate', 'endDate', 'attendeeCount'],
                                    properties: {
                                        venueId: { type: 'integer' },
                                        companyName: { type: 'string' },
                                        email: { type: 'string', format: 'email' },
                                        startDate: { type: 'string', format: 'date' },
                                        endDate: { type: 'string', format: 'date' },
                                        attendeeCount: { type: 'integer' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'Booking created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            data: { $ref: '#/components/schemas/BookingInquiry' },
                                        },
                                    },
                                },
                            },
                        },
                        400: { description: 'Validation error' },
                        409: { description: 'Booking conflict' },
                    },
                },
                get: {
                    summary: 'Get bookings for a venue',
                    tags: ['Bookings'],
                    parameters: [
                        { in: 'query', name: 'venueId', schema: { type: 'integer' }, required: true, description: 'ID of the venue to fetch bookings for' },
                    ],
                    responses: {
                        200: {
                            description: 'List of bookings',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            data: { type: 'array', items: { $ref: '#/components/schemas/BookingInquiry' } },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        components: {
            schemas: {
                Venue: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        location: { type: 'string' },
                        pricePerNight: { type: 'number' },
                        capacity: { type: 'integer' },
                        imageUrl: { type: 'string', nullable: true },
                    },
                },
                BookingInquiry: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        venueId: { type: 'integer' },
                        companyName: { type: 'string' },
                        email: { type: 'string' },
                        startDate: { type: 'string', format: 'date-time' },
                        endDate: { type: 'string', format: 'date-time' },
                        attendeeCount: { type: 'integer' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    },
    apis: [], // No need to scan files
};

export const specs = swaggerJsdoc(options);
