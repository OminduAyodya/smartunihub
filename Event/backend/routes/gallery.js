const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/gallery');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Only allow images
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

// Get gallery for specific event
router.get('/event/:eventId', async (req, res) => {
  try {
    const gallery = await Gallery.find({ event: req.params.eventId })
      .populate('uploadedBy', 'name email')
      .sort({ uploadedAt: -1, createdAt: -1 });
    
    res.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ message: error.message });
  }
});

// Upload photo with file
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { event, title, description, caption } = req.body;
    
    if (!event) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Event ID is required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    if (!title && !caption) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Title is required' });
    }

    const imageUrl = `/uploads/gallery/${req.file.filename}`;
    
    const galleryEntry = new Gallery({
      event,
      imageUrl,
      image: imageUrl, // Keep for backward compatibility
      title: title || caption,
      description: description || caption,
      caption: caption || title,
      uploadedBy: req.body.uploadedBy,
    });
    
    const saved = await galleryEntry.save();
    const populated = await saved.populate('uploadedBy', 'name email');
    
    res.status(201).json(populated);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error uploading photo:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete photo
router.delete('/:id', async (req, res) => {
  try {
    const photo = await Gallery.findByIdAndDelete(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Delete the file from disk
    if (photo.imageUrl) {
      const filePath = path.join(__dirname, '../', photo.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
