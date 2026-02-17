
import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../main";
import Layout from "../Utils/Layout";
import "./adminpayments.css";
import {
    MdPayments,
    MdSearch,
    MdFilterList,
    MdDownload,
    MdAccountCircle,
    MdBook,
    MdAttachMoney,
    MdDateRange,
    MdReceipt,
    MdCheckCircle,
    MdTrendingUp
} from "react-icons/md";
import toast from "react-hot-toast";

const AdminPayments = ({ adminSidebarOpen }) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCourse, setFilterCourse] = useState("All");

    const fetchAllPayments = async () => {
        try {
            const { data } = await axios.get(`${server}/api/payments`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setPayments(data.payments);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Cloud Synchro Failure: Unable to fetch ledger data");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllPayments();
    }, []);

    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.razorpay_payment_id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCourse = filterCourse === "All" || payment.course?.title === filterCourse;

        return matchesSearch && matchesCourse;
    });

    const totalRevenue = filteredPayments.reduce((acc, p) => acc + (p.course?.price || 0), 0);
    const uniqueCourses = ["All", ...new Set(payments.map(p => p.course?.title).filter(Boolean))];

    if (loading) return (
        <Layout adminSidebarOpen={adminSidebarOpen}>
            <div className="admin-payments-loading">
                <div className="elite-spinner"></div>
                <p>Decrypting Financial Mainframe...</p>
            </div>
        </Layout>
    );

    return (
        <Layout adminSidebarOpen={adminSidebarOpen}>
            <div className="admin-payments-container">
                {/* Elite Header */}
                <div className="admin-page-header">
                    <div className="header-info">
                        <h1>
                            <MdPayments className="header-icon" />
                            Financial Registry
                        </h1>
                        <p>Real-time audit of platform-wide transactions and revenue streams.</p>
                    </div>
                    <div className="header-stats">
                        <div className="mini-stat-card elite-variant">
                            <div className="stat-icon-box"><MdTrendingUp /></div>
                            <div className="stat-details">
                                <span>₹{totalRevenue.toLocaleString()}</span>
                                <label>Net Payload</label>
                            </div>
                        </div>
                        <div className="mini-stat-card elite-variant">
                            <div className="stat-icon-box blue"><MdReceipt /></div>
                            <div className="stat-details">
                                <span>{filteredPayments.length}</span>
                                <label>Authorized Logs</label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="management-toolbar">
                    <div className="toolbar-left">
                        <div className="search-box-admin">
                            <MdSearch className="search-icon-inside" />
                            <input
                                type="text"
                                placeholder="Search by Client, Email or P-ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-box-admin">
                            <MdFilterList className="filter-icon-inside" />
                            <select
                                value={filterCourse}
                                onChange={(e) => setFilterCourse(e.target.value)}
                            >
                                {uniqueCourses.map(course => (
                                    <option key={course} value={course}>{course}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button className="elite-action-btn" onClick={() => toast.success("Export Protocol Initialized")}>
                        <MdDownload /> Export Ledger
                    </button>
                </div>

                {/* Payments Table/List */}
                <div className="payment-ledger-section">
                    <div className="ledger-header">
                        <div className="col-user">Administrative Identity</div>
                        <div className="col-course">Asset Provisioned</div>
                        <div className="col-id">Transaction Hash</div>
                        <div className="col-date">Execution Timestamp</div>
                        <div className="col-amount">Payload</div>
                        <div className="col-status">Status</div>
                    </div>
                    <div className="ledger-body">
                        {filteredPayments.length > 0 ? (
                            filteredPayments.map((p) => (
                                <div key={p._id} className="ledger-row elite-hover">
                                    <div className="col-user">
                                        <div className="user-info-elite">
                                            <div className="user-avatar-mini"><MdAccountCircle /></div>
                                            <div className="user-text">
                                                <span className="user-name">{p.user?.name}</span>
                                                <span className="user-email">{p.user?.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-course">
                                        <div className="course-tag-elite">
                                            <MdBook /> {p.course?.title}
                                        </div>
                                    </div>
                                    <div className="col-id">
                                        <code className="p-id-hash">{p.razorpay_payment_id}</code>
                                    </div>
                                    <div className="col-date">
                                        <span className="timestamp-elite">
                                            <MdDateRange /> {new Date(p.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="col-amount">
                                        <span className="amount-elite">₹{p.course?.price}</span>
                                    </div>
                                    <div className="col-status">
                                        <span className="status-badge-success">
                                            <MdCheckCircle /> Verified
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-ledger-state">
                                <MdPayments size={48} />
                                <p>No records found in the current audit scope.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminPayments;
