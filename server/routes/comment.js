
import express from "express";
import {
    addComment,
    getComments,
    deleteComment,
    addReply,
    resolveDoubt,
    likeComment,
} from "../controllers/comment.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/comment/new", isAuth, addComment);
router.get("/comment/:courseId", isAuth, getComments);
router.delete("/comment/:id", isAuth, deleteComment);
router.put("/comment/reply/:id", isAuth, addReply);
router.put("/comment/doubt/:id", isAuth, resolveDoubt); // Resolve doubt toggle
router.put("/comment/like/:id", isAuth, likeComment); // Like toggle

export default router;
