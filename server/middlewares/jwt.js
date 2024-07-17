const jwt = require("jsonwebtoken");

// s = giay, m = phut, h= giờ, d = ngày
const generateAccessToken = (uid, role) =>
  jwt.sign({ _id: uid, role }, process.env.JWT_SECRET, { expiresIn: "3d" });
const generateRefreshToken = (uid) =>
  jwt.sign({ _id: uid }, process.env.JWT_SECRET, { expiresIn: "7d" });
const checkOTP = (uid) =>
  jwt.sign({ _id: uid }, process.env.JWT_SECRET, { expiresIn: "15m" });

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  checkOTP,
};
