
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail, { sendForgotMail } from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

// ================= Register =================
export const register = TryCatch(async (req, res) => {
  const { email, name, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User Already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { name, email, password: hashedPassword };

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  const activationToken = jwt.sign({ user, otp }, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });

  await sendMail(email, "E-learning", { name, otp });

  res.status(200).json({
    message: "OTP sent to your email",
    activationToken,
  });
});

// ================= Verify User =================
export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;

  let verifiedData;
  try {
    verifiedData = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      res.setHeader("X-OTP-Status", "expired");
      return res.status(400).json({ message: "OTP Expired. Please request a new one." });
    }
    res.setHeader("X-OTP-Status", "invalid");
    return res.status(400).json({ message: "Invalid OTP token" });
  }

  if (verifiedData.otp.toString() !== otp.toString()) {
    res.setHeader("X-OTP-Status", "wrong");
    return res.status(400).json({ message: "Wrong OTP" });
  }

  const existingUser = await User.findOne({ email: verifiedData.user.email });
  if (existingUser) {
    res.setHeader("X-OTP-Status", "already-verified");
    return res.status(400).json({ message: "User already verified" });
  }

  await User.create({
    name: verifiedData.user.name,
    email: verifiedData.user.email,
    password: verifiedData.user.password,
  });

  res.setHeader("X-OTP-Status", "success");
  res.status(201).json({ message: "User Registered Successfully" });
});

// ================= Login =================
// export const loginUser = TryCatch(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ message: "No User with this email" });

//   const passwordMatch = await bcrypt.compare(password, user.password);
//   if (!passwordMatch) return res.status(400).json({ message: "Wrong Password" });

//   // ✅ Use same secret as isAuth
//   const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "15d" });


//   res.status(200).json({
//     message: `Welcome back ${user.name}`,
//     token,
//     user: {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     },
//   });
// });


export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Find user by email
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "No User with this email" });

  // 2️⃣ Verify password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(400).json({ message: "Wrong Password" });

  // 3️⃣ Sign JWT token (make sure secret is same as in isAuth)
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
  }

  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );

  // 4️⃣ Send token and user info to client
  res.status(200).json({
    message: `Welcome back ${user.name}`,
    token, // ✅ important!
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
// ================= My Profile =================
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).json({ user });
});

// ================= Forgot Password =================
export const forgotPassword = TryCatch(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "No User with this email" });

  const token = jwt.sign({ email }, process.env.FORGOT_SECRET, { expiresIn: "5m" });
  await sendForgotMail(email, "E-learning Reset Password", { email, token });

  user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;
  await user.save();

  res.status(200).json({ message: "Reset Password Link sent to your email" });
});

// ================= Reset Password =================
export const resetPassword = TryCatch(async (req, res) => {
  let decoded;
  try {
    decoded = jwt.verify(req.query.token, process.env.FORGOT_SECRET);
  } catch {
    return res.status(400).json({ message: "Invalid or Expired Token" });
  }

  const user = await User.findOne({ email: decoded.email });
  if (!user) return res.status(404).json({ message: "No user with this email" });

  if (!user.resetPasswordExpire || user.resetPasswordExpire < Date.now()) {
    return res.status(400).json({ message: "Token Expired" });
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordExpire = null;
  await user.save();

  res.status(200).json({ message: "Password Reset Successfully" });
});
