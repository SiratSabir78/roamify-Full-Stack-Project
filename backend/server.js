require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const adminRoutes = require("./routes/admin");
const cityRoutes = require("./routes/city");
const bookingRoutes = require("./routes/booking");
const authRoutes = require("./routes/auth");
const communityRoutes = require("./routes/communityRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/admin", adminRoutes);
app.use("/cities", cityRoutes);
app.use("/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", communityRoutes); // <-- All question/answer routes are under /api/questions

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
