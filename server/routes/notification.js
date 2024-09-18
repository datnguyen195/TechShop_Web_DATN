const express = require("express");
const router = express.Router();
const socket = require("../middlewares/socketio");
const Notification = require("../models/notification");

router.post("/send-notification", async (req, res) => {
  const { title, message, imageUrl } = req.body;
  const notification = { title, message, imageUrl };

  try {
    // Send notification via socket
    socket.sendNotification(notification);

    // Save the notification in the database
    const newNotification = new Notification(notification);
    await newNotification.save();

    res
      .status(200)
      .json({ success: true, message: "Notification sent and saved" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error sending notification", error });
  }
});

router.get("/notifications", async (req, res) => {
  try {
    // Lấy danh sách thông báo từ cơ sở dữ liệu, sắp xếp theo thời gian tạo mới nhất
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error retrieving notifications",
        error,
      });
  }
});

module.exports = router;
