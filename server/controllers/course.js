
import { instance } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";
import { Progress } from "../models/Progress.js";

// GET all courses
export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  res.json({ courses });
});

// GET single course
export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json({ course });
});

// GET lectures for a course
export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });
  const user = await User.findById(req.user._id);

  if (user.role === "admin") return res.json({ lectures });
  if (!user.subscription.includes(req.params.id))
    return res.status(403).json({ message: "You have not subscribed to this course" });

  res.json({ lectures });
});

// GET single lecture
export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) return res.status(404).json({ message: "Lecture not found" });

  const user = await User.findById(req.user._id);
  if (user.role === "admin") return res.json({ lecture });
  if (!user.subscription.includes(lecture.course.toString()))
    return res.status(403).json({ message: "You have not subscribed to this course" });

  res.json({ lecture });
});

// GET my courses (subscribed)
export const getMyCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find({ _id: { $in: req.user.subscription } });
  res.json({ courses });
});

// POST checkout
export const checkout = TryCatch(async (req, res) => {
  const { id } = req.params; // course ID from URL
  const user = await User.findById(req.user._id);
  const course = await Courses.findById(id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  if (user.subscription.includes(course._id))
    return res.status(400).json({ message: "You already have this course" });

  const options = {
    amount: course.price * 100,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  };
  const order = await instance.orders.create(options);

  res.status(201).json({ order, course });
});

// POST payment verification
export const paymentVerification = TryCatch(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const courseId = req.params.id; // ✅ get courseId from URL

  if (!courseId) return res.status(400).json({ message: "Course ID required" });

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature)
    return res.status(400).json({ message: "Payment verification failed" });

  await Payment.create({ razorpay_order_id, razorpay_payment_id, razorpay_signature });

  const user = await User.findById(req.user._id);
  const course = await Courses.findById(courseId);
  if (!user.subscription.includes(course._id)) {
    user.subscription.push(course._id);
    await user.save();

    // Create Progress document if not exists
    const existingProgress = await Progress.findOne({ user: user._id, course: course._id });
    if (!existingProgress) {
      await Progress.create({ user: user._id, course: course._id, completedLectures: [] });
    }
  }

  res.status(200).json({ message: "Course purchased successfully" });
});

// POST add progress
export const addProgress = TryCatch(async (req, res) => {
  const { courseId, lectureId } = req.body;
  if (!courseId || !lectureId)
    return res.status(400).json({ message: "Course and Lecture ID are required" });

  let progress = await Progress.findOne({ user: req.user._id, course: courseId });
  if (!progress) {
    progress = await Progress.create({
      user: req.user._id,
      course: courseId,
      completedLectures: [lectureId],
    });
    return res.status(201).json({ message: "Progress record created", progress });
  }

  if (!progress.completedLectures.includes(lectureId)) {
    progress.completedLectures.push(lectureId);
    await progress.save();
  }

  res.status(200).json({ message: "Progress updated", progress });
});

// GET user progress
export const getYourProgress = TryCatch(async (req, res) => {
  const { course } = req.query;
  if (!course) return res.status(400).json({ message: "Course ID required" });

  let progress = await Progress.findOne({ user: req.user._id, course }).populate("completedLectures");

  if (!progress) {
    progress = await Progress.create({ user: req.user._id, course, completedLectures: [] });
  }

  const totalLectures = await Lecture.countDocuments({ course });
  const completedLectures = progress.completedLectures.length;
  const percentage = totalLectures ? (completedLectures / totalLectures) * 100 : 0;

  res.json({
    courseProgressPercentage: percentage,
    completedLectures,
    totalLectures,
    progress,
  });
});
