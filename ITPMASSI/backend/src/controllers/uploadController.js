const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({ message: "Filename is required" });
    }

    const filePath = path.join(uploadsDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: "Image deleted successfully" });
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
