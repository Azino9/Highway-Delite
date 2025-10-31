import React, { useState,useEffect } from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import { assets, experiences as dummyExperiences } from '../assets/assets';
import Loader from '../Components/Loader';
import { useAppContext } from '../hooks/useAppContext';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
// reference motion to avoid unused-var false-positive in some linters
void motion;

const ExperienceDetails = () => {
  // To get experience id from url 

  const {id} = useParams();
  const {experiences, currency, pickupDate, setPickupDate, returnDate, setReturnDate} = useAppContext() ;
  const navigate = useNavigate() ;
  const [experience,setExperience] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Try to find from context (local dummy data) first, then from bundled dummyExperiences,
    // avoid network fetches in dev/offline mode.
    const fromCtx = experiences && experiences.find((c) => c._id === id);
    if (fromCtx) {
      setExperience(fromCtx);
      return;
    }

    const fromAssets = dummyExperiences && dummyExperiences.find((e) => e._id === id);
    if (fromAssets) {
      setExperience(fromAssets);
      return;
    }

    // Don't hit the backend in dev/demo mode. If the experience wasn't found in context or bundled
    // dummy data, mark as not found so UI can show a friendly message instead of spamming fetch errors.
    setNotFound(true);
  }, [experiences, id]);  // Whenever id changes in this url it will excute this function

  // local state for quantity and simple price math
  const [qty, setQty] = useState(1);
  const fmt = v => Number.isInteger(v) ? v.toString() : v.toFixed(2);
  const subtotal = experience ? Number((experience.pricePerDay || experience.pricePerPerson || 0) * qty) : 0;
  const taxes = Number((subtotal * 0.06).toFixed(2));
  const total = Number((subtotal + taxes).toFixed(2));

  if (experience) {
    return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>

      <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
        <img src={assets.arrow_icon} alt="back" className='rotate-180 opacity-65 h-4' />
        <span>Details</span>
      </button>

  <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start'>
        {/* Left: image + details */}
        <motion.div className='lg:col-span-2' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <motion.img
            src={(() => {
              if (!experience) return '';
              if (experience.image) return experience.image;
              if (experience.images) return Array.isArray(experience.images) ? experience.images[0] : experience.images;
              return '';
            })()}
            alt={experience.name}
            className='w-full h-64 md:h-96 lg:h-[420px] object-cover rounded-xl mb-6 shadow-md'
            initial={{ opacity: 0, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          <h2 className='text-2xl font-semibold mb-1'>{experience.name || experience.brand}</h2>
          <p className='text-gray-600 mb-6'>{experience.description}</p>

          {/* Date selector - show next 5 days */}
          <div className='mb-6'>
            <div className='text-base font-medium mb-2'>Choose date</div>
              <div className='flex items-center gap-3'>
                {/* If the experience provides per-date availability, use it; otherwise fall back to the next 5 days */}
                {((experience && experience.availability && experience.availability.length) ? experience.availability : Array.from({ length: 5 }).map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() + i);
                  return { date: d.toISOString().split('T')[0] };
                })).map((entry, idx) => {
                  const key = entry.date;
                  // friendly label (e.g., 'Nov 01')
                  const label = (entry && entry.date) ? new Date(entry.date).toLocaleString(undefined, { month: 'short', day: 'numeric' }) : `Day ${idx+1}`;
                  const isUnavailable = entry.available === false || (entry.times && entry.times.every(t => t.capacity === 0));
                  return (
                    <button
                      key={key}
                      type='button'
                      onClick={() => setPickupDate && setPickupDate(pickupDate === key ? '' : key)}
                      className={` cursor-pointer px-3 py-2 rounded-md ${pickupDate === key ? 'bg-[#FFD200] text-black' : (isUnavailable ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border border-gray-200')} text-sm`}
                      disabled={isUnavailable}
                    >
                      {label}{isUnavailable ? ' • Not available' : ''}
                    </button>
                  )
                })}
              </div>
            {/* Time selector with availability badges */}
            <div className='mb-6 mt-4'>
              <div className='text-base font-medium mb-2'>Choose time</div>
              <div className='flex items-center gap-3 flex-wrap'>
                {
                  // Choose time slots for the selected date (pickupDate) if availability exists
                  (() => {
                    const availForDate = (experience && experience.availability && pickupDate) ? experience.availability.find(d => d.date === pickupDate) : null;
                    const slots = availForDate ? (availForDate.times || []) : (experience.times && experience.times.length ? experience.times : [
                      { time: '07:00 am', capacity: 4 },
                      { time: '09:00 am', capacity: 6 },
                      { time: '11:00 am', capacity: 5 },
                      { time: '01:00 pm', capacity: 0 }
                    ]);
                    return slots.map(s => (
                      <button
                        key={s.time}
                        type='button'
                        onClick={() => s.capacity > 0 && setReturnDate && setReturnDate(returnDate === s.time ? '' : s.time)}
                        className={` cursor-pointer px-3 py-2 rounded-md text-sm ${s.capacity > 0 ? (returnDate === s.time ? 'bg-[#FFD200] text-black' : 'bg-white text-gray-700 border border-gray-200') : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                      >
                        <div className='flex items-center gap-3'>
                          <span>{s.time}</span>
                          {s.capacity > 0 ? <span className='text-xs text-red-600'> {s.capacity} left</span> : <span className='text-xs text-gray-500'>Sold out</span>}
                        </div>
                      </button>
                    ));
                  })()
                }
              </div>
              <div className='text-xs text-gray-400 mt-2'>All times are in IST (GMT +5:30)</div>
            </div>
          </div>

          <div className='mb-6'>
            <div className='text-base font-medium mb-2'>About</div>
            <div className='bg-gray-100 p-3 rounded-md text-base text-gray-600'>{experience.about || experience.description}</div>
          </div>
        </motion.div>

  {/* Right: booking summary */}
  <motion.aside 
    initial={{ opacity: 0, y: 12 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.45, delay: 0.12 }}
    className='w-full max-w-[380px] bg-gray-100 p-5 rounded-lg lg:sticky lg:top-20 shadow-lg mx-auto lg:mx-0' 
    >
          <div className='text-base text-gray-600 mb-4'>
            <div className='flex justify-between mb-2'><span>Price</span><span className='text-lg font-medium text-gray-800'>{currency}{experience.pricePerPerson || experience.pricePerDay}</span></div>
            <div className='flex justify-between mb-2'>
              <span>Quantity</span>
              <div className='flex items-center gap-2'>
                <button type='button' onClick={() => setQty(q => Math.max(1, q-1))} className='h-5 w-5 flex items-center justify-center border rounded text-xs bg-white'>-</button>
                <span className='text-gray-800'>{qty}</span>
                <button type='button' onClick={() => setQty(q => q+1)} className='h-5 w-5 flex items-center justify-center border rounded text-xs bg-white'>+</button>
              </div>
            </div>
            <div className='flex justify-between mb-2'><span>Subtotal</span><span className='text-sm font-medium text-gray-800'>{currency}{fmt(subtotal)}</span></div>
            <div className='flex justify-between mb-2'><span>Taxes</span><span className='text-sm font-medium text-gray-800'>{currency}{fmt(taxes)}</span></div>
          </div>
          <hr className='border-gray-200 my-3' />
          <div className='flex justify-between items-center mb-4'>
            <div className='text-xl font-xl'>Total</div>
            <div className='text-xl font-xl'>{currency}{fmt(total)}</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={() => {
              if (!pickupDate || !returnDate) {
                if (!pickupDate && !returnDate) {
                  toast.error('Please select a date and time');
                } else if (!pickupDate) {
                  toast.error('Please select a date');
                } else {
                  toast.error('Please select a time');
                }
                return;
              }
              const checkoutItem = {
                experienceId: experience._id,
                name: experience.name || experience.brand,
                date: pickupDate,
                time: returnDate,
                qty,
                subtotal: total,
                pricePerUnit: experience.pricePerPerson || experience.pricePerDay
              };
              try { sessionStorage.setItem('checkoutItem', JSON.stringify(checkoutItem)); } catch (e) { console.warn('store checkoutItem', e) }
              navigate('/checkout');
            }}
            className={` bg-gray-200 hover:bg-primary text-black hover:brightness-95 w-full py-3 font-medium rounded-md cursor-pointer `}
          >
            Confirm
          </motion.button>
  </motion.aside>
      </div>
    </div>
    )
  }

  if (notFound) {
    return (
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-center'>
        <h2 className='text-2xl font-semibold mb-4'>Experience not found</h2>
        <p className='text-gray-600 mb-6'>We couldn't find the experience you're looking for. It may have been removed or the ID is invalid.</p>
        <div className='flex justify-center'>
          <button onClick={() => navigate('/')} className='px-4 py-2 bg-primary text-black rounded-md'>Back to home</button>
        </div>
      </div>
    )
  }

  return <Loader />
}

export default ExperienceDetails
