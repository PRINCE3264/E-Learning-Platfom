




import React, { useEffect, useState } from "react";
import "./courses.css";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import CourseCard from "../../components/coursecard/CourseCard";

const Courses = ({ adminSidebarOpen }) => {
  const { courses, loading, fetchCourses } = CourseData();
  const { user, isAuth } = UserData();
  const isAdmin = user?.role === "admin" || user?.mainrole === "superadmin";
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCourses();
  }, [isAuth]);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading.courses || (isAuth && !user)) {
    return <div className="loading-text">Loading courses...</div>;
  }

  return (
    <div className={`courses-page ${(isAdmin && adminSidebarOpen) ? 'admin-sidebar-active' : ''}`}>
      {/* ===== HEADER ===== */}
      <div className="courses-header">
        <span className="badge">Knowledge Matrix</span>
        <h1>Explore Our <span className="gradient-text">Elite Courses</span></h1>
        <p>Upgrade your skills with industry-ready curriculum designed by world-class architects.</p>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search courses by name or technology..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ===== COURSES ===== */}
      <div className="course-container">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))
        ) : (
          <div className="empty-state">
            <h3>No courses found 😕</h3>
            <p>Try searching with a different keyword</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
