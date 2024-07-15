const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const sendMail = require("../ultils/sendMail");
const crypto = require("crypto");
const product = require("../models/product");
const makeToken = require("uniqid");

const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body.params;
  if (!email || !password || !name)
    return res.status(400).json({
      success: false,
      message: "Thiếu dữ liệu",
    });
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      sucess: false,
      error: "User has expired",
    });
  } else {
    const newUser = await User.create(req.body.params);
    return res.status(200).json({
      success: newUser ? true : false,
      mes: newUser
        ? "Đăng ký thành công. Vui lòng đăng nhập~"
        : "Đã xảy ra lỗi",
    });
  }
});

// const register1 = asyncHandler(async (req, res) => {
//   const { email, password, name, mobile } = req.body;

//   if (!email || !password || !name || !mobile)
//     return res.status(400).json({
//       success: false,
//       mes: "Thiếu dữ liệu",
//     });
//   const user = await User.findOne({ email });
//   if (user) {
//     throw new Error("Người dùng đã tồn tại");
//   } else {
//     const token = makeToken();
//     res.cookie(
//       "dataregister",
//       { ...req.body, token },
//       {
//         httpOnly: true,
//         maxAge: 15 * 60 * 1000,
//       }
//     );
//     const html = `này sẽ hết hạn sau 15 phút kể từ bây giờ. ${token}{' '}
//    <a href=${process.env.URL_SERVER}/api/user/finalregister/${token}>Click here</a>`;

//     const data = {
//       email,
//       html,
//       title: "Hoàn tất đăng ký",
//     };
//     const rs = await sendMail(data);
//     return res.status(200).json({
//       success: true,
//       mes: "Vui lòng check mail của bạn",
//     });
//   }
//   //lưư dươi cookei
// });

// const finalRegister = asyncHandler(async (req, res) => {
//   const { token } = req.body;
//   if (!token) throw new Error("Thiếu dữ liệu");
//   const checkToken = await User.findOne({ token });
//   if (!checkToken) throw new Error("Token không hợp lệ");
//   return res.status(200).json({
//     success: checkToken ? true : false,
//     mes: checkToken ? "Đăng Ký thành công" : "Đã xảy ra lỗi",
//   });
// });

// const finalRegister = asyncHandler(async (req, res) => {
//   const cookie = req.cookies;
//   const { token } = req.params;
//   if (!cookie || cookie?.dataregister?.token !== token)
//     throw new Error("Đăng ký bị lỗi");
//   const newUser = await User.create({
//     email: cookie?.dataregister?.email,
//     password: cookie?.dataregister?.password,
//     name: cookie?.dataregister?.name,
//     mobile: cookie?.dataregister?.mobile,
//   });
//   return res.status(200).json({
//     success: newUser ? true : false,
//     mes: newUser ? "Đăng ký thành công. Vui lòng đăng nhập~" : "Đã xảy ra lỗi",
//     newUser,
//   });
//   // return res.status(200).json({
//   //   success: true,
//   //   cookie,
//   // });
// });

// Refresh token => Cấp mới access token
// Access token => Xác thực người dùng, quân quyên người dùng
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body.params;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: "Thiếu dữ liệu",
    });
  // plain object
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    // Tách password và role ra khỏi response
    const { password, role, refreshToken, ...userData } = response.toObject();
    // Tạo access token
    const accessToken = generateAccessToken(response._id, role);
    // Tạo refresh token
    const newRefreshToken = generateRefreshToken(response._id);
    // // Lưu refresh token vào database
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    // // Lưu refresh token vào cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Thông tin không hợp lệ!");
  }
});
const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-refreshToken -password ");
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : "Không tìm thấy người dùng",
  });
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  // Lấy token từ cookies
  const cookie = req.cookies;
  // Check xem có token hay không
  if (!cookie && !cookie.refreshToken) throw new Error("không có token");
  // Check token có hợp lệ hay không
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "token không khớp",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken) throw new Error("không có token");
  // Xóa refresh token ở db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  // Xóa refresh token ở cookie trình duyệt
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mes: "Đăng xuất thành công",
  });
});
// Client gửi email
// Server check email có hợp lệ hay không => Gửi mail + kèm theo link (password change token)
// Client check mail => click link
// Client gửi api kèm token
// Check token có giống với token mà server gửi mail hay không
// Change password

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Thiếu email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("ko tồn tại user");
  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `Token này sẽ hết hạn sau 15 phút kể từ bây giờ ${resetToken}. <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`;

  const data = {
    email,
    html,
    title: "Forgot password",
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: true,
    rs,
  });
});
const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Thiếu dữ liệu");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("token không hợp lệ");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Updated password" : "Đã xảy ra lỗi",
  });
});
const getUsers = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  const formatedQueries = JSON.parse(queryString);
  if (queries?.name)
    formatedQueries.name = { $regex: queries.name, $options: "i" };
  let queryCommand = Product.find(formatedQueries);

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  //Pagination
  //limit: số object lay ve goi 1 API
  //skip:2
  //1 2 3 ... 10
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  //Execute query
  //So luong ap thoa man dieu kien == so luonwg sp tra ve 1 lafn goi api
  queryCommand.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const counts = await Product.find(formatedQueries).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      products: response ? response : "Cannot get products",
    });
  });
});
const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("Thiếu dữ liệu");
  const response = await User.findByIdAndDelete(_id);
  return res.status(200).json({
    success: response ? true : false,
    deletedUser: response
      ? `User with email ${response.email} deleted`
      : "No user delete",
  });
});
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Some thing went wrong",
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  //
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Some thing went wrong",
  });
});

const updateAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    { new: true }
  ).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Some thing went wrong",
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color) throw new Error("Missing inputs");
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid
  );
  if (alreadyProduct) {
    if (alreadyProduct.color === color) {
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
        { $set: { "cart.$.quantity": quantity } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "Some thing went wrong",
      });
    } else {
      const response = await User.findByIdAndUpdate(
        _id,
        { $push: { cart: { product: pid, quantity, color } } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "Some thing went wrong",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { cart: { product: pid, quantity, color } } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "Some thing went wrong",
    });
  }
});
const uploadImagesAvatar = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.file) throw new Error("thiếu trường");
  const response = await User.findByIdAndUpdate(
    _id,
    { avatar: req.file.path },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    updateAvatar: response ? response : "khong the upload anh avatar",
  });
  // console.log(req.files);
  // return res.json("oke");
});
module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateAddress,
  updateCart,
  uploadImagesAvatar,
};
