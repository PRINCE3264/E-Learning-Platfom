
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

// GET my courses (Discovery from 3 sources)
export const getMyCourses = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  // 1. Discovery from Subscriptions, Progress, and Payments
  const subIds = (user.subscription || []).map(id => id?.toString()).filter(Boolean);

  const fromProgress = await Progress.find({ user: user._id });
  const progIds = fromProgress.map(p => p.course?.toString()).filter(Boolean);

  const fromPayments = await Payment.find({ user: user._id });
  const payIds = fromPayments.map(p => p.course?.toString()).filter(Boolean);

  // 2. Union and Unique IDs
  const unionIds = [...new Set([...subIds, ...progIds, ...payIds])];

  const courses = await Courses.find({ _id: { $in: unionIds } });

  // 3. Attach Progress Data for Dashboard
  const coursesWithProgress = await Promise.all(courses.map(async (course) => {
    const progress = await Progress.findOne({ user: req.user._id, course: course._id });
    const totalLectures = await Lecture.countDocuments({ course: course._id });

    let completedLectures = 0;
    let percentage = 0;

    if (progress) {
      completedLectures = progress.completedLectures.length;
      percentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
    }

    return {
      ...course.toObject(),
      progress: percentage,
      completedLectures,
      totalLectures
    };
  }));

  res.json({ courses: coursesWithProgress });
});

// GET payment history (Triple-Join Discovery)
export const getPaymentHistory = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const paymentRecords = await Payment.find({ user: req.user._id }).populate("course");

  // 1. Triple-Source Discovery Logic
  const subIds = (user.subscription || []).map(id => id?.toString()).filter(Boolean);

  const allProgress = await Progress.find({ user: user._id });
  const progIds = allProgress.map(p => p.course?.toString()).filter(Boolean);

  const payIds = paymentRecords.map(p => p.course?._id?.toString() || p.course?.toString()).filter(Boolean);

  const allEnrolledIds = [...new Set([...subIds, ...progIds, ...payIds])];

  // 2. Fetch Verified Course Documents
  const ownedCoursesDocs = await Courses.find({ _id: { $in: allEnrolledIds } });

  // 3. Assemble History with Intelligent Fallbacks
  const history = await Promise.all(ownedCoursesDocs.map(async (courseDoc) => {
    // Priority: Official Payment Record
    const officialPayment = paymentRecords.find(p =>
      p.course?._id?.toString() === courseDoc._id.toString() ||
      p.course?.toString() === courseDoc._id.toString()
    );

    if (officialPayment) {
      return {
        _id: officialPayment._id,
        course: courseDoc,
        razorpay_payment_id: officialPayment.razorpay_payment_id,
        razorpay_order_id: officialPayment.razorpay_order_id,
        razorpay_signature: officialPayment.razorpay_signature,
        status: "Official Payment",
        createdAt: officialPayment.createdAt
      };
    } else {
      // Fallback: Date from Progress or User Creation
      const progress = allProgress.find(p => p.course?.toString() === courseDoc._id.toString());
      return {
        _id: `verified_${courseDoc._id}`,
        course: courseDoc,
        razorpay_payment_id: "PORTAL_VERIFIED",
        razorpay_order_id: "SUBSCRIPTION_ACTIVE",
        razorpay_signature: "SECURE_LEGACY_RECORD",
        status: "Verified Subscription",
        createdAt: progress ? progress.createdAt : user.createdAt
      };
    }
  }));

  // Chronological Sort
  history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ payments: history });
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

  await Payment.create({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    user: req.user._id,
    course: courseId,
  });

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

  if (progress.completedLectures.some((id) => id.toString() === lectureId.toString())) {
    console.log("Lecture already completed");
  } else {
    progress.completedLectures.push(lectureId);
    await progress.save();
  }

  res.status(200).json({ message: "Progress updated", progress });
});

// GET user progress
export const getYourProgress = TryCatch(async (req, res) => {
  const { course } = req.query;
  if (!course) return res.status(400).json({ message: "Course ID required" });

  let progress = await Progress.findOne({ user: req.user._id, course });

  if (!progress) {
    progress = await Progress.create({ user: req.user._id, course, completedLectures: [] });
  }

  const totalLectures = await Lecture.countDocuments({ course });
  const completedLectures = progress.completedLectures.length;
  const percentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

  res.json({
    courseProgressPercentage: percentage,
    completedLectures,
    totalLectures,
    progress,
  });
});
// POST update time spent
export const updateTimeSpent = TryCatch(async (req, res) => {
  const { courseId, minutes } = req.body;
  if (!courseId || !minutes)
    return res.status(400).json({ message: "Course ID and minutes are required" });

  let progress = await Progress.findOne({ user: req.user._id, course: courseId });
  if (!progress) {
    progress = await Progress.create({
      user: req.user._id,
      course: courseId,
      timeSpent: minutes,
      completedLectures: [],
    });
  } else {
    progress.timeSpent += minutes;
    await progress.save();
  }

  res.status(200).json({ message: "Time spent updated", progress });
});
