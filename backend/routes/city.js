const express = require("express");
const router = express.Router();
const {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,

} = require("../controllers/cityController");

// RESTful city routes
router.get("/", getAllCities); // GET all cities
router.get("/:id", getCityById); // GET a city by ID
router.post("/", createCity); // POST create a new city
router.put("/:id", updateCity); // PUT update a city
router.delete("/:id", deleteCity); // DELETE a city

module.exports = router;
