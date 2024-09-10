const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    thumb: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
    },
    types: {
      type: Array,
    },
    ratings: [
      {
        star: { type: Number },
        postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
        productId: { type: String },
        comment: { type: String },
        avatar: { type: String },
        name: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    totalRatings: {
      type: Number,
      default: 0,
    },
    varriants: [
      {
        sku: String,
        color: String,
        price: Number,
        thumb: String,
        quantity: Number,
        images: Array,
        title: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
