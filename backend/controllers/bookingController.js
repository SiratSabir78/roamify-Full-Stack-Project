// controllers/bookingController.js
const Booking = require("../models/Booking");
const User = require('../models/User');
const City = require('../models/City');
const mongoose = require('mongoose');

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'username email')
      .populate('cityId', 'name description');
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};

// Create a new booking
const createBooking = async (req, res) => {
  const { userId, cityId, date, numberOfPeople, totalPrice, email, phone, specialRequests } = req.body;

  // Basic validation
  if (!userId || !cityId || !date || numberOfPeople === undefined || totalPrice === undefined) {
    return res.status(400).json({ message: "Missing required booking fields (userId, cityId, date, numberOfPeople, totalPrice)." });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }
  if (!mongoose.Types.ObjectId.isValid(cityId)) {
    return res.status(400).json({ message: "Invalid city ID format." });
  }

  try {
    const userExists = await User.findById(userId);
    const cityExists = await City.findById(cityId);

    if (!userExists) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!cityExists) {
      return res.status(404).json({ message: "City not found." });
    }

    const newBooking = new Booking({
      userId,
      cityId,
      date: new Date(date),
      numberOfPeople,
      totalPrice,
      // Optional fields like email, phone, specialRequests
      // Make sure your Booking schema supports these fields if you want to save them
      // email,
      // phone,
      // specialRequests
    });

    const savedBooking = await newBooking.save();

    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate('userId', 'username email')
      .populate('cityId', 'name description');

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to create booking", error: error.message });
  }
};

// Delete a booking
const deleteBooking = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid booking ID format." });
  }

  try {
    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found." });
    }
    res.status(200).json({ message: "Booking deleted successfully", booking: deletedBooking });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Failed to delete booking", error: error.message });
  }
};

// Monthly city-wise booking counts for last 6 months
const getMonthlyCityBookingSummary = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const summary = await Booking.aggregate([
      {
        $match: {
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "cityId",
          foreignField: "_id",
          as: "city",
        },
      },
      { $unwind: "$city" },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: "$date" } },
            city: "$city.name",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          cities: {
            $push: {
              city: "$_id.city",
              count: "$count",
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllBookings,
  createBooking,
  deleteBooking,
  getMonthlyCityBookingSummary
};
