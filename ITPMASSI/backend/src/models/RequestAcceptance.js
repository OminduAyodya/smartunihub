const mongoose = require("mongoose");

const requestAcceptanceSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    helperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    acceptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

// Ensure unique acceptance per helper per request
requestAcceptanceSchema.index({ requestId: 1, helperId: 1 }, { unique: true });

module.exports = mongoose.model("RequestAcceptance", requestAcceptanceSchema);
