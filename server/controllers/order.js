const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");
const makeToken = require("uniqid");

function generateShortToken(length) {
  const uniqueId = makeToken();
  return uniqueId.slice(-length).toUpperCase();
}

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { products, total, address } = req.body.params ?? req.body;
  if (address) {
    await User.findByIdAndUpdate(_id, { address, cart: [] });
  }
  const code = generateShortToken(5);

  const data = {
    code: code,
    products,
    total,
    orderBy: _id,
    address,
  };
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
  const status = 0;
  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );

  for (let productOne of response.products) {
    const { product, productVid, quantity } = productOne;
    const foundProduct = await Product.findById(product);

    // const variantIndex = foundProduct.varriants.find((item) =>
    //   item._id.equals(productVid)
    // );
    // console.log("variantIndex", variantIndex);
    // console.log("variant", variant);
    // variant.quantity -= quantity;
    // console.log("variant", variant._id);

    if (foundProduct) {
      const updatedProduct = await Product.findByIdAndUpdate(
        foundProduct._id,
        { quantity: (foundProduct.quantity -= quantity) }, // Fields to update
        { new: true }
      );
      console.log("updatedProduct", updatedProduct);
    } else {
      return res.status(404).json({
        success: false,
        error: `Không tìm thấy sản phẩm với ID ${product}`,
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

const aggregateOrders = async (year, period) => {
  const matchStage = {
    $match: {
      $expr: {
        $and: [{ $eq: [{ $year: "$createdAt" }, year] }],
      },
    },
  };

  const groupStage = {
    $group: {
      _id:
        period === "quarterly"
          ? {
              $concat: [
                {
                  $toString: {
                    $ceil: { $divide: [{ $month: "$createdAt" }, 3] },
                  },
                },
                "-Q",
              ],
            }
          : { $month: "$createdAt" },
      totalSales: { $sum: { $cond: [{ $eq: ["$status", 1] }, 1, 0] } },
      canceledOrders: { $sum: { $cond: [{ $eq: ["$status", 2] }, 1, 0] } },
      totalRevenue: { $sum: { $cond: [{ $eq: ["$status", 1] }, "$total", 0] } },
    },
  };

  const projectStage = {
    $project: {
      _id: 0,
      period: {
        $concat: [{ $toString: "$_id" }, period === "quarterly" ? "" : "-"],
      },
      totalSales: 1,
      canceledOrders: 1,
      totalRevenue: 1,
    },
  };

  return Order.aggregate([matchStage, groupStage, projectStage]);
};

const getDashboard = asyncHandler(async (req, res) => {
  const { year, period } = req.query; // Use GET
  // period could be 'yearly' or 'quarterly'

  try {
    const data = await aggregateOrders(Number(year), period);
    res.json({
      labels:
        period === "quarterly"
          ? ["Q1", "Q2", "Q3", "Q4"]
          : [
              "Tháng 1",
              "Tháng 2",
              "Tháng 3",
              "Tháng 4",
              "Tháng 5",
              "Tháng 6",
              "Tháng 7",
              "Tháng 8",
              "Tháng 9",
              "Tháng 10",
              "Tháng 11",
              "Tháng 12",
            ],
      datasets: [
        {
          label: `Đã bán ${period !== "quarterly" ? year : ""}`,
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          data: data.map((item) => item.totalSales),
          yAxisID: "y1",
        },
        {
          label: `Huỷ hàng  ${period !== "quarterly" ? year : ""}`,
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(192,75,75,0.4)",
          borderColor: "rgba(192,75,75,1)",
          data: data.map((item) => item.canceledOrders),
          yAxisID: "y1",
        },
        {
          label: `Doanh thu ${period !== "quarterly" ? year : ""}`,
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(255,206,86,0.4)",
          borderColor: "rgba(255,206,86,1)",
          data: data.map((item) => item.totalRevenue),
          yAxisID: "y2",
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = {
  createOrder,
  buyStatus,
  deteStatus,
  getUserOrder,
  getsOrder,
  createOneOrder,
  getDashboard,
};
