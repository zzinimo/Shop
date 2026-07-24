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
>>>>>>> dc0e07f (created auth middleware and global error handling function that was added to index.js)
router.delete("/:id/delete", deleteOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
