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

app.use("/admin", adminRoutes);
app.use("/cities", cityRoutes); // GET /cities/:id etc
app.use("/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", communityRoutes);

// Only one user route base for consistency:
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
