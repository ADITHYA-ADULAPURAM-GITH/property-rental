const express = require('express');
const router = express.Router();

router.get('/mine', (req, res) => {
  res.json({
    properties: [],
    rentals: [],
    payments: []
  });
});

module.exports = router;