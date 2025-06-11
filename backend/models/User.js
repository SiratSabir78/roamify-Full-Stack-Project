const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  username: String,
  email: String,
  phone: String,
  address: String,
  gender: String,
  password: String,
  image: String,
  reviews: [String],
  favouriteCities: [String],
  citiesTravelled: [String],
  questions: [String],
  isAdmin: { type: Boolean, default: false }, // to identify admin users
});

module.exports = mongoose.model("User", userSchema);
