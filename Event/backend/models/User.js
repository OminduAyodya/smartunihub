const mongoose = require('mongoose');

// ============================================
// USER SCHEMA DEFINITION WITH VALIDATION
// ============================================
// Defines the structure and validation rules for User documents
// All validation messages will be returned to client on error
const userSchema = new mongoose.Schema({
  // ============================================
  // NAME FIELD VALIDATION
  // ============================================
  // Requirements:
  //   - Required: true (must be provided)
  //   - Minimum length: 2 characters
  //   - Format: Only letters (a-z, A-Z) and spaces allowed
  //   - Automatic trimming: removes leading/trailing whitespace
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters'],
    match: [/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'],
    trim: true,
  },

  // ============================================
  // EMAIL FIELD VALIDATION
  // ============================================
  // Requirements:
  //   - Required: true (must be provided)
  //   - Unique: true (no duplicate emails allowed in database)
  //   - Format: Valid email format (user@domain.extension)
  //   - Lowercase: true (automatically converts to lowercase for consistency)
  //   - Trim: true (removes leading/trailing whitespace)
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email already in use'],
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ],
  },

  // ============================================
  // PASSWORD FIELD VALIDATION
  // ============================================
  // Requirements:
  //   - Required: true (must be provided)
  //   - Minimum length: 6 characters
  //   - Note: Password is hashed before storage (not stored in plain text)
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },

  // ============================================
  // USER ROLE FIELD
  // ============================================
  // Requirements:
  //   - Enum: users can only have 'user' or 'admin' role
  //   - Default: 'user' (normal user by default)
  //   - Cannot be any other value
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'Role must be either user or admin'
    },
    default: 'user',
  },

  // ============================================
  // PHONE FIELD VALIDATION
  // ============================================
  // Requirements:
  //   - Optional: sparse index allows null/missing values
  //   - Format: Exactly 10 digits (numbers only)
  //   - Sparse: allows multiple users without phone number
  phone: {
    type: String,
    sparse: true,
    match: [
      /^[0-9]{10}$/,
      'Phone number must be exactly 10 digits'
    ],
  },
  profileImage: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create index for email uniqueness
userSchema.index({ email: 1 }, { unique: true, sparse: true });

// Pre-save validation
userSchema.pre('save', function(next) {
  // Ensure phone is removed if empty
  if (this.phone === '') {
    this.phone = undefined;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
