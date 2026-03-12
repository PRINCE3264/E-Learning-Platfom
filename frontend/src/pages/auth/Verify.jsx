import React, { useRef, useState, useEffect } from "react";
import "./verify.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import ReCAPTCHA from "react-google-recaptcha";
import { FaShieldAlt, FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

const Verify = () => {
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [showBtn, setShowBtn] = useState(false);
  const { btnLoading, verifyOtp } = UserData();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (value, index) => {
    // Get only the last character if multiple are entered
    const lastChar = value.slice(-1);

    // Only proceed if it's a digit or empty
    if (!/^\d?$/.test(lastChar)) return;

    const newOtp = [...otp];
    newOtp[index] = lastChar;
    setOtp(newOtp);
    setMessage({ text: "", type: "" });

    // Focus next input if a digit was entered
    if (lastChar && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const otpArray = pastedData.split('');
      setOtp(otpArray);
      if (inputsRef.current[5]) {
        inputsRef.current[5].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setMessage({ text: "Please enter all 6 digits", type: "error" });
      return;
    }

    if (!/^\d{6}$/.test(finalOtp)) {
      setMessage({ text: "OTP must contain only numbers", type: "error" });
      return;
    }

    try {
      await verifyOtp(Number(finalOtp), navigate);
    } catch (error) {
      setMessage({ text: error.message || "Verification failed", type: "error" });
    }
  };

  const handleResendOtp = () => {
    if (canResend) {
      setTimeLeft(300);
      setCanResend(false);
      setOtp(Array(6).fill(""));
      setShowBtn(false);
      setMessage({ text: "New OTP sent to your email!", type: "success" });
      // Add your resend OTP API call here
      if (inputsRef.current[0]) {
        inputsRef.current[0].focus();
      }
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-wrapper">
        <div className="verify-card">
          <div className="card-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Back
            </button>
            <div className="header-row">
              <div className="header-icon">
                <FaShieldAlt />
              </div>
              <h2>Verify Your Account</h2>
            </div>
            <p className="subtitle">
              <FaEnvelope size={12} />
              Check your email for the 6-digit code
            </p>
          </div>

          <div className="timer-bar">
            <div className="timer-info">
              <span className="timer-label">Code expires in</span>
              <span className={`timer-clock ${timeLeft < 60 ? 'warning' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <button
              className={`resend-action ${canResend ? 'active' : ''}`}
              onClick={handleResendOtp}
              disabled={!canResend}
            >
              {canResend ? 'Resend OTP' : 'Please wait...'}
            </button>
          </div>

          {message.text && (
            <div className={`status-msg ${message.type}`}>
              {message.type === 'success' ? <FaCheckCircle /> : <FaShieldAlt />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="otp-form">
            <div className="otp-field-group">
              <label className="otp-title">Enter Verification Code</label>
              <div className="otp-box-container" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`otp-digit-input ${digit ? 'active' : ''}`}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    disabled={btnLoading}
                  />
                ))}
              </div>
            </div>

            <div className="form-footer">
              <div className="captcha-wrapper">
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                  onChange={() => setShowBtn(true)}
                />
              </div>

              {showBtn && (
                <button
                  type="submit"
                  className="verify-submit-btn"
                  disabled={btnLoading}
                >
                  {btnLoading ? <div className="loader-spin"></div> : 'Verify & Continue'}
                </button>
              )}
            </div>
          </form>

          <p className="auth-footer-link">
            Already verified? <Link to="/login">Login here</Link>
          </p>
        </div>

        <div className="security-panel">
          <h3><FaShieldAlt /> Security Overview</h3>
          <ul className="security-hints">
            <li>
              <span className="dot"></span>
              <p>Never share your verification code with anyone else.</p>
            </li>
            <li>
              <span className="dot"></span>
              <p>Our team will never ask for your OTP over phone or chat.</p>
            </li>
            <li>
              <span className="dot"></span>
              <p>The code is only valid for a single registration session.</p>
            </li>
            <li>
              <span className="dot"></span>
              <p>Use the same browser tab where you started the process.</p>
            </li>
            <li>
              <span className="dot"></span>
              <p>Check your spam folder if the email doesn't arrive soon.</p>
            </li>
          </ul>

          <div className="panel-footer">
            <p>Didn't receive code?</p>
            <button
              className={`text-action-btn ${canResend ? 'enabled' : ''}`}
              onClick={handleResendOtp}
              disabled={!canResend}
            >
              {canResend ? 'Resend now' : `Wait ${formatTime(timeLeft)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;