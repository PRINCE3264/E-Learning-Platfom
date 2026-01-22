

import React, { useState, useEffect } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { btnLoading, loginUser } = UserData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});

  // 🔹 load remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // 🔹 remember email
    if (remember) {
      localStorage.setItem("rememberEmail", email);
    } else {
      localStorage.removeItem("rememberEmail");
    }

    await loginUser(email, password, navigate);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">

          {/* HEADER */}
          <div className="auth-header">
            <h1 className="platform-title">E-Learning Platform</h1>
            <p className="welcome-text">Welcome Back 👋</p>
          </div>

          {/* FORM */}
          <form onSubmit={submitHandler} className="auth-form">

            {/* EMAIL */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
                placeholder="Enter your password"
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="remember-forgot">
              <label className="remember-box">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>

              <Link to="/forgot" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* SUBMIT */}
            <button type="submit" className="submit-btn" disabled={btnLoading}>
              {btnLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* FOOTER */}
          <div className="auth-footer">
            <p>
              Don&apos;t have an account?{" "}
              <Link to="/register">Create Account</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
