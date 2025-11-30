import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BookingForm from '../BookingForm'

// Mock global fetch
global.fetch = jest.fn()

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

    it('renders correctly', () => {
        render(<BookingForm venue={mockVenue} onClose={mockOnClose} />)

        expect(screen.getByText('Book Test Venue')).toBeInTheDocument()
        expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    })

    it('validates end date is after start date', async () => {
        render(<BookingForm venue={mockVenue} onClose={mockOnClose} />)

        fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'Test Co' } })
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: '2025-01-05' } })
        fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: '2025-01-01' } })
        fireEvent.change(screen.getByLabelText(/Attendees/i), { target: { value: '5' } })

        fireEvent.click(screen.getByText('Submit Inquiry'))

        expect(await screen.findByText('End date must be after start date')).toBeInTheDocument()
    })

    it('submits form successfully', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, data: { id: 1 } })
        })

        render(<BookingForm venue={mockVenue} onClose={mockOnClose} />)

        fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'Test Co' } })
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: '2025-01-01' } })
        fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: '2025-01-05' } })
        fireEvent.change(screen.getByLabelText(/Attendees/i), { target: { value: '5' } })

        fireEvent.click(screen.getByText('Submit Inquiry'))

        await waitFor(() => {
            expect(screen.getByText('Booking Inquiry Sent!')).toBeInTheDocument()
        })
    })
})
