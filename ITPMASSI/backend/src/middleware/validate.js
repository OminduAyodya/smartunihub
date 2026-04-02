const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// Validates food request creation
// Ensures foodId, requesterId, quantity are provided and properly formatted
// Checks that quantity is at least 1 and serviceCharge is not negative
const validateFoodRequest = (req, res, next) => {
  const { foodId, requesterId, helperId, quantity, serviceCharge } = req.body;

  // Required fields check
  if (!foodId || !requesterId || quantity === undefined) {
    return res.status(400).json({
      message: "foodId, requesterId and quantity are required",
    });
  }

  // Validate MongoDB ObjectId format for foodId and requesterId
  if (!isValidObjectId(foodId) || !isValidObjectId(requesterId)) {
    return res.status(400).json({ message: "Invalid foodId or requesterId" });
  }

  // Validate helperId format if provided (optional field)
  if (helperId !== undefined && helperId !== null && helperId !== "" && !isValidObjectId(helperId)) {
    return res.status(400).json({ message: "Invalid helperId" });
  }

  // Validate quantity is at least 1
  if (Number(quantity) < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  // Validate serviceCharge is not negative (optional field)
  if (serviceCharge !== undefined && Number(serviceCharge) < 0) {
    return res.status(400).json({ message: "serviceCharge cannot be negative" });
  }

  next();
};

// Validates request status update
// Ensures status is either "accepted" or "rejected"
// Validates helperId format when provided, and requires it for acceptance
const validateRequestStatusUpdate = (req, res, next) => {
  const { status, helperId } = req.body;

  // Status must be one of the allowed values
  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "status must be accepted or rejected" });
  }

  // Validate helperId format if provided (optional field)
  if (helperId !== undefined && !isValidObjectId(helperId)) {
    return res.status(400).json({ message: "Invalid helper id" });
  }

  // When accepting a request, helperId is required
  if (status === "accepted" && (!helperId || !isValidObjectId(helperId))) {
    return res.status(400).json({ message: "Valid helperId is required when accepting a request" });
  }

  next();
};

// Validates event creation
// Ensures all required fields (title, date, venue, organizerName) are provided
// Validates that event date is a valid date format
const validateEventCreate = (req, res, next) => {
  const { title, date, venue, organizerName } = req.body;

  // All required fields must be provided
  if (!title || !date || !venue || !organizerName) {
    return res.status(400).json({
      message: "title, date, venue and organizerName are required",
    });
  }

  // Validate date is a valid date format
  if (Number.isNaN(new Date(date).getTime())) {
    return res.status(400).json({ message: "Invalid event date" });
  }

  next();
};

// Validates event review/approval decision
// Ensures decision is either "approved" or "rejected"
// Validates that adminUserId is a valid MongoDB ObjectId
const validateEventReview = (req, res, next) => {
  const { decision, adminUserId } = req.body;

  // Decision must be one of the allowed values
  if (!["approved", "rejected"].includes(decision)) {
    return res.status(400).json({ message: "decision must be approved or rejected" });
  }

  // adminUserId must be provided and valid
  if (!adminUserId || !isValidObjectId(adminUserId)) {
    return res.status(400).json({ message: "Valid adminUserId is required" });
  }

  next();
};

// Validates event stall request
// Ensures stallsRequested is provided and is a non-negative integer
const validateEventStallRequest = (req, res, next) => {
  const { stallsRequested } = req.body;

  // stallsRequested must be provided
  if (stallsRequested === undefined) {
    return res.status(400).json({ message: "stallsRequested is required" });
  }

  // stallsRequested must be a non-negative integer (0 or positive whole number)
  if (!Number.isInteger(Number(stallsRequested)) || Number(stallsRequested) < 0) {
    return res.status(400).json({ message: "stallsRequested must be a non-negative integer" });
  }

  next();
};

// Validates event photo upload
// Ensures photo URL is provided and is a valid HTTP/HTTPS URL
const validateEventPhoto = (req, res, next) => {
  const { url } = req.body;

  // Photo URL must be provided
  if (!url) {
    return res.status(400).json({ message: "photo url is required" });
  }

  // URL must start with http:// or https:// (secure protocol check)
  if (!/^https?:\/\//i.test(url)) {
    return res.status(400).json({ message: "photo url must start with http or https" });
  }

  next();
};

module.exports = {
  validateFoodRequest,
  validateRequestStatusUpdate,
  validateEventCreate,
  validateEventReview,
  validateEventStallRequest,
  validateEventPhoto,
  isValidObjectId,
};
