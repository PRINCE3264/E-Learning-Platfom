

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./adminquiz.css";
import Layout from "../Utils/Layout";
import { UserData } from "../../context/UserContext";
import { MdHelpOutline, MdCategory, MdFormatListBulleted, MdCheckCircle, MdAddCircle, MdLayers, MdHistory, MdAnalytics, MdSearch, MdClose, MdRefresh, MdDelete, MdEdit, MdTrendingUp } from "react-icons/md";


const API_URL = "http://localhost:5000/api/quiz";

const AdminQuiz = ({ user, adminSidebarOpen }) => {
  const { user: contextUser } = UserData();
  const currentUser = user || contextUser;

  if (currentUser && (currentUser.role !== "admin" && currentUser.mainrole !== "superadmin")) {
    return null;
  }
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("questions"); // "questions" or "results"
  const [results, setResults] = useState([]);

  const [formData, setFormData] = useState({
    question: "",
    category: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);


  // ===== FETCH DATA =====
  useEffect(() => {
    fetchQuizzes();
    fetchResults();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(API_URL);
      setQuizzes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${API_URL}/all-results`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setResults(res.data);
    } catch (err) {
      console.error("Error fetching results:", err);
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
        await axios.put(`${API_URL}/${editId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        toast.success("Quiz Node Refined Successfully");
      } else {
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        toast.success("New Quiz Node Provisioned");
      }
      fetchQuizzes();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Provisioning Error");
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
    setShowModal(true);
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Authorize Deletion of this Quiz Node?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Quiz Node Terminated");
      fetchQuizzes();
    } catch (err) {
      toast.error("Termination Protocol Failed");
    }
  };

  const resetForm = () => {
    setFormData({
      question: "",
      category: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    });
    setEditId(null);
    setShowModal(false);
  };


  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + "y ago";
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + "mo ago";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + "d ago";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + "h ago";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + "m ago";
    return "just now";
  };

  const filteredQuizzes = quizzes.filter(
    (q) =>
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout adminSidebarOpen={adminSidebarOpen}>
      <div className="admin-users-page">
        {/* ===== ELITE HEADER ===== */}
        <div className="users-header">
          <div className="header-left">
            <h1>Quiz Intelligence</h1>
            <div className="meta-info-bar">
              <span className="subtitle">Knowledge Matrix & Performance Analysis</span>
              <span className="live-date">
                Matrix Clock: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <div className="header-right">
            <button className="add-user-trigger" onClick={() => setShowModal(true)}>
              <MdAddCircle /> Provision Node
            </button>
            <button className="refresh-btn" onClick={() => { fetchQuizzes(); fetchResults(); }} disabled={loading}>
              <MdRefresh className={loading ? "spin" : ""} /> Sync Matrix
            </button>
          </div>
        </div>

        {/* ===== ELITE STATS ===== */}
        <div className="users-stats">
          <div className="user-stat-card total">
            <div className="user-stat-icon"><MdFormatListBulleted /></div>
            <div className="user-stat-content">
              <h3>{quizzes.length}</h3>
              <p>Total Quizzes</p>
            </div>
          </div>
          <div className="user-stat-card admins">
            <div className="user-stat-icon"><MdCategory /></div>
            <div className="user-stat-content">
              <h3>{new Set(quizzes.map((q) => q.category)).size}</h3>
              <p>Categories</p>
            </div>
          </div>
          <div className="user-stat-card active">
            <div className="user-stat-icon"><MdHistory /></div>
            <div className="user-stat-content">
              <h3>{results.length}</h3>
              <p>Performance Logs</p>
            </div>
          </div>
          <div className="user-stat-card enrollments">
            <div className="user-stat-icon"><MdTrendingUp /></div>
            <div className="user-stat-content">
              <h3>
                {results.length > 0
                  ? (results.reduce((acc, r) => acc + r.percentage, 0) / results.length).toFixed(1)
                  : "0.0"}%
              </h3>
              <p>Avg. Efficiency</p>
            </div>
          </div>
        </div>

        {/* ===== TAB NAVIGATION ===== */}
        <div className="tab-navigation-elite">
          <button
            className={`tab-btn ${activeTab === "questions" ? "active" : ""}`}
            onClick={() => setActiveTab("questions")}
          >
            <MdLayers /> Matrix Questions
          </button>
          <button
            className={`tab-btn ${activeTab === "results" ? "active" : ""}`}
            onClick={() => setActiveTab("results")}
          >
            <MdHistory /> Performance Logs
          </button>
        </div>

        {activeTab === "questions" ? (
          <div className="users-filters">
            <div className="search-box">
              <MdSearch className="search-icon" />
              <input
                className="search-input"
                type="text"
                placeholder="Query the quiz matrix (Question or Category)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="users-filters">
            <div className="search-box">
              <MdSearch className="search-icon" />
              <input
                className="search-input"
                type="text"
                placeholder="Filter results by User or Quiz..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="refresh-btn-elite" onClick={fetchResults}>
              <MdRefresh /> Sync Results
            </button>
          </div>
        )}

        {/* ===== ELITE TABLE ===== */}
        <div className="users-table-container">
          {activeTab === "questions" ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Question Engineering</th>
                  <th>Category Sector</th>
                  <th>Option Vectors</th>
                  <th>Validation Key</th>
                  <th>Protocol Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuizzes.map((quiz) => (
                  <tr key={quiz._id}>
                    <td>
                      <div className="user-info-cell">
                        <div className="user-details">
                          <span className="user-name">{quiz.question}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="authority-tag admin">
                        {quiz.category}
                      </span>
                    </td>
                    <td>
                      <div className="options-stack">
                        {quiz.options.map((o, i) => (
                          <span key={i} className={`option-pill ${o === quiz.correctAnswer ? 'correct' : ''}`}>
                            {o}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="clearance-level premium">
                        {quiz.correctAnswer}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-elite">
                        <button className="action-btn edit" onClick={() => handleEdit(quiz)} title="Edit Node">
                          <MdEdit />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(quiz._id)} title="Decommission Node">
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredQuizzes.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-row-elite">
                      Matrix contains no matching nodes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Learner Identity</th>
                  <th>Quiz Vector (Category)</th>
                  <th>Score Payload</th>
                  <th>Efficiency %</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {results
                  .filter(r =>
                    r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                    r.category?.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((res) => (
                    <tr key={res._id}>
                      <td>
                        <div className="user-info-cell">
                          <div className="user-avatar-mini">
                            {res.user?.name?.charAt(0) || "U"}
                          </div>
                          <div className="user-details">
                            <span className="user-name">{res.user?.name || "Unknown"}</span>
                            <span className="user-email">{res.user?.email || "N/A"}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="category-pill-elite">
                          {res.category}
                        </span>
                      </td>
                      <td>
                        <span className="score-badge">
                          {res.score} / {res.totalQuestions}
                        </span>
                      </td>
                      <td>
                        <div className="efficiency-wrapper-premium">
                          <div className="efficiency-bar-container">
                            <div
                              className="efficiency-bar"
                              style={{
                                width: `${res.percentage}%`,
                                backgroundColor: res.percentage >= 80 ? '#10b981' : res.percentage >= 50 ? '#f59e0b' : '#ef4444'
                              }}
                            ></div>
                          </div>
                          <span className="percent-text-pro">{Math.round(res.percentage)}%</span>
                        </div>
                      </td>
                      <td>
                        <span className="timestamp-text">
                          {timeAgo(res.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}

                {results.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-row-elite">
                      No performance logs detected in the system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ===== ELITE PROVISIONING MODAL ===== */}
        {showModal && (
          <div className="user-modal-overlay">
            <div className="user-form-modal elite-variant">
              <div className="modal-header-elite">
                <div className="header-main-content">
                  <div className="header-brand-icon">
                    {editId ? <MdLayers /> : <MdAddCircle />}
                  </div>
                  <div className="header-titles">
                    <h2>{editId ? "Node Refinement" : "Quiz Provisioning"}</h2>
                    <p>{editId ? "Modifying existing knowledge infrastructure." : "Deploying new evaluation nodes to the matrix."}</p>
                  </div>
                </div>
                <button className="close-elite-btn" onClick={resetForm}>
                  <MdClose />
                </button>
              </div>

              <div className="modal-grid-layout">
                <form onSubmit={handleSubmit} className="elite-onboarding-form">
                  <div className="form-segment">
                    <label className="segment-indicator">01. Core Inquiry</label>
                    <div className="form-group-elite">
                      <label><MdHelpOutline /> Question Blueprint</label>
                      <div className="elite-input-wrapper">
                        <MdHelpOutline className="elite-field-icon" style={{ top: '15px' }} />
                        <textarea
                          name="question"
                          placeholder="What is the architectural foundation of..."
                          value={formData.question}
                          onChange={handleChange}
                          required
                          rows="3"
                        />
                      </div>
                    </div>

                    <div className="form-group-elite">
                      <label><MdCategory /> Sector Designation</label>
                      <div className="elite-input-wrapper">
                        <MdCategory className="elite-field-icon" />
                        <input
                          type="text"
                          name="category"
                          placeholder="e.g. React Architecture"
                          value={formData.category}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-segment">
                    <label className="segment-indicator">02. Vector Matrix (Options)</label>
                    <div className="elite-horizontal-stack-grid">
                      {formData.options.map((opt, i) => (
                        <div key={i} className="form-group-elite">
                          <label>Vector {i + 1}</label>
                          <div className="elite-input-wrapper">
                            <MdFormatListBulleted className="elite-field-icon" />
                            <input
                              type="text"
                              placeholder={`Option Data...`}
                              value={opt}
                              onChange={(e) => handleOptionChange(i, e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="form-group-elite">
                      <label><MdCheckCircle /> Validation Key (Correct Answer)</label>
                      <div className="elite-input-wrapper">
                        <MdCheckCircle className="elite-field-icon" />
                        <select
                          name="correctAnswer"
                          value={formData.correctAnswer}
                          onChange={handleChange}
                          required
                          className="elite-select"
                        >
                          <option value="">Select Validation Key</option>
                          {formData.options.map((opt, i) => (
                            opt && <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="elite-form-actions">
                    <button type="submit" disabled={loading} className="elite-cta-primary">
                      {loading ? (
                        <span className="sync-box">Syncing...</span>
                      ) : (
                        <>{editId ? "Update Node" : "Execute Provision"}</>
                      )}
                    </button>
                    <button type="button" onClick={resetForm} className="elite-cta-secondary">
                      Abort Protocol
                    </button>
                  </div>
                </form>

                <div className="identity-preview-panel">
                  <div className="preview-label">Matrix Vision Preview</div>
                  <div className="identity-card-wireframe">
                    <div className="wireframe-avatar squircle-glow">
                      <MdLayers style={{ fontSize: '32px' }} />
                    </div>
                    <div className="wireframe-info">
                      <h4>{formData.question.substring(0, 40) + (formData.question.length > 40 ? "..." : "") || "Awaiting Blueprint..."}</h4>
                      <p>{formData.category || "Awaiting Sector..."}</p>
                    </div>
                    <div className="wireframe-stats">
                      <div className="stat-node">
                        <label>VECTORS</label>
                        <span>{formData.options.filter(o => o).length} / 4</span>
                      </div>
                      <div className="stat-node">
                        <label>STATUS</label>
                        <span style={{ color: formData.correctAnswer ? '#22c55e' : '#f59e0b' }}>
                          {formData.correctAnswer ? "VAL-READY" : "PENDING"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="elite-preview-list">
                    {formData.options.map((opt, i) => (
                      opt && (
                        <div key={i} className={`preview-item ${opt === formData.correctAnswer ? 'active' : ''}`}>
                          <MdCheckCircle className="item-icon" />
                          <span>{opt}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );

};

export default AdminQuiz;



