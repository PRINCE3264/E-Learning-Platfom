import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        bio: {
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true,
        },
        experience: {
            type: Number,
            required: true,
        },
        specialization: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            default: 0,
        },
        totalStudents: {
            type: Number,
            default: 0,
        },
        fee: {
            type: Number,
            default: 0,
        },
        socialLinks: {
            linkedin: String,
            twitter: String,
            website: String,
        },
        status: {
            type: String,
            default: "pending",
            enum: ["pending", "active", "rejected"],
        },
    },
    {
        timestamps: true,
    }
);

export const Instructor = mongoose.model("Instructor", schema);
