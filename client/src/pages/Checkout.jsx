import React, { useEffect, useState } from 'react'
import { useAppContext } from '../hooks/useAppContext'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'
import {motion} from 'motion/react'

// Checkout page: handles booking form, validation, promo, pricing and submission

const Checkout = () => {
    
    // get common helpers from global context
    const { axios, navigate, currency } = useAppContext();

    // form and UI state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [promo, setPromo] = useState('');
    const [agree, setAgree] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPromos, setShowPromos] = useState(false);
    const [appliedPromo, setAppliedPromo] = useState('');


    // load checkout item (set by ExperienceDetails) from sessionStorage
    // fallback to null if parsing fails
    const [item, setItem] = useState(() => {
        try {
            const raw = sessionStorage.getItem('checkoutItem');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });
    // ensure a safe fallback so the page stays usable if sessionStorage is empty
    useEffect(() => {
        if (!item) {
            // nothing selected — keep page usable with fallback
            setItem({ name: 'Experience', date: new Date().toISOString().split('T')[0], 
                time: '09:00 am', qty: 1, subtotal: 999, pricePerUnit: 999 });
        }
    }, [item]);


    // available promo definitions (client-side demo only)
    const PROMOS = [
        { code: 'PROMO10', type: 'percent', value: 10, desc: '10% off your booking' },
        { code: 'FLAT50', type: 'fixed', value: 50, desc: 'Flat ' + currency + '50 off' }
    ];

    // apply promo logic: set discount and mark which promo is applied
    const applyPromoByCode = (code) => {
        const p = PROMOS.find(x => x.code === (code || '').trim().toUpperCase());
        if (!p) {
            setDiscount(0);
            setAppliedPromo('');
            return false;
        }
        if (p.type === 'percent') setDiscount(p.value / 100);
        else if (p.type === 'fixed') setDiscount((p.value) / (subtotal || 1));
        setPromo(p.code);
        setAppliedPromo(p.code);
        return true;
    };

    const applyPromo = () => {
        applyPromoByCode(promo);
    };

    const removeApplied = () => {
        setPromo('');
        setDiscount(0);
        setAppliedPromo('');
    };

    


    // pricing calculations
    const subtotal = item ? Number(item.subtotal || item.pricePerUnit * item.qty || 0) : 0;
    const discounted = Number((subtotal * (1 - discount)).toFixed(2));
    const taxes = Number((discounted * 0.06).toFixed(2));
    const total = Number((discounted + taxes).toFixed(2));
    const promoAmount = Number((subtotal - discounted).toFixed(2));

    // small helper: show integer without decimals, otherwise 2 dp
    const fmt = (v) => {
        if (Number.isInteger(v)) return v.toString();
        return v.toFixed(2);
    };
    // handle payment/booking submission
    const handlePay = async () => {
        // validate fields and collect any errors
        const nextErrors = {};
        if (!name || !name.trim()) nextErrors.name = 'Full name is required';
        if (!email || !email.trim()) nextErrors.email = 'Email is required';
        else {
            // simple email validation
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!re.test(email)) nextErrors.email = 'Please enter a valid email address';
        }

        if (Object.keys(nextErrors).length) {
            setErrors(nextErrors);
            // show the first error as toast for immediate feedback
            const first = nextErrors[Object.keys(nextErrors)[0]];
            toast.error(first);
            return;
        }

        if (!agree) {
            setErrors(prev => ({...prev, agree: 'You must agree to the terms and safety policy'}));
            toast.error('Mark the T&C checkbox');
            return;
        }

        // begin processing UI (disable button, show spinner)
        setIsProcessing(true);
        const toastId = toast.loading('Processing booking...');

        // prepare payload sent to backend
        const payload = {
            experienceId: item.experienceId,
            experienceName: item.name,
            date: item.date,
            time: item.time,
            qty: item.qty,
            pricePerUnit: item.pricePerUnit,
            subtotal: discounted,
            taxes,
            total,
            customerName: name,
            customerEmail: email,
            promo
        };

        try {
            // send booking to backend; client-side timeout prevents long hangs
            const { data } = await axios.post('/api/bookings/create-experience', payload, { timeout: 15000 });
            if (data && data.success) {
                try { sessionStorage.setItem('bookingConfirmation', JSON.stringify({ ref: data.bookingRef || data.bookingId || data._id || 'REF'+Date.now() })); } catch (e) { console.warn('bookingConfirmation store error', e) }
                toast.success('Booking confirmed', { id: toastId });
                navigate('/booking-confirmation');
            } else {
                toast.error(data?.message || 'Booking failed', { id: toastId });
            }
        } catch (err) {
            const isNetworkError = !err.response;
            if (isNetworkError) {
                // network unavailable: simulate a booking so demo flow continues
                const simulatedRef = 'SIM-' + Date.now();
                try { sessionStorage.setItem('bookingConfirmation', JSON.stringify({ ref: simulatedRef })); } catch (e) { console.warn('bookingConfirmation store error', e) }
                toast.success('Offline mode: booking simulated (no backend).', { id: toastId });
                navigate('/booking-confirmation');
                return;
            }

            // otherwise show server-side error message
            toast.error(err.response?.data?.message || err.message || 'Booking error', { id: toastId });
        } finally {
            // re-enable UI
            setIsProcessing(false);
        }
    };

