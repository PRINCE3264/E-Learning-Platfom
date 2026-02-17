import React, { useEffect, useState } from "react";
import "./progress.css";
import { UserData } from "../../context/UserContext";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { FaClock, FaBookOpen, FaAward, FaChartLine, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ProgressPage = () => {
    const { fetchAnalytics } = UserData();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            const res = await fetchAnalytics();
            if (res) setData(res);
            setLoading(false);
        };
        getData();
    }, []);

    if (loading) return <div className="progress-page-loading">
        <div className="spinner"></div>
        <p>Preparing your analytics dashboard...</p>
    </div>;

    if (!data) return <div className="progress-page-error">
        <h2>Oops!</h2>
        <p>We couldn't load your progress data. Please try again later.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
    </div>;

    const chartData = {
        labels: data.quizResults.map((r, i) => `Quiz ${data.quizResults.length - i}`).reverse(),
        datasets: [
            {
                label: "Performance Score (%)",
                data: data.quizResults.map((r) => r.percentage).reverse(),
                fill: true,
                backgroundColor: "rgba(99, 102, 241, 0.08)",
                borderColor: "#6366f1",
                tension: 0.4,
                borderWidth: 4,
                pointRadius: 6,
                pointHoverRadius: 9,
                pointBackgroundColor: "#6366f1",
                pointBorderColor: "#fff",
                pointBorderWidth: 3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: "rgba(148, 163, 184, 0.05)" },
                ticks: {
                    color: "#94a3b8",
                    font: { family: "'Outfit', sans-serif", weight: '700' }
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    color: "#94a3b8",
                    font: { family: "'Outfit', sans-serif", weight: '700' }
                }
            },
        },
    };

    return (
        <div className="progress-page-container">
            <div className="progress-page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>
                <div className="header-text">
                    <span className="badge">Performance Analytics</span>
                    <h1>Your Learning <span className="gradient-text">Milestones</span></h1>
                    <p>Track your academic achievements and precision metrics</p>
                </div>
            </div>

            <div className="analytics-grid">
                {/* Stats Cards */}
                <div className="stats-row">
                    <div className="p-stat-card">
                        <FaClock className="icn time" />
                        <div className="txt">
                            <h3>{data.totalTimeSpent || 0}m</h3>
                            <p>Learning Time</p>
                        </div>
                    </div>
                    <div className="p-stat-card">
                        <FaBookOpen className="icn book" />
                        <div className="txt">
                            <h3>{data.activeCourses || 0}</h3>
                            <p>Active Courses</p>
                        </div>
                    </div>
                    <div className="p-stat-card">
                        <FaAward className="icn badge" />
                        <div className="txt">
                            <h3>{data.badges.length || 0}</h3>
                            <p>Badges Won</p>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="main-analytics-content">
                    <div className="chart-box">
                        <div className="box-header">
                            <h3><FaChartLine /> Quiz Performance Trend</h3>
                        </div>
                        <div className="chart-wrapper">
                            {data.quizResults.length > 0 ? (
                                <Line data={chartData} options={options} />
                            ) : (
                                <div className="no-data-msg">No quiz performance data available.</div>
                            )}
                        </div>
                    </div>

                    <div className="progress-breakdown">
                        <div className="box-header">
                            <h3>Course Progress</h3>
                        </div>
                        <div className="p-list">
                            {data.progressRecords.length > 0 ? (
                                data.progressRecords.map((record) => (
                                    <div key={record._id} className="p-item">
                                        <div className="p-info">
                                            <span className="name">{record.course?.title}</span>
                                            <span className="percent">{Math.round(record.percentage || 0)}%</span>
                                        </div>
                                        <div className="p-bar-bg">
                                            <div
                                                className="p-bar-fill"
                                                style={{ width: `${record.percentage || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-data-msg">Enroll in a course to see progress.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Badges Section */}
                <div className="badges-showcase">
                    <div className="box-header">
                        <h3>My Certificates & Badges</h3>
                    </div>
                    <div className="badges-flex">
                        {data.badges.length > 0 ? (
                            data.badges.map((badge, i) => (
                                <div key={i} className="badge-item">
                                    <img src={badge.image} alt={badge.title} />
                                    <h4>{badge.title}</h4>
                                </div>
                            ))
                        ) : (
                            <div className="empty-badges">
                                <FaAward />
                                <p>Complete your first course to earn a badge!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressPage;
