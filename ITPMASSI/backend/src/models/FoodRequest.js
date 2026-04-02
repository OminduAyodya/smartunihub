const mongoose = require("mongoose");

const foodRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodItem",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    note: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    serviceCharge: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FoodRequest", foodRequestSchema);
