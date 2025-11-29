import { Venue } from '@prisma/client'

interface VenueCardProps {
  venue: Venue
  onBook: (venue: Venue) => void
}

export default function VenueCard({ venue, onBook }: VenueCardProps) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100">
      {venue.imageUrl && (
        <div className="relative h-64 overflow-hidden bg-slate-100">
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}
      <div className="p-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{venue.name}</h3>
          <p className="text-slate-600 flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {venue.location}
          </p>
        </div>

        <p className="text-slate-600 mb-6 line-clamp-2 leading-relaxed">{venue.description}</p>

        <div className="flex items-center justify-between py-6 border-t border-b border-slate-100 mb-6">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Price</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-900">${venue.pricePerNight}</span>
              <span className="text-slate-500 text-sm">/ night</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Capacity</p>
            <div className="flex items-center gap-2 justify-end">
              <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-2xl font-bold text-slate-900">{venue.capacity}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onBook(venue)}
          className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Book This Venue
        </button>
      </div>
    </div>
  )
}

