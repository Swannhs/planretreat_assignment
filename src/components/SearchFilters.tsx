'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SearchFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [city, setCity] = useState(searchParams.get('city') || '')
    const [capacity, setCapacity] = useState(searchParams.get('capacity') || '')
    const [price, setPrice] = useState(searchParams.get('price') || '')

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams()
            if (city) params.set('city', city)
            if (capacity) params.set('capacity', capacity)
            if (price) params.set('price', price)

            router.push(`/?${params.toString()}`)
        }, 500)

        return () => clearTimeout(timer)
    }, [city, capacity, price, router])

    return (
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                        Location
                    </label>
                    <input
                        type="text"
                        placeholder="Enter city..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                        Min Capacity
                    </label>
                    <input
                        type="number"
                        placeholder="Number of attendees..."
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                        Max Price / Night
                    </label>
                    <input
                        type="number"
                        placeholder="Your budget..."
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                    />
                </div>
            </div>
        </div>
    )
}
