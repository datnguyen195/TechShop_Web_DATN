const router = require("express").Router();
const ctrls = require("../controllers/user");
const uploader = require("../config/cloudinary.config");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/register", ctrls.register);
// router.post("/finalregister", ctrls.finalRegister);
router.put(
  "/avatar",
  verifyAccessToken,
  uploader.single("avatar"),
  ctrls.uploadImagesAvatar
);
router.post("/login", ctrls.login);
router.get("/current", verifyAccessToken, ctrls.getCurrent);
router.post("/refreshtoken", ctrls.refreshAccessToken);
router.get("/logout", ctrls.logout);
router.get("/forgotpassword", ctrls.forgotPassword);
router.put("/resetpassword", ctrls.resetPassword);
router.get("/", [verifyAccessToken, isAdmin], ctrls.getUsers);
router.delete("/:uid", [verifyAccessToken, isAdmin], ctrls.deleteUser);
// router.put("/current", [verifyAccessToken], ctrls.updateUser);
router.put(
  "/current",
  verifyAccessToken,
  uploader.single("avatar"),
  ctrls.updateOneUser
);
router.put("/address", verifyAccessToken, ctrls.updateAddress);
router.put("/putaddress", verifyAccessToken, ctrls.putAddress);
router.delete("/address/:aid", verifyAccessToken, ctrls.deleteAddress);
router.put("/cart", verifyAccessToken, ctrls.updateCart);
router.delete("/remove-cart/:pid/:color", verifyAccessToken, ctrls.deleteCart);
router.put("/:uid", [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin);
router.post("/changepass", ctrls.changePassUser);

module.exports = router;

// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETEeee
// CREATE (POST) + PUT - body
// GET + DELETE - query // ?fdfdsf&fdfs
