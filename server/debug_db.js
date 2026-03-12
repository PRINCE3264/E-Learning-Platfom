
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Courses } from "./models/Courses.js";

dotenv.config();

const test = async () => {
  await mongoose.connect(process.env.DB);
  console.log("Connected to DB");
  
  const courses = await Courses.find().lean();
  console.log("RAW COURSES:", JSON.stringify(courses, null, 2));
  
  const course = await Courses.findById("68c5428244be35da329efc32").lean();
  console.log("SINGLE COURSE:", JSON.stringify(course, null, 2));
  
  process.exit();
};

test();
