const mongoose = require("mongoose");

const informationSchema = new mongoose.Schema({
  phoneNumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  avatar: String,
  fullname: String,
  gender: {
    type: String,
    enum: ["Nam", "Nữ", "Khác"],
  },
});

module.exports = mongoose.model("Information", informationSchema);
