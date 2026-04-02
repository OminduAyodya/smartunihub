const User = require('../models/User');
const mongoose = require('mongoose');

const ensureDbConnection = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: 'Database is unavailable. Please try again shortly.' });
    return false;
  }
  return true;
};

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    console.log('Received registration data:', req.body);
    const { name, studentId, email, password, phone, role, securityQuestion, securityAnswer } = req.body;

    if (
      !name ||
      !studentId ||
      !email ||
      !password ||
      !phone ||
      !securityQuestion ||
      !securityAnswer ||
      securityQuestion.trim() === '' ||
      securityAnswer.trim() === ''
    ) {
      return res.status(400).json({ message: 'All fields are required and cannot be empty' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { studentId }] });
    if (userExists) {
      return res.status(409).json({ message: 'User with this email or student ID already exists' });
    }

    const user = await User.create({
      name,
      studentId,
      email,
      password, // In production, hash this password
      phone,
      securityQuestion,
      securityAnswer,
      role: role || 'rider',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      studentId: user.studentId,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      studentId: user.studentId,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/:id
const getUserProfile = async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
const updateUserProfile = async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body, password: undefined }, // Don't allow password update here
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
const getAllUsers = async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    const { role, isActive } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
};
