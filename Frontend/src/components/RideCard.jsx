import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, User, Phone } from "lucide-react";

function RideCard({ ride, type }) {
  const navigate = useNavigate();
  const [showing, setShowing] = useState(false);

  const handleClick = () => {
    if (ride.status === "requested") {
      navigate("/rideTracking", { state: { rideId: ride._id } });
    } else {
      setShowing(true);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white h-[180px] overflow-y-auto border border-gray-200 rounded-xl p-4 mb-4 shadow-md hover:shadow-lg cursor-pointer transition"
    >
      {/* Top Info: Pickup → Destination */}
      <h3 className="text-blue-600 font-semibold text-md truncate">
        {ride?.pickup?.address} → {ride?.destination?.address}
      </h3>

      {/* Ride Meta */}
      <div className="flex justify-between items-center mt-2">
        <div>
          <p className="text-gray-600 text-sm">
            {new Date(ride?.createdAt).toLocaleString()}
          </p>
          <p className="text-gray-800 font-medium mt-1">
            Fare: ₹{ride?.fare}
          </p>
        </div>

        {/* Ride Status */}
        <span
          className={`px-3 mr-2 w-24 py-1 text-sm text-center rounded-full capitalize ${
            ride.status === "completed"
              ? "bg-green-100 text-green-600"
              : ride.status === "ongoing"
              ? "bg-yellow-100 text-yellow-600"
              : ride.status === "requested"
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {ride.status}
        </span>
      </div>

      {/* Expanded Details */}
      {showing && (
        <div className="fixed inset-0 z-50 flex justify-center items-start bg-black bg-opacity-40 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl w-[95%] md:w-[700px] mt-10 p-6 relative">
            {/* Back Button */}
            <ArrowLeft
              className="w-6 h-6 text-blue-600 absolute top-4 left-4 cursor-pointer"
              onClick={() => {setShowing(true), navigate("/UserHome")}}
            />

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Ride Details
            </h2>

            {/* Captain Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4 flex items-center space-x-4">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {ride?.captain?.fullname?.firstname}{" "}
                  {ride?.captain?.fullname?.lastname}
                </h3>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">
                    {ride?.captain?.rideStats?.rating ?? "N/A"}
                  </span>
                  <span className="text-sm text-gray-400">
                    ({ride?.captain?.rideStats?.totalRides ?? 0} trips)
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Vehicle: {ride?.captain?.vehicle?.name ?? "N/A"} (
                  {ride?.captain?.vehicle?.plate ?? "N/A"})
                </p>
              </div>
              <button className="p-2 bg-green-100 rounded-full hover:bg-green-200">
                <Phone className="w-5 h-5 text-green-600" />
              </button>
            </div>

            {/* User Info */}
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Passenger</h4>
              <p className="text-sm text-gray-700">
                {ride?.user?.fullname?.firstname}{" "}
                {ride?.user?.fullname?.lastname}
              </p>
              <p className="text-sm text-gray-500">{ride?.user?.email}</p>
            </div>

            {/* Trip Info */}
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-3">
                Trip Information
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Pickup</p>
                  <p className="font-medium">{ride?.pickup?.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-medium">{ride?.destination?.address}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Distance: {ride?.distance} km</span>
                  <span>Duration: {ride?.duration} min</span>
                  <span>OTP: {ride?.otp}</span>
                </div>
              </div>
            </div>

            {/* Fare Info */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4 text-center">
              <span className="text-lg font-semibold text-gray-800">
                Total Fare
              </span>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                ₹{ride?.fare}
              </p>
              <p className="text-sm text-gray-500">Including taxes & fees</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RideCard;
