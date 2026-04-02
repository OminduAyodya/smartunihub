const express = require('express');
const router = express.Router();

// Seat routes
router.post('/', (req, res) => {
  // Book seat
  res.json({ message: 'Book seat' });
});

router.get('/event/:eventId', (req, res) => {
  // Get seats for event
  res.json({ message: 'Get seats for event' });
});

router.get('/:id', (req, res) => {
  // Get seat details
  res.json({ message: 'Get seat details' });
});

router.put('/:id', (req, res) => {
  // Update seat
  res.json({ message: 'Update seat' });
});

module.exports = router;
