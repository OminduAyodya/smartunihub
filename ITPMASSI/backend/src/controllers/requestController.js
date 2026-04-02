const Request = require("../models/Request");
const FoodItem = require("../models/FoodItem");
const User = require("../models/User");
const RequestAcceptance = require("../models/RequestAcceptance");

const populateRequestQuery = [
  { path: "requesterId", select: "name email itNumber phoneNumber" },
  { path: "helperId", select: "name email itNumber phoneNumber" },
  { path: "foodId", select: "name price image inStock" },
];

const createRequest = async (req, res, next) => {
  try {
    const { foodId, requesterId, helperId, quantity, message, serviceCharge } = req.body;

    const [existingFoodItem, requester, helper] = await Promise.all([
      FoodItem.findById(foodId),
      User.findById(requesterId),
      helperId ? User.findById(helperId) : Promise.resolve(null),
    ]);

    if (!existingFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    if (!requester) {
      return res.status(404).json({ message: "Requester not found" });
    }

    if (helperId && !helper) {
      return res.status(404).json({ message: "Selected helper not found" });
    }

    if (!existingFoodItem.inStock) {
      return res.status(400).json({ message: "Selected food item is out of stock" });
    }

    const newRequest = await Request.create({
      foodId,
      requesterId,
      helperId: helper?._id || null,
      quantity: Number(quantity),
      message: message || "",
      status: "pending",
      serviceCharge: Number(serviceCharge ?? 50),
    });

    const populatedRequest = await Request.findById(newRequest._id).populate(populateRequestQuery);
    res.status(201).json(populatedRequest);
  } catch (error) {
    next(error);
  }
};

const getRequestsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const requests = await Request.find({ requesterId: userId })
      .populate(populateRequestQuery)
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    next(error);
  }
};

const getIncomingRequestsByHelper = async (req, res, next) => {
  try {
    const { helperId } = req.params;
    const { status } = req.query;

    let query = {
      $or: [
        { status: "pending", requesterId: { $ne: helperId } },
        { helperId },
      ],
    };

    if (status && ["pending", "accepted", "rejected"].includes(status)) {
      if (status === "pending") {
        query = { status: "pending", requesterId: { $ne: helperId } };
      } else {
        query = { status, helperId };
      }
    }

    const requests = await Request.find(query)
      .populate(populateRequestQuery)
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    next(error);
  }
};

const updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "status must be accepted or rejected" });
    }

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be updated" });
    }

    request.status = status;
    if (status === "accepted") {
      request.helperId = req.body.helperId;
    } else if (status === "rejected") {
      request.helperId = null;
    }

    await request.save();

    const updated = await Request.findById(request._id).populate(populateRequestQuery);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const acceptRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { helperId, serviceCharge } = req.body;

    if (!helperId) {
      return res.status(400).json({ message: "helperId is required" });
    }

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be accepted" });
    }

    // Check if helper exists
    const helper = await User.findById(helperId);
    if (!helper) {
      return res.status(404).json({ message: "Helper not found" });
    }

    // Check if helper already accepted this request
    const existingAcceptance = await RequestAcceptance.findOne({
      requestId: id,
      helperId,
    });

    if (existingAcceptance) {
      return res.status(400).json({ message: "You have already accepted this request" });
    }

    // Create acceptance record with service charge
    const acceptance = await RequestAcceptance.create({
      requestId: id,
      helperId,
      serviceCharge: Number(serviceCharge || 0),
    });

    const populatedAcceptance = await RequestAcceptance.findById(acceptance._id).populate([
      { path: "helperId", select: "name email itNumber phoneNumber" },
    ]);

    res.status(201).json(populatedAcceptance);
  } catch (error) {
    next(error);
  }
};

const getRequestAcceptances = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const acceptances = await RequestAcceptance.find({ requestId: id })
      .populate({ path: "helperId", select: "name email itNumber phoneNumber" })
      .sort({ acceptedAt: -1 });

    res.json(acceptances);
  } catch (error) {
    next(error);
  }
};

const selectHelperForRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { acceptanceId, helperId } = req.body;

    if (!helperId) {
      return res.status(400).json({ message: "helperId is required" });
    }

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request is not pending" });
    }

    // Verify the helper accepted this request
    const acceptance = await RequestAcceptance.findOne({
      requestId: id,
      helperId,
    });

    if (!acceptance) {
      return res.status(400).json({ message: "This helper has not accepted the request" });
    }

    // Verify helper exists
    const helper = await User.findById(helperId);
    if (!helper) {
      return res.status(404).json({ message: "Helper not found" });
    }

    // Update request with selected helper and mark as accepted
    request.helperId = helperId;
    request.status = "accepted";
    await request.save();

    // Delete all acceptance records for this request (cleanup)
    await RequestAcceptance.deleteMany({ requestId: id });

    const updated = await Request.findById(request._id).populate(populateRequestQuery);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const updateOwnPendingRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { requesterId, quantity, serviceCharge, message } = req.body;

    if (!requesterId) {
      return res.status(400).json({ message: "requesterId is required" });
    }

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (String(request.requesterId) !== String(requesterId)) {
      return res.status(403).json({ message: "Only requester can update this request" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be updated" });
    }

    if (quantity !== undefined) {
      if (Number(quantity) < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
      }
      request.quantity = Number(quantity);
    }

    if (serviceCharge !== undefined) {
      if (Number(serviceCharge) < 0) {
        return res.status(400).json({ message: "serviceCharge cannot be negative" });
      }
      request.serviceCharge = Number(serviceCharge);
    }

    if (message !== undefined) {
      request.message = message;
    }

    await request.save();
    const updated = await Request.findById(request._id).populate(populateRequestQuery);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteOwnPendingRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { requesterId } = req.body;

    if (!requesterId) {
      return res.status(400).json({ message: "requesterId is required" });
    }

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (String(request.requesterId) !== String(requesterId)) {
      return res.status(403).json({ message: "Only requester can delete this request" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be deleted" });
    }

    await RequestAcceptance.deleteMany({ requestId: request._id });
    await Request.deleteOne({ _id: request._id });

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getRequestsByUser,
  getIncomingRequestsByHelper,
  updateRequestStatus,
  acceptRequest,
  getRequestAcceptances,
  selectHelperForRequest,
  updateOwnPendingRequest,
  deleteOwnPendingRequest,
};
