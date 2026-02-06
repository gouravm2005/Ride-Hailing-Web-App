const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
dotenv.config();
const mongoose = require("mongoose");
const app = require("./app");
const { setupSocket } = require("./socket/socketManager.js");

const server = http.createServer(app); 
const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://ezride-f7vi.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middlewares
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ezride-f7vi.onrender.com"
  ],
  methods: ["GET", "POST"],
  credentials: true,
}));

if (process.env.NODE_ENV === "production") {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", 
          "https://ezride-f7vi.onrender.com",
          "https://ezride-backend.onrender.com",
          "wss://ezride-backend.onrender.com",
          "ws://localhost:4000"
        ],
      },
    })
  );
}

setupSocket(io);

app.get("/", (req, res) => {
  res.send("Server is running");
});

mongoose.set("bufferCommands", false);

const PORT = process.env.PORT || 5000;

/* 🔍 Mongoose connection events (DEBUGGING) */
mongoose.connection.on("connecting", () => {
  console.log("MongoDB connecting...");
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

/* 🚀 Start server ONLY after Mongo connects */
(async () => {
  try {
    await mongoose.connect(process.env.DB_Connect, {
      dbName: "uberClone", // change if needed
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB failed to connect:", err);
    process.exit(1);
  }
})();

