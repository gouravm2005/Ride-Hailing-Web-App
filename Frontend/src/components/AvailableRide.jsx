import React from 'react'

const AvailableRide = ({onSelectCaptain}) => {
  return (
   <div className='w-full h-full bg-white flex flex-col justify-between p-4'>
     <div onClick={onSelectCaptain} className='w-[90%] h-32 bg-white p-4 flex m-4 rounded-lg border-2 hover:border-blue-500 justify-between'>
     <div><img className='w-20 h-14 rounded-full pr-2 mt-6' src='profile.webp'></img></div>
     <div className='flex flex-col mt-5'>
     <h2 className='text-blue-500 text-lg font-semibold'>Captain-1</h2>
     <h2 className='text-md text-blue-500 font-semibold'>0.2km . 2min away</h2>
     </div>
     <div className='mt-8'>
      <h2 className='text-2xl text-blue-500 font-semibold'>$20</h2>
     </div>
    </div>

     <div onClick={onSelectCaptain} className='w-[90%] h-32 bg-white p-4 flex m-4 rounded-lg border-2 hover:border-blue-500 justify-between'>
     <div><img className='w-20 h-14 rounded-full pr-2 mt-6' src='profile.webp'></img></div>
     <div className='flex flex-col mt-5'>
     <h2 className='text-blue-500 text-lg font-semibold'>Captain-1</h2>
     <h2 className='text-md text-blue-500 font-semibold'>0.2km . 2min away</h2>
     </div>
     <div className='mt-8'>
      <h2 className='text-2xl text-blue-500 font-semibold'>$20</h2>
     </div>
    </div>

     <div onClick={onSelectCaptain} className='w-[90%] h-32 bg-white p-4 flex m-4 rounded-lg border-2 hover:border-blue-500 justify-between'>
     <div><img className='w-20 h-14 rounded-full pr-2 mt-6' src='profile.webp'></img></div>
     <div className='flex flex-col mt-5'>
     <h2 className='text-blue-500 text-lg font-semibold'>Captain-1</h2>
     <h2 className='text-md text-blue-500 font-semibold'>0.2km . 2min away</h2>
     </div>
     <div className='mt-8'>
      <h2 className='text-2xl text-blue-500 font-semibold'>$20</h2>
     </div>
    </div>

     <div onClick={onSelectCaptain} className='w-[90%] h-32 bg-white p-4 flex m-4 rounded-lg border-2 hover:border-blue-500 justify-between'>
     <div><img className='w-20 h-14 rounded-full pr-2 mt-6' src='profile.webp'></img></div>
     <div className='flex flex-col mt-5'>
     <h2 className='text-blue-500 text-lg font-semibold'>Captain-1</h2>
     <h2 className='text-md text-blue-500 font-semibold'>0.2km . 2min away</h2>
     </div>
     <div className='mt-8'>
      <h2 className='text-2xl text-blue-500 font-semibold'>$20</h2>
     </div>
    </div>
    
   </div>
   
  )
}

export default AvailableRide