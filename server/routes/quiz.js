


import express from "express";
import {
  addQuiz,
  getQuizzes,
  submitQuiz,
  updateQuiz,
  deleteQuiz,
  getAllQuizResults
} from "../controllers/quizController.js";
import { isAuth, isAdmin } from "../middlewares/isAuth.js";

const router = express.Router();


router.post("/", isAuth, isAdmin, addQuiz);

router.get("/", getQuizzes);

router.post("/submit", submitQuiz);

router.put("/:id", isAuth, isAdmin, updateQuiz);

router.delete("/:id", isAuth, isAdmin, deleteQuiz);
router.get("/all-results", isAuth, isAdmin, getAllQuizResults);

export default router;
