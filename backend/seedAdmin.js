require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User"); // Adjust the path as needed

const adminUsers = [
  {
    username: "areeba",
    email: "221343@students.au.edu.pk",
    phone: "03001234567",
    address: "Admin Block, AU",
    gender: "female",
    password: "pass1",
    image: "",
    reviews: [],
    favouriteCities: [],
    citiesTravelled: [],
    questions: [],
    isAdmin: true,
  },
  {
    username: "sirat",
    email: "221382@students.au.edu.pk",
    phone: "03111234567",
    address: "Admin Block, AU",
    gender: "female",
    password: "pass2",
    image: "",
    reviews: [],
    favouriteCities: [],
    citiesTravelled: [],
    questions: [],
    isAdmin: true,
  },
  {
    username: "hafsa",
    email: "221460@students.au.edu.pk",
    phone: "03221234567",
    address: "Admin Block, AU",
    gender: "female",
    password: "pass3",
    image: "",
    reviews: [],
    favouriteCities: [],
    citiesTravelled: [],
    questions: [],
    isAdmin: true,
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await User.deleteMany({ isAdmin: true }); 
    await User.insertMany(adminUsers);
    console.log("✅ Seeded admin users!");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
