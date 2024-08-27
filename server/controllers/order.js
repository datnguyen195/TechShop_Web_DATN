const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");
const makeToken = require("uniqid");

function generateShortToken(length) {
  const uniqueId = makeToken();
  return uniqueId.slice(0, length).toUpperCase();
}

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { products, total, address } = req.body.params ?? req.body;
  if (address) {
    await User.findByIdAndUpdate(_id, { address, cart: [] });
  }
  const code = generateShortToken(5);
  const data = { code: code, products, total, orderBy: _id };
  const newOrder = await Order.create(data);

  return res.status(200).json({
    success: newOrder ? true : false,
    res: newOrder ? "Thành công " : "Xảy ra lỗi ",
    order: newOrder,
  });
});

const createOneOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId, title, quantity, total, color, address, types } = req.body;

  const product = await Product.findById(productId);
  if (product.quantity < 1) {
    return res.status(404).json({ success: false, error: "sản phẩm đã hết" });
  }
  if (!product) {
    return res
      .status(404)
      .json({ success: false, error: "Không tìm thấy sản phẩm." });
  }
  const orderData = {
    products: [{ product: productId, quantity, color, types, title }],
    total,
    address,
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
    success: newOrder ? true : false,
    rs: newOrder ? newOrder : "Xảy ra lỗi ",
  });
});

// const updateStatus = asyncHandler(async (req, res) => {
//   const { oid } = req.params;
//   const { status } = req.body;
//   if (!status) throw new Error("Thiếu trường");
//   const response = await Order.findByIdAndUpdate(
//     oid,
//     { status },
//     { new: true }
//   );
//   return res.json({
//     success: response ? true : false,
//     response: response ? response : "ko tạo thêm mới ",
//   });
// });

const buyStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const status = 1;
  if (!status) throw new Error("Thiếu trường");
  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );

  for (let product of response.products) {
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

  return res.json({
    success: response ? true : false,
    response: response ? response : "ko tạo thêm mới ",
  });
});

const deteStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const status = 2;
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
  const queries = { ...req.query };
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  const formatedQueries = JSON.parse(queryString);

  const qr = { ...formatedQueries };
  let queryCommand = Order.find(qr);

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  queryCommand.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const counts = await User.find(formatedQueries).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      orders: response ? response : "Cannot get users",
    });
  });
});

module.exports = {
  createOrder,
  buyStatus,
  deteStatus,
  getUserOrder,
  getsOrder,
  createOneOrder,
};