return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
            <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-6  cursor-pointer'>
                <img src={assets.arrow_icon} alt="back" className='rotate-180 opacity-65 h-4' />
                <span>Checkout</span>
            </button>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
                {/* {Left Side Details} */}
                <div className='lg:col-span-2'>
                    <div className='bg-gray-100 rounded-lg p-6'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <label className='block'>
                                <div className='text-sm text-gray-600 mb-2'>Full name</div>
                                    <input
                                        value={name}
                                        onChange={e => { setName(e.target.value); setErrors(prev => ({...prev, name: ''})); }}
                                        placeholder='John Doe'
                                        className='mt-0 w-full px-4 py-3 rounded-md bg-gray-200 placeholder-gray-500 text-gray-800 border border-transparent focus:outline-none'
                                    />
                                    {errors.name && <div className='text-xs text-red-600 mt-1'>{errors.name}</div>}
                            </label>

                            <label className='block'>
                                <div className='text-sm text-gray-600 mb-2'>Email</div>
                                <input
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ''})); }}
                                    placeholder='test@test.com'
                                    className='mt-0 w-full px-4 py-3 rounded-md bg-gray-200 placeholder-gray-500 text-gray-800 border border-transparent focus:outline-none'
                                />
                                {errors.email && <div className='text-xs text-red-600 mt-1'>{errors.email}</div>}
                            </label>
                        </div>

                            <div className='mt-4'>
                                <div className='text-sm text-gray-600 mb-2'>Promo code</div>
                                <div className='flex gap-3'>
                                    <input
                                        value={promo}
                                        onChange={e => setPromo(e.target.value)}
                                        placeholder='Promo code'
                                        className='flex-1 px-4 py-3 rounded-md bg-gray-200 placeholder-gray-500 text-gray-800 border border-transparent focus:outline-none'
                                    />
                                    <button
                                        onClick={applyPromo}
                                        type='button'
                                        disabled={appliedPromo === promo && discount > 0}
                                        className={`px-4 py-2 rounded-md ${appliedPromo === promo && discount > 0 ? 'bg-green-100 text-green-800 cursor-default' : 'bg-black text-white'}`}>
                                        {appliedPromo === promo && discount > 0 ? 'Applied' : 'Apply'}
                                    </button>
                                </div>

                                {/* show applied promo on the left when present */}
                                {appliedPromo && (
                                    <div className='mt-2'>
                                        <div className='inline-flex items-center justify-between gap-3 bg-white p-2 rounded-md border border-gray-200'>
                                            <div className='flex flex-col'>
                                                <span className='text-sm font-medium'>{appliedPromo}</span>
                                                <span className='text-xs text-gray-500'>{PROMOS.find(p => p.code === appliedPromo)?.desc}</span>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={removeApplied}
                                                    aria-label='Remove applied promo'
                                                    title='Remove promo'
                                                    className='flex items-center justify-center h-7 w-7 rounded-md bg-red-50 text-red-600 hover:bg-red-100 focus:ring-2 focus:ring-red-200 focus:outline-none'
                                                >
                                                    <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
                                                        <path fillRule='evenodd' d='M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z' clipRule='evenodd' />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Promo Code Logic */}
                                <div className='mt-3'>
                                    <button type='button' onClick={() => setShowPromos(s => !s)} aria-expanded={showPromos}
                                        className='flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800'
                                    >
                                        <span>Available promo codes</span>
                                        {/* small chevron */}
                                        <svg
                                            className={`h-4 w-4 text-gray-500 transform transition-transform ${showPromos ? 'rotate-180' : ''}`}
                                            viewBox='0 0 20 20'
                                            fill='currentColor'
                                            xmlns='http://www.w3.org/2000/svg'
                                            aria-hidden='true'
                                        >
                                            <path fillRule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z' clipRule='evenodd' />
                                        </svg>
                                    </button>

                                    {showPromos && (
                                        <div className='mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2'>
                                            {PROMOS.map(p => (
                                                <div key={p.code} className='flex items-center justify-between bg-white p-2 rounded-md border border-gray-200'>
                                                    <div>
                                                        <div className='text-sm font-medium'>{p.code}</div>
                                                        <div className='text-xs text-gray-500'>{p.desc}</div>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <button onClick={() => { setPromo(p.code); applyPromoByCode(p.code); }} className='px-3 py-1 bg-primary text-black rounded text-sm'>Use</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                        <div className='flex items-center gap-2 text-sm mt-4'>
                            <input id='terms' checked={agree} onChange={e => { setAgree(e.target.checked); setErrors(prev => ({...prev, agree: ''})); }} type='checkbox' className='h-4 w-4 text-black' required />
                            <label htmlFor='terms' className='text-gray-600'>I agree to the terms and safety policy</label>
                        </div>
                        {errors.agree && <div className='text-xs text-red-600 mt-1'>{errors.agree}</div>}
                    </div>
                </div>

                {/* {Right Side Summary} */}
                <aside className='w-full max-w-[420px] bg-gray-100 p-5 rounded-lg'>
                    <div className='text-sm text-gray-600 mb-4'>
                        <div className='flex justify-between mb-2'><span>Experience</span><span className='font-medium text-gray-800'>{item?.name}</span></div>
                        <div className='flex justify-between mb-2'><span>Date</span><span className='text-gray-800'>{item?.date}</span></div>
                        <div className='flex justify-between mb-2'><span>Time</span><span className='text-gray-800'>{item?.time}</span></div>
                        <div className='flex justify-between mb-2'><span>Qty</span><span className='text-gray-800'>{item?.qty}</span></div>
                        <div className='flex justify-between mb-2'><span>Subtotal</span><span className='font-medium text-gray-800'>{currency}{discounted}</span></div>
                        <div className='flex justify-between mb-2'><span>Taxes</span><span className='font-medium text-gray-800'>{currency}{taxes}</span></div>
                            <div className='flex justify-between mb-2'>
                                <span>Subtotal</span>
                                <span>
                                    {discount > 0 ? (
                                        <>
                                            <span className='text-gray-400 line-through mr-2'>{currency}{fmt(subtotal)}</span>
                                            <span className='font-medium text-gray-800'>{currency}{fmt(discounted)}</span>
                                        </>
                                    ) : (
                                        <span className='font-medium text-gray-800'>{currency}{fmt(subtotal)}</span>
                                    )}
                                </span>
                            </div>

                            {discount > 0 && (
                                <div className='flex justify-between mb-2 text-sm text-gray-700 items-center'>
                                    <span>Promo <span className='font-medium'>({appliedPromo || 'PROMO'})</span></span>
                                    <div className='flex items-center gap-3'>
                                        <span className='text-red-600'>-{currency}{fmt(promoAmount)}</span>
                                    </div>
                                </div>
                            )}

                            <div className='flex justify-between mb-2'><span>Taxes</span><span className='font-medium text-gray-800'>{currency}{fmt(taxes)}</span></div>
                    </div>
                    <hr className='border-gray-200 my-3' />
                    <div className='flex justify-between items-center mb-4'>
                        <div className='text-lg font-semibold'>Total</div>
                        <div className='text-2xl font-bold'>{currency}{total}</div>
                    </div>
                    <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     transition={{ type: 'spring', stiffness: 300 }}
                     onClick={handlePay}
                     disabled={isProcessing}
                     aria-busy={isProcessing}
                     className={`w-full py-3 ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-[#FFD200]'} text-black font-medium rounded-md flex items-center justify-center gap-3`}
                    >
                        {isProcessing ? (
                            <>
                                <svg className='animate-spin h-5 w-5 text-black' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'></path>
                                </svg>
                                <span>Processing...</span>
                            </>
                        ) : (
                            'Pay and Confirm'
                        )}
                    </motion.button>
                </aside>
            </div>
        </div>
    )
}
export default Checkout