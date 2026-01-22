


import express from "express";
import {
  addQuiz,
  getQuizzes,
  submitQuiz,
  updateQuiz,
  deleteQuiz
} from "../controllers/quizController.js";

const router = express.Router();


router.post("/", addQuiz);

router.get("/", getQuizzes);

router.post("/submit", submitQuiz);

router.put("/:id", updateQuiz);

router.delete("/:id", deleteQuiz);

export default router;
