import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='w-screen h-screen gap-10 relative'>
      <div className='w-screen h-14 bg-blue-500 text-white text-lg font-medium pl-5 pt-3 pb-4'>RideGo</div>
      <div className="absolute w-full h-full bg-center bg-cover bg-no-repeat bg-[url('https://t3.ftcdn.net/jpg/00/55/89/96/360_F_55899675_EgRRtQ4hjbSfOGjiVIsqXGsvkLLCINxN.jpg')]"></div>
      <div className='absolute h-full w-full bg-black/80'></div>
      <div className='relative z-10 flex flex-col gap-16 justify-center items-center top-1/3 text-white'>
        <div>
          <h1 className='lg:text-8xl sm:text-7xl text-6xl font-bold'>RideGo</h1>
          <h1 className='text-sm md:text-1xl lg:text-2xl text-center font-medium'>Every Ride, A Step Ahead</h1>
        </div>
        <Link to='/Userlogin'><button className='lg:text-2xl text-xl font-medium lg:w-80 lg:h-12 w-56 h-8 rounded-lg bg-blue-500'>Continue</button></Link> 
      </div>
    </div>
  )
}

export default Home