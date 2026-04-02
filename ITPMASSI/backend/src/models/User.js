const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    itNumber: { type: String, trim: true, default: "" },
    phoneNumber: { type: String, trim: true, default: "" },
    serviceCharge: { type: Number, default: 0, min: 0 },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
