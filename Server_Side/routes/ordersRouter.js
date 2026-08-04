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
  authOrderSchema,
  guestOrderSchema,
  statusUpdateSchema,
} = require("../validation/orders");
const {
  validateOrder,
  validateOrderByAuth,
} = require("../middleware/validateOrder");

const {
  optionalAuth,
  checkToken,
  getUserFromDb,
} = require("../middleware/auth");

// base url "/orders"

router.get("/", checkToken, getUserFromDb, getOrder); //checked
router.get("/:id", checkToken, getUserFromDb, getOrderById); //checked

router.post(
  "/",
  optionalAuth,
  validateOrderByAuth(guestOrderSchema, authOrderSchema),
  createOrder,
); //checked

router.patch(
  "/:id/status",
  checkToken,
  getUserFromDb,
  validateOrder(statusUpdateSchema),
  updateStatus,
); //checked

router.patch("/:id/cancel", checkToken, getUserFromDb, cancelOrder); //checked
router.delete("/:id", checkToken, getUserFromDb, deleteOrder); //checked

module.exports = router;
