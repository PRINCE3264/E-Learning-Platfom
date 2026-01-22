


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
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setMessage({ text: "", type: "" });

    if (value && index < 5) {
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
      <div className="verify-container">
        <div className="verify-card">
          <div className="card-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Back
            </button>
            <div className="header-icon">
              <FaShieldAlt />
            </div>
            <h2>Verify Your Account</h2>
            <p className="subtitle">
              <FaEnvelope /> Enter the 6-digit verification code sent to your email
            </p>
          </div>

          <div className="timer-section">
            <div className="timer-display">
              <span className="timer-label">Code expires in:</span>
              <span className={`timer ${timeLeft < 60 ? 'warning' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <button 
              className={`resend-btn ${canResend ? 'active' : ''}`}
              onClick={handleResendOtp}
              disabled={!canResend}
            >
              {canResend ? 'Resend OTP' : 'Resend'}
            </button>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              <FaCheckCircle /> {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div 
              className="otp-container" 
              onPaste={handlePaste}
            >
              <label className="otp-label">Enter OTP:</label>
              <div className="otp-box">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`otp-input ${digit ? 'filled' : ''}`}
                    inputMode="numeric"
                    autoComplete="off"
                    disabled={btnLoading}
                  />
                ))}
              </div>
            </div>

            <div className="captcha-container">
              <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                onChange={() => setShowBtn(true)}
                theme="light"
                size="normal"
              />
            </div>

            {showBtn && (
              <button 
                type="submit" 
                className="submit-btn"
                disabled={btnLoading}
              >
                {btnLoading ? (
                  <>
                    <div className="spinner"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify Account'
                )}
              </button>
            )}
          </form>

          <div className="card-footer">
            <p>
              Didn't receive code?{' '}
              <button 
                className={`link-btn ${canResend ? 'active' : ''}`}
                onClick={handleResendOtp}
                disabled={!canResend}
              >
                {canResend ? 'Resend now' : `Resend in ${formatTime(timeLeft)}`}
              </button>
            </p>
            <p className="login-link">
              Already verified? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>

        <div className="verify-info">
          <h4><FaShieldAlt /> Security Tips</h4>
          <ul>
            <li>✓ Never share your OTP with anyone</li>
            <li>✓ OTP expires in 5 minutes</li>
            <li>✓ Check spam folder if not received</li>
            <li>✓ Use the same device for verification</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Verify;