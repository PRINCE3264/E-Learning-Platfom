
import React, { useEffect, useState, useRef } from "react";
import { getQuizzes, submitQuiz } from "../../services/api";
import { UserData } from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import {
  FaQuestionCircle,
  FaInfoCircle,
  FaCheckCircle,
  FaHourglassHalf,
  FaPaperPlane,
  FaTrophy,
  FaClipboardList,
  FaEnvelope,
  FaClock,
  FaPlayCircle
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./Quiz.css";
const Quiz = ({ adminSidebarOpen }) => {
  const { user } = UserData();
  const isAdmin = user?.role === "admin" || user?.mainrole === "superadmin";

  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)

  const timerRef = useRef(null);
  // Pre-fill email if logged in
  useEffect(() => {
    if (user && user.email) {
      setUserEmail(user.email);
    }
  }, [user]);

  // Fetch quizzes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getQuizzes();

        if (Array.isArray(data)) {
          setQuizzes(data);
          setAnswers(new Array(data.length).fill(""));
          setAnsweredCount(0);
        } else {
          toast.error("Invalid quiz data");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching quizzes");
      }
    };

    fetchData();
  }, []);

  // Timer logic
  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      toast.info("⌛ Time is up! Submitting your answers automatically.");
      handleAutoSubmit();
    }
    return () => clearInterval(timerRef.current);
  }, [quizStarted, timeLeft]);

  const handleStartQuiz = () => {
    if (!userEmail) {
      toast.warning("Please enter your email to start the assessment.");
      return;
    }
    setQuizStarted(true);
    toast.success("Ready, set, go! 🚀 Assessment started.");
  };

  // Handle option select
  const handleChange = (index, value) => {
    if (!quizStarted) return;
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);

    // Update answered count
    const newAnsweredCount = updated.filter(answer => answer !== "").length;
    setAnsweredCount(newAnsweredCount);
  };

  const handleAutoSubmit = () => {
    // If auto-submitting after time out, we don't care about the empty answers check
    performSubmission(true);
  };

  // Submit quiz
  const handleSubmit = async () => {
    if (answers.includes("")) {
      toast.warning(`Please answer all ${quizzes.length - answeredCount} remaining questions`);
      return;
    }
    performSubmission(false);
  };

  const performSubmission = async (isAuto = false) => {
    setLoading(true);
    try {
      const response = await submitQuiz(userEmail, answers);
      if (response && (response.success || response.message)) {
        toast.success("✅ Assessment submitted! Check your score below.");
        setQuizResults(response); // Store results (assuming it contains score/percentage)
        setQuizStarted(false);
        setAnswers(new Array(quizzes.length).fill(""));
        setAnsweredCount(0);
        setTimeLeft(600);
      } else {
        toast.error(response?.message || "Submission failed");
      }
    } catch (err) {
      toast.error("Server error while submitting quiz");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate progress percentage
  const progressPercentage = quizzes.length > 0
    ? Math.round((answeredCount / quizzes.length) * 100)
    : 0;

  return (
    <div className={`quiz-portal-wrapper ${isAdmin && adminSidebarOpen ? 'admin-sidebar-active' : ''}`}>
      <div className="quiz-portal-hero">
        <div className="quiz-portal-hero-content">
          <span className="badge">Assessment Matrix</span>
          <h1>Precision <span className="gradient-text">Online Assessment</span></h1>
          <p>Sharpen your skills and validate your knowledge with our premium interactive knowledge portal.</p>
        </div>
      </div>

      {quizResults ? (
        <div className="quiz-portal-score-screen">
          <div className="quiz-portal-card quiz-portal-score-card">
            <div className={`quiz-portal-score-badge ${quizResults.percentage > 70 ? 'quiz-portal-elite' : 'quiz-portal-improving'}`}>
              <FaTrophy />
              <span>{quizResults.percentage}%</span>
            </div>
            <h2>Performance Report</h2>
            <div className="quiz-portal-score-details">
              <div className="quiz-portal-score-item">
                <span className="quiz-portal-label">Total Score</span>
                <span className="quiz-portal-value">{quizResults.score} / {quizzes.length * 10}</span>
              </div>
              <div className="quiz-portal-score-item">
                <span className="quiz-portal-label">Efficiency</span>
                <span className="quiz-portal-value">{quizResults.percentage}%</span>
              </div>
            </div>
            <p className="quiz-portal-score-message">
              {quizResults.percentage > 70
                ? "Excellent! You've mastered this knowledge matrix."
                : "Good effort! Continue sync with our learning modules to improve."}
            </p>
            <button className="quiz-portal-start-btn" onClick={() => setQuizResults(null)}>
              Retake Assessment <FaPlayCircle />
            </button>
          </div>
        </div>
      ) : !quizStarted ? (
        <div className="quiz-portal-start-screen">
          <div className="quiz-portal-card quiz-portal-start-card">
            <FaPlayCircle className="quiz-portal-start-icon" />
            <h2>Ready to Begin?</h2>
            <p>You will have <strong>10 minutes</strong> to complete the assessment once you start.</p>

            <div className="quiz-portal-email-section">
              <label>Confirm Your Email</label>
              <div className="quiz-portal-input-wrapper">
                <FaEnvelope className="quiz-portal-input-icon" />
                <input
                  type="email"
                  placeholder="Enter email to receive scorecard"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="quiz-portal-start-btn" onClick={handleStartQuiz}>
              Start Assessment Now <FaPlayCircle />
            </button>
            <p className="quiz-portal-start-hint">Your results will be sent to the email provided above.</p>
          </div>
        </div>
      ) : (
        <div className="quiz-portal-container">
          <div className="quiz-portal-grid">
            {/* Left Column: Instructions & Status */}
            <div className="quiz-portal-sidebar">
              <div className={`quiz-portal-card quiz-portal-clock-card ${timeLeft < 60 ? 'critical' : ''}`}>
                <h3><FaClock /> Remaining Time</h3>
                <div className="quiz-portal-timer-display">
                  {formatTime(timeLeft)}
                </div>
                {timeLeft < 60 && <p className="quiz-portal-timer-alert">Hurry up! Less than a minute left.</p>}
              </div>

              <div className="quiz-portal-card quiz-portal-stats-card">
                <h3><FaClipboardList /> Quiz Status</h3>
                <div className="quiz-portal-stat-item">
                  <span className="quiz-portal-label">Questions</span>
                  <span className="quiz-portal-value">{quizzes.length}</span>
                </div>
                <div className="quiz-portal-stat-item">
                  <span className="quiz-portal-label">Answered</span>
                  <span className="quiz-portal-value quiz-portal-answered">{answeredCount}</span>
                </div>

                <div className="quiz-portal-progress-section">
                  <div className="quiz-portal-progress-header">
                    <span>Current Progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="quiz-portal-progress-bar">
                    <div className="quiz-portal-progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="quiz-portal-card quiz-portal-instructions-card">
                <h3><FaInfoCircle /> Guidelines</h3>
                <ul>
                  <li><FaCheckCircle className="quiz-portal-li-icon" /> Finish within 10 minutes limit.</li>
                  <li><FaCheckCircle className="quiz-portal-li-icon" /> All fields are mandatory.</li>
                  <li><FaCheckCircle className="quiz-portal-li-icon" /> Results sent to: <br /><strong>{userEmail}</strong></li>
                </ul>
              </div>
            </div>

            {/* Right Column: Questions */}
            <div className="quiz-portal-main">
              <div className="quiz-portal-questions-wrapper">
                {quizzes.map((q, index) => {
                  const isAnswered = answers[index] !== "";
                  return (
                    <div
                      className={`quiz-portal-card quiz-portal-question-card ${isAnswered ? 'quiz-portal-is-answered' : ''}`}
                      key={q._id || index}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="quiz-portal-q-header">
                        <span className="quiz-portal-q-number">{index + 1}</span>
                        <h3>{q.question}</h3>
                      </div>

                      <div className="quiz-portal-options-grid">
                        {q.options.map((opt, i) => {
                          const optionLetter = String.fromCharCode(65 + i);
                          return (
                            <label className={`quiz-portal-option ${answers[index] === opt ? 'quiz-portal-selected' : ''}`} key={i}>
                              <input
                                type="radio"
                                name={`question-${index}`}
                                checked={answers[index] === opt}
                                onChange={() => handleChange(index, opt)}
                                aria-label={`Option ${optionLetter}`}
                              />
                              <span className="quiz-portal-opt-letter">{optionLetter}</span>
                              <span className="quiz-portal-opt-text">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="quiz-portal-submit-section">
                <button
                  className={`quiz-portal-submit-btn ${(answeredCount === quizzes.length && !loading) ? 'quiz-portal-ready' : ''}`}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="quiz-portal-loader"></span>
                  ) : (
                    <>Submit Assessment <FaPaperPlane className="quiz-portal-btn-icon" /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Quiz;