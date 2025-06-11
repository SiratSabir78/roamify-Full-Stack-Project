const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
  },
  date: Date,
  numberOfPeople: Number,
  totalPrice: Number,
});

module.exports = mongoose.model("Booking", bookingSchema);
