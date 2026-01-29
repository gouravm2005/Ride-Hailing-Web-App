// import { createContext, useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";

// export const NotificationContext = createContext(null);
// export const SocketContext = createContext(null);

// export default function SocketProvider({ children }) {
//   const socketRef = useRef(null);
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     const connectSocket = () => {
    
//       if (socketRef.current) return;

//       // Read auth safely
//       const userAuth = JSON.parse(localStorage.getItem("userAuth"));
//       const captainAuth = JSON.parse(localStorage.getItem("captainAuth"));
//       const user = JSON.parse(localStorage.getItem("user"));
//       const captain = JSON.parse(localStorage.getItem("captain"));

//       let identity = null;

//       if (userAuth?.role === "user" && user?._id) {
//         identity = { id: user._id, role: "user" };
//       }

//       if (captainAuth?.role === "captain" && captain?._id) {
//         identity = { id: captain._id, role: "captain" };
//       }

//       if (!identity) {
//         console.warn("No authenticated user/captain. Socket not started.");
//         return;
//       }

//       // Create socket
//       const socket = io("http://localhost:4000", {
//         transports: ["websocket"],
//         autoConnect: true
//       });

//       socketRef.current = socket;

//       socket.on("connect", () => {
//         console.log("Socket connected:", socket.id);

//         // Explicit registration
//         socket.emit("register", identity.id);
//       });

//       socket.on("receiveNotification", (data) => {
//         console.log("Notification received:", data);
//         setNotifications((prev) => [data, ...prev]);
//       });

//       socket.on("disconnect", () => {
//         console.log("Socket disconnected");
//       });
//     };

//     connectSocket();

//     // Listen for login / logout changes
//     window.addEventListener("auth-changed", connectSocket);

//     return () => {
//       window.removeEventListener("auth-changed", connectSocket);

//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }
//     };
//   }, []);

//   return (
//     <NotificationContext.Provider value={{ notifications, setNotifications }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// }

//------------------------------------------------------------------------------------
// import { createContext, useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";

// export const NotificationContext = createContext(null);
// export const SocketContext = createContext(null);

// export default function SocketProvider({ children }) {
//   const socketRef = useRef(null);
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     // 🔐 Read auth ONCE
//     const userAuth = JSON.parse(localStorage.getItem("userAuth"));
//     const captainAuth = JSON.parse(localStorage.getItem("captainAuth"));
//     const user = JSON.parse(localStorage.getItem("user"));
//     const captain = JSON.parse(localStorage.getItem("captain"));

//     let identity = null;
//     let token = null;

//     // ⚠️ MUTUALLY EXCLUSIVE
//     if (userAuth?.token && user?._id && !captainAuth?.token) {
//       identity = { id: user._id, role: "user" };
//       token = userAuth.token;
//     }

//     if (captainAuth?.token && captain?._id) {
//       identity = { id: captain._id, role: "captain" };
//       token = captainAuth.token;
//     }

//     if (!identity) {
//       console.warn("🚫 No valid auth → socket not started");
//       return;
//     }

//     // 🟢 Create socket ONCE
//     const socket = io(import.meta.env.VITE_SOCKET_URL, {
//       transports: ["websocket"],
//       auth: { token },
//       autoConnect: true,
//     });

//     socketRef.current = socket;

//     socket.on("connect", () => {
//       console.log("🟢 Socket connected:", socket.id);
//       socket.emit("register", identity); // { id, role }
//     });

//     socket.on("receiveNotification", (data) => {
//       console.log("🔔 Notification received:", data);
//       setNotifications((prev) => [data, ...prev]);
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("🔴 Socket disconnected:", reason);
//     });

//     socket.on("connect_error", (err) => {
//       console.error("❌ Socket connection error:", err.message);
//     });

//    return () => {
//   console.log("🧹 Cleaning up socket");

//   if (socketRef.current) {
//     if (socketRef.current.connected) {
//       socketRef.current.disconnect();
//     }
//     socketRef.current = null;
//   }
// };
//   }, []); // ✅ NO auth-changed, NO reconnect loop

//   return (
//     <SocketContext.Provider value={socketRef.current}>
//       <NotificationContext.Provider value={{ notifications, setNotifications }}>
//         {children}
//       </NotificationContext.Provider>
//     </SocketContext.Provider>
//   );
// }

// ---------------------------------------------------------------------------
import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const NotificationContext = createContext(null);

export default function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // 🛑 PREVENT MULTIPLE SOCKETS
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
      console.warn("🚫 No identity, socket not started");
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
      console.log("🟢 Socket connected:", socket.id);
      socket.emit("register", {
      id: identity.id,
      role: identity.role,
      });
    });

    socket.on("receiveNotification", (data) => {
      console.log("🔔 Notification received:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    // 🔴 CLEANUP ONLY ON TAB CLOSE
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
