require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Connection error:", err));

app.post("/signup", async (req, res) => {
  try {
    console.log("Received signup:", req.body);
    const user = new User(req.body);
    await user.save();
    res.status(200).json({ message: "User saved successfully!" });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ error: "Failed to save user" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server running on port ${PORT}");


});
