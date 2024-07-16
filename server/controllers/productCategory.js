const ProductCategory = require("../models/productCategory");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const respone = await ProductCategory.create(req.body);
  return res.json({
    success: respone ? true : false,
    createCategory: respone ? respone : "ko tạo thêm Category mới ",
  });
});
const getCategories = asyncHandler(async (req, res) => {
  const response = await ProductCategory.find().select("title _id image");
  return res.json({
    success: response ? true : false,
    createCategory: response ? response : "ko xem Category",
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, {
    new: true,
  });

  return res.json({
    success: response ? true : false,
    updateCategory: response ? response : "ko the cap nhap Category ",
  });
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const respone = await ProductCategory.findByIdAndDelete(pcid);

  return res.json({
    success: respone ? true : false,
    deleteCategory: respone ? respone : "ko the xoa Category",
  });
});
///jiji
module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
