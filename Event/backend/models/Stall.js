const mongoose = require('mongoose');

// ============================================
// STALL SCHEMA DEFINITION WITH VALIDATION
// ============================================
// Defines the structure and validation rules for Stall documents
// All validation messages will be returned to client on error
const stallSchema = new mongoose.Schema({
  // ============================================
  // STALL NAME FIELD VALIDATION
  // ============================================
  // Requirements:
  //   - Required: true (must be provided)
  //   - Minimum length: 3 characters
  //   - Trim: true (removes leading/trailing whitespace)
  stallName: {
    type: String,
    required: [true, 'Stall name is required'],
    minlength: [3, 'Stall name must be at least 3 characters'],
    trim: true,
  },

  // ============================================
  // ORGANIZING FACULTY FIELD VALIDATION
  // ============================================
  // Requirements:
  //   - Required: true (must be provided)
  //   - Minimum length: 3 characters
  //   - Trim: true (removes leading/trailing whitespace)
  organizingFaculty: {
    type: String,
    required: [true, 'Organizing faculty is required'],
    minlength: [3, 'Faculty name must be at least 3 characters'],
    trim: true,
  },

  // ============================================
  // LOCATION FIELD VALIDATION
  // ============================================
  // Requirements:
  //   - Optional: field is not required
  //   - If provided: minimum 3 characters
  //   - Trim: true (removes leading/trailing whitespace)
  location: {
    type: String,
    minlength: [3, 'Location must be at least 3 characters if provided'],
    trim: true,
  },

  // ============================================
  // EVENT FIELD VALIDATION
  // ============================================
  // Requirements:
  //   - Required: true (must reference an event)
  //   - Minimum length: 3 characters
  //   - Trim: true (removes leading/trailing whitespace)
  event: {
    type: String,
    required: [true, 'Event is required for stall'],
    minlength: [3, 'Event name must be at least 3 characters'],
    trim: true,
  },

  // ============================================
  // ORGANIZER FIELD
  // ============================================
  // References: User model (ObjectId)
  // Links stall to the user who created it
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  // ============================================
  // STALL STATUS FIELD
  // ============================================
  // Requirements:
  //   - Enum: must be one of: 'available', 'booked', 'pending', 'approved', 'rejected'
  //   - Default: 'pending' (new stalls start as pending)
  //   - Tracks the availability status of the stall
  status: {
    type: String,
    enum: {
      values: ['available', 'booked', 'pending', 'approved', 'rejected'],
      message: 'Stall status must be available, booked, pending, approved, or rejected'
    },
    default: 'pending',
  },

  // ============================================
  // APPROVAL STATUS FIELD
  // ============================================
  // Requirements:
  //   - Enum: must be one of: 'pending', 'approved', 'rejected'
  //   - Default: 'pending' (new stalls need admin approval)
  //   - Tracks admin approval state (separate from availability)
  approvalStatus: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected'],
      message: 'Approval status must be pending, approved, or rejected'
    },
    default: 'pending',
  },

  // ============================================
  // STALL SIZE FIELD VALIDATION
  // ============================================
  // Requirements:
  //   - Required: true (must select a size)
  //   - Enum: must be one of: 'small', 'medium', 'large'
  //   - Cannot be any other value
  size: {
    type: String,
    enum: {
      values: ['small', 'medium', 'large'],
      message: 'Stall size must be small, medium, or large'
    },
    required: [true, 'Stall size is required'],
  },

  // ============================================
  // PRICE FIELD VALIDATION
  // ============================================
  // Requirements:
  //   - Required: true (must be provided)
  //   - Minimum: 0 (cannot be negative)
  //   - Must be a positive number (custom validator: > 0)
  //   - Cannot have zero or negative price
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: 'Price must be a positive number'
    }
  },

  // ============================================
  // CATEGORY FIELD VALIDATION
  // ============================================
  // Requirements:
  //   - Enum: must be one of: 'food', 'crafts', 'retail', 'other'
  //   - Categorizes the type of stall
  category: {
    type: String,
    enum: {
      values: ['food', 'crafts', 'retail', 'other'],
      message: 'Category must be food, crafts, retail, or other'
    },
    required: [true, 'Category is required'],
  },
  rejectionReason: {
    type: String,
    trim: true,
  },
  approvedAt: {
    type: Date,
  },
  rejectedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
stallSchema.index({ event: 1, status: 1 });
stallSchema.index({ organizer: 1 });

module.exports = mongoose.model('Stall', stallSchema);
