import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/CommunityForum.css";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const CommunityForum = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [askingQuestion, setAskingQuestion] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDesc, setQuestionDesc] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchQuestions();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/community/questions");
      setQuestions(res.data);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const handleAddAnswer = async () => {
    if (!newAnswer.trim()) return;
    if (!user) return alert("⚠️ Please log in to post an answer.");

    try {
      await axios.post(
        `http://localhost:5000/community/questions/${selectedQuestion._id}/answer`,
        {
          text: newAnswer,
          username: user.username,
          userId: user._id,
        }
      );
      setNewAnswer("");
      fetchQuestions();
      const updated = await axios.get(
        `http://localhost:5000/community/questions/${selectedQuestion._id}`
      );
      setSelectedQuestion(updated.data);
    } catch (err) {
      console.error("Error adding answer:", err);
    }
  };

  const handleAskQuestion = async () => {
    if (!questionTitle.trim() || !questionDesc.trim()) return;
    if (!user) return alert("⚠️ Please log in to ask a question.");

    try {
      await axios.post("http://localhost:5000/community/questions", {
        title: questionTitle,
        description: questionDesc,
        username: user.username,
        userId: user._id,
      });
      setQuestionTitle("");
      setQuestionDesc("");
      setAskingQuestion(false);
      fetchQuestions();
    } catch (err) {
      console.error("Error posting question:", err);
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <>
      <Navbar />
      <div className="forum-container">
        <h2>Community Forum (Q&A)</h2>

        {!selectedQuestion && !askingQuestion && (
          <div>
            {user ? (
              <button onClick={() => setAskingQuestion(true)}>
                + Ask a Question
              </button>
            ) : (
              <p style={{ color: "red" }}>
                ⚠️ <Link to="/login">Log in</Link> to ask or answer questions.
              </p>
            )}
          </div>
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
                key={q._id}
                className="question-card"
                onClick={() => setSelectedQuestion(q)}
              >
                <h5>{q.title}</h5>
                <p>{q.description}</p>
                {q.username && (
                  <p>
                    <strong>Posted by:</strong> {q.username} <br />
                    <small>on {formatTime(q.createdAt)}</small>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedQuestion && (
          <div className="answer-section">
            <button onClick={() => setSelectedQuestion(null)}>← Back</button>
            <h3>{selectedQuestion.title}</h3>
            <p>{selectedQuestion.description}</p>
            <p>
              <strong>Posted by:</strong> {selectedQuestion.username} <br />
              <small>on {formatTime(selectedQuestion.createdAt)}</small>
            </p>

            <h5>Answers:</h5>
            {selectedQuestion.answers.length > 0 ? (
              selectedQuestion.answers.map((a) => (
                <div key={a._id} className="answer-card">
                  <p>{a.text}</p>
                  {a.username && (
                    <p>
                      <strong>Answered by:</strong> {a.username} <br />
                      <small>on {formatTime(a.createdAt)}</small>
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p>No answers yet.</p>
            )}

            {user ? (
              <>
                <textarea
                  placeholder="Write your answer..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                ></textarea>
                <br />
                <button onClick={handleAddAnswer}>Post Answer</button>
              </>
            ) : (
              <p style={{ color: "red" }}>
                ⚠️ <Link to="/login">Log in</Link> to post an answer.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CommunityForum;
