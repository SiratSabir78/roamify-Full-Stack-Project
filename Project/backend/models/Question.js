const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    text: String,
    username: String,
    userId: String,
  },
  { timestamps: true }
);

const questionSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    username: String,
    userId: String,
    answers: [answerSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
