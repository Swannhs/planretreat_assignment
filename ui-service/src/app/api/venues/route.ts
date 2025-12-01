import { NextResponse } from 'next/server'

const API_URL = process.env.API_URL || 'http://localhost:4000'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const params = new URLSearchParams()

        searchParams.forEach((value, key) => {
            params.append(key, value)
        })

        const res = await fetch(`${API_URL}/api/venues?${params.toString()}`, {
            cache: 'no-store',
        })

        const data = await res.json()

        if (!res.ok) {
            return NextResponse.json(
                { success: false, error: data.error?.message || data.error || 'Failed to fetch venues' },
                { status: res.status }
            )
        }

        return NextResponse.json(data, { status: 200 })
    } catch (error: any) {
        console.error('Venues fetch proxy error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
