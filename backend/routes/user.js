const express = require("express");
const router = express.Router();
const { updateUserProfile, getUserProfile } = require("../controllers/userController");

// Get user profile by id (optional)
router.get("/:id", getUserProfile);

// Update user profile
router.put("/update", updateUserProfile);

module.exports = router;
