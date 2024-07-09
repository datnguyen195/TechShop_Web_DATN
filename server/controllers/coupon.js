const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("thiếu trường");
  const respone = await Coupon.create({
    ...req.body,
    expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
  });
  return res.json({
    success: respone ? true : false,
    createCoupon: respone ? respone : "ko tạo thêm Coupon mới ",
  });
});
const getCoupon = asyncHandler(async (req, res) => {
  const response = await Coupon.find().select("-createdAt -updatedAt");
  return res.json({
    success: response ? true : false,
    coupons: response ? response : "ko xem Coupon",
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("thiếu trường");
  if (req.body.expiry)
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
  const response = await Coupon.findByIdAndUpdate(cid, req.body, {
    new: true,
  });

  return res.json({
    success: response ? true : false,
    updateCoupon: response ? response : "ko the cap nhap Coupon ",
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const respone = await Coupon.findByIdAndDelete(cid);

  return res.json({
    success: respone ? true : false,
    deleteCoupon: respone ? respone : "ko the xoa Coupon",
  });
});
///jiji
module.exports = {
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
};
