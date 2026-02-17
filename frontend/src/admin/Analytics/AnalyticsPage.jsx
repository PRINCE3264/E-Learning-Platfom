
import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../main";
import Layout from "../Utils/Layout";
import {
  MdAnalytics, MdTrendingUp, MdPeople, MdLibraryBooks,
  MdAttachMoney, MdShowChart, MdPieChart, MdRefresh
} from "react-icons/md";
import "./AnalyticsPage.css";

const AnalyticsPage = ({ adminSidebarOpen }) => {
  const [stats, setStats] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [courseStats, setCourseStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/analytics/admin`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setStats(data.stats);
      setMonthlyRevenue(data.monthlyRevenue);
      setCourseStats(data.courseStats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin analytics", error);
      setLoading(false);
    }
  };

  const get6MonthHistory = () => {
    const history = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      const existing = monthlyRevenue.find(r => r._id.month === month && r._id.year === year);
      history.push({
        _id: { month, year },
        revenue: existing ? existing.revenue : 0
      });
    }
    return history;
  };

  const revenueHistory = get6MonthHistory();
  const maxRevenue = Math.max(...revenueHistory.map(item => item.revenue), 1000);

  const getMonthName = (month) => {
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[month] || `M${month}`;
  };

  if (loading) return <Layout adminSidebarOpen={adminSidebarOpen}><div className="loading-container-elite"><div className="spinner-elite"></div></div></Layout>;

  return (
    <Layout adminSidebarOpen={adminSidebarOpen}>
      <div className="admin-analytics-container">
        <div className="analytics-top-header">
          <div className="header-text">
            <h1>Intelligence Matrix</h1>
            <p>Aggregated platform analytics & growth intelligence</p>
          </div>
          <button className="sync-btn-premium" onClick={fetchData}>
            <MdRefresh /> Sync Knowledge Base
          </button>
        </div>

        <div className="analytics-matrix-grid">
          <div className="matrix-card revenue">
            <div className="matrix-icon"><MdAttachMoney /></div>
            <div className="matrix-content">
              <h3>₹{stats?.totalRevenue?.toLocaleString()}</h3>
              <p>Gross Capital</p>
              <div className="matrix-trend positive">
                <MdTrendingUp /> Capital Solid
              </div>
            </div>
          </div>

          <div className="matrix-card students">
            <div className="matrix-icon"><MdPeople /></div>
            <div className="matrix-content">
              <h3>{stats?.totalUsers?.toLocaleString()}</h3>
              <p>Active Learners</p>
              <div className="matrix-trend positive">
                <MdTrendingUp /> Growth Active
              </div>
            </div>
          </div>

          <div className="matrix-card courses">
            <div className="matrix-icon"><MdLibraryBooks /></div>
            <div className="matrix-content">
              <h3>{stats?.totalCourses || 0}</h3>
              <p>Pro Assets</p>
              <div className="matrix-trend">
                Network Stable
              </div>
            </div>
          </div>

          <div className="matrix-card efficiency">
            <div className="matrix-icon"><MdAnalytics /></div>
            <div className="matrix-content">
              <h3>{stats?.avgQuizScore}%</h3>
              <p>QoS Accuracy</p>
              <div className="matrix-trend positive">
                Peak Efficiency
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-visual-row">
          <div className="visual-card growth-chart">
            <h2><MdShowChart /> Revenue Velocity (6M)</h2>
            <div className="chart-canvas-mock">
              {revenueHistory.map((item, index) => (
                <div key={index} className="mock-bar-container">
                  <div className="mock-bar" style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}>
                    <div className="bar-tooltip">₹{item.revenue}</div>
                  </div>
                  <span>{getMonthName(item._id.month)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="visual-card popularity-pie">
            <h2><MdPieChart /> Course Dominance</h2>
            <div className="popularity-list">
              {courseStats.map((course, index) => (
                <div key={index} className="popularity-item">
                  <div className="pop-info">
                    <span>{course.title}</span>
                    <strong>{course.enrollments} {course.enrollments === 1 ? 'Node' : 'Nodes'}</strong>
                  </div>
                  <div className="pop-progress">
                    <div className="pop-fill" style={{ width: `${(course.enrollments / stats?.totalUsers) * 100}%`, background: `hsl(${index * 40}, 70%, 50%)` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;