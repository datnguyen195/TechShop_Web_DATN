const express = require("express");
const router = express.Router();
const socket = require("../middlewares/socketio");
const Notification = require("../models/notification");
const asyncHandler = require("express-async-handler");

const senNotifi = asyncHandler(async (req, res) => {
  const { title, message } = req.body;
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No image provided" });
  }
  const imageUrl = req.file.path; // Đường dẫn tệp trên Cloudinary
  const notification = { title, message, imageUrl };

  try {
    const newNotification = new Notification(notification);
    const notifi = await newNotification.save();

    if (notifi) socket.sendNotification(notifi);
    res
      .status(200)
      .json({ success: true, message: "Notification sent and saved" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error sending notification", error });
  }
});

const getNotifi = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving notifications",
      error,
    });
  }
});

const deleteNotifi = asyncHandler(async (req, res) => {
  try {
    const { nid } = req.params;
    console.log(nid); // Get the notification ID from the request parameters
    const notification = await Notification.findById(nid);

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    await notification.remove(); // Remove the notification from the database

    res
      .status(200)
      .json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error,
    });
  }
});

const getNotificationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new Error("thieu truong");

  const notification = await Notification.findById(id);

  // If notification is not found, throw an error
  if (!notification) {
    res.status(404);
    throw new Error("Không tìm thấy thông báo");
  }

  // Send the found notification as the response
  res.status(200).json(notification);
});

module.exports = {
  senNotifi,
  getNotifi,
  deleteNotifi,
  getNotificationById,
};
