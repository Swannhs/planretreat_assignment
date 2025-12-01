'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

export default function SearchFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [city, setCity] = useState(searchParams.get('city') || '')
    const [capacity, setCapacity] = useState(searchParams.get('capacity') || '')
    const [price, setPrice] = useState(searchParams.get('price') || '')
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const debounceTimer = useRef<NodeJS.Timeout | null>(null)

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (city) params.set('city', city)
        else params.delete('city')

        if (capacity) params.set('capacity', capacity)
        else params.delete('capacity')

        if (price) params.set('price', price)
        else params.delete('price')

        // Reset pagination when filters change
        params.delete('page')

        router.push(`/?${params.toString()}`)
    }

    useEffect(() => {
        if (!city.trim()) {
            setSuggestions([])
            return
        }

        const controller = new AbortController()

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }

        debounceTimer.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `/api/venues/suggestions?query=${encodeURIComponent(city)}`,
                    { signal: controller.signal }
                )

                if (!res.ok) {
                    setSuggestions([])
                    return
                }

                const data = await res.json()
                if (Array.isArray(data.data)) {
                    setSuggestions(data.data)
                    setShowSuggestions(true)
                } else {
                    setSuggestions([])
                }
            } catch (err: any) {
                if (err?.name !== 'AbortError') {
                    setSuggestions([])
                }
            }
        }, 250)

        return () => {
            controller.abort()
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current)
            }
        }
    }, [city])

    return (
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                        Location
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter city..."
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onFocus={() => suggestions.length && setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                            className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-10 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
                                {suggestions.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => {
                                            setCity(s)
                                            setShowSuggestions(false)
                                            setSuggestions([])
                                            const params = new URLSearchParams(searchParams.toString())
                                            params.set('city', s)
                                            params.delete('page')
                                            router.push(`/?${params.toString()}`)
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-800"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
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
                <button
                    onClick={handleSearch}
                    className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    Search
                </button>
            </div>
        </div>
    )
}
