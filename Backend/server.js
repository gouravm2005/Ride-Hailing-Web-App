const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
dotenv.config();

const app = require("./app");
const { setupSocket } = require("./Socket/socketManager");

const server = http.createServer(app); 
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middlewares
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

if (process.env.NODE_ENV === "production") {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://Appdomain.com"],
      },
    })
  );
}

setupSocket(io);

app.get("/", (req, res) => {
  res.send("Server is running");
});


const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
