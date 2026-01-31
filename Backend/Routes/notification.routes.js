const express = require("express");
const router = express.Router();
const { getNotifications, markAsRead } = require("../controllers/notificationController.js");

router.get("/:receiverId", getNotifications);
router.put("/read/:id", markAsRead);

module.exports = router;