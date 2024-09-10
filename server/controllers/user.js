const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const sendMail = require("../ultils/sendMail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const product = require("../models/product");
const makeToken = require("uniqid");

const register = asyncHandler(async (req, res) => {
  const { email, password, name, mobile } = req.body.params ?? req.body;
  if (!email || !password || !name || !mobile)
    return res.status(400).json({
      success: false,
      message: "Thiếu dữ liệu",
    });
  const user = await User.findOne({ email });
  if (user) throw new Error("Người dùng đã tồn tại");
  else {
    const token = makeToken();
    const emailEdit = btoa(email) + "@" + token;
    const newUser = await User.create({
      email: emailEdit,
      password,
      name,
      mobile,
    });
    if (newUser) {
      const html = `<h2>Token này sẽ hết hạn sau 15 phút kể từ bây giờ</h2> <br/> <blockquote>${token}</blockquote>.`;
      const data = {
        email,
        html,
        title: "Đăng ký tài khoản",
      };
      await sendMail(data);
    }
    setTimeout(async () => {
      await User.deleteOne({ email: emailEdit });
    }, 180000);

    return res.status(200).json({
      success: true,
      mes: "vui lòng kiểm tra email",
    });
  }
});

const finalRegister = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const notActivedEmail = await User.findOne({
    email: new RegExp(`${token}$`),
  });
  if (notActivedEmail) {
    notActivedEmail.email = atob(notActivedEmail?.email?.split("@")[0]);
    notActivedEmail.save();
  }
  return res.json({
    success: notActivedEmail ? true : false,
    res: notActivedEmail
      ? notActivedEmail
      : " Đã sảy ra lỗi xin vui lòng thử lại",
  });
});

// Refresh token => Cấp mới access token
// Access token => Xác thực người dùng, quân quyên người dùng
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body.params ?? req.body;
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
  const user = await User.findById(_id)
    .select("-refreshToken -password ")
    .populate({
      path: "cart",
    });
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

  if (req.query.searchKey) {
    delete formatedQueries.searchKey;
    formatedQueries["$or"] = [
      { name: { $regex: req.query.searchKey, $options: "i" } },
      { email: { $regex: req.query.searchKey, $options: "i" } },
      { mobile: { $regex: req.query.searchKey, $options: "i" } },
    ];
  }

  let queryCommand = User.find(formatedQueries);
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
      users: response ? response : "Cannot get users",
    });
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const response = await User.findByIdAndDelete(uid);
  return res.status(200).json({
    success: response ? true : false,
    mes: response
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
  }).select("-role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Đã xảy ra lỗi",
  });
});

const updateOneUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { name, email, phone } = req.body;
  const data = { name, email, phone };
  if (req.file) data.avatar = req.file.path;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(_id, data, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Updated." : "Some thing went wrong",
  });
});
const updateUserByAdmin = asyncHandler(async (req, res) => {
  //
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Thiếu dữ liệu");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Thành công" : "Đã xảy ra lỗi",
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
    updatedUser: response ? response : "Đã xảy ra lỗi",
  });
});

const putAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { addressId, newAddress } = req.body.params ?? req.body;

  if (!addressId || !newAddress) throw new Error("Missing inputs");

  const response = await User.findOneAndUpdate(
    { _id, "address._id": addressId },
    { $set: { "address.$": newAddress } },
    { new: true }
  ).select("-password -role -refreshToken");

  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Đã xảy ra lỗi",
  });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { aid } = req.params;
  if (!aid) throw new Error("Missing inputs");

  const response = await User.findByIdAndUpdate(
    _id,
    { $pull: { address: { _id: aid } } },
    { new: true }
  ).select("-password -role -refreshToken");

  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Đã xảy ra lỗi",
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const {
    pid,
    pvid,
    quantity = 1,
    color,
    price,
    thumb,
    title,
  } = req.body.params ?? req.body;
  if (!pvid || !color) throw new Error("Missing inputs");
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.productVid === pvid && el.color === color
  );
  if (alreadyProduct && alreadyProduct.color === color) {
    const response = await User.updateOne(
      { cart: { $elemMatch: alreadyProduct } },
      {
        $set: {
          "cart.$.product": pid,
          "cart.$.productVid": pvid,
          "cart.$.quantity": quantity,
          "cart.$.price": price,
          "cart.$.thumb": thumb,
          "cart.$.title": title,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? response : "Đã xảy ra lỗi",
    });
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      {
        $push: {
          cart: {
            product: pid,
            productVid: pvid,
            quantity,
            color,
            price,
            thumb,
            title,
          },
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? response : "Đã xảy ra lỗi",
    });
  }
});

const deleteCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, color } = req.params;
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.productVid === pid && el.color === color
  );
  if (alreadyProduct) {
    return res.status(200).json({
      success: false,
      mes: "Sửa giỏ hàng",
    });
  }
  const response = await User.findByIdAndUpdate(
    _id,
    { $pull: { cart: { productVid: pid } } },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "cập nhật giỏ hàng" : "Đã xảy ra lỗi",
  });
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

const changePassUser = asyncHandler(async (req, res) => {
  const { _id, oldPassword, newPassword } = req.body.params ?? req.body;

  const user = await User.findById(_id);

  if (!user) {
    return res.status(404).json({ mes: "User not found", success: false });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    return res
      .status(401)
      .json({ mes: "Incorrect old password", success: false });
  }

  user.password = newPassword;
  await user.save();

  res.json({ mes: "Password changed successfully", success: true });
});

module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  finalRegister,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateAddress,
  updateCart,
  uploadImagesAvatar,
  changePassUser,
  deleteCart,
  updateOneUser,
  putAddress,
  deleteAddress,
};
