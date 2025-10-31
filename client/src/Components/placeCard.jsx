import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../hooks/useAppContext'

// Generic card used to render an experience listing. Accepts either
// a `experience` prop (preferred) or a legacy `car` prop for compatibility.
const CarCard = ({car, experience}) => {
  const item = experience || car;
   
  const navigate = useNavigate();
  const {currency} = useAppContext();

  const imageSrc = item.image || (item.images ? (Array.isArray(item.images) ? item.images[0] : item.images) : '');
  const title = item.name || item.brand || '';

  return (

    // this onClick we added in the first div is for the oclick property so whenever we click on a car it will take us to the car details page
  <div onClick={()=>{ navigate(`/experience/${item._id}`); scrollTo(0,0) }}  className=' group rounded-2xl overflow-hidden  hover:-translate-y-1 transition-all duration-500 w-full max-w-sm mx-auto sm:mx-0  cursor-pointer  ' >


  {/* Experience image */}
      <div className=' relative h-48 overflow-hidden ' >
        <img src={imageSrc} alt="experience_image" className=' w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ' />
      </div>

  {/* Experience details */}
  <div className=' p-4 sm:p-5 bg-city-box  ' >
        
        <div className=' flex justify-between items-start mb-2  ' >
          <div className='flex justify-between '>
            <h3 className=' text-lg font-medium ' >{title} </h3>
          </div>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2' >
            <button className=' bg-city px-2 py-1 rounded text-xs' >{item.category}</button>
          </div>
        </div>

        <div className=' mt-4  text-box-t ' >
          <p className=' text-sm  ' >{item.description || item.about || 'Unique local experience — details available on the listing.'} </p>
        </div>

        <div className=' flex justify-between items-start mt-4  ' >
            <div className='flex justify-between gap-2 '>
            <h3 className=' text-md py-1 ' > From </h3>
            <h3 className=' text-2xl  ' >{currency} {item.pricePerPerson || item.pricePerDay}</h3>
          </div>
          <div className='flex  '>
          </div>
    <div onClick={()=>{ navigate(`/experience/${item._id}`); scrollTo(0,0) }} className='flex flex-col sm:flex-row items-start sm:items-center' >
            <button className=' px-3 py-1 bg-primary text-black rounded-md shadow-sm cursor-pointer transform transition-all duration-150 hover:bg-[#FFD200] hover:scale-105 ' >View Details</button>
          </div>
        </div>

      </div>
        
    </div>
  )
}

export default CarCard