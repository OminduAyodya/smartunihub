const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    discount: { type: String, required: true }, // e.g., "15% OFF", "Buy 2 Get 1", "LKR 30 OFF"
    description: { type: String, required: true },
    icon: { type: String, default: "🎁" }, // emoji or icon
    startTime: { type: String, required: true }, // e.g., "11:30 AM"
    endTime: { type: String, required: true }, // e.g., "2:30 PM"
    badge: { type: String, default: "OFFER" }, // e.g., "POPULAR", "LIMITED", "BASEMENT ONLY"
    isActive: { type: Boolean, default: true },
    canteen: { type: String, required: true, enum: ["anohana", "basement"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
