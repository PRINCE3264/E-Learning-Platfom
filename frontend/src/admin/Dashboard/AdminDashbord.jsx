

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
  MdAccessTime
} from "react-icons/md";
import { 
  FaChalkboardTeacher, 
  FaUserShield,
  FaChartLine,
  FaDatabase
} from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";

const AdminDashboard = ({ user }) => {
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

  // Get user from localStorage if prop is undefined
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
    // Wait until we have user data
    if (!localUser) return;

    if (localUser.role !== "admin") {
      navigate("/");
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch stats
        const { data } = await axios.get(`${server}/api/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const s = data.stats || {};
        setStats({
          totalCourses: s.totalCourses ?? s.totalCoures ?? 0,
          totalLectures: s.totalLectures ?? 0,
          totalUsers: s.totalUsers ?? 0,
          totalInstructors: s.totalInstructors ?? 5,
          activeUsers: s.activeUsers ?? 145,
          monthlyRevenue: s.monthlyRevenue ?? 12500,
        });

        // Mock recent activities (replace with real API)
        setRecentActivities([
          { id: 1, user: "John Doe", action: "created new course", time: "10 min ago", type: "course" },
          { id: 2, user: "Jane Smith", action: "completed course", time: "25 min ago", type: "completion" },
          { id: 3, user: "Bob Wilson", action: "uploaded lecture", time: "1 hour ago", type: "lecture" },
          { id: 4, user: "Admin", action: "updated settings", time: "2 hours ago", type: "admin" },
          { id: 5, user: "Sarah Johnson", action: "registered", time: "3 hours ago", type: "user" },
        ]);

      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("fetchData error:", err);
        const status = err.response?.status;
        if (status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        } else if (status === 403) {
          setError("Access denied");
          navigate("/");
        } else {
          setError(err.response?.data?.message || "Failed to fetch data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [localUser, navigate]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch(type) {
      case 'course': return <MdSchool className="activity-icon" />;
      case 'completion': return <MdTrendingUp className="activity-icon" />;
      case 'lecture': return <MdVideoLibrary className="activity-icon" />;
      case 'admin': return <MdSettings className="activity-icon" />;
      case 'user': return <MdPeople className="activity-icon" />;
      default: return <MdBarChart className="activity-icon" />;
    }
  };

  // Get activity color based on type
  const getActivityColor = (type) => {
    switch(type) {
      case 'course': return '#667eea';
      case 'completion': return '#10b981';
      case 'lecture': return '#f59e0b';
      case 'admin': return '#8b5cf6';
      case 'user': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  // Show loading while fetching user
  if (!localUser && !error) {
    return (
      <Layout>
        <div className="admin-dashboard">
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Loading User Information...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="admin-dashboard">
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Loading Admin Dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="admin-dashboard">
          <div className="dashboard-error">
            <div className="error-icon">⚠️</div>
            <h3>Error Loading Dashboard</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="admin-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1>
              <MdDashboard className="header-icon" />
              Admin Dashboard
            </h1>
            <p className="welcome-text">Welcome back, {localUser?.name || 'Admin'}</p>
          </div>
          <div className="header-right">
            <div className="date-display">
              <MdAccessTime />
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-container" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
              <MdSchool className="stat-icon" style={{ color: '#667eea' }} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.totalCourses}</h3>
              <p className="stat-label">Total Courses</p>
            </div>
            <div className="stat-trend">
              <span className="trend-up">+12%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-container" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <MdVideoLibrary className="stat-icon" style={{ color: '#10b981' }} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.totalLectures}</h3>
              <p className="stat-label">Total Lectures</p>
            </div>
            <div className="stat-trend">
              <span className="trend-up">+8%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-container" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <MdPeople className="stat-icon" style={{ color: '#3b82f6' }} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.totalUsers}</h3>
              <p className="stat-label">Total Users</p>
            </div>
            <div className="stat-trend">
              <span className="trend-up">+24%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-container" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <GiTeacher className="stat-icon" style={{ color: '#f59e0b' }} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.totalInstructors}</h3>
              <p className="stat-label">Instructors</p>
            </div>
            <div className="stat-trend">
              <span className="trend-neutral">+2%</span>
            </div>
          </div>

          {/* <div className="stat-card">
            <div className="stat-icon-container" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <FaUserShield className="stat-icon" style={{ color: '#8b5cf6' }} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.activeUsers}</h3>
              <p className="stat-label">Active Users</p>
            </div>
            <div className="stat-trend">
              <span className="trend-up">+18%</span>
            </div>
          </div> */}

          {/* <div className="stat-card revenue-card">
            <div className="stat-icon-container" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
              <FaChartLine className="stat-icon" style={{ color: '#22c55e' }} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{formatCurrency(stats.monthlyRevenue)}</h3>
              <p className="stat-label">Monthly Revenue</p>
            </div>
            <div className="stat-trend">
              <span className="trend-up">+32%</span>
            </div>
          </div> */}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="dashboard-content">
          {/* Quick Actions */}
          <div className="quick-actions">
            <h2 className="section-title">
              <MdSettings className="section-icon" />
              Quick Actions
            </h2>
            <div className="actions-grid">
              <button className="action-btn" onClick={() => navigate("/admin/course")}>
                <MdAdd className="action-icon" />
                <span>Add New Course</span>
              </button>
              <button className="action-btn" onClick={() => navigate("/admin/users")}>
                <MdPeople className="action-icon" />
                <span>Manage Users</span>
              </button>
              <button className="action-btn" onClick={() => navigate("/admin/instructors")}>
                <FaChalkboardTeacher className="action-icon" />
                <span>Instructors</span>
              </button>
              <button className="action-btn" onClick={() => navigate("/admin/analytics")}>
                <FaChartLine className="action-icon" />
                <span>Analytics</span>
              </button>
              <button className="action-btn" onClick={() => navigate("/admin/quiz")}>
                <MdSecurity className="action-icon" />
                <span>Quize</span>
              </button>
              <button className="action-btn" onClick={() => navigate("/account")}>
                <FaDatabase className="action-icon" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <h2 className="section-title">
              <MdBarChart className="section-icon" />
              Recent Activity
            </h2>
            <div className="activity-list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon-container" style={{ background: getActivityColor(activity.type) }}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">
                      <strong>{activity.user}</strong> {activity.action}
                    </p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="view-all-btn" onClick={() => navigate("/admin/activities")}>
              View All Activities
              <MdList className="btn-icon" />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="summary-section">
          <h2 className="section-title">
            <MdBarChart className="section-icon" />
            Platform Overview
          </h2>
          <div className="summary-cards">
            <div className="summary-card">
              <h4>Course Completion Rate</h4>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '78%' }}></div>
              </div>
              <span className="progress-text">78%</span>
            </div>
            <div className="summary-card">
              <h4>User Satisfaction</h4>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '92%', background: '#10b981' }}></div>
              </div>
              <span className="progress-text">92%</span>
            </div>
            <div className="summary-card">
              <h4>System Uptime</h4>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '99.9%', background: '#3b82f6' }}></div>
              </div>
              <span className="progress-text">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;


