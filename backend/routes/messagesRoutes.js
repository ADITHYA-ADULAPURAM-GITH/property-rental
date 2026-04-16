const express = require('express');
const router = express.Router();

// TEMP dummy route
router.get('/', (req, res) => {
  res.json([]);
});

module.exports = router;