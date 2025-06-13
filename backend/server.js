require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");

const adminRoutes = require("./routes/admin");
const cityRoutes = require("./routes/city");
const bookingRoutes = require("./routes/booking");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Connection error:", err));

// Existing signup route
// --- Signup Route ---
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


app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find().sort({ _id: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching questions" });
  }
});

app.get("/api/questions/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: "Error fetching question" });
  }
});

app.post("/api/questions", async (req, res) => {
  const { title, description, username, time } = req.body;
  try {
    const question = new Question({ title, description, username, time });
    await question.save();
    res.status(201).json({ message: "Question posted!" });
  } catch (err) {
    res.status(500).json({ error: "Error saving question" });
  }
});

app.post("/api/questions/:id/answer", async (req, res) => {
  const { text, username, time } = req.body;
  try {
    const question = await Question.findById(req.params.id);
    question.answers.push({ text, username, time });
    await question.save();
    res.status(201).json({ message: "Answer added!" });
  } catch (err) {
    res.status(500).json({ error: "Error posting answer" });
  }
});
// Admin, City and Booking routes
app.use("/admin", adminRoutes);
app.use("/cities", cityRoutes);
app.use("/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
