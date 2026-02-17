import React from "react";
import "./common.css";
import { Link } from "react-router-dom";
import { AiFillHome, AiOutlineLogout } from "react-icons/ai";
import {
  FaBook,
  FaUserAlt,
  FaQuestionCircle,
  FaRegListAlt,
  FaBars,
  FaTimes,
  FaMoneyBillWave
} from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { UserData } from "../../context/UserContext";

const Sidebar = ({ isOpen = false, toggleSidebar }) => {
  const { user } = UserData();

  // Wait until user loads
  if (!user) return null;

  const userRole = user.role?.toLowerCase();
  const mainRole = user.mainrole?.trim()?.toLowerCase();

  // Only Admin + SuperAdmin
  if (userRole !== "admin" && mainRole !== "superadmin") return null;

  console.log("Admin Sidebar isOpen:", isOpen); // Debug log

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={toggleSidebar}
      />

      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Profile */}
        <div className="admin-user-profile-card">
          <div className="admin-user-avatar">
            <FaUserAlt />
          </div>
          <div className="admin-user-info">
            <h3>{user.name}</h3>
            <p>{mainRole === "superadmin" ? "SUPER ADMIN" : "ADMIN"}</p>
          </div>
        </div>

        <ul>

          <li className="sidebar-section-header">
            <span>Admin Panel</span>
          </li>

          <li>
            <Link to="/admin/dashboard">
              <div className="icon"><AiFillHome /></div>
              <span>Dashboard</span>
            </Link>
          </li>

          <li>
            <Link to="/admin/course">
              <div className="icon"><FaBook /></div>
              <span>Courses</span>
            </Link>
          </li>

          {(mainRole === "superadmin" || userRole === "admin") && (
            <li>
              <Link to="/admin/users">
                <div className="icon"><FaUserAlt /></div>
                <span>Users</span>
              </Link>
            </li>
          )}

          <li>
            <Link to="/admin/quiz">
              <div className="icon"><FaQuestionCircle /></div>
              <span>Quiz</span>
            </Link>
          </li>

          <li>
            <Link to="/admin/study-material">
              <div className="icon"><FaBook /></div>
              <span>Study Material</span>
            </Link>
          </li>

          <li>
            <Link to="/admin/analytics">
              <div className="icon"><FaRegListAlt /></div>
              <span>Analytics</span>
            </Link>
          </li>

          <li>
            <Link to="/admin/payments">
              <div className="icon"><MdPayments /></div>
              <span>Payments</span>
            </Link>
          </li>

          <li>
            <Link to="/admin/instructors">
              <div className="icon"><FaUserAlt /></div>
              <span>Instructors</span>
            </Link>
          </li>

          <li className="logout-item">
            <Link to="/logout">
              <div className="icon"><AiOutlineLogout /></div>
              <span>Logout</span>
            </Link>
          </li>

        </ul>
      </div>
    </>
  );
};

export default Sidebar;
