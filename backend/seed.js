require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const admins = [
  { username: "Areeba", email: "221343@students.au.edu.pk", password: "pass1", isAdmin: true },
  { username: "Sirat", email: "221382@students.au.edu.pk", password: "pass2", isAdmin: true },
  { username: "Hafsa", email: "221460@students.au.edu.pk", password: "pass3", isAdmin: true },
];

async function createAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    for (const adminData of admins) {
      const existingAdmin = await User.findOne({ email: adminData.email });
      if (!existingAdmin) {
        const admin = new User(adminData);
        await admin.save();
        console.log(`Created admin: ${admin.email}`);
      } else {
        console.log(`Admin already exists: ${adminData.email}`);
      }
    }

    console.log("Admin creation script finished.");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error creating admins:", err);
  }
}

createAdmins();
