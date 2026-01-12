let ioInstance = null;

const onlineUsers = new Map();

function setupSocket(io) {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("🟢 New socket:", socket.id);

  
    socket.on("register", (userId) => {
      if (!userId) return;

      const uid = String(userId).trim();
      socket.userId = uid;

      if (!onlineUsers.has(uid)) {
        onlineUsers.set(uid, new Set());
      }

      onlineUsers.get(uid).add(socket.id);
      socket.join(`user:${uid}`);

      console.log(`✅ Registered ${uid} → ${socket.id}`);
      logOnlineUsers();
    });

    socket.on("joinRide", (rideId) => {
      if (!rideId) return;
      socket.join(`ride:${rideId}`);
      console.log(`🚕 ${socket.id} joined ride:${rideId}`);
    });

    socket.on("disconnect", () => {
      const uid = socket.userId;

      if (uid && onlineUsers.has(uid)) {
        const sockets = onlineUsers.get(uid);
        sockets.delete(socket.id);

        if (sockets.size === 0) {
          onlineUsers.delete(uid);
        }
      }

      console.log("🔴 Disconnected:", socket.id);
      logOnlineUsers();
    });
  });
}

function sendToUser(userId, event, payload) {
  if (!ioInstance) return false;

  const uid = String(userId).trim();
  ioInstance.to(`user:${uid}`).emit(event, payload);

  console.log(`📤 ${event} → user:${uid}`);
  return true;
}

function sendToRideRoom(rideId, event, payload) {
  if (!ioInstance) return false;
  ioInstance.to(`ride:${rideId}`).emit(event, payload);
  return true;
}

function sendNotification(receiverId, notification) {
  if (!receiverId) return false;
  return sendToUser(receiverId, "receiveNotification", notification);
}

function logOnlineUsers() {
  console.log(
    "📡 Online:",
    Object.fromEntries(
      [...onlineUsers].map(([k, v]) => [k, [...v]])
    )
  );
}

module.exports = {
  setupSocket,
  sendToUser,
  sendToRideRoom,
  sendNotification
};
