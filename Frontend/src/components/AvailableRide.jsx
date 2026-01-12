import { MapPin, Star, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

const AvailableRide = ({ onSelectCaptain, selectedRideType, panelOpen }) => {
  const [mockCaptains, setmockCaptains] = useState([]);
const { user, setUser } = useContext(UserDataContext);

  useEffect(() => {
    const userAuth = JSON.parse(localStorage.getItem("userAuth"));
    if (!userAuth || !userAuth.token)
      return;

    axios.get(`${import.meta.env.VITE_BASE_URL}/api/captain/getAvailableCaptain`)
      .then((res) => { setmockCaptains(res.data) })
      .catch(err => console.error("Error fetching captains:", err));
  }, [])

  return (
    <div className="bg-white pl-6 pr-6 mt-16 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Available Drivers</h3>
        <span className="text-sm text-gray-500">{mockCaptains.length} nearby</span>
      </div>

      <div className="space-y-4">
        {mockCaptains.map((captain) => (
          <div
            key={captain._id}
            onClick={() => onSelectCaptain && onSelectCaptain(captain._id)}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{captain.fullname.firstname} {captain.fullname.lastname}</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{captain.rideStats.rating}</span>
                    <span className="text-sm text-gray-400">({captain.rideStats.totalRides} rides)</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-gray-900">₹{captain.rideFeePerKm}<span className='text-sm text-gray-500 font-normal'> per km</span></p>
                <p className="text-sm text-gray-500 mt-1">{Math.floor(Math.random() * 10) + 1} min away</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className='ml-4'>{captain.vehicle.name}</span>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{Math.round(Math.random() * 10) / 10} km away</span>
              </div>
            </div>
          </div>
        ))}
      </div>
        {panelOpen && (
            <div className="w-8 h-8 absolute top-3 z-50">
              <button
                onClick={panelOpen}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-blue-600" />
              </button>
            </div>
          )}
    </div>
  );
};

export default AvailableRide;