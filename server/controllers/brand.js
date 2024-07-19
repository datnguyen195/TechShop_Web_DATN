const Brand = require("../models/brand");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res) => {
  const respone = await Brand.create(req.body);
  return res.json({
    success: respone ? true : false,
    createBrand: respone ? respone : "ko tạo thêm Brand mới ",
  });
});
const getBrand = asyncHandler(async (req, res) => {
  const response = await Brand.find();
  return res.json({
    success: response ? true : false,
    getBrand: response ? response : "ko xem Brand",
  });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const response = await Brand.findByIdAndUpdate(bid, req.body, {
    new: true,
  });

  return res.json({
    success: response ? true : false,
    updateBrand: response ? response : "ko the cap nhap Brand ",
  });
});
const deleteBrand = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const respone = await Brand.findByIdAndDelete(bid);

  return res.json({
    success: respone ? true : false,
    deleteBrand: respone ? respone : "ko the xoa Brand",
  });
});
///jiji
module.exports = {
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
};
