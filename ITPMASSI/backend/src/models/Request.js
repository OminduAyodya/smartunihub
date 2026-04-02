const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodItem",
      required: true,
    },
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    helperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    quantity: { type: Number, required: true, min: 1 },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    serviceCharge: { type: Number, default: 50, min: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Request", requestSchema);