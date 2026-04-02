const express = require("express");
const { getUsers, updateUserProfile } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.put("/:id", updateUserProfile);

module.exports = router;
