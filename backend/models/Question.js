// models/Question.js
const mongoose = require("mongoose");
const AnswerSchema = require("./Answer");

const QuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    answers: [AnswerSchema], // embed answers inside each question
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
