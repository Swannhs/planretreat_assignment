import { NextResponse } from 'next/server'

const API_URL = 'https://api-service-two-pi.vercel.app'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('query')

        const res = await fetch(`${API_URL}/api/venues/suggestions?query=${encodeURIComponent(query || '')}`, {
            cache: 'no-store',
        })

        const data = await res.json()

        if (!res.ok) {
            return NextResponse.json(
                { success: false, error: data.error?.message || data.error || 'Failed to fetch suggestions' },
                { status: res.status }
            )
        }

        return NextResponse.json(data, { status: 200 })
    } catch (error: any) {
        console.error('Suggestions fetch proxy error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
