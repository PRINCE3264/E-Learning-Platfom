
import mongoose from "mongoose";
import { QuizResult } from "./models/QuizResult.js";
import { User } from "./models/User.js";

const DB_URI = process.env.DB || "mongodb://localhost:27017/elearning";

const run = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("✅ DB Connected");

        const targetUserId = "69901da44df57935afdb44ee";
        // Verify user exists first
        const user = await User.findById(targetUserId);

        if (!user) {
            console.log("User not found with ID", targetUserId);
            // Try to find ANY user
            const anyUser = await User.findOne();
            if (anyUser) {
                console.log("Using alternative user:", anyUser.email);
                await createResult(anyUser._id);
            } else {
                console.log("No users found at all.");
            }
        } else {
            console.log("Found user:", user.email);
            await createResult(user._id);
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

const createResult = async (userId) => {
    const result = await QuizResult.create({
        user: userId,
        score: 8,
        totalQuestions: 10,
        percentage: 80,
        category: "Web Development"
    });
    console.log("🎉 Created Dummy Quiz Result:", result);
};

run();
