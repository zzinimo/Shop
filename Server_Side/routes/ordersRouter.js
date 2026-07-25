const router = require('express').Router();
const {
  createOrder,
  getOrderById,
  getOrder,
  updateStatus,
  cancelOrder,
  deleteOrder,
} = require('../controllers/orders');

const {
  optionalAuth,
  checkToken,
  getUserFromDb,
} = require('../middleware/auth');

// base url '/orders'

router.get('/', checkToken, getUserFromDb, getOrder);
router.get('/:id', checkToken, getUserFromDb, getOrderById);

router.post('/', optionalAuth, createOrder);

router.patch('/:id/status', checkToken, getUserFromDb, updateStatus);
router.patch('/:id/cancel', checkToken, getUserFromDb, cancelOrder);
router.delete('/:id', checkToken, getUserFromDb, deleteOrder);

module.exports = router;
