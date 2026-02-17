


// adminController.js
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { rm } from "fs";
import { promisify } from "util";
import fs from "fs";
import { User } from "../models/User.js";
import { Payment } from "../models/Payment.js";
import { QuizResult } from "../models/QuizResult.js";
import bcrypt from "bcrypt";

const unlinkAsync = promisify(fs.unlink);

// ==========================
// Courses Management
// ==========================
export const createCourse = TryCatch(async (req, res) => {
  const { title, description, category, createdBy, duration, price } = req.body;
  const image = req.file;

  await Courses.create({
    title,
    description,
    category,
    createdBy,
    image: image?.path,
    duration,
    price,
  });

  res.status(201).json({ message: "Course Created Successfully" });
});

export const addLectures = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  if (!course)
    return res.status(404).json({ message: "No Course with this ID" });

  const { title, description } = req.body;
  const file = req.file;

  const lecture = await Lecture.create({
    title,
    description,
    video: file?.path,
    course: course._id,
  });

  res.status(201).json({ message: "Lecture Added", lecture });
});

export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) return res.status(404).json({ message: "Lecture not found" });

  if (lecture.video) rm(lecture.video, () => console.log("Video deleted"));
  await lecture.deleteOne();

  res.json({ message: "Lecture Deleted" });
});

export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  const lectures = await Lecture.find({ course: course._id });
  await Promise.all(
    lectures.map(async (lecture) => {
      if (lecture.video) await unlinkAsync(lecture.video);
      console.log("Video deleted");
    })
  );

  if (course.image) rm(course.image, () => console.log("Image deleted"));

  await Lecture.deleteMany({ course: req.params.id });
  await course.deleteOne();
  await User.updateMany({}, { $pull: { subscription: req.params.id } });

  res.json({ message: "Course Deleted" });
});

export const updateCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  const { title, description, category, createdBy, duration, price } = req.body;
  const image = req.file;

  if (title) course.title = title;
  if (description) course.description = description;
  if (category) course.category = category;
  if (createdBy) course.createdBy = createdBy;
  if (duration) course.duration = duration;
  if (price) course.price = price;

  if (image) {
    if (course.image) {
      await unlinkAsync(course.image).catch((err) => console.log("Old image skip:", err));
    }
    course.image = image.path;
  }

  await course.save();

  res.json({ message: "Course Updated Successfully" });
});

// ==========================
// Stats
// ==========================
export const getAllStats = TryCatch(async (req, res) => {
  const totalCourses = await Courses.countDocuments();
  const totalLectures = await Lecture.countDocuments();
  const totalUsers = await User.countDocuments();

  res.json({ stats: { totalCourses, totalLectures, totalUsers } });
});

// ==========================
// User Management
// ==========================
export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
  res.json({ users });
});

export const updateRole = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.role === "user") {
    user.role = "admin";
  } else {
    user.role = "user";
  }

  await user.save();
  res.status(200).json({ message: `Role updated to ${user.role}` });
});

export const updateUserStatus = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.status = req.body.status;
  await user.save();
  res.json({ message: `User status updated to ${user.status}` });
});

export const deleteUser = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.deleteOne();
  res.json({ message: "User Deleted Successfully" });
});

export const createUser = TryCatch(async (req, res) => {
  const { name, username, email, password, role } = req.body;

  if (!name || !email || !password) {
    const missing = [];
    if (!name) missing.push("name");
    if (!email) missing.push("email");
    if (!password) missing.push("password");
    return res.status(400).json({ message: `Incomplete Provisioning: Required fields missing from transmission: ${missing.join(", ")}` });
  }

  const query = { $or: [] };
  if (email) query.$or.push({ email });
  if (username) query.$or.push({ username });

  const existingUser = await User.findOne(query);

  if (existingUser) {
    if (email && existingUser.email === email) return res.status(400).json({ message: "Duplicate Identity Detected: This email address is already registered in the mainframe." });
    if (username && existingUser.username === username) return res.status(400).json({ message: "Security Clearance Denied: System username is already provisioned to another node." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
    role: role || "user",
    profilePicture: req.file ? req.file.path : "",
  });

  res.status(201).json({ message: "User Created Successfully", user });
});

export const getAllPayments = TryCatch(async (req, res) => {
  const payments = await Payment.find()
    .populate("user", "name email")
    .populate("course", "title price")
    .sort({ createdAt: -1 });

  res.json({ payments });
});
// ==========================
// Analytics & Activity
// ==========================
export const getRecentActivities = TryCatch(async (req, res) => {
  const quizResults = await QuizResult.find().populate("user", "name").sort({ createdAt: -1 }).limit(5);
  const payments = await Payment.find().populate("user", "name").populate("course", "title").sort({ createdAt: -1 }).limit(5);

  const activities = [
    ...quizResults.map(r => ({
      id: r._id,
      user: r.user?.name || "Unknown Learner",
      action: `secured ${r.percentage}% in ${r.category} Quiz`,
      time: r.createdAt,
      type: "completion"
    })),
    ...payments.map(p => ({
      id: p._id,
      user: p.user?.name || "New Student",
      action: `enrolled in ${p.course?.title || "Premium Course"}`,
      time: p.createdAt,
      type: "course"
    }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

  res.json({ activities });
});
