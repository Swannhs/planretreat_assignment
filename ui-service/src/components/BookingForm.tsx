'use client'

import { useState, useEffect } from 'react'
import { Venue } from '@/types'

import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

interface BookingFormProps {
    venue: Venue
    onClose: () => void
}

export default function BookingForm({ venue, onClose }: BookingFormProps) {
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        attendeeCount: '',
    })
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;
    const [excludedDates, setExcludedDates] = useState<Date[]>([])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch(`/api/bookings?venueId=${venue.id}`)
                if (res.ok) {
                    const data = await res.json()
                    if (data.success && Array.isArray(data.data)) {
                        const dates: Date[] = []
                        data.data.forEach((booking: any) => {
                            let current = new Date(booking.startDate)
                            const end = new Date(booking.endDate)
                            while (current <= end) {
                                dates.push(new Date(current))
                                current.setDate(current.getDate() + 1)
                            }
                        })
                        setExcludedDates(dates)
                    }
                }
            } catch (err) {
                console.error('Failed to fetch bookings', err)
            }
        }

        fetchBookings()
    }, [venue.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (!startDate || !endDate) {
            setError('Please select a date range')
            setLoading(false)
            return
        }

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    venueId: venue.id,
                    ...formData,
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0],
                    attendeeCount: parseInt(formData.attendeeCount),
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                const errorMessage = data.success === false
                    ? data.error
                    : data.error?.message || 'Failed to submit booking'
                throw new Error(errorMessage)
            }

            setSuccess(true)
            setTimeout(() => {
                onClose()
            }, 2000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                <div className="bg-white p-8 rounded-2xl max-w-md w-full text-center shadow-2xl transform animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Inquiry Sent!</h2>
                    <p className="text-gray-600">We'll get back to you shortly.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl transform animate-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Book {venue.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-3">
                        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                        <input
                            id="companyName"
                            required
                            type="text"
                            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input
                            id="email"
                            required
                            type="email"
                            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Dates</label>
                        <DatePicker
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => {
                                setDateRange(update);
                            }}
                            isClearable={true}
                            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                            wrapperClassName="w-full"
                            placeholderText="Select date range"
                            minDate={new Date()}
                            excludeDates={excludedDates}
                        />
                    </div>
                    <div>
                        <label htmlFor="attendeeCount" className="block text-sm font-semibold text-gray-700 mb-2">
                            Attendees (Max: {venue.capacity})
                        </label>
                        <input
                            id="attendeeCount"
                            required
                            type="number"
                            max={venue.capacity}
                            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                            value={formData.attendeeCount}
                            onChange={(e) => setFormData({ ...formData, attendeeCount: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'Submitting...' : 'Submit Inquiry'}
                    </button>
                </form>
            </div>
        </div>
    )
}
