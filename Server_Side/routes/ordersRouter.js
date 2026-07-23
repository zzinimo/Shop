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
<<<<<<< HEAD
=======

>>>>>>> c381be5 (Resolve merge conflict markers in orders router)
router.delete("/:id/delete", deleteOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
