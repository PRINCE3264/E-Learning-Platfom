import express from "express";
import { isAuth, isAdmin } from "../middlewares/isAuth.js";
import {
    registerInstructor,
    getAllInstructors,
    getPublicInstructors,
    updateInstructor,
    getInstructorStats,
    deleteInstructor,
    applyInstructor,
    updateInstructorStatus,
} from "../controllers/instructor.js";

import { uploadFiles } from "../middlewares/multer.js";

const router = express.Router();

// Admin Only Routes
router.post("/instructor/new", isAuth, isAdmin, uploadFiles, registerInstructor);
router.get("/instructor/all", isAuth, isAdmin, getAllInstructors);
router.get("/instructor/stats", isAuth, isAdmin, getInstructorStats);
router.put("/instructor/:id", isAuth, isAdmin, uploadFiles, updateInstructor);
router.delete("/instructor/:id", isAuth, isAdmin, deleteInstructor);
router.put("/instructor/status/:id", isAuth, isAdmin, updateInstructorStatus);

// User Routes
router.post("/instructor/apply", isAuth, applyInstructor);
router.get("/instructor/active", getPublicInstructors);

export default router;
