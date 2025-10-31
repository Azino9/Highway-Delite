import React from 'react'
import { experiences } from '../assets/assets'
import CarCard from './placeCard'
import { motion } from 'motion/react'
import { useAppContext } from '../hooks/useAppContext'

const FeaturedSection = () => {
  const { filteredExperiences } = useAppContext();
  // Respect filteredExperiences when it's set (even if empty). Fall back only when it's undefined.
  const list = Array.isArray(filteredExperiences) ? filteredExperiences : experiences;
  return (
    <motion.div
    initial={{opacity: 0, y:40}}
    whileInView={{opacity: 1, y:0}}    // When we scroll to this section it will come to its original position
    transition={{duration: 1, ease: "easeInOut"}}
    className=' flex flex-col items-center  px-6 md:px-16 bg-white
    lg:px-24 xl:px-32 ' >

        <motion.div
        initial={{opacity: 0, y: 100}}
        whileInView={{opacity: 1, y:0}}    // When we scroll to this section it will come to its original position
        transition={{duration: 1,delay: 0.5}}
         className=' grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-18 ' >

  {/* Experience Card */}
   { list && list.length > 0 ? (
      <>
        {list.slice(0,8).map((experience) => (
          <motion.div key={experience._id}
            initial={{opacity: 0, scale: 0.95}}
            whileInView={{opacity: 1, scale: 1}}    // When we scroll to this section it will come to its original position
            transition={{duration: 0.4,ease: "easeOut"}}
          >
            <CarCard experience={experience} />
          </motion.div>
        ))}
      </>
    ) : (
      <div className='col-span-full text-center text-gray-500 py-8'>No experiences found for your search.</div>
    )}
        </motion.div>

    </motion.div>
  )
}

export default FeaturedSection