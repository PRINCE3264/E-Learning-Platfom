import React, { useState } from "react";
import "./auth.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/user/reset?token=${params.token}`,
        {
          password,
        }
      );

      toast.success(data.message);
      navigate("/login");
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="text">Enter Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button disabled={btnLoading} className="common-btn">
            {btnLoading ? "Please Wait..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;



// import React, { useState, useEffect } from "react";
// import { FaCheckCircle, FaExclamationTriangle, FaLock } from "react-icons/fa";
// import "./auth.css";
// import { useParams, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { server } from "../../main";

// const ResetPassword = () => {
//   const [formData, setFormData] = useState({
//     password: "",
//     confirmPassword: ""
//   });
//   const [btnLoading, setBtnLoading] = useState(false);
//   const [resetSuccess, setResetSuccess] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState({
//     score: 0,
//     text: "Enter new password",
//     className: ""
//   });
//   const [errors, setErrors] = useState({});
//   const [tokenValid, setTokenValid] = useState(true);
//   const navigate = useNavigate();
//   const params = useParams();

//   // Check token validity on component mount
//   useEffect(() => {
//     const checkToken = async () => {
//       try {
//         await axios.get(`${server}/api/user/validate-reset-token?token=${params.token}`);
//       } catch (error) {
//         setTokenValid(false);
//         toast.error("Reset link is invalid or expired");
//       }
//     };
//     checkToken();
//   }, [params.token]);

//   // Password strength checker
//   useEffect(() => {
//     const checkPasswordStrength = () => {
//       if (!formData.password) {
//         return { score: 0, text: "Enter new password", className: "" };
//       }

//       let score = 0;
//       const password = formData.password;

//       // Length check
//       if (password.length >= 8) score += 1;
//       if (password.length >= 12) score += 1;

//       // Complexity checks
//       if (/[A-Z]/.test(password)) score += 1; // Uppercase
//       if (/[a-z]/.test(password)) score += 1; // Lowercase
//       if (/[0-9]/.test(password)) score += 1; // Numbers
//       if (/[^A-Za-z0-9]/.test(password)) score += 1; // Special chars

//       // Determine strength level
//       if (score <= 2) {
//         return { score, text: "Weak", className: "weak" };
//       } else if (score <= 4) {
//         return { score, text: "Fair", className: "fair" };
//       } else {
//         return { score, text: "Strong", className: "strong" };
//       }
//     };

//     setPasswordStrength(checkPasswordStrength());
//   }, [formData.password]);

//   // Form validation
//   const validateForm = () => {
//     const newErrors = {};
    
//     // Password validation
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     } else if (passwordStrength.score <= 2) {
//       newErrors.password = "Please choose a stronger password";
//     }
    
//     // Confirm password validation
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your password";
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
    
//     // Clear error for this field
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: "" }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setBtnLoading(true);
//     try {
//       const { data } = await axios.post(
//         `${server}/api/user/reset?token=${params.token}`,
//         {
//           password: formData.password,
//         }
//       );

//       toast.success(data.message || "Password reset successfully!");
//       setResetSuccess(true);
      
//       // Auto redirect to login after 3 seconds
//       setTimeout(() => {
//         navigate("/login");
//       }, 3000);
      
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to reset password");
//     } finally {
//       setBtnLoading(false);
//     }
//   };

//   // Show token error state
//   if (!tokenValid) {
//     return (
//       <div className="auth-page">
//         <div className="auth-container">
//           <div className="auth-card">
//             <div className="token-error">
//               <div className="token-error-icon">
//                 <FaExclamationTriangle />
//               </div>
//               <h3>Invalid Reset Link</h3>
//               <p>
//                 This password reset link is invalid or has expired.
//                 Please request a new password reset link.
//               </p>
//               <button 
//                 onClick={() => navigate("/forgot")}
//                 className="submit-btn"
//                 style={{ marginTop: '20px' }}
//               >
//                 REQUEST NEW LINK
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Show success state
//   if (resetSuccess) {
//     return (
//       <div className="auth-page">
//         <div className="auth-container">
//           <div className="auth-card">
//             <div className="reset-success">
//               <div className="success-icon">
//                 <FaCheckCircle />
//               </div>
//               <h3>Password Reset Successful!</h3>
//               <p>
//                 Your password has been reset successfully.
//                 You can now log in with your new password.
//               </p>
//               <button 
//                 onClick={() => navigate("/login")}
//                 className="submit-btn"
//                 style={{ marginTop: '20px' }}
//               >
//                 GO TO LOGIN
//               </button>
//               <div className="auto-login">
//                 <span>Redirecting to login in 3 seconds...</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Show reset form
//   return (
//     <div className="auth-page">
//       <div className="auth-container">
//         <div className="auth-card">
//           {/* Header */}
//           <div className="reset-header">
//             <h1 className="reset-title">Set New Password</h1>
//             <p className="reset-text">
//               Create a new password for your account
//             </p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="auth-form">
//             {/* New Password */}
//             <div className="form-group">
//               <label htmlFor="password" className="form-label">
//                 <FaLock style={{ marginRight: '6px' }} />
//                 New Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 className="form-input"
//                 value={formData.password}
//                 onChange={(e) => handleInputChange("password", e.target.value)}
//                 placeholder="Enter new password"
//               />
              
//               {/* Password Strength Indicator */}
//               {formData.password && (
//                 <div className="password-strength">
//                   <div className="strength-bar">
//                     <div className={`strength-fill ${passwordStrength.className}`}></div>
//                   </div>
//                   <div className="strength-text">
//                     <span>Password strength: {passwordStrength.text}</span>
//                     <span>{formData.password.length} characters</span>
//                   </div>
//                 </div>
//               )}

//               {errors.password && (
//                 <div className="error-message">
//                   <span>⚠️</span>
//                   {errors.password}
//                 </div>
//               )}
//             </div>

//             {/* Confirm Password */}
//             <div className="form-group confirm-password-group">
//               <label htmlFor="confirmPassword" className="form-label">
//                 <FaLock style={{ marginRight: '6px' }} />
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 className="form-input"
//                 value={formData.confirmPassword}
//                 onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
//                 placeholder="Confirm new password"
//               />
//               {errors.confirmPassword && (
//                 <div className="error-message">
//                   <span>⚠️</span>
//                   {errors.confirmPassword}
//                 </div>
//               )}
//             </div>

//             {/* Password Requirements */}
//             <div className="password-requirements">
//               <h4>Password Requirements:</h4>
//               <ul>
//                 <li>At least 8 characters long</li>
//                 <li>Contains uppercase letters</li>
//                 <li>Contains lowercase letters</li>
//                 <li>Contains numbers</li>
//                 <li>Contains special characters (optional)</li>
//               </ul>
//             </div>

//             {/* Submit Button */}
//             <button 
//               type="submit" 
//               className="submit-btn"
//               disabled={btnLoading}
//               style={{ marginTop: '20px' }}
//             >
//               {btnLoading ? (
//                 <span className="btn-loading">
//                   <span className="loading-spinner"></span>
//                   RESETTING PASSWORD...
//                 </span>
//               ) : (
//                 "RESET PASSWORD"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;






