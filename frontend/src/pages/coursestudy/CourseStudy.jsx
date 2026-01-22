


import React, { useEffect } from "react";
import "./coursestudy.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import { server } from "../../main";

const CourseStudy = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Use context user (not props)
  const { user } = UserData();
  const { fetchCourse, course } = CourseData();

  useEffect(() => {
    fetchCourse(id);
  }, [id]);

  // 🔐 Authorization check
  useEffect(() => {
    if (!user) return;

    const isEnrolled =
      user.role === "admin" ||
      user.subscription?.some(
        (cid) => cid === id || cid?._id === id
      );

    if (!isEnrolled) {
      navigate("/");
    }
  }, [user, id, navigate]);

  if (!course) return null;

  return (
    <div className="course-study-page">
      {/* ===== HERO ===== */}
      <div className="study-hero">
        <img src={`${server}/${course.image}`} alt={course.title} />
        <div className="study-info">
          <h1>{course.title}</h1>
          <p>{course.description}</p>

          <div className="study-meta">
            <span>👨‍🏫 {course.createdBy}</span>
            <span>⏱ {course.duration} weeks</span>
            <span>🎯 Beginner</span>
          </div>

          <div className="progress-box">
            <p>📊 Course Progress</p>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <span>20% Completed</span>
          </div>

          <Link to={`/lectures/${course._id}`} className="start-btn">
            ▶ Start Learning
          </Link>
        </div>
      </div>

      {/* ===== FEATURES ===== */}
      <div className="study-features">
        <div>
          <h3>📘 Lectures</h3>
          <p>45+</p>
        </div>
        <div>
          <h3>🎥 Video Hours</h3>
          <p>18+</p>
        </div>
        <div>
          <h3>🏆 Certificate</h3>
          <p>Yes</p>
        </div>
        <div>
          <h3>💬 Support</h3>
          <p>Lifetime</p>
        </div>
      </div>
    </div>
  );
};

export default CourseStudy;
