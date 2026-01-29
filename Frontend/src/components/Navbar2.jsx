import { React, useState, useEffect } from "react";
import { Car } from "lucide-react";
import { Link } from 'react-router-dom'
import UserProfile from "./UserProfile";
import CaptainProfile from "./CaptainProfile";
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

function Navbar2() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [role, setRole] = useState("user");

const { user, setUser } = useContext(UserDataContext);

  useEffect(() => {
    const userAuth = JSON.parse(sessionStorage.getItem("userAuth"));
    if (userAuth?.role) {
      setRole(userAuth.role);
    }
  }, []);

  const handleMenu = () => setMenuOpen(!menuOpen);
  const handleProfileToggle = () => setIsProfileOpen(!isProfileOpen);

  return (
    <div className='w-screen h-16 flex justify-between bg-white text-blue-600 border-b-2 border-gray-300'>
      <div className='flex gap-4 pl-3 text-xl pt-4 font-normal'>
        <div className='w-30 h-16 text-2xl font-bold flex gap-2 '>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <h1 className='text-blue-600'>EzRyde</h1>
        </div>
        <div className='hidden md:flex gap-10 pl-14 pt-1 font-medium'>
          <h3><Link to='/UserRides'>Ride</Link></h3>
          <h3> {role === "user" ? <Link to="/UserNotification">Notification</Link> : <Link to="/CaptainNotification">Notification</Link> }</h3>
          <h3><Link to='/About'>About</Link></h3>
          <h3><Link to='/Support'>Support</Link></h3>
        </div>
      </div>
      <div className="flex gap-5 pt-4 p-3 pr-8 items-center">
        <div
          onClick={handleProfileToggle}
          className="w-10 h-10 rounded-full cursor-pointer"
        >
          <img
            className="w-9 h-9 rounded-full border"
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            alt="Profile"
          />
        </div>

        {isProfileOpen && (
          <div className="absolute top-20 right-8 z-50 bg-white shadow-xl rounded-lg">
            {role === "user" ? <UserProfile /> : <CaptainProfile />}
          </div>
        )}
        <div className="md:hidden cursor-pointer" onClick={handleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="30"
            height="30"
            color="#3B82F6"
            fill="none"
          >
            <path
              d="M4 5L20 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 12L20 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 19L20 19"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {menuOpen && (
          <div onClick={handleMenu} className="md:hidden flex flex-col gap-4 items-start text-xl font-bold bg-white text-blue-400 w-[40%] h-screen fixed z-10 top-16 right-0 pt-8 pl-8">
            <h3><Link to='/UserRides'>Ride</Link></h3>
            <h3> {role === "user" ? <Link to="/UserNotification">Notification</Link> : <Link to="/CaptainNotification">Notification</Link> }</h3>
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