const express = require("express");
const router = express.Router();
const socket = require("../middlewares/socketio");

router.post("/send-notification", (req, res) => {
  const { title, message } = req.body;
  const notification = { title, message };

  socket.sendNotification(notification);
  res.status(200).json({ success: true, message: "Notification sent" });
});

module.exports = router;
