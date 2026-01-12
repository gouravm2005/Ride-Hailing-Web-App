import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const NotificationContext = createContext(null);

export default function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const connectSocket = () => {
    
      if (socketRef.current) return;

      // Read auth safely
      const userAuth = JSON.parse(localStorage.getItem("userAuth"));
      const captainAuth = JSON.parse(localStorage.getItem("captainAuth"));
      const user = JSON.parse(localStorage.getItem("user"));
      const captain = JSON.parse(localStorage.getItem("captain"));

      let identity = null;

      if (userAuth?.role === "user" && user?._id) {
        identity = { id: user._id, role: "user" };
      }

      if (captainAuth?.role === "captain" && captain?._id) {
        identity = { id: captain._id, role: "captain" };
      }

      if (!identity) {
        console.warn("No authenticated user/captain. Socket not started.");
        return;
      }

      // Create socket
      const socket = io("http://localhost:4000", {
        transports: ["websocket"],
        autoConnect: true
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);

        // Explicit registration
        socket.emit("register", identity.id);
      });

      socket.on("receiveNotification", (data) => {
        console.log("Notification received:", data);
        setNotifications((prev) => [data, ...prev]);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    };

    connectSocket();

    // Listen for login / logout changes
    window.addEventListener("auth-changed", connectSocket);

    return () => {
      window.removeEventListener("auth-changed", connectSocket);

      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

