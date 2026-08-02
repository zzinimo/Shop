const router = require("express").Router();
const {
  createOrder,
  getOrderById,
  getOrder,
  updateStatus,
  cancelOrder,
  deleteOrder,
} = require("../controllers/orders");

const ordersJoiSchema = require("../validation/orders");
const validateOrder = require("../middleware/validateOrder");

const {
  optionalAuth,
  checkToken,
  getUserFromDb,
} = require("../middleware/auth");

// base url "/orders"

router.get("/", checkToken, getUserFromDb, getOrder); //checked
router.get("/:id", checkToken, getUserFromDb, getOrderById); //checked

router.post("/", optionalAuth, validateOrder(ordersJoiSchema), createOrder); //checked

router.patch(
  "/:id/status",
  validateOrder(ordersJoiSchema),
  checkToken,
  getUserFromDb,
  updateStatus,
); //checked
router.patch(
  "/:id/cancel",
  validateOrder(ordersJoiSchema),
  checkToken,
  getUserFromDb,
  cancelOrder,
); //checked
router.delete("/:id", checkToken, getUserFromDb, deleteOrder); //checked

module.exports = router;
