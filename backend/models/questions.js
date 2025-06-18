const mongoose = require("mongoose");
const Question = require("./Question");

mongoose
  .connect(
    "mongodb+srv://roamifyDatabase:FnNXqgz5f3ifQ9KJ@roamify.ljiltmx.mongodb.net/?retryWrites=true&w=majority&appName=roamify"
  )
  .then(() => {
    console.log("MongoDB connected");
    return seedData();
  })
  .catch((err) => console.error("MongoDB error:", err));

async function seedData() {
  await Question.deleteMany(); // Optional: clear existing questions

  const questions = [
    {
      title: "What is the best time to visit Lahore?",
      description:
        "I'm planning a trip to Lahore. When is the weather most pleasant?",
      username: "Ali",
      userId: "user123",
      time: "12:34 Tuesday, 24, 2024",
      answers: [
        {
          text: "Spring (March-April) is beautiful in Lahore with pleasant weather and blooming gardens.",
          username: "Sara",
          userId: "user456",
        },
      ],
    },
    {
      title: "Must-see spots in Islamabad?",
      description: "Looking for top attractions for a weekend in Islamabad.",
      username: "Hina",
      userId: "user234",
      time: "15:20 Tuesday, 24, 2024",
      answers: [
        {
          text: "Faisal Mosque, Daman-e-Koh, and Monal restaurant offer the best views.",
          username: "Ahmed",
          userId: "user789",
        },
      ],
    },
    {
      title: "Safe areas to stay in Karachi?",
      description:
        "Can anyone recommend safe and central places to stay in Karachi?",
      username: "Ahmed",
      userId: "user789",
      time: "14:10 Tuesday, 24, 2024",
      answers: [
        {
          text: "Clifton and DHA are among the safest and most well-maintained areas in Karachi.",
          username: "Ali",
          userId: "user123",
        },
      ],
    },
  ];

  try {
    await Question.insertMany(questions);
    console.log("✅ Seeded questions with answers successfully!");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  } finally {
    mongoose.disconnect();
  }
}
