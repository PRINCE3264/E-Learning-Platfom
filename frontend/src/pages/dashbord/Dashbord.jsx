import React from "react";
import "./dashbord.css";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import { UserData } from "../../context/UserContext";

const Dashbord = ({ adminSidebarOpen }) => {
  const navigate = useNavigate();
  const { user } = UserData();
  const isAdmin = user?.role === "admin" || user?.mainrole === "superadmin";
  const { myCourses, fetchMyCourses } = CourseData();

  React.useEffect(() => {
    fetchMyCourses();
  }, []);

  return (
    <div className={`student-dashboard ${(isAdmin && adminSidebarOpen) ? 'admin-sidebar-active' : ''}`}>
      <div className="dashboard-grid-elite">
        {/* LEFT: COURSES */}
        <div className="dashboard-main-section">
          <h2>My <span className="gradient-text">Enrolled Courses</span></h2>
          <div className="dashboard-content">
            {myCourses && myCourses.length > 0 ? (
              myCourses.map((e) => <CourseCard key={e._id} course={e} />)
            ) : (
              <p className="empty-state-msg">You haven't enrolled in any courses yet. Explore our elite catalog to get started!</p>
            )}
          </div>
        </div>

        {/* RIGHT: MENTOR INTEL */}
        <div className="dashboard-side-section">
          <div className="mentor-intel-card">
            <div className="intel-header">
              <span className="intel-badge">Lead Mentor</span>
              <div className="intel-avatar">J</div>
            </div>
            <div className="intel-body">
              <h3>Joya Chaubey</h3>
              <p className="intel-spec">AI & React Architecture</p>
              <div className="intel-bio">
                "An AI mentor guides learners with personalized feedback, smart resources, real-time doubt solving, and motivation to master modern technical skills efficiently every single day."
              </div>
              <button className="intel-action-btn" onClick={() => navigate("/instructors")}>
                Connect for Doubt Solving
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashbord;
