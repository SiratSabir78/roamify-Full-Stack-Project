const City = require("../models/City");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

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

const addCityReview = async (req, res) => {
  try {
    const { userId, text, rating } = req.body;
    const cityId = req.params.id;

    const user = await User.findById(userId);
    const city = await City.findById(cityId);

    if (!user || !city) return res.status(404).json({ message: "User or city not found" });

    const review = {
      id: uuidv4(),
      userId,
      username: user.username,
      text,
      rating,
    };

    city.reviews.push(review);
    user.reviews.push({ ...review, cityId, cityName: city.name });

    await city.save();
    await user.save();

    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCityReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;

    const city = await City.findById(req.params.id);
    const user = await User.findById(userId);

    if (!city || !user) return res.status(404).json({ message: "City or user not found" });

    city.reviews = city.reviews.filter((r) => r.id !== reviewId);
    user.reviews = user.reviews.filter((r) => r.id !== reviewId);

    await city.save();
    await user.save();

    res.json({ message: "Review deleted" });
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
  addCityReview,
  deleteCityReview,
};
