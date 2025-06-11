// models/Answer.js
const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
); // allow unique ID for each answer

module.exports = AnswerSchema;
