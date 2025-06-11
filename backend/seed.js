<<<<<<< HEAD
// seedCommunityQuestions.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schema
const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: String,
  username: String,
  time: String,
  answers: [
    {
      text: String,
      userId: String,
      username: String,
      time: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.model("Question", questionSchema);

// Sample questions with username and time
const questions = [
  {
    title: "What is the best time to visit Lahore?",
    description:
      "I’m planning a trip to Lahore. When is the weather most pleasant?",
    userId: "user123",
    username: "Ali",
    time: "12:34 Tuesday, 24, 2024",
    answers: [
      {
        text: "March and November are great months—cool and vibrant.",
        userId: "user456",
        username: "Zara",
        time: "13:02 Tuesday, 24, 2024",
      },
    ],
  },
  {
    title: "Safe areas to stay in Karachi?",
    description:
      "Can anyone recommend safe and central places to stay in Karachi?",
    userId: "user789",
    username: "Ahmed",
    time: "14:10 Tuesday, 24, 2024",
    answers: [
      {
        text: "Clifton and DHA are among the safest and well-connected areas.",
        userId: "user123",
        username: "Ali",
        time: "14:32 Tuesday, 24, 2024",
      },
      {
        text: "I’d recommend PECHS too—more affordable and still nice.",
        userId: "user321",
        username: "Sana",
        time: "14:48 Tuesday, 24, 2024",
      },
    ],
  },
  {
    title: "Must-see spots in Islamabad?",
    description: "Looking for top attractions for a weekend in Islamabad.",
    userId: "user234",
    username: "Hina",
    time: "15:20 Tuesday, 24, 2024",
    answers: [
      {
        text: "Faisal Mosque, Daman-e-Koh, and Monal are top picks!",
        userId: "user456",
        username: "Zara",
        time: "15:55 Tuesday, 24, 2024",
      },
    ],
  },
];

// Seed function
async function seed() {
  try {
    await Question.deleteMany();
    await Question.insertMany(questions);
    console.log("✅ Community questions with usernames and time seeded!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    mongoose.connection.close();
  }
}

seed();
=======
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
>>>>>>> hafsa13
