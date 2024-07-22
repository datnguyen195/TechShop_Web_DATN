const { response } = require("express");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct1 = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    createdProduct: newProduct ? newProduct : "Cannot create new product",
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const { title, price, description, brand, category, color } = req.body;
  const thumb = req?.files?.thumb[0]?.path;
  const images = req?.files?.images?.map((el) => el.path);
  // if (!(title && price && description && brand && category && color))
  //   throw new Error("Missing inputs");
  req.body.slug = slugify(title);
  if (thumb) req.body.thumb = thumb;
  if (images) req.body.images = images;
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    createdProduct: newProduct ? newProduct : "Cannot create new product",
  });
});
const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "Cannot get product",
  });
});
// Filtering, sorting & pagination
const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  //tach cac truong dac biet ra khoi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  //Format lai cac operator cho dung cu phap mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  const formatedQueries = JSON.parse(queryString);

  if (req.query.q) {
    delete formatedQueries.q;
    formatedQueries["$or"] = [
      { color: { $regex: req.query.q, $options: "i" } },
      { title: { $regex: req.query.q, $options: "i" } },
      { category: { $regex: req.query.q, $options: "i" } },
      { brand: { $regex: req.query.q, $options: "i" } },
    ];
  }
  //Filtering
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: "i" };
  let queryCommand = Product.find(formatedQueries);

  //Sorting
  //abc, seg => [abc,efg]=> abc sfg
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

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const files = req?.files;
  if (files?.thumb) req.body.thumb = files?.thumb[0]?.path;
  if (files?.images) req.body.images = files?.images?.map((el) => el.path);
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updatedProduct ? true : false,
    updatedProduct: updatedProduct ? updatedProduct : "Cannot update product",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deletedProduct ? true : false,
    mes: deletedProduct ? deletedProduct : "Cannot delete product",
  });
});

const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;
  if (!star || !pid) throw new Error("Thiếu trường");
  const ratingProduct = await Product.findById(pid);
  const alreadyRating = ratingProduct?.ratings?.find(
    (el) => el.postedBy.toString() === _id
  );

  if (alreadyRating) {
    // Update star & comment
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRating },
      },
      { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
      { new: true }
    );
  } else {
    // Add star & comment
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id } },
      },
      { new: true }
    );
    console.log(response);
  }

  const updateProduct = await Product.findById(pid);
  const ratingCount = updateProduct.ratings.length;
  const sumRatings = updateProduct.ratings.reduce(
    (sum, el) => sum + +el.star,
    0
  );
  updateProduct.totalRatings = Math.round((sumRatings * 10) / ratingCount) / 10;
  await updateProduct.save();
  return res.status(200).json({
    status: true,
    updateProduct,
  });
});

const uploadImagesProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!req.files) throw new Error("thiếu trường");
  const response = await Product.findByIdAndUpdate(
    pid,
    {
      $push: { images: { $each: req.files.map((el) => el.path) } },
    },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    updateProduct: response ? response : "khong the upload anh product",
  });
  // console.log(req.files);
  // return res.json("oke");
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratings,
  uploadImagesProduct,
};
