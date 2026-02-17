import React from "react";
import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaBook,
    FaQuestionCircle,
    FaInfoCircle,
    FaEnvelope,
    FaUserCircle,
    FaTachometerAlt,
    FaFacebookF,
    FaGithub,
    FaInstagram,
    FaLinkedinIn,
    FaTimes,
    FaSignOutAlt,
    FaPhone,
    FaChartLine,
    FaChartBar,
    FaCreditCard,
    FaUsers,
    FaShieldAlt
} from "react-icons/fa";

const Sidebar = ({ menuOpen, closeMenu, isAuth, user, logoutUser }) => {
    const isAdminUser = user?.role?.toLowerCase() === 'admin' || user?.mainrole?.trim()?.toLowerCase() === 'superadmin';

    return (
        <>
            {/* Sidebar Overlay - Clicks here will close the menu */}
            <div
                className={`sidebar-overlay ${menuOpen ? "show" : ""}`}
                onClick={closeMenu}
            ></div>

            {/* Premium Sidebar */}
            <div className={`app-sidebar ${menuOpen ? "open" : ""}`}>
                {/* Integrated Sidebar Header */}
                <div className="sidebar-header-integrated">
                    <div className="sidebar-logo-text">
                        <span>E</span>-Learning
                    </div>
                    <div className="sidebar-close-btn-integrated" onClick={closeMenu}>
                        <FaTimes />
                    </div>
                </div>

                {isAuth && user && (
                    <div className="user-profile-card">
                        <div className="user-avatar-icon">
                            <FaUserCircle />
                        </div>
                        <div className="user-meta">
                            <h3>{user.name}</h3>
                            <p>{user.mainrole?.toLowerCase() === 'superadmin' ? 'Super Admin' : user.role || 'Student'}</p>
                        </div>
                    </div>
                )}

                <div className="app-sidebar-content">
                    <div className="nav-group">
                        <span className="group-label">Quick Links</span>
                        <NavLink to="/" onClick={closeMenu}>
                            <FaHome /> Home
                        </NavLink>
                        {isAuth && (
                            <NavLink to={`/${user._id}/dashboard`} onClick={closeMenu}>
                                <FaTachometerAlt /> My Dashboard
                            </NavLink>
                        )}
                        {isAdminUser && (
                            <NavLink to="/admin/dashboard" onClick={closeMenu} style={{ color: '#6366f1', fontWeight: '800' }}>
                                <FaShieldAlt /> Admin Console
                            </NavLink>
                        )}
                        <NavLink to="/courses" onClick={closeMenu}>
                            <FaBook /> Courses
                        </NavLink>
                        <NavLink to="/instructors" onClick={closeMenu}>
                            <FaUsers /> Instructors
                        </NavLink>
                        <NavLink to="/quiz" onClick={closeMenu}>
                            <FaQuestionCircle /> Quiz
                        </NavLink>
                        <NavLink to="/study-material" onClick={closeMenu}>
                            <FaBook /> Study Material
                        </NavLink>
                        <NavLink to="/progress" onClick={closeMenu}>
                            <FaChartLine /> My Progress
                        </NavLink>
                        <NavLink to="/analytics" onClick={closeMenu}>
                            <FaChartBar /> My Analytics
                        </NavLink>
                        <NavLink to="/payments" onClick={closeMenu}>
                            <FaCreditCard /> My Payments
                        </NavLink>
                    </div>

                    <div className="nav-group">
                        <span className="group-label">Support & Account</span>
                        <NavLink to="/about" onClick={closeMenu}>
                            <FaInfoCircle /> About Us
                        </NavLink>
                        <NavLink to="/contact" onClick={closeMenu}>
                            <FaEnvelope /> Contact
                        </NavLink>

                        {isAuth && (
                            <>
                                <NavLink to="/account" onClick={closeMenu}>
                                    <FaUserCircle /> My Account
                                </NavLink>
                                <button className="logout-btn-sidebar" onClick={() => { logoutUser(); closeMenu(); }}>
                                    <FaSignOutAlt /> Logout
                                </button>
                            </>
                        )}
                    </div>


                    <div className="nav-group social-group">
                        <span className="group-label">Follow Us</span>
                        <div className="social-links-grid">
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon fb">
                                <FaFacebookF />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon gh">
                                <FaGithub />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon ig">
                                <FaInstagram />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon li">
                                <FaLinkedinIn />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Sidebar Footer */}
                <div className="sidebar-footer-integrated">
                    <p>© 2026 E-Learning</p>
                    <span>All Rights Reserved</span>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
