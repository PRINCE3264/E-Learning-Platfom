import { User } from "../models/User.js";
import { Progress } from "../models/Progress.js";
import { QuizResult } from "../models/QuizResult.js";
import { Lecture } from "../models/Lecture.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail, { sendForgotMail } from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Payment } from "../models/Payment.js";

// ================= Register =================
export const register = TryCatch(async (req, res) => {
  const { email, name, password, username } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    if (existingUser.email === email) return res.status(400).json({ message: "Email already exists" });
    if (existingUser.username === username) return res.status(400).json({ message: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { name, username, email, password: hashedPassword };

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
    username: verifiedData.user.username,
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

// ================= Update Profile =================
export const updateProfile = TryCatch(async (req, res) => {
  console.log("--> updateProfile Hit");
  console.log("Request Body:", req.body);
  console.log("Request File:", req.file);

  const { name, phone, address, gender } = req.body;
  const file = req.file; // Check for file

  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (address) user.address = address;
  if (gender) user.gender = gender;
  if (file) user.profilePicture = file.path.replace(/\\/g, "/"); // Normalizing, fixing Windows path issue

  await user.save();

  res.status(200).json({
    message: "Profile Updated Successfully",
    user,
  });
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

// ================= User Analytics =================
export const getUserAnalytics = TryCatch(async (req, res) => {
  const userId = req.user._id;

  // 1. Get fresh user for accurate subscription count
  const user = await User.findById(userId);

  // 2. Get all progress records and populate course
  const progressRecords = await Progress.find({ user: userId }).populate("course");

  // 3. Enhance records with real percentage calculation
  const enhancedProgress = await Promise.all(progressRecords.map(async (record) => {
    if (!record.course) return { ...record._doc, percentage: 0 };

    const totalLectures = await Lecture.countDocuments({ course: record.course._id });
    const completedCount = record.completedLectures.length;

    // Calculate percentage
    const percentage = totalLectures > 0
      ? Math.round((completedCount / totalLectures) * 100)
      : 0;

    return {
      ...record._doc,
      totalLectures,
      percentage
    };
  }));

  // 4. Quiz Performance
  const quizResults = await QuizResult.find({ user: userId }).sort({ createdAt: -1 });

  // 5. Overall Stats
  const totalTimeSpent = progressRecords.reduce((acc, curr) => acc + (curr.timeSpent || 0), 0);

  // "Active Courses" - Triple-Source Discovery
  const subIds = (user.subscription || []).map(id => id?.toString()).filter(Boolean);
  const progIds = progressRecords.map(p => p.course?._id?.toString() || p.course?.toString()).filter(Boolean);
  const fromPayments = await Payment.find({ user: user._id });
  const payIds = fromPayments.map(p => p.course?._id?.toString() || p.course?.toString()).filter(Boolean);

  const activeCourses = [...new Set([...subIds, ...progIds, ...payIds])].length;

  res.status(200).json({
    progressRecords: enhancedProgress,
    quizResults,
    totalTimeSpent,
    activeCourses,
    badges: user.badges || [],
  });
});
