const express = require('express');
const router = express.Router();
const {
  createRental,
  updateRentalStatus,
  getLandlordRentals,
  getTenantRentals,
  getRental,
} = require('../controllers/rentalController');
const { protect, requireActiveRole } = require('../middleware/auth');

router.post('/', protect, requireActiveRole('tenant'), createRental);
router.get('/landlord', protect, requireActiveRole('landlord'), getLandlordRentals);
router.get('/tenant', protect, requireActiveRole('tenant'), getTenantRentals);
router.get('/:id', protect, getRental);
router.put('/:id/status', protect, requireActiveRole('landlord'), updateRentalStatus);

module.exports = router;