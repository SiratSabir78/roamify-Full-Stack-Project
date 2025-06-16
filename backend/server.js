// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Route imports
const userRoutes = require("./routes/user");
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
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
// All frontend-used routes go under the /api prefix for consistency
app.use("/api/auth", authRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api", communityRoutes);

// Admin routes (not under /api if not needed by frontend directly)
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
