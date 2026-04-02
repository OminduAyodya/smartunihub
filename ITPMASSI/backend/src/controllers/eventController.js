const Event = require("../models/Event");
const User = require("../models/User");

const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, venue, organizerName } = req.body;

    const event = await Event.create({
      title,
      description: description || "",
      date,
      venue,
      organizerName,
      status: "draft",
    });

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

const getEvents = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status && ["draft", "pending", "approved", "rejected"].includes(status)) {
      query.status = status;
    }

    const events = await Event.find(query).sort({ date: 1, createdAt: -1 });
    res.json(events);
  } catch (error) {
    next(error);
  }
};

const submitEventForApproval = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!["draft", "rejected"].includes(event.status)) {
      return res.status(400).json({ message: "Only draft or rejected events can be submitted" });
    }

    event.status = "pending";
    event.adminReviewNote = "";
    await event.save();

    res.json(event);
  } catch (error) {
    next(error);
  }
};

const reviewEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { decision, adminReviewNote, allocatedStalls, stallLocation, stallNotes, adminUserId } = req.body;

    if (!["approved", "rejected"].includes(decision)) {
      return res.status(400).json({ message: "decision must be approved or rejected" });
    }

    const adminUser = await User.findById(adminUserId).select("role");
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Only admins can approve or reject events" });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status !== "pending") {
      return res.status(400).json({ message: "Only pending events can be reviewed" });
    }

    event.status = decision;
    event.adminReviewNote = adminReviewNote || "";

    if (decision === "approved") {
      event.approvalDate = new Date();
      event.stallAllocation = {
        allocatedStalls: Array.isArray(allocatedStalls) ? allocatedStalls.filter(Boolean) : event.stallAllocation.allocatedStalls,
        location: stallLocation || event.stallAllocation.location || "",
        notes: stallNotes || event.stallAllocation.notes || "",
      };
    }

    await event.save();

    res.json(event);
  } catch (error) {
    next(error);
  }
};

const requestEventStalls = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stallsRequested, stallRequestNote } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.stallsRequested = Number(stallsRequested);
    event.stallRequestNote = stallRequestNote || "";
    await event.save();

    res.json(event);
  } catch (error) {
    next(error);
  }
};

const getEventStallAllocation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).select(
      "title status stallsRequested stallRequestNote stallAllocation organizerName date"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
};

const getCalendarEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ status: "approved", date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
      .select("title date venue organizerName stallAllocation")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    next(error);
  }
};

const getPastEvents = async (req, res, next) => {
  try {
    const pastEvents = await Event.find({ 
      date: { $lt: new Date() },
      status: "approved"
    })
      .sort({ date: -1 })
      .limit(20);

    res.json(pastEvents);
  } catch (error) {
    next(error);
  }
};

const addEventPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { url, caption } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.photos.push({ url, caption: caption || "" });
    await event.save();

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

const deleteEventPhoto = async (req, res, next) => {
  try {
    const { id, photoId } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const photo = event.photos.id(photoId);
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    photo.deleteOne();
    await event.save();

    res.json({ message: "Photo deleted" });
  } catch (error) {
    next(error);
  }
};

const getEventGallery = async (req, res, next) => {
  try {
    const eventsWithPhotos = await Event.find({ "photos.0": { $exists: true } })
      .select("title date photos venue organizerName")
      .sort({ date: -1 });

    const galleryItems = eventsWithPhotos.flatMap((event) =>
      event.photos.map((photo) => ({
        eventId: event._id,
        eventTitle: event.title,
        eventDate: event.date,
        venue: event.venue,
        organizerName: event.organizerName,
        photo,
      }))
    );

    res.json(galleryItems);
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
