const router = require("express").Router();
const ctrls = require("../controllers/order");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", verifyAccessToken, ctrls.createOrder);
router.post("/one", verifyAccessToken, ctrls.createOneOrder);
router.put("/status/:oid", [verifyAccessToken, isAdmin], ctrls.updateStatus);
router.get("/", verifyAccessToken, ctrls.getUserOrder);
router.get("/admin", verifyAccessToken, isAdmin, ctrls.getsOrder);
module.exports = router;

// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETEeee
// CREATE (POST) + PUT - body
// GET + DELETE - query // ?fdfdsf&fdfs
