import {React, useState, useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext, UserDataContext } from '../context/UserContext'

const UserSignup = () => {
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [firstname, setfirstname] = useState('')
    const [lastname, setlastname] = useState('')
    const [UserData, setUserData] = useState('')
    
    const {user, setUser} = useContext(UserDataContext)
    const navigate = useNavigate();

    const submitHandler = async (e) => {
     e.preventDefault()
     setUserData({
      fullname:{
        firstname:firstname,
        lastname:lastname
      },
       email:email,
       password:password
     })
    const newUser = ({
        fullname:{
          firstname:firstname,
          lastname:lastname
        },
         email:email,
         password:password
       })
    
    // const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, newUser)
    
    // if(response.status == 201){
    //   const data = response.data;

    //   navigate('/Homepage')
    // }
    //  setfirstname('')
    //  setlastname('')
    //  setemail('')
    //  setpassword('')
    // }

    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, newUser);

      if (response.status === 201) {
        console.log('Signup success:', response.data);
        navigate('/UserHome');
      }
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
    }
  }

  return (
    <div>
      <div className='w-screen h-14 bg-blue-500 text-white text-lg font-medium pl-5 pt-3 pb-4'>RideGo</div>
      <form className='w-screen h-screen flex flex-col items-center p-10 gap-5 pt-20' onSubmit={submitHandler}>

      <h3 className='w-64 text-xl font-medium'>What's your Name</h3>
      <div><input className='w-28 bg-gray-200 p-2 rounded-sm' required value={firstname} onChange={(e)=>setfirstname(e.target.value)} type="text" placeholder='First Name'/> <input className='w-28 bg-gray-200 p-2 rounded-sm ml-6' required value={lastname} onChange={(e)=>setlastname(e.target.value)} type="text" placeholder='Last Name'/></div>
      
      <h3 className='w-60 text-xl font-medium mt-4'>What's your Email</h3>
      <input className='w-60 bg-gray-200 p-2 rounded-sm' required value={email} onChange={(e)=>setemail(e.target.value)} type="email" placeholder='example@email.com'/>

      <h3 className='w-60 text-xl font-medium mt-4'>Enter Password</h3>
      <input className='w-60 bg-gray-200 p-2 rounded-sm' required value={password} onChange={(e)=>setpassword(e.target.value)} type="password" placeholder='password'/>

      <button className='w-60 bg-blue-400 p-2 mt-10 rounded-md text-white font-medium'>Sign up</button>
      <p>Already have an account? <Link className='text-blue-400' to='/Userlogin'>Login here</Link></p>

      </form>
    </div>
  )
}

export default UserSignup