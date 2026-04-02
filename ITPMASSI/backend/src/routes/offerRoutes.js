const express = require("express");
const {
  getOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
} = require("../controllers/offerController");

const router = express.Router();

router.get("/", getOffers);
router.get("/:id", getOfferById);
router.post("/", createOffer);
router.put("/:id", updateOffer);
router.delete("/:id", deleteOffer);

module.exports = router;
