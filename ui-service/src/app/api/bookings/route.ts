import { NextResponse } from 'next/server'

const API_URL = 'https://api-service-two-pi.vercel.app'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const res = await fetch(`${API_URL}/api/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        const data = await res.json()

        if (!res.ok) {
            return NextResponse.json(
                { success: false, error: data.error?.message || data.error || 'Failed to create booking' },
                { status: res.status }
            )
        }

        return NextResponse.json(data, { status: 201 })
    } catch (error: any) {
        console.error('Booking proxy error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const venueId = searchParams.get('venueId')

        const res = await fetch(`${API_URL}/api/bookings?venueId=${venueId}`, {
            cache: 'no-store',
        })

        const data = await res.json()

        if (!res.ok) {
            return NextResponse.json(
                { success: false, error: data.error?.message || data.error || 'Failed to fetch bookings' },
                { status: res.status }
            )
        }

        return NextResponse.json(data, { status: 200 })
    } catch (error: any) {
        console.error('Booking fetch proxy error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
