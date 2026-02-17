import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple users to have no username (null/undefined)
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    mainrole: {
      type: String,
      default: "user",
    },
    status: {
      type: String,
      default: "active",
    },
    phone: {
      type: String, // Added Phone
    },
    address: {
      type: String, // Added Address
    },
    gender: {
      type: String, // Added Gender
    },
    profilePicture: {
      type: String, // Added Profile Picture
    },
    subscription: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
      },
    ],
    resetPasswordExpire: Date,
    badges: [
      {
        title: String,
        image: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", schema);
