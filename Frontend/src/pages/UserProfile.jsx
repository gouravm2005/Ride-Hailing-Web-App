import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";

function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth || !auth.token) return;

    axios.get("${import.meta.env.VITE_BASE_URL}/user/profile", {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    .then(res => setUser(res.data))
    .catch(err => console.error(err));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className='w-screen h-screen bg-white'>
     <div className='w-[80%] h-[30%]'>
      <img className='w-12 h-10 p-5 border-2 rounded-full' src="profile.webp" alt="" />
      <h1 className='w-full text-xl text-blue-500 align-middle'>{user.name}</h1>
       <h1 className='w-full text-xl text-blue-500 align-middle'>{user.email}</h1>
     </div>
     <div className='w-[90%] h-2 ml-4 bg-black'></div>
     <h1 className='text-lg text-blue-500 m-3'>Ride History</h1>
    </div>
  )
}

export default UserProfile