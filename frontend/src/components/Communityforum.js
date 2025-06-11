import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/CommunityForum.css";
import { Link } from "react-router-dom";

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
      const res = await axios.get("http://localhost:5000/api/questions");
      setQuestions(res.data);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const handleAddAnswer = async () => {
    if (!newAnswer.trim()) return;
    if (!user) return alert("Please log in to post an answer.");

    try {
      await axios.post(
        `http://localhost:5000/api/questions/${selectedQuestion._id}/answer`,
        {
          text: newAnswer,
          username: user.username, // include username if your schema allows it
        }
      );
      setNewAnswer("");
      fetchQuestions();
      const updated = await axios.get(
        `http://localhost:5000/api/questions/${selectedQuestion._id}`
      );
      setSelectedQuestion(updated.data);
    } catch (err) {
      console.error("Error adding answer:", err);
    }
  };

  const handleAskQuestion = async () => {
    if (!questionTitle.trim() || !questionDesc.trim()) return;
    if (!user) return alert("Please log in to ask a question.");

    try {
      await axios.post("http://localhost:5000/api/questions", {
        title: questionTitle,
        description: questionDesc,
        username: user.username, // optional
      });
      setQuestionTitle("");
      setQuestionDesc("");
      setAskingQuestion(false);
      fetchQuestions();
    } catch (err) {
      console.error("Error posting question:", err);
    }
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
          {user ? (
            <>
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
            </>
          ) : (
            <p style={{ color: "red" }}>
              ⚠️ Please <Link to="/login">log in</Link> to ask a question.
            </p>
          )}
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
                  <strong>Posted by:</strong> {q.username}
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

          <h5>Answers:</h5>
          {selectedQuestion.answers.map((a) => (
            <div key={a._id} className="answer-card">
              <p>{a.text}</p>
              {a.username && (
                <p>
                  <strong>Answered by:</strong> {a.username}
                </p>
              )}
            </div>
          ))}

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
              ⚠️ Please <Link to="/login">log in</Link> to answer this question.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityForum;
