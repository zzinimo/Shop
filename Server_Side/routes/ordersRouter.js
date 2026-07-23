const router = require("express").Router();
const {
  createOrder,
  getOrderById,
  getOrder,
  updateStatus,
  cancelOrder,
  deleteOrder,
} = require("../controllers/orders");

router.get("/", getOrder);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.patch("/:id/status", updateStatus);
router.patch("/:id/cancel", cancelOrder);
router.delete("/:id/delete", deleteOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
