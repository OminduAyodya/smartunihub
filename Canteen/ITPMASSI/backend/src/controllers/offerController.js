const Offer = require("../models/Offer");

const getOffers = async (req, res, next) => {
  try {
    const { isActive, canteen } = req.query;
    const filter = {};
    
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }
    
    if (canteen) {
      filter.canteen = canteen;
    }
    
    const offers = await Offer.find(filter).sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    next(error);
  }
};

const getOfferById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json(offer);
  } catch (error) {
    next(error);
  }
};

const createOffer = async (req, res, next) => {
  try {
    const { title, discount, description, icon, startTime, endTime, badge, isActive, canteen } = req.body;

    if (!title || !discount || !description || !startTime || !endTime || !canteen) {
      return res.status(400).json({
        message: "title, discount, description, startTime, endTime, and canteen are required",
      });
    }

    if (!["anohana", "basement"].includes(canteen)) {
      return res.status(400).json({ message: "Invalid canteen. Must be 'anohana' or 'basement'" });
    }

    const offer = await Offer.create({
      title,
      discount,
      description,
      icon: icon || "🎁",
      startTime,
      endTime,
      badge: badge || "OFFER",
      isActive: typeof isActive === "boolean" ? isActive : true,
      canteen,
    });

    res.status(201).json(offer);
  } catch (error) {
    next(error);
  }
};

const updateOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, discount, description, icon, startTime, endTime, badge, isActive } = req.body;

    const updatedOffer = await Offer.findByIdAndUpdate(
      id,
      {
        title,
        discount,
        description,
        icon,
        startTime,
        endTime,
        badge,
        isActive,
      },
      { new: true, runValidators: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json(updatedOffer);
  } catch (error) {
    next(error);
  }
};

const deleteOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedOffer = await Offer.findByIdAndDelete(id);

    if (!deletedOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
};
