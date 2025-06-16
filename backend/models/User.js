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
  favouriteCities: [{ type: mongoose.Schema.Types.ObjectId, ref: "City" }],
  citiesTravelled: [String],
  questions: [String],
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
