const express = require('express');
const router = express.Router();
const Stall = require('../models/Stall');
const authMiddleware = require('../middleware/auth');

// Get user's approved stalls
router.get('/approved/user', async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    
    const stalls = await Stall.find({ 
      organizer: userId,
      approvalStatus: 'approved' 
    }).sort({ approvedAt: -1 });
    
    res.json(stalls || []);
  } catch (error) {
    console.error('Error fetching approved stalls:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all stalls
router.get('/', async (req, res) => {
  try {
    const stalls = await Stall.find().sort({ createdAt: -1 });
    res.json(stalls);
  } catch (error) {
    console.error('Error fetching stalls:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get pending stall requests
router.get('/pending', async (req, res) => {
  try {
    const stalls = await Stall.find({ approvalStatus: 'pending' }).sort({ createdAt: -1 });
    res.json(stalls);
  } catch (error) {
    console.error('Error fetching pending stalls:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get stalls for event
router.get('/event/:eventId', async (req, res) => {
  try {
    const stalls = await Stall.find({ event: req.params.eventId }).sort({ createdAt: -1 });
    res.json(stalls);
  } catch (error) {
    console.error('Error fetching event stalls:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get stall details
router.get('/:id', async (req, res) => {
  try {
    const stall = await Stall.findById(req.params.id);
    
    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }
    
    res.json(stall);
  } catch (error) {
    console.error('Error fetching stall:', error);
    res.status(500).json({ message: error.message });
  }
});

// Request stall (create with pending approval status)
router.post('/', async (req, res) => {
  try {
    const stallData = {
      ...req.body,
      approvalStatus: 'pending'
    };
    
    const stall = new Stall(stallData);
    const saved = await stall.save();
    
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating stall:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update stall
router.put('/:id', async (req, res) => {
  try {
    const stall = await Stall.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }
    
    res.json(stall);
  } catch (error) {
    console.error('Error updating stall:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete stall
router.delete('/:id', async (req, res) => {
  try {
    const stall = await Stall.findByIdAndDelete(req.params.id);
    
    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }
    
    res.json({ message: 'Stall deleted successfully', deletedStall: stall });
  } catch (error) {
    console.error('Error deleting stall:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
