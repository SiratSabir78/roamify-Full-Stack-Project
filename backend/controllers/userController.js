const mongoose = require("mongoose");
const User = require("../models/User");

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { userId, username, email, phone, address, gender, password } =
    req.body;

  if (!username || username.length < 3)
    return res
      .status(400)
      .json({ error: "Username must be at least 3 characters" });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: "Invalid email address" });
  if (!/@gmail\.com$/.test(email))
    return res.status(400).json({ error: "Only Gmail addresses are allowed" });
  if (!phone || !/^((\+92)|(0092)|(92)|0)?3[0-9]{9}$/.test(phone))
    return res
      .status(400)
      .json({ error: "Enter a valid Pakistani phone number" });
  if (!address || !/pakistan/i.test(address))
    return res.status(400).json({ error: "Address must include Pakistan" });
  if (!["male", "female", "other"].includes(gender))
    return res.status(400).json({ error: "Select a valid gender" });
  if (password && password.length < 6)
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });

  try {
    const emailExists = await User.findOne({ email, _id: { $ne: userId } });
    if (emailExists)
      return res.status(400).json({ error: "Email already in use" });

    const usernameExists = await User.findOne({
      username,
      _id: { $ne: userId },
    });
    if (usernameExists)
      return res.status(400).json({ error: "Username already in use" });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        phone,
        address,
        gender,
        ...(password ? { password } : {}),
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Toggle add/remove favorite city
const toggleFavoriteCity = async (req, res) => {
  const { userId } = req.body;
  const { cityId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.favouriteCities) user.favouriteCities = [];

    const index = user.favouriteCities.findIndex(
      (id) => id.toString() === cityId
    );

    if (index > -1) {
      user.favouriteCities.splice(index, 1); // remove
    } else {
      user.favouriteCities.push(new mongoose.Types.ObjectId(cityId)); // add
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      message: "Favorites updated successfully",
      favorites: updatedUser.favouriteCities,
    });
  } catch (error) {
    console.error("Toggle favorite error:", error.message);
    return res.status(500).json({ error: "Failed to update favorites" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  toggleFavoriteCity,
};
