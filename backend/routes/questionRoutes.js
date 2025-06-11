// routes/questionRoutes.js
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// GET all questions
router.get("/", async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

// POST new question
router.post("/", async (req, res) => {
  const { title, description } = req.body;
  const question = new Question({ title, description });
  await question.save();
  res.status(201).json(question);
});

// POST answer to a question
router.post("/:id/answer", async (req, res) => {
  const { text } = req.body;
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ error: "Question not found" });

  question.answers.push({ text });
  await question.save();
  res.status(201).json(question);
});

// Like an answer
router.post("/:questionId/answer/:answerId/like", async (req, res) => {
  const question = await Question.findById(req.params.questionId);
  if (!question) return res.status(404).json({ error: "Question not found" });

  const answer = question.answers.id(req.params.answerId);
  if (!answer) return res.status(404).json({ error: "Answer not found" });

  answer.likes += 1;
  await question.save();
  res.status(200).json(question);
});

module.exports = router;
