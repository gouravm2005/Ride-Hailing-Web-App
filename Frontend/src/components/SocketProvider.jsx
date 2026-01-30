import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

export const NotificationContext = createContext(null);

export default function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (socketRef.current) return;

    const userAuth = JSON.parse(sessionStorage.getItem("userAuth"));
    const captainAuth = JSON.parse(sessionStorage.getItem("captainAuth"));
    const user = JSON.parse(sessionStorage.getItem("user"));
    const captain = JSON.parse(sessionStorage.getItem("captain"));

    let identity = null;

    if (userAuth?.token && user?._id) {
      identity = { id: user._id, role: "user" };
    } else if (captainAuth?.token && captain?._id) {
      identity = { id: captain._id, role: "captain" };
    }

    if (!identity) {
      console.warn("No identity, socket not started");
      return;
    }

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
      auth: {
        token:
          identity.role === "user"
            ? userAuth?.token
            : captainAuth?.token,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("register", {
        id: identity.id,
        role: identity.role,
      });
    });

    socket.on("receiveNotification", async (data) => {
      setNotifications((prev) => [data, ...prev]);

      if (data.category === "info" && data.autoClose) {
        toast.info(data.message);

        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((n) => n._id !== data._id)
          );
        }, 4000);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
      }
      socketRef.current = null;
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}
