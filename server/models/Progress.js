import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
    },
    completedLectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    timeSpent: {
      type: Number,
      default: 0, // In minutes
    },
  },
  {
    timestamps: true,
  }
);

export const Progress = mongoose.model("Progress", schema);
