import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  question: String,
  category: String, // html, css, js, react, node
  options: [String],
  correctAnswer: String,
});

export const Quiz = mongoose.model("Quiz", quizSchema);
