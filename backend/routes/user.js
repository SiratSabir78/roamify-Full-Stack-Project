const express = require("express");
const router = express.Router();
const {
  updateUserProfile,
  getUserProfile,
  toggleFavoriteCity,
} = require("../controllers/userController");

router.get("/:id", getUserProfile);
router.put("/update", updateUserProfile);
router.post("/favorite/:cityId", toggleFavoriteCity);

module.exports = router;
