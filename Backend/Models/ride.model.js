const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  captain: { type: mongoose.Schema.Types.ObjectId, ref: "Captain", required: true },
  pickup: {
    address: String,
    lat: Number,
    lng: Number,
  },
  destination: {
    address: String,
    lat: Number,
    lng: Number,
  },
  status: {
    type: String,
    enum: ["requested", "accepted", "confirmed", "ongoing", "completed", "cancelled"],
    default: "requested",
  },
  ridetype : {type: String, required: true},
  fare: { type: Number, default: 0 },
  distance: { type: Number, default: 0 }, // km
  duration: { type: Number, default: 0 }, // minutes
  otp: { type: String }, // for ride start validation
  startedAt: Date,
  completedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Ride", rideSchema);
