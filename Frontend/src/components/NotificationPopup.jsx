import React, { useContext, useState } from "react";
import { NotificationContext } from "./SocketProvider";
import axios from "axios";
import { toast } from "react-toastify";

export default function NotificationPopup() {
  const { notifications, setNotifications } = useContext(NotificationContext);
  const [loading, setLoading] = useState(false);

  const latest = notifications?.length ? notifications[0] : null;

  const getAuthHeader = () => {
    const captainAuth = JSON.parse(localStorage.getItem("captainAuth"));
    return captainAuth?.token
      ? { Authorization: `Bearer ${captainAuth.token}` }
      : {};
  };

  const accept = async () => {
    if (!latest?.ride) return;
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ride/acceptRide/${latest.ride}`,
        {},
        { headers: getAuthHeader() }
      );
      toast.success("Ride accepted");
      setNotifications(prev => prev.filter(n => n._id !== latest._id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Accept failed");
    } finally {
      setLoading(false);
    }
  };

  const reject = async () => {
    if (!latest?.ride) return;
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ride/rejectRide/${latest.ride}`,
        {},
        { headers: getAuthHeader() }
      );
      toast.info("Ride rejected");
      setNotifications(prev => prev.filter(n => n._id !== latest._id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Reject failed");
    } finally {
      setLoading(false);
    }
  };

  if (!latest) return null;

  return (
    <div className="fixed top-20 right-5 z-50 max-w-sm">
      <div className="bg-white shadow-lg rounded-lg p-4 border">
        <h4 className="font-semibold">{latest.title}</h4>
        <p className="text-sm text-gray-600">{latest.message}</p>

        <div className="mt-3 flex gap-2">
          <button
            disabled={loading}
            onClick={accept}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Accept
          </button>
          <button
            disabled={loading}
            onClick={reject}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

