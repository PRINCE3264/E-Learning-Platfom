

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import "./dashboard.css";
import {
  MdDashboard,
  MdSchool,
  MdVideoLibrary,
  MdPeople,
  MdAdd,
  MdList,
  MdSettings,
  MdBarChart,
  MdSecurity,
  MdTrendingUp,
  MdAccessTime,
  MdPersonAdd
} from "react-icons/md";
import {
  FaChalkboardTeacher,
  FaUserShield,
  FaChartLine,
  FaDatabase
} from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + "y ago";
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + "mo ago";
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + "d ago";
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + "h ago";
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + "m ago";
  return "just now";
};

const AdminDashboard = ({ user, adminSidebarOpen }) => {
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLectures: 0,
    totalUsers: 0,
    totalInstructors: 0,
    activeUsers: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    if (user) {
      setLocalUser(user);
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setLocalUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (!localUser) return;
    if (localUser.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch Stats
        const statsRes = await axios.get(`${server}/api/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const s = statsRes.data.stats || {};
        setStats({
          totalCourses: s.totalCourses ?? 0,
          totalLectures: s.totalLectures ?? 0,
          totalUsers: s.totalUsers ?? 0,
          totalInstructors: s.totalInstructors ?? 0,
          activeUsers: s.activeUsers ?? 0,
          monthlyRevenue: s.monthlyRevenue ?? 0,
        });

        // Fetch Recent Activities
        const activityRes = await axios.get(`${server}/api/recent-activities`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentActivities(activityRes.data.activities || []);

      } catch (err) {
        console.error("fetchData error:", err);
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          setError(err.response?.data?.message || "Failed to fetch dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [localUser, navigate]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'course': return <MdSchool />;
      case 'completion': return <MdTrendingUp />;
      case 'lecture': return <MdVideoLibrary />;
      case 'admin': return <MdSettings />;
      case 'user': return <MdPeople />;
      default: return <MdBarChart />;
    }
  };

  if (loading) {
    return (
      <Layout adminSidebarOpen={adminSidebarOpen}>
        <div className="dashboard-loading-state">
          <div className="modern-spinner"></div>
          <p>Analyzing Platform Data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout adminSidebarOpen={adminSidebarOpen}>
      <div className="modern-dashboard">
        {error && (
          <div className="dashboard-error-banner">
            <MdSecurity /> {error}
          </div>
        )}
        {/* Top Header */}
        <div className="dashboard-top-header">
          <div className="welcome-section">
            <h1>Admin Control Center</h1>
            <p>Welcome back, <span>{localUser?.name || 'Administrator'}</span>. Here's what's happening today.</p>
          </div>
          <div className="header-actions">
            <div className="status-badge live">
              <span className="dot"></span> Platform Live
            </div>
            <div className="current-date">
              <MdAccessTime /> {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Major KPIs */}
        <div className="stats-container">
          <div className="stat-box blue">
            <div className="stat-icon-bg"><MdSchool /></div>
            <div className="stat-info">
              <h3>{stats.totalCourses}</h3>
              <p>Total Courses</p>
            </div>
          </div>
          <div className="stat-box green">
            <div className="stat-icon-bg"><MdPeople /></div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Learners</p>
            </div>
          </div>
          <div className="stat-box purple">
            <div className="stat-icon-bg"><GiTeacher /></div>
            <div className="stat-info">
              <h3>{stats.totalInstructors}</h3>
              <p>Instructors</p>
            </div>
          </div>
          <div className="stat-box orange">
            <div className="stat-icon-bg"><MdVideoLibrary /></div>
            <div className="stat-info">
              <h3>{stats.totalLectures}</h3>
              <p>Total Contents</p>
            </div>
          </div>
        </div>

        <div className="dashboard-main-grid">
          {/* Main Feed: Recent Activity */}
          <div className="activity-section">
            <div className="section-header">
              <h2>Recent Platform Activity</h2>
              <button className="text-btn">View All</button>
            </div>
            <div className="activity-feed">
              {recentActivities.map(activity => (
                <div key={activity.id} className={`activity-card ${activity.type}`}>
                  <div className="activity-icon-wrapper">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-details">
                    <p><strong>{activity.user}</strong> {activity.action}</p>
                    <span className="timestamp">{timeAgo(activity.time)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Area: Quick Actions & Performance */}
          <div className="dashboard-sidebar-panels">
            {/* Quick Actions */}
            <div className="panel-card actions-panel">
              <h3>Quick Management</h3>
              <div className="action-grid-buttons">
                <button onClick={() => navigate("/admin/course")}>
                  <MdAdd /> New Course
                </button>
                <button onClick={() => navigate("/admin/users")}>
                  <MdPeople /> Manage Users
                </button>
                <button onClick={() => navigate("/admin/instructor")}>
                  <MdPersonAdd /> Add Mentor
                </button>
                <button onClick={() => navigate("/admin/analytics")}>
                  <MdBarChart /> Reports
                </button>
                <button onClick={() => navigate("/admin/settings")}>
                  <MdSettings /> Settings
                </button>
              </div>
            </div>

            {/* Platform Performance */}
            <div className="panel-card performance-panel">
              <h3>Platform Health</h3>
              <div className="health-metrics">
                <div className="metric-item">
                  <div className="metric-header">
                    <label>Engagement</label>
                    <span>84%</span>
                  </div>
                  <div className="progress-bg"><div className="progress-bar p84"></div></div>
                </div>
                <div className="metric-item">
                  <div className="metric-header">
                    <label>Completion</label>
                    <span>62%</span>
                  </div>
                  <div className="progress-bg"><div className="progress-bar p62"></div></div>
                </div>
                <div className="metric-item">
                  <div className="metric-header">
                    <label>Server Status</label>
                    <span className="status-ok">Optimal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;


