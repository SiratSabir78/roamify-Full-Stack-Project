const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// GET all questions
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// GET a specific question by ID
router.get("/questions/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });

    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch question" });
  }
});

// POST a new question
router.post("/questions", async (req, res) => {
  const { title, description, username, userId } = req.body;

  try {
    const question = new Question({
      title,
      description,
      username,
      userId,
    });

    await question.save();
    res.status(201).json({ message: "Question posted", question });
  } catch (err) {
    res.status(500).json({ error: "Failed to post question" });
  }
});

// POST an answer to a question
router.post("/questions/:id/answer", async (req, res) => {
  const { text, username, userId } = req.body;

  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });

    question.answers.push({ text, username, userId });
    await question.save();

    res
      .status(201)
      .json({ message: "Answer added", answers: question.answers });
  } catch (err) {
    res.status(500).json({ error: "Failed to add answer" });
  }
});

module.exports = router;
