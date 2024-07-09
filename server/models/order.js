const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var OrderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Types.ObjectId, ref: "Product" },
      count: Number,
      color: String,
    },
  ],
  status: {
    type: String,
    default: "Proccessing",
    enum: ["Cancelled", "Proccessing", "Succeed"],
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
});
module.exports = mongoose.model("Order", OrderSchema);
