const City = require("../models/City");

// GET all cities
const getAllCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a single city by ID
const getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ message: "City not found" });
    res.json(city);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create a new city
const createCity = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const {
      name,
      places,
      description,
      images,
      tripDates,
      numberOfPeople,
      pricePerPerson,
      favouritesCount = 0,
      totalTravelers = 0,
      reviews,
    } = req.body;

    const newCity = new City({
      name,
      places,
      description,
      images,
      tripDates,
      numberOfPeople,
      pricePerPerson,
      favouritesCount,
      totalTravelers,
      reviews,
    });

    await newCity.save();
    res.status(201).json(newCity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update a city
const updateCity = async (req, res) => {
  try {
    const { totalTravelers, ...restBody } = req.body;
    const updatedCity = await City.findByIdAndUpdate(req.params.id, restBody, {
      new: true,
    });
    if (!updatedCity)
      return res.status(404).json({ message: "City not found" });
    res.json(updatedCity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE a city
const deleteCity = async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    res.json({ message: "City deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
};
