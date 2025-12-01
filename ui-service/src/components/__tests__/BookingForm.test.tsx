import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BookingForm from '../BookingForm'

// Mock global fetch
global.fetch = jest.fn()

// Mock react-datepicker
jest.mock('react-datepicker', () => {
    return function DummyDatePicker({ onChange, startDate, endDate, placeholderText }: any) {
        return (
            <input
                data-testid="date-picker"
                placeholder={placeholderText}
                onChange={(e) => {
                    // Simulate selecting a range
                    if (e.target.value === 'range') {
                        onChange([new Date('2025-01-01'), new Date('2025-01-05')])
                    } else {
                        onChange([null, null])
                    }
                }}
                value={startDate && endDate ? 'range' : ''}
            />
        )
    }
})

describe('BookingForm', () => {
    const mockVenue = {
        id: 1,
        name: 'Test Venue',
        description: 'Test Description',
        location: 'Test Location',
        pricePerNight: 100,
        capacity: 10,
        imageUrl: 'test.jpg'
    }

    const mockOnClose = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders correctly', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, data: [] })
        })

        render(<BookingForm venue={mockVenue} onClose={mockOnClose} />)

        expect(screen.getByText('Book Test Venue')).toBeInTheDocument()
        expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
        expect(screen.getByTestId('date-picker')).toBeInTheDocument()
    })

    it('validates date range is selected', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, data: [] })
        })

        render(<BookingForm venue={mockVenue} onClose={mockOnClose} />)

        fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'Test Co' } })
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })
        // Do not select date
        fireEvent.change(screen.getByLabelText(/Attendees/i), { target: { value: '5' } })

        fireEvent.click(screen.getByText('Submit Inquiry'))

        expect(await screen.findByText('Please select a date range')).toBeInTheDocument()
    })

    it('submits form successfully', async () => {
        const fetchMock = global.fetch as jest.Mock

        // Mock fetch for bookings on mount
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, data: [] })
        })

        // Mock fetch for submission
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, data: { id: 1 } })
        })

        render(<BookingForm venue={mockVenue} onClose={mockOnClose} />)

        fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'Test Co' } })
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })

        // Select date range using our mock
        fireEvent.change(screen.getByTestId('date-picker'), { target: { value: 'range' } })

        fireEvent.change(screen.getByLabelText(/Attendees/i), { target: { value: '5' } })

        fireEvent.click(screen.getByText('Submit Inquiry'))

        await waitFor(() => {
            expect(screen.getByText('Booking Inquiry Sent!')).toBeInTheDocument()
        })
    })
})
