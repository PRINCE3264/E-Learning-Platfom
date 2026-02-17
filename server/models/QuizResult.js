import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        totalQuestions: {
            type: Number,
            required: true,
        },
        percentage: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            default: "General",
        },
    },
    {
        timestamps: true,
    }
);

export const QuizResult = mongoose.model("QuizResult", schema);
