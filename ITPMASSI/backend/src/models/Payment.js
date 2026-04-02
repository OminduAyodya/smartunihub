const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);