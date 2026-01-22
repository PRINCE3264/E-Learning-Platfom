




import React, { useEffect, useState } from "react";
import "./courses.css";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import CourseCard from "../../components/coursecard/CourseCard";

const Courses = () => {
  const { courses, loading, fetchCourses } = CourseData();
  const { user, isAuth } = UserData();
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
    <div className="courses-page">
      {/* ===== HEADER ===== */}
      <div className="courses-header">
        <h1>Explore Courses</h1>
        <p>Upgrade your skills with industry-ready courses</p>

        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
