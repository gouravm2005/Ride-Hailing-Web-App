import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import axios from 'axios'
import { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";

function CaptainProfile({ onClose }) {
  // const [captain, setCaptain] = useState(null)
  const navigate = useNavigate()

const { captain, setCaptain } = useContext(CaptainDataContext);

  const getProfile = () => {
    const captainAuth = JSON.parse(localStorage.getItem("captainAuth"));
    if (!captainAuth || !captainAuth.token) {
      navigate('/Captainlogin')
      return
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/captain/profile`, {
        headers: {
          Authorization: `Bearer ${captainAuth.token}`,
        },
      })
      .then((res) => setCaptain(res.data))
      .catch((err) => console.error('Profile error:', err))
  }

  const logoutCaptain = () => {
    const captainAuth = JSON.parse(localStorage.getItem('captainAuth'))
    if (!captainAuth || !captainAuth.token) {
      navigate('/Captainlogin')
      return
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/captain/logout`, {
        headers: {
          Authorization: `Bearer ${captainAuth.token}`,
        },
      })
      .then(() => {
        localStorage.removeItem('captainAuth')
        localStorage.removeItem('captain')
        navigate('/Captainlogin')
      })
      .catch((err) => console.error('Logout error:', err))
  }

  useEffect(() => {
    getProfile()
  }, [])

  if (!captain) return null

  return (
    <div className="absolute top-2 right-0 w-64 bg-white shadow-lg rounded-xl border border-blue-200 p-5 z-50">
      {/* Profile header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
          <User className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-blue-600">
            {captain.firstname} {captain.lastname}
          </h2>
          <p className="text-sm text-gray-500">{captain.email}</p>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logoutCaptain}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Logout
      </button>
    </div>
  )
}

export default CaptainProfile;
