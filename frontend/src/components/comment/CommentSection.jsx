
import React, { useState, useEffect } from "react";
import "./commentSection.css";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import { FaReply, FaTrash, FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const CommentSection = ({ courseId, lectureId }) => {
    const { user } = UserData();
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [isDoubt, setIsDoubt] = useState(false);
    const [loading, setLoading] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [filter, setFilter] = useState("all"); // 'all', 'doubt', 'general'

    const fetchComments = async () => {
        try {
            const { data } = await axios.get(
                `${server}/api/comment/${courseId}?lectureId=${lectureId}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            setComments(data.comments);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [lectureId]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(
                `${server}/api/comment/new`,
                {
                    content: comment,
                    isDoubt,
                    courseId,
                    lectureId,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            toast.success(data.message);
            setComment("");
            setIsDoubt(false);
            fetchComments();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add comment");
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            const { data } = await axios.delete(`${server}/api/comment/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            toast.success(data.message);
            fetchComments();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete");
        }
    };

    const replyHandler = async (id) => {
        if (!replyContent) return toast.error("Reply cannot be empty");
        try {
            const { data } = await axios.put(
                `${server}/api/comment/reply/${id}`,
                { content: replyContent },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            toast.success(data.message);
            setReplyContent("");
            setActiveReplyId(null);
            fetchComments();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reply");
        }
    };

    const likeHandler = async (id) => {
        try {
            const { data } = await axios.put(
                `${server}/api/comment/like/${id}`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            toast.success(data.message);
            fetchComments();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to like");
        }
    }

    const resolveHandler = async (id) => {
        try {
            const { data } = await axios.put(
                `${server}/api/comment/doubt/${id}`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            toast.success(data.message);
            fetchComments();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    }


    return (
        <div className="comment-section">
            <div className="comment-section-header">
                <span className="badge">Knowledge Forum</span>
                <h3>Discussion <span className="gradient-text">& Doubts</span></h3>
            </div>
            <form onSubmit={submitHandler} className="comment-form">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ask a doubt or share your thoughts..."
                    required
                ></textarea>
                <div className="form-actions">
                    <label className="doubt-toggle">
                        <input
                            type="checkbox"
                            checked={isDoubt}
                            onChange={(e) => setIsDoubt(e.target.checked)}
                        />
                        Mark as Doubt
                    </label>
                    <button type="submit" disabled={loading}>
                        {loading ? "Posting..." : "Post"}
                    </button>
                </div>
            </form>

            <div className="comment-filters">
                <button
                    className={filter === "all" ? "active" : ""}
                    onClick={() => setFilter("all")}
                >
                    All Discussions
                </button>
                <button
                    className={filter === "doubt" ? "active" : ""}
                    onClick={() => setFilter("doubt")}
                >
                    Doubts Only
                </button>
                <button
                    className={filter === "general" ? "active" : ""}
                    onClick={() => setFilter("general")}
                >
                    General
                </button>
            </div>

            <div className="comments-list">
                {comments && comments.length > 0 ? (
                    comments
                        .filter(c => {
                            if (filter === "all") return true;
                            if (filter === "doubt") return c.isDoubt;
                            if (filter === "general") return !c.isDoubt;
                            return true;
                        })
                        .map((c, index) => (
                            <div
                                key={c._id}
                                className={`comment-card ${c.isDoubt ? "doubt-card" : ""}`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="comment-header">
                                    <div className="user-info">
                                        <div className="avatar">
                                            {c.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="meta">
                                            <span className="name">
                                                {c.user.name}
                                                {c.user.role === "admin" && <MdVerified className="verified-badge" title="Instructor" />}
                                            </span>
                                            <span className="date">
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    {c.isDoubt && (
                                        <span className={`doubt-badge ${c.isResolved ? "resolved" : "pending"}`}>
                                            {c.isResolved ? "Resolved" : "Unresolved Doubt"}
                                        </span>
                                    )}
                                </div>

                                <p className="comment-content">{c.content}</p>

                                <div className="comment-actions">
                                    <button className="action-btn" onClick={() => likeHandler(c._id)}>
                                        {c.likes.includes(user._id) ? <FaThumbsUp /> : <FaRegThumbsUp />} {c.likes.length}
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => setActiveReplyId(activeReplyId === c._id ? null : c._id)}
                                    >
                                        <FaReply /> Reply
                                    </button>
                                    {(user._id === c.user._id || user.role === "admin") && (
                                        <button
                                            className="action-btn delete"
                                            onClick={() => deleteHandler(c._id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                    {user.role === "admin" && c.isDoubt && (
                                        <button className="action-btn resolve" onClick={() => resolveHandler(c._id)}>
                                            {c.isResolved ? "Mark Unresolved" : "Mark Resolved"}
                                        </button>
                                    )}
                                </div>

                                {/* Replies */}
                                {c.replies && c.replies.length > 0 && (
                                    <div className="replies-section">
                                        {c.replies.map((r, i) => (
                                            <div key={i} className="reply-card">
                                                <div className="reply-header">
                                                    <span className="reply-name">
                                                        {r.user.name}
                                                        {r.user.role === "admin" && <MdVerified className="verified-badge" />}
                                                    </span>
                                                    <span className="reply-date">
                                                        {new Date(r.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p>{r.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Reply Input */}
                                {activeReplyId === c._id && (
                                    <div className="reply-input">
                                        <input
                                            type="text"
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Write a reply..."
                                        />
                                        <button onClick={() => replyHandler(c._id)}>Reply</button>
                                    </div>
                                )}
                            </div>
                        ))
                ) : (
                    <p className="no-comments">No discussions yet. Be the first to ask!</p>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
