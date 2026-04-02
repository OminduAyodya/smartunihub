const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Keep for backward compatibility
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  caption: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Gallery', gallerySchema);
