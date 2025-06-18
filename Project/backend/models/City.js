const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: String,
  places: [String],
  description: String,
  images: [String],
  tripDates: [String],
  numberOfPeople: Number,
  pricePerPerson: Number,
  favouritesCount: { type: Number, default: 0 },
  totalTravelers: { type: Number, default: 0 },
  reviews: [
    {
      id: String,
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: String,
      text: String,
      rating: Number,
    },
  ],
});

module.exports = mongoose.model("City", citySchema);
