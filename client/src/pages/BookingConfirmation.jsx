import React from 'react'
import { useNavigate } from 'react-router-dom'

const BookingConfirmation = () => {
  const navigate = useNavigate()

  // Read lightweight confirmation data from sessionStorage.
  // This page expects a small object set earlier (bookingRef) — if missing, we show a fallback ref.
  let confirmation = null
  try {
    const raw = sessionStorage.getItem('bookingConfirmation')
    confirmation = raw ? JSON.parse(raw) : null
  } catch (e) { 
    console.warn('Booking Failed', e) 
  }

  // booking reference to show to the user
  const ref = confirmation?.ref || 'REF' + Date.now()

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center shadow-md">
            {/* simple stroked check icon: crisp at small sizes and easy to style */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-semibold mb-3">Booking Confirmed</h1>
        {/* Display booking reference and actions */}
        <p className="text-sm text-gray-500 mb-6">Ref ID: <span className="font-medium text-gray-700">{ref}</span></p>

        <div className="flex items-center justify-center gap-3">
        {/* go back to home */}
          <button
            onClick={() => navigate('/')}
            className="px-4 py-3 bg-gray-200 text-gray-800 rounded-md shadow-sm cursor-pointer transform transition duration-150 hover:bg-white hover:scale-105 hover:px-5 "
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation
