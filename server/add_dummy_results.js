
import mongoose from "mongoose";
import { QuizResult } from "./models/QuizResult.js";
import { User } from "./models/User.js";

const DB_URI = process.env.DB || "mongodb://localhost:27017/elearning";

const run = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("✅ DB Connected");

        // Targeted user ID from previous context
        const targetUserId = "69901da44df57935afdb44ee";

        const user = await User.findById(targetUserId);

        if (!user) {
            console.log("❌ User not found. Please check the ID.");
            return;
        }

        console.log(`Adding quiz results for: ${user.name} (${user.email})`);

        // Dummy data to add
        const results = [
            { score: 3, total: 10, percent: 30, cat: "General" },
            { score: 4, total: 10, percent: 40, cat: "Web Dev" },
            { score: 5, total: 10, percent: 50, cat: "React" },
            { score: 10, total: 10, percent: 100, cat: "Node.js" }
        ];

        for (const r of results) {
            await QuizResult.create({
                user: user._id,
                score: r.score,
                totalQuestions: r.total,
                percentage: r.percent,
                category: r.cat,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000)) // Random past time
            });
            console.log(`✅ Added result: ${r.percent}%`);
        }

        console.log("🎉 All dummy results added!");

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
