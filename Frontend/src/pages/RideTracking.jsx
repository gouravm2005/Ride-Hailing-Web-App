import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar2 from "../components/Navbar2";
import MapComponent from "../components/MapComponent";
import { Phone, Star, Car } from "lucide-react";

const RideTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rideId } = location.state || {};

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rideId) return;

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/ride/getUserRide/${rideId}`)
      .then((res) => {
        setRide(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching ride:", err);
        setLoading(false);
      });
  }, [rideId]);

  if (loading) return <div className="p-6 text-center">Loading ride...</div>;
  if (!ride) return <div className="p-6 text-center">Ride not found</div>;

  const { user, captain, pickup, destination, fare, otp } = ride;

  return (
    <div className="w-screen h-screen flex flex-col">
      <Navbar2 />

      {/* ✅ Responsive Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Map Section */}
        <div className="h-1/2 md:h-full md:w-[70%] relative">
          {pickup?.lat && destination?.lat ? (
            <MapComponent pickuplnglat={pickup} destinationlnglat={destination} />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <p className="text-gray-500">Loading map...</p>
            </div>
          )}
        </div>

        {/* Ride Info Section */}
        <div className="h-1/2 md:h-full md:w-[30%] bg-white shadow-lg rounded-t-2xl md:rounded-none md:border-l border-gray-200 overflow-y-auto">
          <div className="p-5 space-y-6">

            {/* Captain Info */}
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-lg">
                  {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <h2 className="text-sm text-gray-700">
                    {ride?.captain?.rideStats?.rating ?? "N/A"}
                  </h2>
                  <span className="text-sm text-gray-400">
                    ({captain?.rideStats?.totalRides || 0} trips)
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 flex items-center">
                  <Car className="w-4 h-4 mr-2 text-gray-500" />
                  {captain?.vehicle?.name || "Vehicle Info Unavailable"}
                </p>
              </div>

              {/* Contact Button */}
              <button className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full text-white shadow-md transition">
                <Phone className="w-5 h-5" />
              </button>
            </div>

            {/* Vehicle Info */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <h5 className="font-semibold text-gray-800 mb-3">
                Vehicle Information
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">
                    {captain?.vehicle?.name || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Number:</span>
                  <span className="font-medium">
                    {captain?.vehicle?.plate || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{ride.distance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Arrival Time:</span>
                  <span className="font-medium">{ride.duration}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 bg-gray-50">
            <div className="flex flex-col justify-between">
             <span className="text-md font-semi-bold text-gray-800">
                pickup point
                </span>
                <span className="text-md font-normal text-blue-600">{ride.pickup.address}</span>
            </div>
              <div className="flex flex-col justify-between">
             <span className="text-md font-semi-bold text-gray-800">
                destination point
                </span>
                <span className="text-md font-normal text-blue-600">{ride.destination.address}</span>
            </div>
            </div>

            {/* Fare + OTP */}
            <div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">
                  Total Fare
                </span>
                <span className="text-2xl font-bold text-blue-600">₹{fare}</span>
              </div>
              <p className="text-sm text-gray-500">
                Including taxes and fees
              </p>
              <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
                <p className="font-medium text-gray-800">
                  OTP to Start Ride:{" "}
                  <span className="text-blue-600 font-semibold">{otp}</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => navigate("/UserHome")}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white text-lg font-semibold rounded-lg shadow transition"
              >
                Cancel
              </button>
              <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-lg shadow transition">
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideTracking;
