


import React from "react";
import "./courseCard.css";
import { server } from "../../main";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CourseData } from "../../context/CourseContext";
import { MdPlayArrow, MdEdit, MdDelete, MdStar, MdPeople } from "react-icons/md";

const CourseCard = ({ course, onEdit }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const { fetchCourses } = CourseData();

  const isEnrolled =
    user?.role === "admin" ||
    user?.subscription?.some(
      (id) => id === course._id || id?._id === course._id
    );

  const deleteHandler = async () => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await axios.delete(`${server}/api/course/${course._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Course deleted");
      fetchCourses();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="course-card-adv">
      {/* ===== IMAGE ===== */}
      <div className="image-box">
        <img src={`${server}/${course.image}`} alt={course.title} />
        <span className="price-badge">₹{course.price}</span>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="card-body">
        <h3>{course.title}</h3>

        <p className="instructor">👨‍🏫 {course.createdBy}</p>

        <div className="meta-row">
          <span><MdStar className="meta-icon" /> 4.8</span>
          <span><MdPeople className="meta-icon" /> 1.2k</span>
          <span className="level">Beginner</span>
        </div>

        <p className="desc">
          {course.description?.slice(0, 70)}...
        </p>

        <div className="card-actions">
          {/* ===== ACTIONS ===== */}
          {isAuth ? (
            isEnrolled ? (
              <>
                {typeof course.progress === 'number' && (
                  <div className="progress-container-card">
                    <div className="progress-bg-card">
                      <div
                        className="progress-fill-card"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <small>{course.progress}% Completed</small>
                  </div>
                )}
                <button
                  className="btn primary"
                  onClick={() => navigate(`/course/study/${course._id}`)}
                >
                  <MdPlayArrow /> Study Now
                </button>
              </>
            ) : (
              <button
                className="btn primary"
                onClick={() =>
                  navigate(`/course/${course._id}`)
                }
              >
                🚀 Get Started
              </button>
            )
          ) : (
            <button
              className="btn primary"
              onClick={() => navigate("/login")}
            >
              🔐 Login to Enroll
            </button>
          )}

          {/* ===== ADMIN ===== */}
          {user?.role === "admin" && (
            <div className="admin-btns">
              {onEdit && (
                <button
                  className="btn edit-btn-small"
                  onClick={() => onEdit(course)}
                >
                  <MdEdit /> Edit Details
                </button>
              )}
              <button
                className="btn danger"
                onClick={deleteHandler}
              >
                <MdDelete /> Remove Course
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
