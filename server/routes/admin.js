import express from "express";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import {
  addLectures,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllStats,
  getAllUser,
  updateRole,
  updateUserStatus,
  deleteUser,
  createUser,
  updateCourse,
  getAllPayments,
  getRecentActivities,
} from "../controllers/admin.js";
import { uploadFiles } from "../middlewares/multer.js";

const router = express.Router();

router.post("/course/new", isAuth, isAdmin, uploadFiles, createCourse);
router.put("/course/:id", isAuth, isAdmin, uploadFiles, updateCourse);
router.post("/course/:id", isAuth, isAdmin, uploadFiles, addLectures);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);
router.get("/stats", isAuth, isAdmin, getAllStats);
router.put("/user/:id", isAuth, isAdmin, updateRole);
router.put("/user/:id/status", isAuth, isAdmin, updateUserStatus);
router.delete("/user/:id", isAuth, isAdmin, deleteUser);
router.post("/user/new", isAuth, isAdmin, uploadFiles, createUser);
router.get("/users", isAuth, isAdmin, getAllUser);
router.get("/payments", isAuth, isAdmin, getAllPayments);
router.get("/recent-activities", isAuth, isAdmin, getRecentActivities);

export default router;
