import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import axios from 'axios'
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

function UserProfile({ onClose }) {
  // const [user, setUser] = useState(null)
  const navigate = useNavigate()

const { user, setUser } = useContext(UserDataContext);

  const getProfile = () => {
    const userAuth = JSON.parse(localStorage.getItem("userAuth"));
    if (!userAuth || !userAuth.token) {
      navigate('/Userlogin')
      return
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${userAuth.token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error('Profile error:', err))
  }

  const logoutUser = () => {
    const userAuth = JSON.parse(localStorage.getItem('userAuth'))
    if (!userAuth || !userAuth.token) {
      navigate('/Userlogin')
      return
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/user/logout`, {
        headers: {
          Authorization: `Bearer ${userAuth.token}`,
        },
      })
      .then(() => {
        localStorage.removeItem('userAuth')
        localStorage.removeItem('user')
        navigate('/Userlogin')
      })
      .catch((err) => console.error('Logout error:', err))
  }

  useEffect(() => {
    getProfile()
  }, [])

  if (!user) return null

  return (
    <div className="absolute top-0 right-0 w-64 bg-white shadow-lg rounded-xl border border-blue-200 p-5 z-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
          <User className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-blue-600">
            {user.firstname} {user.lastname}
          </h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <button
        onClick={logoutUser}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Logout
      </button>
    </div>
  )
}

export default UserProfile;