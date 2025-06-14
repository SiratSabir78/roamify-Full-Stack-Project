const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  cityId: { type: mongoose.Schema.Types.ObjectId },
  name: String,
  places: [String],
  description: String,
  images: [String],
  tripDates: [Date],
  numberOfPeople: Number,
  pricePerPerson: Number,
  totalTravelers: {
    type: Number,
    default: 0,  // <- add this
  },
    favouritesCount: {
    type: Number,
    default: 0,  // <- add this
  },
  reviews: [String],
});

module.exports = mongoose.model("City", citySchema);
