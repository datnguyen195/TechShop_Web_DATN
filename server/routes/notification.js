const router = require("express").Router();
const ctrls = require("../controllers/notification");
const uploader = require("../config/cloudinary.config");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post(
  "/send-notification",
  [verifyAccessToken, isAdmin],
  uploader.single("imageUrl"),
  ctrls.senNotifi
);
router.get("/", verifyAccessToken, ctrls.getNotifi);
router.get("/admin", verifyAccessToken, ctrls.getNotifiweb);
router.delete(
  "/remove-notification/:nid",
  verifyAccessToken,
  isAdmin,
  ctrls.deleteNotifi
);

module.exports = router;
