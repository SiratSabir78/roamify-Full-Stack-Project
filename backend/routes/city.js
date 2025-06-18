const express = require("express");
const router = express.Router();
const {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
  addCityReview,
  deleteCityReview,
} = require("../controllers/cityController");

router.get("/", getAllCities);
router.get("/:id", getCityById);
router.post("/", createCity);
router.put("/:id", updateCity);
router.delete("/:id", deleteCity);
router.post("/:id/reviews", addCityReview);
router.delete("/:id/reviews/:reviewId/:userId", deleteCityReview);

module.exports = router;
