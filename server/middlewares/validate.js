// // middlewares/validate.js
// import { body, validationResult } from "express-validator";

// export const validateRegister = [
//   body("name").notEmpty().withMessage("Name is required"),
//   body("email").isEmail().withMessage("Invalid email"),
//   body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
// ];

// export const validateLogin = [
//   body("email").isEmail().withMessage("Invalid email"),
//   body("password").notEmpty().withMessage("Password is required"),
// ];

// export const validateForgotPassword = [
//   body("email").isEmail().withMessage("Invalid email"),
// ];

// export const validateResetPassword = [
//   body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
//   body("confirmPassword").custom((value, { req }) => {
//     if (value !== req.body.password) {
//       throw new Error("Passwords do not match");
//     }
//     return true;
//   }),
// ];

// export const handleValidationErrors = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   next();
// };