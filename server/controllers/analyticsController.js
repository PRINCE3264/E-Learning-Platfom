
import TryCatch from "../middlewares/TryCatch.js";
import { User } from "../models/User.js";
import { Courses } from "../models/Courses.js";
import { Payment } from "../models/Payment.js";
import { QuizResult } from "../models/QuizResult.js";
import { Instructor } from "../models/Instructor.js";

// ✅ Admin & Instructor Analytics
export const getAdminAnalytics = TryCatch(async (req, res) => {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalInstructors = await User.countDocuments({ role: "admin" });
    const totalCourses = await Courses.countDocuments();
    const totalRevenueData = await Payment.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = totalRevenueData[0]?.total || 0;

    // Monthly Revenue Data (last 6 months)
    const monthlyRevenue = await Payment.aggregate([
        {
            $match: {
                createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
            }
        },
        {
            $group: {
                _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                revenue: { $sum: "$amount" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Course Popularity (Top 5)
    const courseStats = await User.aggregate([
        { $unwind: "$subscription" },
        { $group: { _id: "$subscription", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "courses",
                localField: "_id",
                foreignField: "_id",
                as: "courseDetails"
            }
        },
        { $unwind: "$courseDetails" },
        {
            $project: {
                title: "$courseDetails.title",
                enrollments: "$count"
            }
        }
    ]);

    // Recent Quiz Efficiency
    const avgQuizScore = await QuizResult.aggregate([
        { $group: { _id: null, avg: { $avg: "$percentage" } } }
    ]);

    res.json({
        stats: {
            totalUsers,
            totalInstructors,
            totalCourses,
            totalRevenue,
            avgQuizScore: avgQuizScore[0]?.avg?.toFixed(2) || 0
        },
        monthlyRevenue,
        courseStats
    });
});

// ✅ User (Student) Specific Analytics
export const getUserAnalytics = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);

    const coursesEnrolled = user.subscription.length;

    const quizPerformance = await QuizResult.find({ user: user._id })
        .sort({ createdAt: -1 })
        .limit(10);

    const avgScore = quizPerformance.length > 0
        ? (quizPerformance.reduce((acc, curr) => acc + curr.percentage, 0) / quizPerformance.length).toFixed(2)
        : 0;

    // Monthly learning activity placeholder or actual progress
    // For now, let's just return courses and quiz stats

    res.json({
        enrolledCount: coursesEnrolled,
        averageQuizScore: avgScore,
        quizHistory: quizPerformance.map(q => ({
            category: q.category,
            percentage: q.percentage,
            date: q.createdAt
        }))
    });
});
