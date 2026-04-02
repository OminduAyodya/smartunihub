const express = require("express");
const {
  createRequest,
  getRequestsByUser,
  getIncomingRequestsByHelper,
  updateRequestStatus,
  acceptRequest,
  getRequestAcceptances,
  selectHelperForRequest,
  updateOwnPendingRequest,
  deleteOwnPendingRequest,
} = require("../controllers/requestController");
const {
  validateFoodRequest,
  validateRequestStatusUpdate,
  isValidObjectId,
} = require("../middleware/validate");

const router = express.Router();

// Create request (POST /)
router.post("/", validateFoodRequest, createRequest);

// Specific routes MUST come before general :id route
// Helper accepts a request
router.post("/:id/accept-help", (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid request id" });
  }
  next();
}, acceptRequest);

// Get list of helpers who accepted a request
router.get("/:id/acceptances", (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid request id" });
  }
  next();
}, getRequestAcceptances);

// Requester selects final helper from acceptances
router.post("/:id/select-helper", (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid request id" });
  }
  next();
}, selectHelperForRequest);

// Requester updates own pending request
router.put("/:id/requester", (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid request id" });
  }
  next();
}, updateOwnPendingRequest);

// Requester deletes own pending request
router.delete("/:id/requester", (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid request id" });
  }
  next();
}, deleteOwnPendingRequest);

// Update request status
router.put("/:id", validateRequestStatusUpdate, (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid request id" });
  }
  next();
}, updateRequestStatus);

// Get incoming requests for a helper
router.get("/incoming/:helperId", (req, res, next) => {
  if (!isValidObjectId(req.params.helperId)) {
    return res.status(400).json({ message: "Invalid helper id" });
  }
  next();
}, getIncomingRequestsByHelper);

// Get requests for a user (MUST be last, as it matches :userId)
router.get("/:userId", (req, res, next) => {
  if (!isValidObjectId(req.params.userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  next();
}, getRequestsByUser);

module.exports = router;
