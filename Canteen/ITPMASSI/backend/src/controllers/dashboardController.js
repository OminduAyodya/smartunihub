const User = require("../models/User");
const FoodItem = require("../models/FoodItem");
const Ride = require("../models/Ride");
const Event = require("../models/Event");
const Payment = require("../models/Payment");

const getDashboardSummary = async (req, res, next) => {
  try {
    const [
      totalStudents,
      foodItems,
      activeRides,
      upcomingEvents,
      creditResult,
      debitResult,
      firstStudent,
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),
      FoodItem.countDocuments(),
      Ride.countDocuments({ status: "active" }),
      Event.countDocuments({ status: "approved", date: { $gte: new Date() } }),
      Payment.aggregate([
        { $match: { type: "credit" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Payment.aggregate([
        { $match: { type: "debit" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      User.findOne({ role: "student" }).select("name email"),
    ]);

    const availableSeats = 42;
    const totalCredits = creditResult[0]?.total || 0;
    const totalDebits = debitResult[0]?.total || 0;
    const walletBalance = totalCredits - totalDebits;

    res.json({
      totalStudents,
      availableSeats,
      foodItems,
      activeRides,
      upcomingEvents,
      walletBalance,
      currentUser: firstStudent || { name: "Student", email: "student@smartunihub.com" },
      recentActivities: [
        { type: "food", message: "Food request sent", time: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
        { type: "ride", message: "Ride booked", time: new Date(Date.now() - 40 * 60 * 1000).toISOString() },
        { type: "event", message: "Workshop RSVP confirmed", time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        { type: "payment", message: "Wallet topped up", time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      ],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
};