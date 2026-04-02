const express = require("express");
const {
  createEvent,
  getEvents,
  submitEventForApproval,
  reviewEvent,
  requestEventStalls,
  getEventStallAllocation,
  getCalendarEvents,
  getPastEvents,
  addEventPhoto,
  deleteEventPhoto,
  getEventGallery,
} = require("../controllers/eventController");
const {
  isValidObjectId,
  validateEventCreate,
  validateEventReview,
  validateEventStallRequest,
  validateEventPhoto,
} = require("../middleware/validate");

const router = express.Router();

router.get("/calendar", getCalendarEvents);
router.get("/past", getPastEvents);
router.get("/gallery", getEventGallery);
router.get("/", getEvents);
router.post("/", validateEventCreate, createEvent);

router.put("/:id/submit", (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid event id" });
  }
  next();
}, submitEventForApproval);

router.put("/:id/review", validateEventReview, (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid event id" });
  }
  next();
}, reviewEvent);

router.put("/:id/stalls", validateEventStallRequest, (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid event id" });
  }
  next();
}, requestEventStalls);

router.get("/:id/stalls", (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid event id" });
  }
  next();
}, getEventStallAllocation);

router.post("/:id/photos", validateEventPhoto, (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid event id" });
  }
  next();
}, addEventPhoto);

router.delete("/:id/photos/:photoId", (req, res, next) => {
  if (!isValidObjectId(req.params.id) || !isValidObjectId(req.params.photoId)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  next();
}, deleteEventPhoto);

module.exports = router;
