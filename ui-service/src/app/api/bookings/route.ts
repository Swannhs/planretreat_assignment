import { NextResponse } from 'next/server'

const API_URL = process.env.API_URL || 'http://localhost:4000'

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
