const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
} = require('../controllers/propertyController');
const { protect, requireActiveRole } = require('../middleware/auth');

router.get('/', getProperties);
router.get('/my-properties', protect, requireActiveRole('landlord'), getMyProperties);
router.get('/:id', getProperty);
router.post('/', protect, requireActiveRole('landlord'), createProperty);
router.put('/:id', protect, requireActiveRole('landlord'), updateProperty);
router.delete('/:id', protect, requireActiveRole('landlord'), deleteProperty);

module.exports = router;