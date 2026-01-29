import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import RideCard from "../components/RideCard";
import Navbar2 from "../components/Navbar2";
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

function UserRides() {
  const [rides, setRides] = useState([]);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const auth = JSON.parse(sessionStorage.getItem("userAuth"));
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/ride/getAllUserRides`,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        setRides(res.data);
      } catch (err) {
        console.error("Error fetching rides:", err);
      }
    };
    fetchRides();
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-50 relative">
      <Navbar2 />
       <div className="p-8 flex items-center ">
        <ArrowLeft
          className="w-6 h-6 text-blue-600 cursor-pointer"
          onClick={() => navigate("/UserHome")}
        />
        <h2 className="ml-4 text-xl font-semibold text-blue-600">Your Rides</h2>
       </div>
        <div className="w-full h-full flex justify-center items-center">
       <div className="w-[90%] md:w-[60%] h-full bg-gray-100 p-4 flex flex-col gap-2">
        {rides.map((ride) => (
          <RideCard key={ride._id} ride={ride} type="user" />
        ))}
      </div>
    </div>  

  </div>
  );
}

export default UserRides;