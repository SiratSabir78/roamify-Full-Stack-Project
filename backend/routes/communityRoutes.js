const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// GET all questions
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// GET a specific question with answers
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
  const { title, description, username, userId, time } = req.body;
  try {
    const question = new Question({
      title,
      description,
      username,
      userId,
      time,
    });

    await question.save();
    res.status(201).json({ message: "Question posted", question });
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ error: "Failed to add answer" });
  }
});

// GET answers for a question
router.get("/questions/:id/answers", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });

    res.status(200).json(question.answers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch answers" });
  }
});

// DELETE an answer
router.delete("/questions/:questionId/answers/:answerId", async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) return res.status(404).json({ error: "Question not found" });

    const answerIndex = question.answers.findIndex(
      (ans) => ans._id.toString() === req.params.answerId
    );

    if (answerIndex === -1)
      return res.status(404).json({ error: "Answer not found" });

    question.answers.splice(answerIndex, 1);
    await question.save();

    res.status(200).json({ message: "Answer deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete answer" });
  }
});

// UPDATE an answer
router.put("/questions/:questionId/answers/:answerId", async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) return res.status(404).json({ error: "Question not found" });

    const answer = question.answers.id(req.params.answerId);
    if (!answer) return res.status(404).json({ error: "Answer not found" });

    if (req.body.text) answer.text = req.body.text;
    await question.save();

    res.status(200).json({ message: "Answer updated", updatedAnswer: answer });
  } catch (err) {
    res.status(500).json({ error: "Failed to update answer" });
  }
});

module.exports = router;
