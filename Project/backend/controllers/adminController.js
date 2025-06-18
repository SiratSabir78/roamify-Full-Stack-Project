const User = require("../models/User");

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ email, password, isAdmin: true });
    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }
    res.status(200).json({ message: "Admin login successful", admin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

module.exports = { loginAdmin };
