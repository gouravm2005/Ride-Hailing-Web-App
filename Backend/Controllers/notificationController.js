const Notification = require("../Models/notification.model.js");

// Create & Send Notification
exports.createNotification = async (data, io) => {
  try {
    const notification = new Notification(data);
    await notification.save();

    // Emit real-time to receiver
    const { receiver, message } = notification;
    const { sendNotification } = require("../Socket/socketManager");
    sendNotification(io, receiver.toString(), notification);

    return notification;
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

// Get Notifications for a User or Captain
exports.getNotifications = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const notifications = await Notification.find({ receiver: receiverId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mark Notification as Read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};