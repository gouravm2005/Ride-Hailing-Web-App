import React, { useContext, useMemo, useState } from "react";
import { NotificationContext } from "./SocketProvider";
import axios from "axios";
import { toast } from "react-toastify";

export default function NotificationPopup({ role }) {
  const { notifications, setNotifications } = useContext(NotificationContext);
  const [loading, setLoading] = useState(false);

  console.log("NotificationPopup:", { role, notifications });

  // Pick the latest relevant notification
  const latest = useMemo(() => {
    return notifications.find(
      (n) =>
        n.category === "action" &&
        n.receiverRole === role
    );
  }, [notifications, role]);

  if (!latest) return null;

  const getAuthHeader = () => {
    const auth =
      role === "captain"
        ? JSON.parse(sessionStorage.getItem("captainAuth"))
        : JSON.parse(sessionStorage.getItem("userAuth"));

    return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
  };

  const rideId = latest.rideId || latest.ride;

  const removeNotification = () => {
    setNotifications((prev) =>
      prev.filter((n) => n._id !== latest._id)
    );
  };

  const accept = async () => {
    if (!rideId) return;

    try {
      setLoading(true);

      if (role === "captain" && latest.type === "rideRequested") {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/ride/acceptRide/${rideId}`,
          {},
          { headers: getAuthHeader() }
        );
        toast.success("Ride accepted");
      }

      if (role === "user" && latest.type === "rideAccepted") {
        // This should later call confirmRide API
        toast.success("Ride confirmed");
      }

      removeNotification();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const reject = async () => {
    if (!rideId) return;

    try {
      setLoading(true);

      if (role === "captain" && latest.type === "rideRequested") {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/ride/rejectRide/${rideId}`,
          {},
          { headers: getAuthHeader() }
        );
        toast.info("Ride rejected");
      }

      if (role === "user" && latest.type === "rideAccepted") {
        // This should later call cancelRide API
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/ride/cancelRide/${rideId}`, {}, { headers: getAuthHeader() });
        toast.info("Ride cancelled");
      }

      removeNotification();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-20 right-5 z-50 max-w-sm">
      <div className="bg-white shadow-xl rounded-lg p-4 border">
        <h4 className="font-semibold">{latest.title}</h4>
        <p className="text-sm text-gray-600">{latest.message}</p>

        <div className="mt-3 flex gap-2">
          <button
            disabled={loading}
            onClick={accept}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            {role === "user" ? "Confirm" : "Accept"}
          </button>

          <button
            disabled={loading}
            onClick={reject}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            {role === "user" ? "Cancel" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}
