



import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaCheckCircle, FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";

const Register = () => {
  const navigate = useNavigate();
  const { btnLoading, registerUser } = UserData();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    text: "Enter password",
    className: ""
  });

  // Password strength checker
  useEffect(() => {
    const checkPasswordStrength = () => {
      if (!formData.password) {
        return { score: 0, text: "Enter password", className: "" };
      }

      let score = 0;
      const password = formData.password;

      // Length check
      if (password.length >= 8) score += 1;
      if (password.length >= 12) score += 1;

      // Complexity checks
      if (/[A-Z]/.test(password)) score += 1; // Uppercase
      if (/[a-z]/.test(password)) score += 1; // Lowercase
      if (/[0-9]/.test(password)) score += 1; // Numbers
      if (/[^A-Za-z0-9]/.test(password)) score += 1; // Special chars

      // Determine strength level
      if (score <= 2) {
        return { score, text: "Weak", className: "weak" };
      } else if (score <= 4) {
        return { score, text: "Fair", className: "fair" };
      } else {
        return { score, text: "Strong", className: "strong" };
      }
    };

    setPasswordStrength(checkPasswordStrength());
  }, [formData.password]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (passwordStrength.score <= 2) {
      newErrors.password = "Please choose a stronger password";
    }

    // Terms validation
    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await registerUser(formData.name, formData.username, formData.email, formData.password, navigate);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <h1 className="platform-title">Create Account</h1>
            <p className="create-account-text">Sign up to start learning</p>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler} className="auth-form">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="name"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <div className="error-message">
                  <span>⚠️</span>
                  {errors.name}
                </div>
              )}
            </div>

            {/* Username */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="username"
                  className="form-input"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Choose a professional username"
                />
              </div>
              {errors.username && (
                <div className="error-message">
                  <span>⚠️</span>
                  {errors.username}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <div className="error-message">
                  <span>⚠️</span>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <div className="password-input-container" style={{ width: '100%' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-input"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className={`strength-fill ${passwordStrength.className}`}
                      style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                    ></div>
                  </div>
                  <div className="strength-text">
                    <span>Strength: {passwordStrength.text}</span>
                    <span>{formData.password.length} chars</span>
                  </div>
                </div>
              )}

              {errors.password && (
                <div className="error-message">
                  <span>⚠️</span>
                  {errors.password}
                </div>
              )}

              {/* Password Requirements */}
              <div style={{
                fontSize: '12px',
                color: '#636e72',
                marginTop: '8px',
                lineHeight: '1.4'
              }}>
                <p style={{ margin: '0 0 4px' }}>Password must contain:</p>
                <ul style={{
                  margin: '0',
                  paddingLeft: '16px',
                  listStyle: 'none'
                }}>
                  <li style={{
                    color: formData.password.length >= 8 ? '#2ecc71' : '#636e72',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginBottom: '2px'
                  }}>
                    <FaCheckCircle size={10} />
                    At least 8 characters
                  </li>
                  <li style={{
                    color: /[A-Z]/.test(formData.password) ? '#2ecc71' : '#636e72',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginBottom: '2px'
                  }}>
                    <FaCheckCircle size={10} />
                    One uppercase letter
                  </li>
                  <li style={{
                    color: /[0-9]/.test(formData.password) ? '#2ecc71' : '#636e72',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <FaCheckCircle size={10} />
                    One number
                  </li>
                </ul>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  if (errors.terms) setErrors({ ...errors, terms: '' });
                }}
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <Link to="/terms">Terms of Service</Link> and{" "}
                <Link to="/privacy">Privacy Policy</Link>
              </label>
            </div>
            {errors.terms && (
              <div className="error-message" style={{ marginTop: '4px' }}>
                <span>⚠️</span>
                {errors.terms}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn register-btn"
              disabled={btnLoading}
            >
              {btnLoading ? (
                <span className="btn-loading">
                  <span className="loading-spinner"></span>
                  CREATING ACCOUNT...
                </span>
              ) : (
                <>
                  CREATE ACCOUNT <FaUserPlus style={{ marginLeft: "8px" }} />
                </>
              )}
            </button>
          </form>

          {/* Already have account */}
          <div className="login-link">
            <p>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div >
    </div >
  );
};

export default Register;