const router = require("express").Router();
const {
  createOrder,
  getOrderById,
  getOrder,
  updateStatus,
  cancelOrder,
  deleteOrder,
} = require("../controllers/orders");

const {
  optionalAuth,
  checkToken,
  getUserFromDb,
} = require("../middleware/auth");

// base url "/orders"

router.get("/", checkToken, getUserFromDb, getOrder); //checked
router.get("/:id", checkToken, getUserFromDb, getOrderById); //checked

router.post("/", optionalAuth, createOrder); //checked

router.patch("/:id/status", checkToken, getUserFromDb, updateStatus); //checked
router.patch("/:id/cancel", checkToken, getUserFromDb, cancelOrder); //checked
router.delete("/:id", checkToken, getUserFromDb, deleteOrder); //checked

module.exports = router;
