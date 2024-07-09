const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");

const createBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error("thieu du lieu");
  const respone = await Blog.create(req.body);
  return res.json({
    success: respone ? true : false,
    createBlog: respone ? respone : "ko tạo thêm blog mới ",
  });
});
const updateBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("thieu truong");
  const respone = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
  return res.json({
    success: respone ? true : false,
    updateBlog: respone ? respone : "ko cap nhat blog ",
  });
});

const getBlogs = asyncHandler(async (req, res) => {
  const respone = await Blog.find();
  return res.json({
    success: respone ? true : false,
    createBlog: respone ? respone : "ko the xem blog ",
  });
});

// like
// dislike

const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.body;
  // if (!bid) throw new Error("thieu truong");
  const blog = await Blog.findById(bid);
  const alreadyDisliked = blog?.disLikes?.find((el) => el.toString() === _id);
  if (alreadyDisliked) {
    const respone = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { disLikes: _id } },
      { new: true }
    );
    return res.json({
      success: respone ? true : false,
      rs: respone,
    });
  }
  const isLiked = blog?.likes?.find((el) => el.toString() === _id);
  if (isLiked) {
    const respone = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: respone ? true : false,
      rs: respone,
    });
  } else {
    const respone = await Blog.findByIdAndUpdate(
      bid,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: respone ? true : false,
      rs: respone,
    });
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndUpdate(
    bid,
    { $inc: { numberViews: 1 } },
    { new: true }
  )
    .populate("likes", "name")
    .populate("disLikes", "name");
  return res.json({
    success: blog ? true : false,
    rs: blog,
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndDelete(bid);
  return res.json({
    success: blog ? true : false,
    deleteBold: blog || "đã xảy ra sự cố",
  });
});

const uploadImagesBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (!req.file) throw new Error("thiếu trường");
  const response = await Blog.findByIdAndUpdate(
    bid,
    { image: req.file.path },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    updateBlog: response ? response : "khong the upload anh Blog",
  });
  // console.log(req.files);
  // return res.json("oke");
});

module.exports = {
  createBlog,
  updateBlog,
  getBlogs,
  getBlog,
  likeBlog,
  deleteBlog,
  uploadImagesBlog,
};
