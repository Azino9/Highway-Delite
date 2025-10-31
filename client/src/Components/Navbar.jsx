import React,{useState, useEffect, useCallback} from 'react'
import { assets, experiences as bundledExperiences } from '../assets/assets'
import {Link} from 'react-router-dom'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';

const Navbar = () => {

  const {experiences, axios, currency, filteredExperiences, setFilteredExperiences} = useAppContext();
  const [input, setInput] = useState("");
  const [showResults, setShowResults] = useState(false);
    const  [searchParams] = useSearchParams() ;

    // This is to change the navbar color based on the page we are on home so it will be light otherwise white, logic is written inside the className
    const location = useLocation();
    const [open,setOpen] = useState(false);
    const navigate = useNavigate();
    
  //  getting search params from URL
      const pickupLocation = searchParams.get('pickupLocation') ;
      const pickupDate = searchParams.get('pickupDate') ;
      const returnDate = searchParams.get('returnDate') ;
      
    
        // For the search input so that we can toggle the value
    
  // If we have search data then filter experiences based on location, pickup date and return date
      const isSearchData = pickupLocation && pickupDate && returnDate ;
    
    
      
    
  const searchExperienceAvailability = useCallback(async() => {
        try {
          // Debug log to check values before API call
          console.log('searchCarAvailability payload:', { pickupLocation, pickupDate, returnDate });
          if (!pickupLocation || !pickupDate || !returnDate) {
            toast.error('Please provide location, pickup date, and return date');
            return;
          }
     
          if (new Date(returnDate) < new Date(pickupDate)) {
          toast.error("Return date cannot be before pickup date");
                return;       
          }
    
          const {data} = await axios.post('/api/bookings/check-availability',{ location: pickupLocation, pickupDate, returnDate})

          if(data.success){
            // API returns available items (compatibility: may be named AvailableCars)
            const available = data.AvailableCars || data.available || [];
            setFilteredExperiences(available);
            if(available.length === 0){
              toast('No experiences available for the selected location and dates.')
            }
            return null
          }
    
        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || error.message);
        }
  }, [axios, pickupLocation, pickupDate, returnDate, setFilteredExperiences])
    
      useEffect(()=>{
          if (isSearchData) searchExperienceAvailability();
        },[isSearchData, searchExperienceAvailability])
      
      useEffect(()=>{
          if (!isSearchData) {
              // use fetched experiences if present, otherwise fall back to bundled demo data
              const source = (experiences && experiences.length) ? experiences : bundledExperiences;
              if(input === ''){
                setFilteredExperiences(source || []) ;
                setShowResults(false);
              } else {
                const term = input.toLowerCase();
                const filtered = (source || []).slice().filter((exp) => {
                  // match on experience name, category, location or about/highlights
                  return (exp.name?.toLowerCase() || '').includes(term)
                    || (exp.category?.toLowerCase() || '').includes(term)
                    || (exp.location?.toLowerCase() || '').includes(term)
                    || (exp.about?.toLowerCase() || '').includes(term)
                    || (Array.isArray(exp.highlights) && exp.highlights.join(' ').toLowerCase().includes(term));
                })
                setFilteredExperiences(filtered);
                setShowResults(true);
              }
          }
  }, [input, experiences, isSearchData, setFilteredExperiences])

      // Immediate input handler: filter as the user types (more responsive than waiting on effect)
      const handleInputChange = (e) => {
        const v = e.target.value;
        setInput(v);
        if (isSearchData) return; // if searching by params, let that flow run

        const source = (experiences && experiences.length) ? experiences : bundledExperiences;
        if (!v || v.trim() === '') {
          setFilteredExperiences(source || []);
          setShowResults(false);
          return;
        }

        const term = v.toLowerCase();
        const filtered = (source || []).slice().filter((exp) => {
          return (exp.name?.toLowerCase() || '').includes(term)
            || (exp.category?.toLowerCase() || '').includes(term)
            || (exp.location?.toLowerCase() || '').includes(term)
            || (exp.about?.toLowerCase() || '').includes(term)
            || (Array.isArray(exp.highlights) && exp.highlights.join(' ').toLowerCase().includes(term));
        });
        setFilteredExperiences(filtered);
        setShowResults(true);
      }

    // hide results on outside click
    useEffect(() => {
      const onDoc = (e) => {
        const target = e.target;
        // simple heuristic: if click is outside input or results container, hide
        if (!target.closest) return;
        if (!target.closest('.search-results') && !target.closest('input')) {
          setShowResults(false);
        }
      };
      document.addEventListener('click', onDoc);
      return () => document.removeEventListener('click', onDoc);
    }, []);
    
    

    

  return (
    <motion.div 
    initial={{y:-20, opacity: 0}}
    animate={{y:0, opacity: 1}}
    transition={{duration: 0.5}}
     className={` flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 py-3 text-gray-600  shadow-md relative bg-white transition-all
    ${location.pathname === "/" && "bg-light"} `} >

        {/* Whenever we click on the logo it should redirect us to Home */}
        <Link to='/' > 
        <motion.img whileHover={{scale: 1.05}} src={assets.logo} alt="Logo" className=' h-14 '  />
        </Link>

        <div className={` max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t
        border-borrderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 
        transition-all duration-300 z-50 bg-white ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"} `} >

            {/* The Hidden below in className if it is mobile Screen and show for medium and above medium /large screeen */}
            <div className='  lg:flex items-center text-sm gap-2   bg-gray-200 px-6 py-2 max-w-90 rounded relative ' >
          <input onChange={handleInputChange} value={input} onKeyDown={(e)=>{ if(e.key === 'Enter'){ e.preventDefault(); if(filteredExperiences && filteredExperiences.length>0){ navigate(`/experience/${filteredExperiences[0]._id}`); setShowResults(false); setInput(''); } } }} type="text" placeholder='Search experiences or locations' className=' w-[500px] h-8 sm:w-[600px] md:w-[700px]  outline-none text-gray-800 ' />
            {/* Results dropdown */}
            {showResults && (
              <div className='search-results absolute left-0 top-full mt-2 w-full bg-white shadow-lg rounded-md max-h-72 overflow-auto z-50'>
                {filteredExperiences && filteredExperiences.length > 0 ? (
                      filteredExperiences.slice(0,8).map(exp => (
                        <div key={exp._id} onClick={() => { navigate(`/experience/${exp._id}`); setShowResults(false); setInput(''); }} className='flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer'>
                          <img src={(exp.image || (exp.images ? (Array.isArray(exp.images)?exp.images[0]:exp.images) : ''))} alt={exp.name} className='w-14 h-10 object-cover rounded' />
                          <div className='flex-1'>
                            <div className='text-sm font-medium'>{exp.name}</div>
                            <div className='text-xs text-gray-500'>{exp.location} · {exp.category}</div>
                          </div>
                          <div className='text-sm font-semibold'>{currency}{exp.pricePerPerson || exp.pricePerDay || ''}</div>
                        </div>
                      ))
                ) : (
                  <div className='p-3 text-sm text-gray-500'>No results for "{input}"</div>
                )}
              </div>
            )}
            </div>

      <div className=' flex max-sm:flex-col items-start sm:items-center gap-6 ' >
  <motion.button    
         initial={{ opacity: 0, y: 12 }} 
         animate={{ opacity: 1, y: 0 }} 
         transition={{ duration: 0.45, delay: 0.12 }}
        onClick={() => { if(filteredExperiences && filteredExperiences.length>0){ navigate(`/experience/${filteredExperiences[0]._id}`); 
        setShowResults(false); setInput(''); } else { setShowResults(true); } }} 
        className=' cursor-pointer px-6 py-3 bg-primary hover:bg-primary-dull transition-all text-black rounded-lg ' >
         Search
    </motion.button>
      </div>
        </div>

        <button className=' sm:hidden cursor-pointer p-2' aria-label='Menu' onClick={()=> setOpen(!open)} >
            <img src={open ? assets.close_icon : assets.menu_icon } alt="" />
        </button>

    </motion.div>
  )
}

export default Navbar