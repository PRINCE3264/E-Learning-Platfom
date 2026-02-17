import { Quiz } from "../models/Quiz.js";
import { QuizResult } from "../models/QuizResult.js";
import { User } from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// ✅ Nodemailer transporter (Gmail SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.Gmail, // Your Gmail
    pass: process.env.Password, // App password
  },
});

// ✅ Add a new quiz question
export const addQuiz = async (req, res) => {
  try {
    const { question, options, correctAnswer, category } = req.body;

    if (!question || !options || !correctAnswer) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const quiz = new Quiz({ question, category, options, correctAnswer });
    await quiz.save();

    res.status(201).json({ message: "Quiz question added", quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all quizzes
export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update a quiz by ID
export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, correctAnswer, category } = req.body;

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    quiz.question = question || quiz.question;
    quiz.options = options || quiz.options;
    quiz.correctAnswer = correctAnswer || quiz.correctAnswer;
    quiz.category = category || quiz.category;

    await quiz.save();
    res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete a quiz by ID
export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    await Quiz.findByIdAndDelete(id);
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Submit quiz answers and send email
export const submitQuiz = async (req, res) => {
  try {
    let { userEmail, answers } = req.body;

    // Accept string OR array for answers
    if (typeof answers === "string") answers = [answers];

    if (userEmail) userEmail = userEmail.trim().toLowerCase(); // Normalize email

    if (!userEmail || !Array.isArray(answers)) {
      return res
        .status(400)
        .json({ message: "Email and answers are required" });
    }

    const quizzes = await Quiz.find();
    if (quizzes.length === 0) {
      return res.status(404).json({ message: "No quiz questions found" });
    }

    // Calculate score
    let score = 0;
    quizzes.forEach((q, index) => {
      const givenAnswer = answers[index] || null;
      if (givenAnswer && givenAnswer === q.correctAnswer) score++;
    });

    // Build HTML email
    const html = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f0f2f5; margin:0; padding:0; }
          .container { max-width: 600px; margin:30px auto; background:#fff; border-radius:10px; padding:20px 30px; box-shadow:0 8px 20px rgba(0,0,0,0.1); }
          h2 { color: #5a2d82; text-align: center; margin-bottom:10px; }
          p { font-size: 16px; color:#333; text-align:center; margin-bottom:20px; }
          ul { list-style:none; padding:0; }
          li { margin-bottom:15px; padding:10px; border-radius:8px; background:#f7f7f7; }
          .correct { color: green; font-weight: bold; }
          .wrong { color: red; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Your Quiz Result 🎉</h2>
          <p>✅ You scored <b>${score}</b> out of <b>${quizzes.length}</b></p>
          <hr />
          <h3>Details:</h3>
          <ul>
            ${quizzes
        .map((q, i) => {
          const yourAnswer = answers[i] || "Not answered";
          const isCorrect = yourAnswer === q.correctAnswer;
          return `
                  <li>
                    <b>Q${i + 1}: ${q.question}</b><br/>
                    Your Answer: <span class="${isCorrect ? "correct" : "wrong"}">${yourAnswer}</span><br/>
                    Correct Answer: <span class="correct">${q.correctAnswer}</span>
                  </li>`;
        })
        .join("")}
          </ul>
        </div>
      </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Quiz App" <${process.env.Gmail}>`,
      to: userEmail,
      subject: "Your Quiz Result 📝",
      html,
    });

    // Save to database if user is logged in (optional based on architecture, but good for analytics)
    const user = await User.findOne({ email: userEmail });
    if (user) {
      await QuizResult.create({
        user: user._id,
        score,
        totalQuestions: quizzes.length,
        percentage: (score / quizzes.length) * 100,
        category: quizzes[0]?.category || "General",
      });
    }

    res.status(200).json({
      message: "Quiz submitted successfully. Result sent to email.",
      score,
      total: quizzes.length,
    });
  } catch (err) {
    console.error("Error in submitQuiz:", err);
    res.status(500).json({ error: err.message });
  }
};


// ✅ Get all quiz results (for admin)
export const getAllQuizResults = async (req, res) => {
  try {
    const results = await QuizResult.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
