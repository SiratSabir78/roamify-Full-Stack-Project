import React, { useState } from "react";
import "./CSS/CommunityForum.css";

const CommunityForum = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "What are the must-visit places in Lahore?",
      description:
        "I'm visiting Lahore for the first time. Any recommendations?",
      answers: [
        {
          id: 1,
          text: "Definitely Badshahi Mosque and Lahore Fort!",
          likes: 3,
        },
        { id: 2, text: "Try food street in old Lahore at night.", likes: 5 },
      ],
    },
    {
      id: 2,
      title: "Best time to visit Hunza Valley?",
      description: "Planning a trip with family. Weather concerns?",
      answers: [
        { id: 1, text: "April to September is beautiful.", likes: 2 },
        { id: 2, text: "Avoid winter unless you're used to snow.", likes: 1 },
      ],
    },
  ]);

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [askingQuestion, setAskingQuestion] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDesc, setQuestionDesc] = useState("");

  const handleLike = (questionId, answerId) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            answers: q.answers.map((a) =>
              a.id === answerId ? { ...a, likes: a.likes + 1 } : a
            ),
          }
        : q
    );
    setQuestions(updatedQuestions);
  };

  const handleAddAnswer = () => {
    if (!newAnswer.trim()) return;

    const updatedQuestions = questions.map((q) =>
      q.id === selectedQuestion.id
        ? {
            ...q,
            answers: [
              ...q.answers,
              {
                id: Date.now(),
                text: newAnswer,
                likes: 0,
              },
            ],
          }
        : q
    );

    setQuestions(updatedQuestions);
    setNewAnswer("");
  };

  const handleAskQuestion = () => {
    if (!questionTitle.trim() || !questionDesc.trim()) return;

    const newQuestion = {
      id: Date.now(),
      title: questionTitle,
      description: questionDesc,
      answers: [],
    };

    setQuestions([newQuestion, ...questions]);
    setQuestionTitle("");
    setQuestionDesc("");
    setAskingQuestion(false);
  };

  return (
    <div className="forum-container">
      <h2>Community Forum (Q&A)</h2>

      {!selectedQuestion && !askingQuestion && (
        <button onClick={() => setAskingQuestion(true)}>
          + Ask a Question
        </button>
      )}

      {askingQuestion && (
        <div className="ask-question-form">
          <h3>Ask a New Question</h3>
          <input
            type="text"
            placeholder="Enter question title..."
            value={questionTitle}
            onChange={(e) => setQuestionTitle(e.target.value)}
          />
          <textarea
            placeholder="Describe your question in detail..."
            value={questionDesc}
            onChange={(e) => setQuestionDesc(e.target.value)}
          />
          <br />
          <button onClick={handleAskQuestion}>Post Question</button>
          <button onClick={() => setAskingQuestion(false)}>Cancel</button>
        </div>
      )}

      {!selectedQuestion && !askingQuestion && (
        <div>
          <h4>Questions:</h4>
          {questions.map((q) => (
            <div
              key={q.id}
              className="question-card"
              onClick={() => setSelectedQuestion(q)}
            >
              <h5>{q.title}</h5>
              <p>{q.description}</p>
            </div>
          ))}
        </div>
      )}

      {selectedQuestion && (
        <div className="answer-section">
          <button onClick={() => setSelectedQuestion(null)}>← Back</button>
          <h3>{selectedQuestion.title}</h3>
          <p>{selectedQuestion.description}</p>

          <h5>Answers:</h5>
          {selectedQuestion.answers.map((a) => (
            <div key={a.id} className="answer-card">
              <p>{a.text}</p>
              <button onClick={() => handleLike(selectedQuestion.id, a.id)}>
                👍 {a.likes}
              </button>
            </div>
          ))}

          <textarea
            placeholder="Write your answer..."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
          ></textarea>
          <br />
          <button onClick={handleAddAnswer}>Post Answer</button>
        </div>
      )}
    </div>
  );
};

export default CommunityForum;
