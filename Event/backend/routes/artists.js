const express = require('express');
const router = express.Router();

// Artist routes
router.post('/', (req, res) => {
  // Add artist
  res.json({ message: 'Add artist' });
});

router.get('/event/:eventId', (req, res) => {
  // Get artists for event
  res.json({ message: 'Get artists for event' });
});

router.post('/:id/vote', (req, res) => {
  // Vote for artist
  res.json({ message: 'Vote for artist' });
});

router.get('/:id', (req, res) => {
  // Get artist details
  res.json({ message: 'Get artist details' });
});

module.exports = router;
