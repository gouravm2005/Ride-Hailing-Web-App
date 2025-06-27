import React from 'react'
import { Link } from 'react-router-dom'
import Navbar2 from '../components/Navbar2'

const RideTracking = () => {
  return (
   <div className='w-screen h-screen'>
    <Navbar2/>
   <img className='w-[90%] h-[70%] m-4 borderr-2 rounded-md' src="Map.gif"/>
   <div className='w-full h-32 m-5 ml-10 flex flex-col gap-5 justify-center align-middle relative'>
    <Link to=''><button className='w-80 h-12 bg-blue-500 text-white text-xl font-semibold border-2 rounded-md'>Cancel Ride</button></Link>
    <Link to=''><button className='w-80 h-12 bg-blue-500 text-white text-xl font-semibold border-2 rounded-md'>Check Detail</button></Link>
    </div>
   </div>
  )
}

export default RideTracking