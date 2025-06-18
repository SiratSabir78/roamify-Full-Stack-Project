const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Make sure the path is correct

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, phone, address, gender, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Create and save new user
    const newUser = new User({
      username,
      email,
      phone,
      address,
      gender,
      password,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: savedUser,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
