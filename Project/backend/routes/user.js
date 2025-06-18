const express = require("express");
const router = express.Router();

const {
  updateUserProfile,
  getUserProfile,
  toggleFavoriteCity,
  getUserStats, // ✅ Import new controller
} = require("../controllers/userController");

// Get user profile by ID
router.get("/:id", getUserProfile);

// Update user profile
router.put("/update", updateUserProfile);

// Toggle favorite city
router.post("/favorite/:cityId", toggleFavoriteCity);

// ✅ New route: Get user gender statistics
router.get("/stats/gender", getUserStats);

module.exports = router;
