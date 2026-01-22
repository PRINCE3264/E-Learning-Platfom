

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adminquiz.css";
import Layout from "../Utils/Layout";

const API_URL = "http://localhost:5000/api/quiz";

const AdminQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    question: "",
    category: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  const [editId, setEditId] = useState(null);

  // ===== FETCH QUIZZES =====
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(API_URL);
      setQuizzes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== HANDLERS =====
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const updated = [...formData.options];
    updated[index] = value;
    setFormData({ ...formData, options: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchQuizzes();
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (quiz) => {
    setFormData({
      question: quiz.question,
      category: quiz.category,
      options: quiz.options,
      correctAnswer: quiz.correctAnswer,
    });
    setEditId(quiz._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    await axios.delete(`${API_URL}/${id}`);
    fetchQuizzes();
  };

  const resetForm = () => {
    setFormData({
      question: "",
      category: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    });
    setEditId(null);
  };

  const filteredQuizzes = quizzes.filter(
    (q) =>
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="admin-quiz-page">
        {/* ===== STATS ===== */}
        <div className="quiz-stats">
          <div className="stat-card purple">
            <h3>{quizzes.length}</h3>
            <p>Total Quizzes</p>
          </div>
          <div className="stat-card blue">
            <h3>{new Set(quizzes.map((q) => q.category)).size}</h3>
            <p>Categories</p>
          </div>
          <div className="stat-card green">
            <h3>{quizzes.length * 4}</h3>
            <p>Total Options</p>
          </div>
        </div>

        {/* ===== FORM ===== */}
        <form className="quiz-form" onSubmit={handleSubmit}>
          <h3>{editId ? "✏️ Edit Quiz" : "➕ Add New Quiz"}</h3>

          <input
            type="text"
            name="question"
            placeholder="Quiz Question"
            value={formData.question}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />

          <div className="options-grid">
            {formData.options.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) =>
                  handleOptionChange(i, e.target.value)
                }
                required
              />
            ))}
          </div>

          <input
            type="text"
            name="correctAnswer"
            placeholder="Correct Answer"
            value={formData.correctAnswer}
            onChange={handleChange}
            required
          />

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : editId
                ? "Update Quiz"
                : "Add Quiz"}
            </button>

            {editId && (
              <button
                type="button"
                className="reset-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* ===== SEARCH ===== */}
        <input
          className="search-input"
          type="text"
          placeholder="Search quizzes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ===== TABLE ===== */}
        <div className="quiz-table-wrapper">
          <table className="quiz-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Category</th>
                <th>Options</th>
                <th>Correct</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuizzes.map((quiz) => (
                <tr key={quiz._id}>
                  <td>{quiz.question}</td>
                  <td>
                    <span className="category-badge">
                      {quiz.category}
                    </span>
                  </td>
                  <td>
                    {quiz.options.map((o, i) => (
                      <span key={i} className="option-badge">
                        {o}
                      </span>
                    ))}
                  </td>
                  <td className="correct-answer">
                    {quiz.correctAnswer}
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(quiz)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(quiz._id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredQuizzes.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-row">
                    No quizzes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminQuiz;



