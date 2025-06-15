const jwt = require("jsonwebtoken");
const User = require("../models/User");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ error: "User not found" });
    if (user.password !== password)
      return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { loginUser }; // ✅ Make sure it's exported as an object
