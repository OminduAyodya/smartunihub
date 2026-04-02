const Driver = require('../models/Driver');
const User = require('../models/User');

// @desc    Register as driver
// @route   POST /api/drivers
const registerDriver = async (req, res) => {
  try {
    const { userId, vehicleType, vehicleNumber, vehicleModel, licenseNumber, capacity } = req.body;

    if (!userId || !vehicleType || !vehicleNumber || !licenseNumber || !capacity) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already a driver
    const existingDriver = await Driver.findOne({ user: userId });
    if (existingDriver) {
      return res.status(409).json({ message: 'User is already registered as a driver' });
    }

    const driver = await Driver.create({
      user: userId,
      vehicleType,
      vehicleNumber,
      vehicleModel,
      licenseNumber,
      capacity,
    });

    // Update user role
    await User.findByIdAndUpdate(userId, { role: 'driver' });

    const populatedDriver = await Driver.findById(driver._id).populate('user', '-password');
    res.status(201).json(populatedDriver);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Vehicle number already registered' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all drivers
// @route   GET /api/drivers
const getDrivers = async (req, res) => {
  try {
    const { isAvailable, isApproved, vehicleType } = req.query;
    const filter = {};
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';
    if (vehicleType) filter.vehicleType = vehicleType;

    const drivers = await Driver.find(filter)
      .populate('user', '-password')
      .sort({ rating: -1 });
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get driver by ID
// @route   GET /api/drivers/:id
const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('user', '-password');
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get driver by user ID
// @route   GET /api/drivers/user/:userId
const getDriverByUserId = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.params.userId }).populate('user', '-password');
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update driver
// @route   PUT /api/drivers/:id
const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', '-password');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update driver availability
// @route   PATCH /api/drivers/:id/availability
const updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true }
    ).populate('user', '-password');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update driver location
// @route   PATCH /api/drivers/:id/location
const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { currentLocation: { lat, lng } },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json({ message: 'Location updated', currentLocation: driver.currentLocation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve driver (admin only)
// @route   PATCH /api/drivers/:id/approve
const approveDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('user', '-password');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Update user verification status
    await User.findByIdAndUpdate(driver.user._id, { isVerified: true });

    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete driver
// @route   DELETE /api/drivers/:id
const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Reset user role to rider
    await User.findByIdAndUpdate(driver.user, { role: 'rider' });

    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get driver statistics
// @route   GET /api/drivers/:id/stats
const getDriverStats = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({
      totalRides: driver.totalRides,
      totalEarnings: driver.totalEarnings,
      rating: driver.rating,
      isAvailable: driver.isAvailable,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerDriver,
  getDrivers,
  getDriverById,
  getDriverByUserId,
  updateDriver,
  updateAvailability,
  updateLocation,
  approveDriver,
  deleteDriver,
  getDriverStats,
};
