import { useState, useEffect, useContext } from "react";
import Navbar1 from "../components/Navbar1";
import MapComponent from "../components/MapComponent";
import { CheckCircle, XCircle, Route } from "lucide-react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { NotificationContext } from "../components/SocketProvider";

export default function CaptainHome() {
  const [isOnline, setIsOnline] = useState(false);
  const [dailyStats, setDailyStats] = useState({ distance: 0, accepted: 0, rejected: 0 });
  const { notifications, socket } = useContext(NotificationContext);

  const location = useLocation();
  const { captainId } = location.state || {};

  useEffect(() => {
    if (!captainId) return;
    console.log("Fetched captain ID:", captainId);

    const captainAuth = JSON.parse(sessionStorage.getItem("captainAuth"));
    if (!captainAuth || !captainAuth.token) return;
    async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/captain/getCaptainDetail/${captainId}`, {
          headers: {
            Authorization: `Bearer ${captainAuth.token}`,
          },
        });
        console.log("Captain detail response:", res.data);
        const cap = res.data;
        const ds = cap.dailyStats || {};
        setDailyStats({
          distance: ds.distanceCovered || 0,
          accepted: ds.ridesAccepted || 0,
          rejected: ds.ridesRejected || 0,
        });
      } catch (err) {
        console.error("Failed to fetch captain detail:", err?.response?.data || err.message);
      }
    }
  }, [captainId]);

  const updateCaptainStatus = async (online) => {
    try {
      if (!captainId) return;

      const captainAuth = JSON.parse(sessionStorage.getItem("captainAuth"));
      if (!captainAuth || !captainAuth.token) return;

      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captain/update-captain-status`, {
        captainId,
        status: online ? "active" : "inactive"
      },
        {
          headers: {
            Authorization: `Bearer ${captainAuth.token}`,
          },
        });
      console.log("Captain status updated to:", online ? "active" : "inactive");
    } catch (err) {
      console.error("Failed to update captain status:", err?.response?.data || err.message);
    }
  }

  return (
    <div className="min-h-screen relative bg-gray-50 p-2 flex flex-col gap-6">
      <Navbar1 />
      <div className="flex items-center justify-between">
        <h1 className="text-xl pl-2 font-semibold">Captain Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{isOnline ? "Online" : "Offline"}</span>
          
          <button
            onClick={() => {
              setIsOnline(prev => {
                const newStatus = !prev;

                updateCaptainStatus(newStatus);

                return newStatus;
              });
            }}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${isOnline ? "bg-blue-600" : "bg-gray-400"
              }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isOnline ? "translate-x-6" : "translate-x-0"
                }`}
            ></div>
          </button>
        </div>
      </div>


      {/* Daily Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl shadow-md bg-white p-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-sm font-medium">Distance Covered</h2>
            <Route className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{dailyStats.distance} km</p>
        </div>

        <div className="rounded-2xl shadow-md bg-white p-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-sm font-medium">Rides Accepted</h2>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{dailyStats.accepted}</p>
        </div>

        <div className="rounded-2xl shadow-md bg-white p-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-sm font-medium">Rides Rejected</h2>
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold">{dailyStats.rejected}</p>
        </div>
      </div>

      {/* Map Box */}

      <div className="w-full h-[600px] z-0 aspect-square bg-gray-200 rounded-xl flex items-center justify-center relative">
        <MapComponent />
      </div>

    </div>
  );
}
