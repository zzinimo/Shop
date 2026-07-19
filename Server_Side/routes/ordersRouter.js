const router = require("express").Router();
const {
  createOrder,
  getOrderById,
  getOrder,
} = require("../controllers/orders");

router.get("/", getOrder);
router.get("/:id", getOrderById);
router.post("/", createOrder);

module.exports = router;
