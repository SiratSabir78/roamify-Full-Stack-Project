require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const cityRoutes = require("./routes/city");
const bookingRoutes = require("./routes/booking");
const authRoutes = require("./routes/auth");
const communityRoutes = require("./routes/communityRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// All APIs under /api prefix
app.use("/api/admin", adminRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/users", userRoutes); // ✅ your favorite route lives here

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
