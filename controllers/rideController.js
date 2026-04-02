const Ride = require('../models/Ride');
const Driver = require('../models/Driver');

// @desc    Create a ride request
// @route   POST /api/rides
const createRide = async (req, res) => {
  try {
    const { riderId, pickupLocation, dropLocation, scheduledDate, scheduledTime, passengers } = req.body;

    if (!riderId || !pickupLocation || !dropLocation || !scheduledDate || !scheduledTime || !passengers) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const ride = await Ride.create({
      rider: riderId,
      pickupLocation: { address: pickupLocation },
      dropLocation: { address: dropLocation },
      scheduledDate,
      scheduledTime,
      passengers,
    });

    const populatedRide = await Ride.findById(ride._id)
      .populate('rider', '-password')
      .populate({
        path: 'driver',
        populate: { path: 'user', select: '-password' }
      });

    res.status(201).json(populatedRide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all rides
// @route   GET /api/rides
const getRides = async (req, res) => {
  try {
    const { status, riderId, driverId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (riderId) filter.rider = riderId;
    if (driverId) filter.driver = driverId;

    const rides = await Ride.find(filter)
      .populate('rider', '-password')
      .populate({
        path: 'driver',
        populate: { path: 'user', select: '-password' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ride by ID
// @route   GET /api/rides/:id
const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('rider', '-password')
      .populate({
        path: 'driver',
        populate: { path: 'user', select: '-password' }
      });

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get rides for a rider
// @route   GET /api/rides/rider/:riderId
const getRidesByRider = async (req, res) => {
  try {
    const rides = await Ride.find({ rider: req.params.riderId })
      .populate('rider', '-password')
      .populate({
        path: 'driver',
        populate: { path: 'user', select: '-password' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get rides for a driver
// @route   GET /api/rides/driver/:driverId
const getRidesByDriver = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.params.driverId })
      .populate('rider', '-password')
      .populate({
        path: 'driver',
        populate: { path: 'user', select: '-password' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept a ride (driver)
// @route   PATCH /api/rides/:id/accept
const acceptRide = async (req, res) => {
  try {
    const { driverId, fare } = req.body;

    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status !== 'pending') {
      return res.status(400).json({ message: 'Ride is no longer available' });
    }

    ride.driver = driverId;
    ride.status = 'accepted';
    ride.fare = fare || 0;
    await ride.save();

    const populatedRide = await Ride.findById(ride._id)
      .populate('rider', '-password')
      .populate({
        path: 'driver',
        populate: { path: 'user', select: '-password' }
      });

    res.status(200).json(populatedRide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Start a ride (driver)
// @route   PATCH /api/rides/:id/start
const startRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status !== 'accepted') {
      return res.status(400).json({ message: 'Ride cannot be started' });
    }

    ride.status = 'ongoing';
    ride.startedAt = new Date();
    await ride.save();

    const populatedRide = await Ride.findById(ride._id)
      .populate('rider', '-password')
      .populate({
        path: 'driver',
        populate: { path: 'user', select: '-password' }
      });

    res.status(200).json(populatedRide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete a ride (driver)
// @route   PATCH /api/rides/:id/complete
const completeRide = async (req, res) => {
  try {
    const { distance, duration } = req.body;

    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status !== 'ongoing') {
      return res.status(400).json({ message: 'Ride cannot be completed' });
    }

    ride.status = 'completed';
    ride.completedAt = new Date();
    ride.distance = distance || 0;
    ride.duration = duration || 0;
    await ride.save();

    // Update driver statistics
    if (ride.driver) {
      await Driver.findByIdAndUpdate(ride.driver, {
        $inc: { totalRides: 1, totalEarnings: ride.fare }
      });
    }

    const populatedRide = await Ride.findById(ride._id)
      .populate('rider', '-password')
      .populate({
        path: 'driver',
        populate: { path: 'user', select: '-password' }
      });

    res.status(200).json(populatedRide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a ride
// @route   PATCH /api/rides/:id/cancel
const cancelRide = async (req, res) => {
  try {
    const { reason } = req.body;

    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (['completed', 'cancelled'].includes(ride.status)) {
      return res.status(400).json({ message: 'Ride cannot be cancelled' });
    }

    ride.status = 'cancelled';
    ride.cancelledAt = new Date();
    ride.cancellationReason = reason || '';
    await ride.save();

    const populatedRide = await Ride.findById(ride._id)
      .populate('rider', '-password')
      .populate({
        path: 'driver',
        populate: { path: 'user', select: '-password' }
      });

    res.status(200).json(populatedRide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Rate a ride
// @route   PATCH /api/rides/:id/rate
const rateRide = async (req, res) => {
  try {
    const { raterType, rating, review } = req.body;

    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed rides' });
    }

    if (raterType === 'rider') {
      ride.driverRating = rating;
      ride.driverReview = review;

      // Update driver's average rating
      const driverRides = await Ride.find({ driver: ride.driver, driverRating: { $exists: true } });
      const avgRating = driverRides.reduce((sum, r) => sum + (r.driverRating || 0), rating) / (driverRides.length + 1);
      await Driver.findByIdAndUpdate(ride.driver, { rating: avgRating.toFixed(1) });
    } else {
      ride.riderRating = rating;
      ride.riderReview = review;
    }

    await ride.save();

    const populatedRide = await Ride.findById(ride._id)
      .populate('rider', '-password')
      .populate({
        path: 'driver',
        populate: { path: 'user', select: '-password' }
      });

    res.status(200).json(populatedRide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending rides (for drivers to accept)
// @route   GET /api/rides/pending
const getPendingRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'pending' })
      .populate('rider', '-password')
      .sort({ createdAt: -1 });

    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a ride
// @route   DELETE /api/rides/:id
const deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findByIdAndDelete(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    res.status(200).json({ message: 'Ride deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRide,
  getRides,
  getRideById,
  getRidesByRider,
  getRidesByDriver,
  acceptRide,
  startRide,
  completeRide,
  cancelRide,
  rateRide,
  getPendingRides,
  deleteRide,
};
