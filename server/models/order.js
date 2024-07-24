const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var OrderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Types.ObjectId, ref: "Product" },
      quantity: Number,
      color: String,
      price: Number,
      types: String,
      thumb: String,
      title: String,
    },
  ],
  status: {
    type: String,
    default: "Cancelled",
    enum: ["Cancelled", "Succeed"],
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
  address: {
    type: String,
  },
});
module.exports = mongoose.model("Order", OrderSchema);
