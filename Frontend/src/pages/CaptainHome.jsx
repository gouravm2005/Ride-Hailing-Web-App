import { useState, useEffect, useContext } from "react";
import Navbar1 from "../components/Navbar1";
import MapComponent from "../components/MapComponent";
import { CheckCircle, XCircle, Route } from "lucide-react";
import axios from "axios";
import NotificationPopup from "../components/NotificationPopup";
import { NotificationContext } from "../components/SocketProvider";

export default function CaptainHome() {
  const [isOnline, setIsOnline] = useState(false);
  const [dailyStats, setDailyStats] = useState({ distance: 0, accepted: 0, rejected: 0 });
  const { notifications, socket } = useContext(NotificationContext);

  useEffect(() => {
    // initialize online state from stored captain (if any)
    const storedCaptain = JSON.parse(localStorage.getItem("captain")) || {};
    const storedAuth = JSON.parse(localStorage.getItem("captainAuth")) || {};
    const status = storedCaptain.status || storedAuth.status || null;
    setIsOnline(status === "active");

    const id = storedCaptain._id || storedAuth.captain?._id || storedAuth.id || null;
    if (!id) return;

    // fetch captain details to populate daily stats
    (async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/captain/getCaptainDetail/${id}`);
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
    })();
  }, []);

  return (
    <div className="min-h-screen relative bg-gray-50 p-2 flex flex-col gap-6">
      <Navbar1/>
      <div className="flex items-center justify-between">
        <h1 className="text-xl pl-2 font-semibold">Captain Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{isOnline ? "Online" : "Offline"}</span>
          {/* Simple toggle switch - update local state and store; backend update endpoint not present */}
          <button
            onClick={() => {
              const next = !isOnline;
              setIsOnline(next);
              // persist locally so refresh keeps toggle state
              const storedCaptain = JSON.parse(localStorage.getItem("captain")) || {};
              storedCaptain.status = next ? "active" : "inactive";
              localStorage.setItem("captain", JSON.stringify(storedCaptain));
              // optionally emit an event to server to mark online
              try {
                socket && socket.emit("status", { status: storedCaptain.status, id: storedCaptain._id });
              } catch (e) {}
            }}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
              isOnline ? "bg-blue-600" : "bg-gray-400"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isOnline ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Notification popup (uses latest notification from context) */}
      {notifications && notifications.length > 0 && <div className="fixed top-20 right-6 z-50"><NotificationPopup /></div>}

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
     
        <div className="w-full h-[600px] aspect-square bg-gray-200 rounded-xl flex items-center justify-center">
        <MapComponent/>
        </div>

    </div>
  );
}


