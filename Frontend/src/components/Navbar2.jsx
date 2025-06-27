import {React,useState} from "react";
import {Link} from 'react-router-dom'

function Navbar2() {
 const [MenuOpen, setMenuOpen] = useState(false)

 const handleMenu = () => {
  setMenuOpen(!MenuOpen)
 }
 return (
  <div className='w-screen h-16 flex justify-between bg-white text-blue-500'>
   <div className='flex gap-4 pt-5 p-3 text-xl font-normal'>
    <h3 className='font-bold text-2xl pr-4'>MySite</h3>
    <div className='hidden md:flex gap-10 pl-14 pt-1 font-normal'>
     <h3><Link to='/UserHome'>Ride</Link></h3>
     <h3><Link to='/UserNotification'>Notification</Link></h3>
     <h3><Link to='/About'>About</Link></h3>
     <h3><Link to='/Support'>Support</Link></h3>
    </div>
   </div>
   <div className='flex gap-5 pt-4 p-3 pr-8'>
    <Link to='/UserProfile'><button className='w-10 h-10 rounded-full'><img className="w-10 h-10 rounded-full" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"></img></button></Link>
    <div className='md:hidden cursor-pointer' onClick={handleMenu}>
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" color="#3B82F6" fill="none"><path d="M4 5L20 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
     <path d="M4 12L20 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
     <path d="M4 19L20 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    </div>
    {MenuOpen && (
        <div className="md:hidden flex flex-col gap-4 items-start text-3xl font-bold bg-white text-blue-400 w-screen h-screen fixed z-10 top-16 left-56 pt-8 pl-8">
          <h3><Link to='/UserHome'>Ride</Link></h3>
          <h3><Link to='/UserNotification'>Notification</Link></h3>
          <h3><Link to='/About'>About</Link></h3>
          <h3><Link to='/Support'>Support</Link></h3>
          <button className="w-20 h-10 border-2 rounded-md hover:border-blue-200 text-red-500 text-lg">Logout</button>
        </div>
      )}
   </div>
  </div>
 )
}

export default Navbar2;