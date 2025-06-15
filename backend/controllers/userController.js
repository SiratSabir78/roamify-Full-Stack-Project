const User = require("../models/User");

// Fetch user profile (optional, useful to populate form initially)
const getUserProfile = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).select("-password"); // exclude password from response
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { userId, username, email, phone, address, gender, password } = req.body;

  // Basic validation (can be improved or moved to middleware)
  if (!username || username.length < 3)
    return res.status(400).json({ error: "Username must be at least 3 characters" });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: "Invalid email address" });
  if (!/@gmail\.com$/.test(email))
    return res.status(400).json({ error: "Only Gmail addresses are allowed" });
  if (!phone || !/^((\+92)|(0092)|(92)|0)?3[0-9]{9}$/.test(phone))
    return res.status(400).json({ error: "Enter a valid Pakistani phone number (e.g. 03xxxxxxxxx)" });
  if (!address || !/pakistan/i.test(address))
    return res.status(400).json({ error: "Address must include Pakistan" });
  if (!["male", "female", "other"].includes(gender))
    return res.status(400).json({ error: "Select a valid gender" });
  if (password && password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters" });

  try {
    // Check if email or username is already taken by another user
    const emailExists = await User.findOne({ email, _id: { $ne: userId } });
    if (emailExists) return res.status(400).json({ error: "Email already in use" });

    const usernameExists = await User.findOne({ username, _id: { $ne: userId } });
    if (usernameExists) return res.status(400).json({ error: "Username already in use" });

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        phone,
        address,
        gender,
        ...(password ? { password } : {}), // update password only if provided
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

module.exports = { updateUserProfile, getUserProfile };
