import React, { useState } from "react";
import "./header.css";
import { Link, NavLink } from "react-router-dom";

import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { MdAccountCircle, MdLogin } from "react-icons/md";
import Sidebar from "./Sidebar";
import AdminSidebar from "../../admin/Utils/Sidebar";
import { UserData } from "../../context/UserContext";



const Header = ({ adminSidebarOpen, setAdminSidebarOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuth, user, logoutUser } = UserData();

  // Close sidebar handler
  const closeMenu = () => {
    setMenuOpen(false);
    setAdminSidebarOpen(false);
  };

  // Toggle sidebar handler
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Toggle admin sidebar
  const toggleAdminSidebar = () => {
    setAdminSidebarOpen(!adminSidebarOpen);
  };

  // Check if user is admin
  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.mainrole?.trim()?.toLowerCase() === 'superadmin';

  return (
    <>
      <header className="main-header">
        <div className="header-left">
          {/* Menu icon - controls different sidebars based on user role */}
          <div className="menu-btn" onClick={isAdmin ? toggleAdminSidebar : toggleMenu} id="sidebarToggle">
            {isAdmin ? (adminSidebarOpen ? <FaTimes /> : <FaBars />) : (menuOpen ? <FaTimes /> : <FaBars />)}
          </div>

          <div className="logo" onClick={closeMenu}>
            <Link to="/"><span>E</span>-Learning</Link>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/courses" onClick={closeMenu}>Courses</NavLink>
          <NavLink to="/instructors" onClick={closeMenu}>Instructors</NavLink>
          <NavLink to="/quiz" onClick={closeMenu} className="quiz-link">
            Quiz
            <span className="quiz-badge">New</span>
          </NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
          {isAdmin && (
            <NavLink to="/admin/dashboard" onClick={closeMenu} style={{ color: '#6366f1', fontWeight: '800' }}>
              Admin
            </NavLink>
          )}



          {isAuth ? (
            <button className="auth-btn logout-btn" onClick={() => { logoutUser(); closeMenu(); }}>
              <FaSignOutAlt style={{ fontSize: '16px' }} /> Logout
            </button>
          ) : (
            <NavLink to="/account" className="auth-btn account-btn" onClick={closeMenu}>
              <MdAccountCircle style={{ fontSize: '20px' }} /> Account
            </NavLink>
          )}
        </nav>
      </header>

      {/* Conditional Sidebar Rendering */}
      {isAdmin ? (
        <AdminSidebar isOpen={adminSidebarOpen} toggleSidebar={toggleAdminSidebar} />
      ) : (
        <Sidebar
          menuOpen={menuOpen}
          closeMenu={closeMenu}
          isAuth={isAuth}
          user={user}
          logoutUser={logoutUser}
        />
      )}
    </>
  );
};

export default Header;
