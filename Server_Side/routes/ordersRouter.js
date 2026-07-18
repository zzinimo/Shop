const router = require("express").Router();
const { createOrder } = require("../controllers/orders");

router.post("/", createOrder);

module.exports = router;
