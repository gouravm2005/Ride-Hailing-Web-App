import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { CaptainContext, CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import { Car } from "lucide-react";

const CaptainSignup = () => {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [firstname, setfirstname] = useState('')
  const [lastname, setlastname] = useState('')
  const [vehicleColor, setvehicleColor] = useState('')
  const [vehiclePlate, setvehiclePlate] = useState('')
  const [vehicleCapacity, setvehicleCapacity] = useState('')
  const [vehicleType, setvehicleType] = useState('')
  const [CaptainData, setCaptainData] = useState('')

  const { captain, setCaptain } = useContext(CaptainDataContext);

  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault()
    const CaptainData = {
      fullname: {
        firstname: firstname,
        lastName: lastname
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType
      }
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captain/register`, CaptainData);

      if (response.status === 201) {
        console.log('Signup success:', response.data);
        const token = response.data.token;
        localStorage.setItem("auth", JSON.stringify({ token: token, role: 'captain' }));
        navigate('/CaptainHome');
      }
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
    }

    setfirstname('')
    setlastname('')
    setemail('')
    setpassword('')
    setvehicleColor('')
    setvehiclePlate('')
    setvehicleCapacity('')
    setvehicleType('')
  }

  return (
    <div>
      <div className='w-screen h-14 bg-gray-200 text-xl flex gap-2 font-medium pl-5 pt-3 pb-4'>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <Car className="w-5 h-5 text-white" />
        </div>
        <h2 className='text-2xl font-bold  text-blue-600'>RideGo</h2>
      </div>
      <form className='w-screen h-screen flex flex-col items-center p-10 gap-5 pt-20' onSubmit={submitHandler}>

        <h3 className='w-64 text-xl font-medium'>What's your Name</h3>
        <div><input className='w-28 bg-gray-200 p-2 rounded-sm' required value={firstname} onChange={(e) => setfirstname(e.target.value)} type="text" placeholder='First Name' /> <input className='w-28 bg-gray-200 p-2 rounded-sm ml-6' value={lastname} onChange={(e) => setlastname(e.target.value)} type="text" placeholder='Last Name' /></div>

        <h3 className='w-60 text-xl font-medium mt-4'>What's your Email</h3>
        <input className='w-60 bg-gray-200 p-2 rounded-sm' required value={email} onChange={(e) => setemail(e.target.value)} type="email" placeholder='example@email.com' />

        <h3 className='w-60 text-xl font-medium mt-4'>Enter Password</h3>
        <input className='w-60 bg-gray-200 p-2 rounded-sm' required value={password} onChange={(e) => setpassword(e.target.value)} type="password" placeholder='password' />

        <h3 className='w-60 text-xl font-medium mt-4'>Vehicle Information</h3>
        <div><input className='w-28 bg-gray-200 p-2 mr-4 rounded-sm' required value={vehicleColor} onChange={(e) => setvehicleColor(e.target.value)} type="text" placeholder='Color' /> <input className='w-28 bg-gray-200 p-2 rounded-sm' required value={vehiclePlate} onChange={(e) => setvehiclePlate(e.target.value)} type="text" placeholder='Plate Number' /></div>
        <div><input className='w-28 bg-gray-200 p-2 mr-4 rounded-sm' required value={vehicleCapacity} onChange={(e) => setvehicleCapacity(e.target.value)} type="Number" placeholder='Capacity' />
          <select className="w-28 font-normal text-gray-400 bg-gray-200 p-2 rounded-sm" required value={vehicleType} onChange={(e) => setvehicleType(e.target.value)}>
            <option value="">Select Vehicle</option>
            <option value="car">car</option>
            <option value="motorcycle">motorcycle</option>
            <option value="auto">auto</option>
          </select>
        </div>

        <button className='w-60 bg-blue-400 p-2 mt-10 rounded-md text-white font-medium'>Sign up</button>
        <p>Already have an account? <Link className='text-blue-400' to='/Captainlogin'>Login here</Link></p>
      </form>
    </div>
  )
}

export default CaptainSignup;