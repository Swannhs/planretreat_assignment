export interface Venue {
    id: number
    name: string
    description: string
    location: string
    pricePerNight: number
    capacity: number
    imageUrl: string | null
}

export interface BookingInquiry {
    id: number
    venueId: number
    companyName: string
    email: string
    startDate: string
    endDate: string
    attendeeCount: number
    createdAt: string
}
