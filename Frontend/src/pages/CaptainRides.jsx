import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import RideCard from "../components/RideCard";
import Navbar1 from "../components/Navbar1";
import { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";

function CaptainRides() {
  const [rides, setRides] = useState([]);
  const navigate = useNavigate();
  const { captain, setCaptain } = useContext(CaptainDataContext);

  useEffect(() => {
    const fetchRides = async () => {
      const auth = JSON.parse(localStorage.getItem("captainAuth"));
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/ride/getAllCaptainRides`,
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
    <div className="w-screen h-screen bg-gray-50">
      <Navbar1 />
      <div className="p-4 flex items-center">
        <ArrowLeft
          className="w-6 h-6 text-blue-600 cursor-pointer"
          onClick={() => navigate("/CaptainHome")}
        />
        <h2 className="ml-4 text-xl font-semibold text-blue-600">
          Captain Rides
        </h2>
      </div>

      <div className="p-4 grid gap-4">
        {rides.map((ride) => (
          <RideCard key={ride._id} ride={ride} type="captain" />
        ))}
      </div>
    </div>
  );
}

export default CaptainRides;
