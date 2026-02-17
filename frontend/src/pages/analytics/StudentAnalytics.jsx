
import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../main";
import { FaChartBar, FaBookOpen, FaGraduationCap, FaHistory, FaTrophy, FaCalendarAlt } from "react-icons/fa";
import "./Analytics.css";

import { UserData } from "../../context/UserContext";

const StudentAnalytics = ({ adminSidebarOpen }) => {
    const { user } = UserData();
    const isAdmin = user?.role === "admin" || user?.mainrole === "superadmin";
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const { data } = await axios.get(`${server}/api/analytics/user`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setData(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching student analytics", error);
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-spinner-container"><div className="spinner"></div></div>;

    return (
        <div className={`analytics-page ${(isAdmin && adminSidebarOpen) ? 'admin-sidebar-active' : ''}`}>
            <div className="analytics-header">
                <span className="badge">Performance Matrix</span>
                <h1>Precision <span className="gradient-text">Learning Analytics</span></h1>
                <p>Tracking your architectural learning journey through precision metrics</p>
            </div>

            <div className="analytics-stats-grid">
                <div className="stat-card-premium">
                    <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>
                        <FaBookOpen />
                    </div>
                    <div className="stat-info">
                        <h3>{data?.enrolledCount || 0}</h3>
                        <p>Courses Enrolled</p>
                    </div>
                </div>

                <div className="stat-card-premium">
                    <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}>
                        <FaGraduationCap />
                    </div>
                    <div className="stat-info">
                        <h3>{data?.averageQuizScore || 0}%</h3>
                        <p>Avg. Quiz Efficiency</p>
                    </div>
                </div>

                <div className="stat-card-premium">
                    <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}>
                        <FaTrophy />
                    </div>
                    <div className="stat-info">
                        <h3>{data?.quizHistory?.length || 0}</h3>
                        <p>Quizzes Completed</p>
                    </div>
                </div>
            </div>

            <div className="analytics-content-split">
                <div className="quiz-history-card">
                    <h2><FaHistory /> Recent Performance Logs</h2>
                    <div className="history-list">
                        {data?.quizHistory?.length > 0 ? (
                            data.quizHistory.map((quiz, index) => (
                                <div className="history-item" key={index}>
                                    <div className="history-info">
                                        <h4>{quiz.category}</h4>
                                        <span><FaCalendarAlt /> {new Date(quiz.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="history-score">
                                        <div className="score-bar-container">
                                            <div className="score-fill" style={{ width: `${quiz.percentage}%`, background: quiz.percentage > 70 ? '#10b981' : quiz.percentage > 40 ? '#f59e0b' : '#ef4444' }}></div>
                                        </div>
                                        <span>{quiz.percentage}%</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-data">No performance logs found yet.</p>
                        )}
                    </div>
                </div>

                <div className="learning-overview-card">
                    <h2><FaChartBar /> Learning Distribution</h2>
                    <div className="chart-placeholder-user">
                        <div className="radar-circle">
                            <div className="radar-pulse"></div>
                            <div className="radar-line"></div>
                        </div>
                        <p>Synchronizing with Knowledge Matrix...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAnalytics;
