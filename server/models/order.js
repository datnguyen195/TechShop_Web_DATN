const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var OrderSchema = new mongoose.Schema(
  {
    code: {
      type: String,
    },
    products: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        productVid: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        color: String,
        price: Number,
        types: String,
        thumb: String,
        title: String,
      },
    ],
    // status: {
    //   type: String,
    //   default: "Chờ xác nhận",
    //   enum: ["Chờ xác nhận", "Thành công", "Đã huỷ"],
    // },

    status: {
      type: Number,
      default: "0",
      enum: ["0", "1", "2"],
    },
    total: Number,
    coupon: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
    },
    orderBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    address: [
      {
        name: String,
        street: String,
        district: String,
        city: String,
        ward: String,
        phone: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Order", OrderSchema);
