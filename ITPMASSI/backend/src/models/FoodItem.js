const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    },
    inStock: { type: Boolean, default: true },
    canteen: { type: String, required: true, enum: ["anohana", "basement"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoodItem", foodItemSchema);
