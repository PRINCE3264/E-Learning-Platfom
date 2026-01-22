

import React, { useEffect, useState } from "react";
import { getQuizzes, submitQuiz } from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Quiz.css";

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);

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

  // Handle option select
  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
    
    // Update answered count
    const newAnsweredCount = updated.filter(answer => answer !== "").length;
    setAnsweredCount(newAnsweredCount);
  };

  // Submit quiz
  const handleSubmit = async () => {
    if (!userEmail) {
      toast.warning("Please enter your email");
      return;
    }

    if (answers.includes("")) {
      toast.warning(`Please answer all ${quizzes.length - answeredCount} remaining questions`);
      return;
    }

    setLoading(true);

    try {
      const response = await submitQuiz(userEmail, answers);

      if (response && (response.success || response.message)) {
        toast.success("✅ Quiz submitted successfully! Results sent to your email.", {
          autoClose: 5000
        });

        // Reset form
        setAnswers(new Array(quizzes.length).fill(""));
        setUserEmail("");
        setAnsweredCount(0);
      } else {
        toast.error(response?.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while submitting quiz");
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress percentage
  const progressPercentage = quizzes.length > 0 
    ? Math.round((answeredCount / quizzes.length) * 100) 
    : 0;

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <h1>📝 Online Assessment</h1>
        <p>Test your knowledge with our interactive quiz. Complete all questions to receive your results via email.</p>
      </div>

      {/* Instructions */}
      <div className="instructions-box">
        <h4>📋 Instructions:</h4>
        <ul>
          <li>Read each question carefully before selecting an answer</li>
          <li>You must answer all questions before submitting</li>
          <li>Results will be sent to the email address you provide</li>
          <li>You cannot change answers after submission</li>
        </ul>
      </div>

      {/* Progress Indicator */}
      {quizzes.length > 0 && (
        <div className="progress-indicator">
          <div className="progress-text">
            <span className="answered-count">{answeredCount}</span>
            <span>of {quizzes.length} questions answered</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {progressPercentage}% complete
          </div>
        </div>
      )}

      {/* EMAIL */}
      <div className="email-box">
        <label>📧 Email Address for Results</label>
        <input
          type="email"
          placeholder="Enter your email to receive results"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
        <p style={{
          fontSize: "0.9rem",
          color: "#7f8c8d",
          marginTop: "10px",
          marginBottom: "0"
        }}>
          Your results will be sent to this email address
        </p>
      </div>

      {/* QUESTIONS */}
      <div className="questions">
        {quizzes.map((q, index) => (
          <div className="question-card" key={q._id || index}>
            <h3>
              Q{index + 1}. {q.question}
            </h3>

            {q.options.map((opt, i) => {
              const optionLetter = String.fromCharCode(65 + i); // A, B, C, D
              return (
                <label className="option" key={i}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={opt}
                    checked={answers[index] === opt}
                    onChange={() => handleChange(index, opt)}
                  />
                  <span>
                    <span className="option-letter">{optionLetter}</span>
                    {opt}
                  </span>
                </label>
              );
            })}
            
            {/* Question Status */}
            <div className="question-status">
              {answers[index] ? (
                <div className="status-answered">
                  <span>✓</span>
                  <span>Answered</span>
                </div>
              ) : (
                <div className="status-pending">
                  <span>⏳</span>
                  <span>Not answered yet</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* SUBMIT */}
      <div className="submit-box">
        <button 
          onClick={handleSubmit} 
          disabled={loading || answeredCount !== quizzes.length}
          style={{
            opacity: answeredCount !== quizzes.length ? 0.7 : 1
          }}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Submitting...
            </>
          ) : (
            "Submit Quiz"
          )}
        </button>
        
        {/* Status Messages */}
        {answeredCount === 0 && quizzes.length > 0 && (
          <div className="message message-warning">
            Start answering questions to submit the quiz
          </div>
        )}
        
        {answeredCount > 0 && answeredCount < quizzes.length && (
          <div className="message message-warning">
            ⚠️ {quizzes.length - answeredCount} more question(s) to answer
          </div>
        )}
        
        {answeredCount === quizzes.length && quizzes.length > 0 && (
          <div className="message message-success">
            ✅ All questions answered! Ready to submit.
          </div>
        )}
        
        <p style={{
          marginTop: "20px",
          fontSize: "0.9rem",
          color: "#7f8c8d"
        }}>
          By submitting, you agree to receive your quiz results via email.
        </p>
      </div>

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