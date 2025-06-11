const express = require("express");
const router = express.Router();
const {
  getAllBookings,
  createBooking,
  deleteBooking
} = require("../controllers/bookingController");

router.get("/", getAllBookings);
router.post("/", createBooking);
router.delete("/:id", deleteBooking);

module.exports = router;