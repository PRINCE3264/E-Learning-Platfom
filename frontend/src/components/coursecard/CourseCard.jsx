

// import React from "react";
// import "./courseCard.css";
// import { server } from "../../main";
// import { UserData } from "../../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { CourseData } from "../../context/CourseContext";

// const CourseCard = ({ course }) => {
//   const navigate = useNavigate();
//   const { user, isAuth } = UserData();
//   const { fetchCourses } = CourseData();

//   // ✅ SAFE ENROLL CHECK (FIX)
//   const isEnrolled = user?.subscription?.some(
//     (id) => id === course._id || id?._id === course._id
//   );

//   // ✅ DELETE COURSE (ADMIN ONLY)
//   const deleteHandler = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this course?"
//     );
//     if (!confirmDelete) return;

//     try {
//       const { data } = await axios.delete(
//         `${server}/api/course/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       toast.success(data.message || "Course deleted successfully");
//       fetchCourses();
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message || "Failed to delete course"
//       );
//     }
//   };

//   return (
//     <div className="course-card">
//       <img
//         src={`${server}/${course.image}`}
//         alt={course.title}
//         className="course-image"
//       />

//       <h3>{course.title}</h3>
//       <p>Instructor - {course.createdBy}</p>
//       <p>Duration - {course.duration} weeks</p>
//       <p>Price - ₹{course.price}</p>

//       {/* ===== BUTTON GROUP ===== */}
//       <div className="btn-group">
//         {isAuth ? (
//           user?.role === "admin" ? (
//             <button
//               onClick={() => navigate(`/course/study/${course._id}`)}
//               className="common-btn study-btn"
//             >
//               Study
//             </button>
//           ) : isEnrolled ? (
//             <button
//               onClick={() => navigate(`/course/study/${course._id}`)}
//               className="common-btn study-btn"
//             >
//               Study
//             </button>
//           ) : (
//             <button
//               onClick={() => navigate(`/course/${course._id}`)}
//               className="common-btn study-btn"
//             >
//               Get Started
//             </button>
//           )
//         ) : (
//           <button
//             onClick={() => navigate("/login")}
//             className="common-btn study-btn"
//           >
//             Get Started
//           </button>
//         )}

//         {/* ===== ADMIN DELETE ===== */}
//         {user?.role === "admin" && (
//           <button
//             onClick={() => deleteHandler(course._id)}
//             className="common-btn delete-btn"
//           >
//             Delete
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseCard;



import React from "react";
import "./courseCard.css";
import { server } from "../../main";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CourseData } from "../../context/CourseContext";

const CourseCard = ({ course }) => {
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
          <span>⭐ 4.8</span>
          <span>👥 1.2k</span>
          <span className="level">Beginner</span>
        </div>

        <p className="desc">
          {course.description?.slice(0, 70)}...
        </p>

        {/* ===== ACTIONS ===== */}
        {isAuth ? (
          isEnrolled ? (
            <button
              className="btn primary"
              onClick={() =>
                navigate(`/course/study/${course._id}`)
              }
            >
              ▶ Study
            </button>
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
          <button
            className="btn danger"
            onClick={deleteHandler}
          >
            🗑 Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
