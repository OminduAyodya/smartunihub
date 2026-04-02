const User = require("../models/User");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: 1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { itNumber, phoneNumber } = req.body || {};

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (typeof itNumber !== "undefined") {
      user.itNumber = String(itNumber || "").trim();
    }
    if (typeof phoneNumber !== "undefined") {
      user.phoneNumber = String(phoneNumber || "").trim();
    }

    await user.save();
    return res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  updateUserProfile,
};
