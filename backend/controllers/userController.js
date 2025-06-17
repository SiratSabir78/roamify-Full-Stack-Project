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

const City = require("../models/City");

const toggleFavoriteCity = async (req, res) => {
  const { userId } = req.body;
  const { cityId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const city = await City.findById(cityId);
    if (!city) return res.status(404).json({ error: "City not found" });

    const index = user.favouriteCities.indexOf(cityId);
    let message = "";

    if (index > -1) {
      // City is already in favorites → remove it
      user.favouriteCities.splice(index, 1);
      city.favouritesCount = Math.max(0, city.favouritesCount - 1);
      message = "City removed from favorites";
    } else {
      // City not in favorites → add it
      user.favouriteCities.push(cityId);
      city.favouritesCount += 1;
      message = "City added to favorites";
    }

    await user.save();
    await city.save();

    res.json({
      message,
      favorites: user.favouriteCities,
      updatedFavouritesCount: city.favouritesCount,
    });
  } catch (err) {
    console.error("Error toggling favorite:", err);
    res.status(500).json({ error: "Failed to update favorites" });
  }
};

// ✅ New: Get user gender stats
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const maleCount = await User.countDocuments({ gender: "male" });
    const femaleCount = await User.countDocuments({ gender: "female" });
    const otherCount = await User.countDocuments({ gender: "other" });

    res.json({
      totalUsers,
      male: maleCount,
      female: femaleCount,
      other: otherCount,
    });
  } catch (error) {
    console.error("Error in getUserStats:", error);  // <-- more detailed logging
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = {
  getUserProfile,
  updateUserProfile,
  toggleFavoriteCity,
  getUserStats, 
};
