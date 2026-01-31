let ioInstance = null;

// Map<identity, Set<socketId>>
const onlineUsers = new Map();

function setupSocket(io) {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("New socket:", socket.id);

  socket.on("register", ({ id, role }) => {
  console.log("Register payload:", { id, role });

  if (!id || !role) {
    console.warn("Invalid register payload");
    return;
  }

  const identity = `${role}:${id}`;

  if (socket.identity === identity) return;

  socket.identity = identity;

  if (!onlineUsers.has(identity)) {
    onlineUsers.set(identity, new Set());
  }

  onlineUsers.get(identity).add(socket.id);
  socket.join(identity);

  console.log(`Registered ${identity} → ${socket.id}`);
  logOnlineUsers();
});

    socket.on("joinRide", (rideId) => {
      if (!rideId) return;
      socket.join(`ride:${rideId}`);
    });

    socket.on("disconnect", () => {
      const identity = socket.identity;

      if (identity && onlineUsers.has(identity)) {
        const sockets = onlineUsers.get(identity);
        sockets.delete(socket.id);

        if (sockets.size === 0) {
          onlineUsers.delete(identity);
        }
      }

      console.log("Disconnected:", socket.id);
      logOnlineUsers();
    });
  });
}

function sendToUser(userId, event, payload) {
  return emitToIdentity(`user:${userId}`, event, payload);
}

function sendToCaptain(captainId, event, payload) {
  return emitToIdentity(`captain:${captainId}`, event, payload);
}

function emitToIdentity(identity, event, payload) {
  if (!ioInstance) return false;

  ioInstance.to(identity).emit(event, payload);
  console.log(`${event} → ${identity}`);
  return true;
}

function sendToRideRoom(rideId, event, payload) {
  if (!ioInstance) return false;
  ioInstance.to(`ride:${rideId}`).emit(event, payload);
  return true;
}

function logOnlineUsers() {
  console.log(
    "Online:",
    Object.fromEntries(
      [...onlineUsers].map(([k, v]) => [k, [...v]])
    )
  );
}

 module.exports = {
  setupSocket,
  sendToUser,
  sendToCaptain,
  sendToRideRoom
};