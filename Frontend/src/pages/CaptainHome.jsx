import { useState } from "react";
import Navbar1 from "../components/Navbar1";
import { MapPin, CheckCircle, XCircle, Route } from "lucide-react";

export default function CaptainHome() {
  const [isOnline, setIsOnline] = useState(false);

  const dailyStats = {
    distance: 24.5, // km
    accepted: 5,
    rejected: 2,
  };

  return (
    <div className="min-h-screen relative bg-gray-50 p-2 flex flex-col gap-6">
      <Navbar1/>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Captain Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {isOnline ? "Online" : "Offline"}
          </span>
          {/* Simple toggle switch */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
              isOnline ? "bg-green-500" : "bg-gray-400"
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
      <div className="rounded-2xl shadow-md bg-white flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md aspect-square bg-gray-200 rounded-xl flex items-center justify-center">
          <MapPin className="h-12 w-12 text-gray-600" />
        </div>
      </div>
    </div>
  );
}


