const router = require("express").Router();
const ctrls = require("../controllers/blog");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");

router.get("/", ctrls.getBlogs);
router.get("/one/:bid", ctrls.getBlog);
router.post("/", [verifyAccessToken, isAdmin], ctrls.createBlog);
router.put("/update/:bid", [verifyAccessToken, isAdmin], ctrls.updateBlog);
router.put(
  "/image/:bid",
  [verifyAccessToken, isAdmin],
  uploader.single("image"),
  ctrls.uploadImagesBlog
);
// router.put("/likes/:bid", [verifyAccessToken], ctrls.likeBlog);
// router.put("/dislike/:bid", [verifyAccessToken], ctrls.likeBlog);
router.delete("/:bid", [verifyAccessToken, isAdmin], ctrls.deleteBlog);

module.exports = router;

// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETEeee
// CREATE (POST) + PUT - body
// GET + DELETE - query // ?fdfdsf&fdfs
