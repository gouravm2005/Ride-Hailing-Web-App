const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride" }, 
  sender: { type: mongoose.Schema.Types.ObjectId, refPath: "senderModel" }, 
  senderModel: { type: String, enum: ["User", "Captain"] }, 
  receiver: { type: mongoose.Schema.Types.ObjectId, refPath: "receiverModel" },
  receiverModel: { type: String, enum: ["User", "Captain"] }, 

  type: {
    type: String,
    enum: [
      "requested",  // User requested ride
      "accepted",   // Captain accepted ride
      "rejected",   // Captain rejected ride 
      "started",    // Ride started
      "completed",  // Ride completed
      "cancelled"   // Ride cancelled
    ],
    required: true
  },

  title: { type: String },    
  message: { type: String },    
  
  isRead: { type: Boolean, default: false }, // mark notification as read/unread

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
