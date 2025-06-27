import React from 'react'
import {useState} from 'react'
import AvailableRide from './AvailableRide'

const RideType = ({onSelectRide}) => {

  const [IsClick, setIsClick] = useState(false)

  return (
    <div className='bg-white w-full h-full p-6 flex flex-col justify-between'>

  <div onClick={onSelectRide} className='w-full h-10 bg-white flex justify-center align-middle'>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" color="#3B82F6" fill="none">
    <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
 </svg>
  </div>

    <div onClick={onSelectRide} className='w-[90%] h-36 p-4 flex m-4  rounded-lg border-2 hover:border-blue-500 justify-between'>
     <div><img className='w-44 h-28 rounded-2xl pr-2' src='car.webp'></img></div>
     <div className='flex gap-12 mt-5'>
     <h2 className='text-blue-500 text-2xl font-semibold'>Car</h2>
     <h2 className='text-2xl text-blue-500 font-semibold'>$20</h2>
     </div>
    </div>

     <div onClick={onSelectRide} className='w-[90%] h-36 p-4 flex m-4  rounded-lg border-2 hover:border-blue-500 justify-between'>
     <div><img className='w-28 h-20 rounded-2xl' src='bike.webp'></img></div>
     <div className='flex gap-12 mt-5'>
     <h2 className='text-blue-500 text-2xl font-semibold'>Bike</h2>
     <h2 className='text-2xl text-blue-500 font-semibold'>$10</h2>
     </div>
    </div>

     <div onClick={onSelectRide} className='w-[90%] h-36 p-4 flex m-4  rounded-lg border-2 hover:border-blue-500 justify-between'>
     <div><img className='w-24 h-14 rounded-2xl mt-3' src='Auto.webp'></img></div>
     <div className='flex gap-12 mt-5'>
     <h2 className='text-blue-500 text-2xl font-semibold'>Auto</h2>
     <h2 className='text-2xl text-blue-500 font-semibold'>$15</h2>
     </div>
    </div>
 
    {/* {IsClick && <AvailableRide/>} */}
    </div>
  )
}

export default RideType