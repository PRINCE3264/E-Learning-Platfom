
import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courses",
            required: true,
        },
        lecture: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture",
            required: false, // Optional: if false, it's a general course comment
        },
        content: {
            type: String,
            required: true,
        },
        isDoubt: {
            type: Boolean,
            default: false,
        },
        isResolved: {
            type: Boolean,
            default: false,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        replies: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                content: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Comment = mongoose.model("Comment", schema);
