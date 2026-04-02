const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true, trim: true },
    organizerName: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "draft",
    },
    adminReviewNote: { type: String, default: "", trim: true },
    approvalDate: { type: Date },
    stallsRequested: { type: Number, default: 0, min: 0 },
    stallRequestNote: { type: String, default: "", trim: true },
    stallAllocation: {
      allocatedStalls: { type: [String], default: [] },
      location: { type: String, default: "", trim: true },
      notes: { type: String, default: "", trim: true },
    },
    photos: {
      type: [
        {
          url: { type: String, required: true, trim: true },
          caption: { type: String, default: "", trim: true },
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);