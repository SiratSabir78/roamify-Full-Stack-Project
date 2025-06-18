const express = require("express");
const router = express.Router();
const {
  getAllBookings,
  createBooking,
  deleteBooking,
  getMonthlyCityBookingSummary,
} = require("../controllers/bookingController");

router.get("/", getAllBookings);
router.post("/", createBooking);
router.delete("/:id", deleteBooking);

// New route for monthly city-wise booking summary
router.get("/summary/monthly-city", getMonthlyCityBookingSummary);

module.exports = router;
