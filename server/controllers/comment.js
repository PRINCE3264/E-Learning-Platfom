
import { Comment } from "../models/Comment.js";
import { User } from "../models/User.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";

// Add a Comment/Doubt
export const addComment = TryCatch(async (req, res) => {
    const { content, isDoubt, lectureId, courseId } = req.body;

    if (!content) return res.status(400).json({ message: "Content is required" });

    const comment = await Comment.create({
        user: req.user._id,
        course: courseId,
        lecture: lectureId,
        content,
        isDoubt: isDoubt || false,
    });

    res.status(201).json({ message: "Comment added successfully", comment });
});

// Get Comments for a Course/Lecture
export const getComments = TryCatch(async (req, res) => {
    const { courseId } = req.params;
    const { lectureId } = req.query;

    const query = { course: courseId };
    if (lectureId) query.lecture = lectureId;

    const comments = await Comment.find(query)
        .populate("user", "name _id role")
        .populate("replies.user", "name _id role")
        .sort({ createdAt: -1 });

    res.json({ comments });
});

// Delete Comment (User can delete own, Admin can delete any)
export const deleteComment = TryCatch(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== "admin")
        return res.status(403).json({ message: "You are not authorized" });

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
});

// Reply to a Comment (Admin and Student)
export const addReply = TryCatch(async (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Reply cannot be empty" });

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies.push({
        user: req.user._id,
        content,
    });

    await comment.save();
    res.json({ message: "Reply added", comment });
});

// Resolve Doubt (Admin/Instructor Only)
export const resolveDoubt = TryCatch(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (req.user.role !== "admin")
        return res.status(403).json({ message: "Only Admin/Instructor can resolve doubts" });

    comment.isResolved = !comment.isResolved;
    await comment.save();

    res.json({ message: "Doubt status updated", comment });
});

// Like/Unlike Comment
export const likeComment = TryCatch(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.likes.includes(req.user._id)) {
        // Unlike
        comment.likes = comment.likes.filter((id) => id.toString() !== req.user._id.toString());
        await comment.save();
        return res.json({ message: "Unliked", comment });
    } else {
        // Like
        comment.likes.push(req.user._id);
        await comment.save();
        return res.json({ message: "Liked", comment });
    }
});
