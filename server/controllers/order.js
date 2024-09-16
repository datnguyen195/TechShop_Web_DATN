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
  const user = await User.findById(_id);
  if (address) {
    await User.findByIdAndUpdate(_id, { address, cart: [] });
  }
  const code = generateShortToken(5);

  const data = {
    code: code,
    products,
    total,
    orderBy: _id,
    orderByName: user.name,
    orderByPhone: user.mobile,
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
  const status = 1;
  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );

  for (let productOne of response.products) {
    const { product, productVid, quantity } = productOne;
    const foundProduct = await Product.findById(product);

    const variant = foundProduct.varriants.find((item) =>
      item._id.equals(productVid)
    );
    // Trừ quantity từ variant
    variant.quantity -= quantity;
    variant.sold += quantity;

    // Cập nhật lại sản phẩm với biến thể đã thay đổi
    await Product.findByIdAndUpdate(
      foundProduct._id,
      {
        varriants: foundProduct.varriants,
        quantity: (foundProduct.quantity -= quantity),
        sold: (foundProduct.sold += quantity),
      },
      // Cập nhật lại danh sách biến thể
      { new: true }
    );
  }

  return res.json({
    success: response ? true : false,
    response: response ? response : "ko tạo thêm mới ",
  });
});

const deteStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  // status = Number(status);

  // Check if the status is a valid number
  console.log("status", status);
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

  if (req.query.q) {
    delete formatedQueries.q;
    formatedQueries["$or"] = [
      { code: { $regex: req.query.q, $options: "i" } },
      { orderByName: { $regex: req.query.q, $options: "i" } },
      { orderByPhone: { $regex: req.query.q, $options: "i" } },
    ];
  }

  if (queries?.status) {
    formatedQueries.status = Number(queries.status);
  }

  queryCommand = Order.find(formatedQueries);

  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  queryCommand.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const counts = await Order.find(formatedQueries).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      orders: response ? response : "Cannot get đơn hàng",
    });
  });
});

const aggregateOrders = async (year, month) => {
  // Trạng thái để chỉ định các điều kiện lọc dữ liệu
  const matchStage = {
    $match: {
      $expr: {
        $and: [
          { $eq: [{ $year: "$createdAt" }, year] },
          // Nếu tháng không được chỉ định, lọc cho tất cả các tháng
          ...(month ? [{ $eq: [{ $month: "$createdAt" }, month] }] : []),
        ],
      },
    },
  };

  // Nhóm theo tháng (và ngày nếu có tháng cụ thể)
  const groupStage = {
    $group: {
      _id: {
        month: { $month: "$createdAt" },
        day: month ? { $dayOfMonth: "$createdAt" } : null, // Nhóm theo ngày nếu tháng cụ thể
      },
      totalSales: { $sum: { $cond: [{ $eq: ["$status", 1] }, 1, 0] } },
      canceledOrders: { $sum: { $cond: [{ $eq: ["$status", 2] }, 1, 0] } },
      totalRevenue: { $sum: { $cond: [{ $eq: ["$status", 1] }, "$total", 0] } },
    },
  };

  // Sắp xếp theo tháng và ngày
  const sortStage = {
    $sort: { "_id.month": 1, "_id.day": 1 },
  };

  // Dự liệu cho dữ liệu ngày
  const projectStage = {
    $project: {
      _id: 0,
      month: "$_id.month",
      day: "$_id.day",
      totalSales: 1,
      canceledOrders: 1,
      totalRevenue: 1,
    },
  };

  const result = await Order.aggregate([
    matchStage,
    groupStage,
    sortStage,
    projectStage,
  ]);

  // Tạo dữ liệu cho tất cả các tháng trong năm
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    totalSales: 0,
    canceledOrders: 0,
    totalRevenue: 0,
  }));

  // Nếu có tháng cụ thể, tạo dữ liệu cho các ngày trong tháng đó
  if (month) {
    const days = Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      totalSales: 0,
      canceledOrders: 0,
      totalRevenue: 0,
    }));

    result.forEach((item) => {
      if (item.day) {
        days[item.day - 1] = {
          day: item.day,
          totalSales: item.totalSales,
          canceledOrders: item.canceledOrders,
          totalRevenue: item.totalRevenue,
        };
      }
    });

    return days;
  } else {
    // Cập nhật dữ liệu cho mỗi tháng
    result.forEach((item) => {
      months[item.month - 1].totalSales += item.totalSales;
      months[item.month - 1].canceledOrders += item.canceledOrders;
      months[item.month - 1].totalRevenue += item.totalRevenue;
    });

    return months;
  }
};

const getDashboard = asyncHandler(async (req, res) => {
  const year = Number(req.query.year);
  const month = req.query.month ? Number(req.query.month) : null;

  console.log("year", year);
  console.log(month);

  try {
    const data = await aggregateOrders(year, month);

    if (month) {
      res.json({
        labels: data.map((item) => `Ngày ${item.day}`),
        datasets: [
          {
            label: `Đã bán ${year}-${month}`,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            data: data.map((item) => item.totalSales),
            yAxisID: "y1",
          },
          {
            label: `Huỷ hàng ${year}-${month}`,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(192,75,75,0.4)",
            borderColor: "rgba(192,75,75,1)",
            data: data.map((item) => item.canceledOrders),
            yAxisID: "y1",
          },
          {
            label: `Doanh thu ${year}-${month}`,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(255,206,86,0.4)",
            borderColor: "rgba(255,206,86,1)",
            data: data.map((item) => item.totalRevenue),
            yAxisID: "y2",
          },
        ],
      });
    } else {
      res.json({
        labels: data.map((item) => `Tháng ${item.month}`),
        datasets: [
          {
            label: `Đã bán ${year}`,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            data: data.map((item) => item.totalSales),
            yAxisID: "y1",
          },
          {
            label: `Huỷ hàng ${year}`,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(192,75,75,0.4)",
            borderColor: "rgba(192,75,75,1)",
            data: data.map((item) => item.canceledOrders),
            yAxisID: "y1",
          },
          {
            label: `Doanh thu ${year}`,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(255,206,86,0.4)",
            borderColor: "rgba(255,206,86,1)",
            data: data.map((item) => item.totalRevenue),
            yAxisID: "y2",
          },
        ],
      });
    }
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
