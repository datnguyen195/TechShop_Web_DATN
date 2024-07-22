const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { products, total, address } = req.body;
  if (address) {
    await User.findByIdAndUpdate(_id, { address, cart: [] });
  }
  const data = { products, total, postedBy: _id };
  const rs = await Order.create(data);

  try {
    for (let product of products) {
      const { productId, quantity } = product;
      const foundProduct = await Product.findById(productId);

      if (foundProduct) {
        foundProduct.quantity -= quantity;
        await foundProduct.save();
      } else {
        return res.status(404).json({
          success: false,
          error: `Không tìm thấy sản phẩm với ID ${productId}`,
        });
      }
    }
    return res.status.json({
      success: true,
      rs: "Thành công ",
      order: rs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Đã xảy ra lỗi khi cập nhật số lượng sản phẩm.",
    });
  }
});

const createOneOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId, quantity, total, address } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, error: "Không tìm thấy sản phẩm." });
  }
  const orderData = {
    products: [{ product: productId, quantity }],
    total,
    postedBy: _id,
  };
  const newOrder = await Order.create(orderData);
  if (!newOrder) {
    return res
      .status(500)
      .json({ success: false, error: "Đã xảy ra lỗi khi tạo đơn hàng." });
  }
  product.quantity -= quantity;
  await product.save();
  return res.json({
    success: rs ? true : false,
    rs: rs ? rs : "Xảy ra lỗi ",
    newOrder,
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status) throw new Error("Thiếu trường");
  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );
  return res.json({
    success: response ? true : false,
    response: response ? response : "ko tạo thêm mới ",
  });
});

const getUserOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const response = await Order.find({ orderBy: _id });
  return res.json({
    success: response ? true : false,
    response: response ? response : "ko co du lieu",
  });
});
const getsOrder = asyncHandler(async (req, res) => {
  const response = await Order.find();
  return res.json({
    success: response ? true : false,
    response: response ? response : "ko co du lieu",
  });
});

module.exports = {
  createOrder,
  updateStatus,
  getUserOrder,
  getsOrder,
  createOneOrder,
};
