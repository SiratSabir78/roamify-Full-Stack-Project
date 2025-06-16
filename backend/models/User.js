const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  address: String,
  gender: String,
  password: String,
  image: String,
  reviews: [
    {
      id: String,
      cityId: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
      cityName: String,
      text: String,
      rating: Number,
    },
  ],
  favouriteCities: [String],
  citiesTravelled: [String],
  questions: [String],
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
