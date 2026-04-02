const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    minlength: [3, 'Title must be at least 3 characters'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(value) {
        // Only require future dates for pending/approved events
        if (this.status === 'completed' || this.status === 'cancelled') {
          return true; // Allow past dates for completed/cancelled events
        }
        return value > new Date();
      },
      message: 'Start date must be in the future'
    }
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  location: {
    type: String,
    minlength: [3, 'Location must be at least 3 characters if provided'],
    trim: true,
  },
  eventType: {
    type: String,
    enum: {
      values: ['indoor', 'outdoor'],
      message: 'Event type must be either indoor or outdoor'
    },
    required: [true, 'Event type is required'],
  },
  totalSeats: {
    type: Number,
    validate: {
      validator: function(value) {
        // Only required and must be positive for indoor events
        if (this.eventType === 'indoor') {
          return value && value > 0;
        }
        return true;
      },
      message: 'Total seats must be a positive number for indoor events'
    }
  },
  eventOrganizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
      message: 'Invalid event status'
    },
    default: 'pending',
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  thumbnail: String,
  gallery: [String],
  artists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
  }],
  stallsRequested: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stall',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
eventSchema.index({ status: 1, startDate: 1 });

module.exports = mongoose.model('Event', eventSchema);
