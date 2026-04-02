const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/rideController');

router.route('/').post(createRide).get(getRides);
router.get('/pending', getPendingRides);
router.route('/:id').get(getRideById).delete(deleteRide);
router.get('/rider/:riderId', getRidesByRider);
router.get('/driver/:driverId', getRidesByDriver);
router.patch('/:id/accept', acceptRide);
router.patch('/:id/start', startRide);
router.patch('/:id/complete', completeRide);
router.patch('/:id/cancel', cancelRide);
router.patch('/:id/rate', rateRide);

module.exports = router;
