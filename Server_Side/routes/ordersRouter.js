const router = require("express").Router();
const { createOrder } = require("../controllers/orders");

router.post("/orders", createOrder);

module.exports = router;
