const express = require("express");
const upload = require("../middleware/upload");
const { uploadImage, deleteImage } = require("../controllers/uploadController");

const router = express.Router();

router.post("/", upload.single("file"), uploadImage);
router.delete("/", deleteImage);

module.exports = router;
