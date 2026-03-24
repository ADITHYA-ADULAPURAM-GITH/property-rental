const express = require('express');
const router = express.Router();
const {
  createPayment,
  getTenantPayments,
  getLandlordPayments,
  getRentDue,
} = require('../controllers/paymentController');
const { protect, requireActiveRole } = require('../middleware/auth');

router.post('/', protect, requireActiveRole('tenant'), createPayment);
router.get('/tenant', protect, requireActiveRole('tenant'), getTenantPayments);
router.get('/landlord', protect, requireActiveRole('landlord'), getLandlordPayments);
router.get('/due/:month', protect, requireActiveRole('landlord'), getRentDue);

module.exports = router;