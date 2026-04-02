const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
    },
    pickupLocation: {
      address: { type: String, required: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    dropLocation: {
      address: { type: String, required: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    scheduledTime: {
      type: String,
      required: true,
    },
    passengers: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
      default: 'pending',
    },
    fare: {
      type: Number,
      default: 0,
    },
    distance: {
      type: Number, // in km
      default: 0,
    },
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    riderRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    driverRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    riderReview: {
      type: String,
    },
    driverReview: {
      type: String,
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ride', rideSchema);
