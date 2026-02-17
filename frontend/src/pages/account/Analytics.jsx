import React, { useEffect, useState } from "react";
import "./Analytics.css";
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
import { FaClock, FaBookOpen, FaAward, FaChartLine } from "react-icons/fa";

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

const Analytics = () => {
    const { fetchAnalytics } = UserData();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            const res = await fetchAnalytics();
            if (res) setData(res);
            setLoading(false);
        };
        getData();
    }, []);

    if (loading) return <div className="analytics-loading">Loading Analytics...</div>;
    if (!data) return <div className="analytics-error">Error loading analytics.</div>;

    const chartData = {
        labels: data.quizResults.map((r, i) => `Quiz ${data.quizResults.length - i}`).reverse(),
        datasets: [
            {
                label: "Quiz Performance (%)",
                data: data.quizResults.map((r) => r.percentage).reverse(),
                fill: true,
                backgroundColor: "rgba(138, 75, 175, 0.2)",
                borderColor: "#8a4baf",
                tension: 0.4,
                pointBackgroundColor: "#8a4baf",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#8a4baf",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "#2d3436",
                padding: 12,
                titleColor: "#fff",
                bodyColor: "#fff",
                cornerRadius: 8,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: "rgba(0,0,0,0.05)" },
            },
            x: {
                grid: { display: false },
            },
        },
    };

    return (
        <div className="analytics-wrapper">
            <div className="analytics-header">
                <h2><FaChartLine /> Learning Progress & Performance</h2>
                <p>Track your journey and achievements</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon time"><FaClock /></div>
                    <div className="stat-info">
                        <h3>{data.totalTimeSpent || 0}m</h3>
                        <p>Total Time Spent</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon course"><FaBookOpen /></div>
                    <div className="stat-info">
                        <h3>{data.activeCourses || 0}</h3>
                        <p>Active Courses</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon badge"><FaAward /></div>
                    <div className="stat-info">
                        <h3>{data.badges.length || 0}</h3>
                        <p>Badges Won</p>
                    </div>
                </div>
            </div>

            <div className="charts-section">
                <div className="chart-container">
                    <h3>Quiz Performance Trend</h3>
                    {data.quizResults.length > 0 ? (
                        <Line data={chartData} options={options} />
                    ) : (
                        <div className="no-data">No quiz data available yet. Start a quiz!</div>
                    )}
                </div>

                <div className="progress-list-container">
                    <h3>Course Progress Breakdown</h3>
                    <div className="progress-list">
                        {data.progressRecords.length > 0 ? (
                            data.progressRecords.map((record) => (
                                <div key={record._id} className="progress-item">
                                    <div className="progress-info">
                                        <span>{record.course?.title}</span>
                                        <span>{record.percentage || 0}%</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${record.percentage || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-data">No course progress tracked yet.</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="badges-section">
                <h3>Your Completion Badges</h3>
                <div className="badges-grid">
                    {data.badges.length > 0 ? (
                        data.badges.map((badge, i) => (
                            <div key={i} className="badge-card">
                                <img src={badge.image} alt={badge.title} />
                                <h4>{badge.title}</h4>
                                <span>{new Date(badge.date).toLocaleDateString()}</span>
                            </div>
                        ))
                    ) : (
                        <div className="no-data-badges">Complete courses to earn beautiful badges! 🏆</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
