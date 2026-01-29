import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import { Car } from "lucide-react";

const Captainlogin = () => {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [CaptainData, setCaptainData] = useState('')

  const { Captain, setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const CaptainData = {
      email: email,
      password: password
    }
    setemail('')
    setpassword('')

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captain/login`, CaptainData);

      if (response.status === 201) {
        const { token, captain } = response.data;
        // localStorage.setItem("captainAuth", JSON.stringify({ token, role: "captain" }));
        // localStorage.setItem("captain", JSON.stringify(captain));
        sessionStorage.removeItem("userAuth");
        sessionStorage.removeItem("user");
        sessionStorage.setItem("captainAuth", JSON.stringify({ token, role: "captain" }));
        sessionStorage.setItem("captain", JSON.stringify(captain));
        setCaptain(captain); // ✅ from CaptainContext
        window.dispatchEvent(new Event("auth-changed"));
        navigate("/CaptainHome", {state: { captainId: captain._id}});
      }
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
    }
  }

  return (
    <div>
      <div className='w-screen h-14 bg-gray-200 text-xl flex gap-2 font-medium pl-5 pt-3 pb-4'>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <Car className="w-5 h-5 text-white" />
        </div>
        <h2 className='text-2xl font-bold  text-blue-600'>EzRyde</h2>
      </div>
      <form className='flex flex-col items-center w-screen h-screen gap-5 p-10 pt-20' onSubmit={submitHandler}>
        <h3 className='text-2xl text-left font-medium w-64'>What's your Email</h3>
        <input required value={email} onChange={(e) => setemail(e.target.value)} className='border-black rounded-sm w-64 bg-gray-200 p-3' type='email' placeholder='example@email.com'></input>

        <h3 className='text-2xl text-left font-medium w-64 mt-6'>Enter Password</h3>
        <input required value={password} onChange={(e) => setpassword(e.target.value)} className='border-black rounded-sm w-64 bg-gray-200 p-3' type='password' placeholder='Password'></input>

        <button className='bg-blue-400 text-white w-64 h-9 rounded-md mt-6 font-medium text-lg'>Login</button>
        <p>New here? <Link className='text-blue-500 font-normal' to='/CaptainSignup'>Create New Account</Link></p>
        <Link to='/Userlogin'><button className='w-64 h-12 p-2 bg-blue-400 text-white mt-20 rounded-md font-medium text-lg'>Sign in as User</button></Link>
      </form>
    </div>
  )
}

export default Captainlogin;
