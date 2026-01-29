import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "./SocketProvider";

function NotificationsPage({ role }) {
  // const { notifications, setNotifications } = useContext(NotificationContext);
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Detect role and ID synchronously on mount
  useEffect(() => {
    const detectRoleAndId = () => {
      try {
        const userAuth = JSON.parse(sessionStorage.getItem("userAuth"));
        const captainAuth = JSON.parse(sessionStorage.getItem("captainAuth"));
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        const storedCaptain = JSON.parse(sessionStorage.getItem("captain"));

        if (storedUser?._id || userAuth?.user?._id) {
          setUserId(storedUser?._id || userAuth?.user?._id);
        } else if (storedCaptain?._id || captainAuth?.captain?._id) {
          setUserId(storedCaptain?._id || captainAuth?.captain?._id);
        } else {
          console.warn("No role detected!");
        }
      } catch (e) {
        console.error("Error detecting role:", e);
      }
    };
    
    detectRoleAndId();
  }, []);

  // Fetch notifications when userId available
  useEffect(() => {
    if (!userId) return;
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/notification/${userId}`
        );
        const list = res.data?.notifications || res.data || [];
        setNotifications(list);
        console.log(`Fetched notifications for ${role}:`, list);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifications();
  }, [userId, role]);

  // Stable navigation handler
  const handleBack = () => {
    if (role === "captain") navigate("/CaptainHome");
    else if (role === "user") navigate("/UserHome");
    else navigate("/");
  };

  if (!role || !userId) {
    return (
      <div className="p-5 text-center">
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="text-2xl font-bold flex items-center gap-2 mb-5">
        <ArrowLeft
          className="w-6 h-6 text-blue-600 cursor-pointer"
          onClick={handleBack}
        />
        <h2>🔔 Notifications</h2>
      </div>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="flex flex-col items-center gap-3">
          {notifications.map((n) => (
            <li
              key={n._id}
              className="w-[90%] md:w-[60%] bg-gray-100 p-4 rounded-xl shadow-sm"
            >
              <strong className="block text-lg">{n.title}</strong>
              <p className="text-gray-700">{n.message}</p>
              <small className="text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationsPage;
