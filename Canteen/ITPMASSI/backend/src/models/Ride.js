const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);