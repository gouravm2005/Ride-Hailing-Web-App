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
      "requested",      
      "accepted",       
      "RideRejected",      
      "RideStarted",        
      "RideCompleted",     
      "RideCancelled",      
      "rideRequested", 
      "rideAccepted"    
    ],
    required: true
  },

  title: { type: String },    
  message: { type: String },    
  
  isRead: { type: Boolean, default: false }, 

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
