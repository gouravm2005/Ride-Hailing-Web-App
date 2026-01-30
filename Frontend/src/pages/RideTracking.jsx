import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar2 from "../components/Navbar2";
import Navbar1 from "../components/Navbar1";
import MapComponent from "../components/MapComponent";
import { Phone, Star, Car } from "lucide-react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BASE_URL, {
  transports: ["websocket"],
});

const RideTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rideId, type } = location.state || {};

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [captainId, setCaptainId] = useState("");
  const [captainInfo, setCaptainInfo] = useState({})
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [startingRide, setStartingRide] = useState(false);
  const [captainPos, setCaptainPos] = useState(null);

  // Detect role
  useEffect(() => {
   if(!captainId) return;

   axios.get(`${import.meta.env.VITE_BASE_URL}/api/captain/getCaptainDetail/${captainId}`)
      .then((res) => {
        setCaptainInfo(res.data);
      })
      .catch((err) => {
        console.error("Error fetching captain details:", err);
      });
  }, [captainId]);

  useEffect(() => {
    if (!rideId || !type) return;

    setRole(type);

    const interval = setInterval(() => {

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/ride/getUserRide/${rideId}`)
      .then((res) => {
        setRide(res.data);
        setCaptainId(res.data.captain?._id || "");
        if(res.data.status === "requested")
        setLoading(true);
        else 
          setLoading(false);
        })
      .catch((err) => {
        console.error("Error fetching ride:", err);
        setLoading(false);
      });
    }, 3000);
       
  return () => clearInterval(interval);
  }, [rideId]);


  useEffect(() => {
    if (!rideId || !ride) return;

    if (ride.status !== "started") {
      setCaptainPos(ride.pickup);
      return;
    }

    socket.emit("joinRide", rideId);

    const handleUpdate = (data) => {
      setCaptainPos({ lat: data.lat, lng: data.lng });
    };
    socket.on("captainLocationUpdate", handleUpdate);

    return () => {
      socket.off("captainLocationUpdate", handleUpdate);
    };
  }, [rideId, ride]);

  useEffect(() => {
    if (!ride) return;

    const captainAuth = JSON.parse(sessionStorage.getItem("captainAuth"));
    if (captainAuth?.role) {
      setRole(captainAuth.role);
    }

    if (ride.status === "completed") {
      axios.post(`${import.meta.env.VITE_BASE_URL}/api/ride/completeRide/${ride._id}`,
        {captainId: captainId},
      );
      if(role === "user")
      navigate("/Payment", { state: { rideId: ride._id, captainId: captainId } });
      else
        navigate("/CaptainHome");
    }
  }, [rideId, ride]);

  const handleVerifyOtp = async () => {
    if (!enteredOtp || !ride) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      const headers = {};
      const captainAuth = JSON.parse(sessionStorage.getItem("captainAuth")) || {};
      const token =
        captainAuth.token ||
        captainAuth?.data?.token ||
        captainAuth?.captain?.token ||
        sessionStorage.getItem("captainToken");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ride/verifyOtp/${ride._id}`,
        { otp: enteredOtp },
        { headers }
      );

      setOtpVerified(true);
      toast.success("OTP verified! You can now start the ride.");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleStartRide = async () => {
    if (!ride) return;
    setStartingRide(true);

    try {
      const headers = {};
      const captainAuth = JSON.parse(sessionStorage.getItem("captainAuth")) || {};
      const token =
        captainAuth.token ||
        captainAuth?.data?.token ||
        captainAuth?.captain?.token ||
        sessionStorage.getItem("captainToken");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ride/startRide/${ride._id}`,
        {captainId: captainId},
        { headers }
      );

      toast.success("Ride started!");
      setRide((prev) => ({ ...prev, status: "started" }));
      setStartingRide(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to start ride");
      setStartingRide(false);
    }
  };

  if (loading) return <div className="p-6 text-center">
    <p className="text-gray-700">Ride Requested, Wait for captain's response</p>
     <span><button onClick={() => navigate("/UserRides")} className="bg-blue-500 text-white px-4 py-2 rounded-md">My Rides</button> <button onClick={() => navigate("/UserHome")} className="bg-blue-500 text-white px-4 py-2 rounded-md">Home</button></span>
  </div>;
  if (!ride) return <div className="p-6 text-center">Ride not found</div>;

  const { user, captain, pickup, destination, fare, otp, status } = ride;

  return (
    <div className="w-screen h-screen flex flex-col">
      {role === "user" ? <Navbar2 /> : <Navbar1 />}

      {/*Responsive Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Map Section */}

        <div className="h-1/2 z-0 md:h-full md:w-[70%] ">
          {pickup?.lat && destination?.lat ? (
            <MapComponent
              pickuplnglat={pickup}
              destinationlnglat={destination}
              captainPos={captainPos}
              rideStatus={ride.status}
            />
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
                    {captainInfo?.rideStats?.rating ?? "N/A"}
                  </h2>
                  <span className="text-sm text-gray-400">
                    ({captainInfo?.rideStats?.totalRides || 0} trips)
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 flex items-center">
                  <Car className="w-4 h-4 mr-2 text-gray-500" />
                  {captainInfo?.vehicle?.name || "Vehicle Info Unavailable"}
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
                    {captainInfo?.vehicle?.name || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Number:</span>
                  <span className="font-medium">
                    {captainInfo?.vehicle?.plate || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{ride.distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Arrival Time:</span>
                  <span className="font-medium">{ride.duration} min</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 border border-gray-200 bg-gray-50">
              <div className="flex flex-col justify-between">
                <span className="text-lg pb-2 font-semi-bold text-gray-800">
                  pickup point :
                </span>
                <span className="text-md font-normal text-blue-600">
                  {ride.pickup.address}
                </span>
              </div>
              <div className="flex flex-col justify-between">
                <span className="text-lg pb-2 font-semi-bold text-gray-800">
                  destination point :
                </span>
                <span className="text-md font-normal text-blue-600">
                  {ride.destination.address}
                </span>
              </div>
            </div>

            {/* Fare */}
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
            </div>

            {/* Role-based OTP & Actions */}
            {role === "user" && (
              <div>
                {status !== "started" && (
              <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
                <p className="font-medium text-gray-800">
                  OTP to Share with Captain:{" "}
                  <span className="text-blue-600 font-semibold">{otp}</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Share this OTP with the captain to start the ride
                </p>
              </div>
              )}
              </div>
            )}

            {role === "captain" && (
              <div>
                {status !== "started" && !otpVerified && (
                  <div className="p-3 bg-blue-100 border border-blue-300 rounded-lg">
                    <label className="block font-medium text-gray-800 mb-2">
                      Enter OTP from User:
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 4-digit OTP"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.slice(0, 4))}
                      maxLength="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest"
                    />
                    <button
                      onClick={handleVerifyOtp}
                      className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}

                {otpVerified && status !== "started" && (
                  <div className="p-3 bg-green-100 border border-green-300 rounded-lg text-center">
                    <p className="font-medium text-green-700 mb-3">
                      OTP Verified
                    </p>
                    <button
                      onClick={handleStartRide}
                      disabled={startingRide}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-lg font-semibold rounded-lg shadow transition"
                    >
                      {startingRide ? "Starting..." : "Start Ride"}
                    </button>
                  </div>
                )}
  
                {status === "started" && (
                  <div className="p-3 bg-green-100 border border-green-300 rounded-lg text-center">
                    <p className="font-medium text-green-700">
                      Ride In Progress
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {role === "user" && (
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => navigate("/UserRides")}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold rounded-lg shadow transition"
                >
                  My Rides 
                </button>
                <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold rounded-lg shadow transition">
                  Contact
                </button>
              </div>
            )}
               {role === "captain" && (
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => navigate("/CaptainRides")}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold rounded-lg shadow transition"
                >
                  Rides 
                </button>
                <button onClick={() => navigate("/CaptainHome")} className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold rounded-lg shadow transition">
                  Home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideTracking;