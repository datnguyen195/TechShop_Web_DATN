const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { type } = require("os");

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  ward: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [0, 1],
      default: 1,
    },
    cart: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        productVid: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
        color: String,
        thumb: String,
        title: String,
      },
    ],
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
    wishlist: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
    registerToken: {
      type: String,
    },
    gender: {
      type: String,
      enum: [0, 1, 2],
      default: 0,
    },
    avatar: {
      type: String,
      default: "https://cdn-i.vtcnews.vn/upload/2023/08/03/1-13125665.jpg",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods = {
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
  createPasswordChangedToken: function () {
    const resetToken = crypto.randomBytes(3).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    return resetToken;
  },
};

//Export the model
module.exports = mongoose.model("User", userSchema);
