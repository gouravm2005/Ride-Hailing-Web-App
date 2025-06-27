import React from 'react'
import { Link } from 'react-router-dom'

const CaptainDetail = () => {
  return (
    <div className='bg-white text-blue-500 w-full h-full pt-5'>
     {/* Captain Information */}
     <div className='w-[90%] h-32 bg-white p-4 flex m-4 rounded-lg border-2 hover:border-blue-500 justify-between'>
     <div><img className='w-20 h-14 rounded-full pr-2 mt-6' src='profile.webp'></img></div>
     <div className='flex flex-col mt-5'>
     <h2 className='text-blue-500 text-lg font-semibold'>Captain-1</h2>
     <h2 className='text-md text-blue-500 font-semibold'>0.2km . 2min away</h2>
     </div>
     <div className='mt-8'>
      <h2 className='text-2xl text-blue-500 font-semibold'>$20</h2>
     </div>
    </div>

 {/* vehicle Information */}
    <div className='w-[90%] h-32 bg-white p-4 flex flex-col m-4 rounded-lg border-2 hover:border-blue-500 justify-center align-middle'>
     <h2>Brand    -   Swift</h2>
      <h2>Color   -   White</h2>
      <h2>plate No. -  MP-04-0001</h2>
      <h2>capacity  -  2</h2>
    </div>

{/* Ride Information */}
      <div className='w-[90%] h-32 bg-white p-4 flex flex-col m-4 rounded-lg border-2 hover:border-blue-500 justify-center align-middle'>
     <h2>Ride Distance - 5km</h2>
      <h2>Total Time - 15 min</h2>
      <h2>Amount - $10</h2>
    </div>

{/* Contact Information */}
      <div className='w-[90%] h-32 bg-white p-4 flex flex-col m-4 rounded-lg border-2 hover:border-blue-500 justify-center align-middle'>
     <h2>Mob no - 0123456789</h2>
      <h2>Whatsapp No - 0123456789</h2>
    </div>

    {/* Payment Information */}
    <div className='w-full h-20 m-4 p-4'>
    
  <h2>Select payment method</h2>
  <select>
  <option value="someOption">UPI</option>
  <option value="otherOption">CASH</option>
  </select>
    </div>

    <div className='w-full h-20 flex justify-center align-middle'><Link to='/RideTracking'><button className='w-36 h-12 rounded-r-md bg-blue-500 text-white text-xl font-semibold'>Comfirm Ride </button></Link></div>
    </div>
  )
}

export default CaptainDetail