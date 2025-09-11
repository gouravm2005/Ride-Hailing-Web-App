const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride" }, // Link to ride
  sender: { type: mongoose.Schema.Types.ObjectId, refPath: "senderModel" }, 
  senderModel: { type: String, enum: ["User", "Captain"] }, // who triggered notification
  receiver: { type: mongoose.Schema.Types.ObjectId, refPath: "receiverModel" },
  receiverModel: { type: String, enum: ["User", "Captain"] }, // who receives it

  type: {
    type: String,
    enum: [
      "requested",  // User requested ride
      "confirmed",  // User confirmed captain
      "accepted",   // Captain accepted ride
      "started",    // Ride started
      "completed",  // Ride completed
      "cancelled"   // Ride cancelled
    ],
    required: true
  },

  title: { type: String },      // e.g. "Ride Accepted"
  message: { type: String },    // e.g. "Captain John has accepted your ride"
  
  isRead: { type: Boolean, default: false }, // mark notification as read/unread

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
