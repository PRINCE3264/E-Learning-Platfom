import React, { useEffect, useState, useRef } from "react";
import "./payments.css";
import { UserData } from "../../context/UserContext";
import axios from "axios";
import { server } from "../../main";
import {
    FaCheckCircle,
    FaCreditCard,
    FaCalendarAlt,
    FaHistory,
    FaDownload,
    FaHashtag,
    FaRegClock,
    FaArrowRight
} from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(null);
    const [currentTime] = useState(new Date().toLocaleString());
    const receiptRefs = useRef({});

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const { data } = await axios.get(`${server}/api/mycourse/payments`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setPayments(data.payments);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchPaymentHistory();
    }, []);

    const handleDownloadPDF = async (paymentId, title) => {
        const input = receiptRefs.current[paymentId];
        if (!input) return;

        setDownloading(paymentId);

        try {
            // Wait a brief moment to ensure UI is ready
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(input, {
                scale: 2, // High DPI
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
                onclone: (clonedDoc) => {
                    // Ensure download buttons are hidden in the clone (PDF)
                    const downloadBtn = clonedDoc.querySelector(`[data-payment-id="${paymentId}"] .download-receipt-btn`);
                    if (downloadBtn) downloadBtn.style.display = 'none';
                }
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Receipt_${title.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
        } finally {
            setDownloading(null);
        }
    };

    if (loading) return (
        <div className="payments-loading-wrapper">
            <div className="payment-spinner"></div>
            <p>Gathering your transaction records...</p>
        </div>
    );

    return (
        <div className="payments-container">
            <div className="payments-header-section">
                <div className="p-header-left">
                    <span className="badge">Financial Ledger</span>
                    <h1>Payment <span className="gradient-text">History</span></h1>
                    <p>Verified purchase records and digital transaction receipts</p>
                </div>
                <div className="p-header-right">
                    <div className="current-time-badge">
                        <FaRegClock /> Statement Generated: {currentTime}
                    </div>
                </div>
            </div>

            <div className="payments-overview-panel">
                <div className="overview-stat">
                    <span>Total Subscriptions</span>
                    <div className="stat-value">{payments.length}</div>
                </div>
                <div className="overview-stat">
                    <span>Account Status</span>
                    <div className="stat-value active">Verified</div>
                </div>
            </div>

            <div className="payments-list">
                {payments.length > 0 ? (
                    payments.map((payment) => (
                        <div
                            key={payment._id}
                            data-payment-id={payment._id}
                            ref={el => receiptRefs.current[payment._id] = el}
                            className="payment-receipt-card"
                        >
                            <div className="receipt-border-dash"></div>
                            <div className="payment-card-content">
                                <div className="p-course-strip">
                                    <div className="p-course-info">
                                        <div className="p-course-img-v2">
                                            <img src={`${server}/${payment.course?.image}`} alt={payment.course?.title} />
                                        </div>
                                        <div className="p-title-group">
                                            <h3>{payment.course?.title}</h3>
                                            <div className="p-id-badges">
                                                <div className="p-id-tag" title={payment.razorpay_payment_id}>
                                                    <span className="p-id-tag-label"><FaHashtag /> P-ID</span>
                                                    <span className="p-id-tag-value">{payment.razorpay_payment_id}</span>
                                                </div>
                                                <div className="p-id-tag" title={payment.razorpay_order_id}>
                                                    <span className="p-id-tag-label"><FaHashtag /> O-ID</span>
                                                    <span className="p-id-tag-value">{payment.razorpay_order_id}</span>
                                                </div>
                                                <div className="p-id-tag signature" title={payment.razorpay_signature}>
                                                    <span className="p-id-tag-label"><FaCheckCircle /> Signature</span>
                                                    <span className="p-id-tag-value">
                                                        {payment.razorpay_signature ? payment.razorpay_signature.substring(0, 16) + '...' : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-status-column">
                                        <span className="status-pill-success">
                                            <FaCheckCircle /> Payment Successful
                                        </span>
                                    </div>
                                </div>

                                <div className="payment-meta-footer">
                                    <div className="m-detail">
                                        <div className="m-label">Amount Paid</div>
                                        <div className="m-value price">₹{payment.course?.price}</div>
                                    </div>
                                    <div className="m-detail">
                                        <div className="m-label">Purchase Date</div>
                                        <div className="m-value"><FaCalendarAlt /> {new Date(payment.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</div>
                                    </div>
                                    <div className="m-detail">
                                        <div className="m-label">Access Period</div>
                                        <div className="m-value">Lifetime Access</div>
                                    </div>
                                    <div className="m-action">
                                        <button
                                            className={`download-receipt-btn ${downloading === payment._id ? 'loading' : ''}`}
                                            onClick={() => handleDownloadPDF(payment._id, payment.course?.title)}
                                            disabled={downloading !== null}
                                        >
                                            {downloading === payment._id ? (
                                                <>Preparing...</>
                                            ) : (
                                                <><FaDownload /> Download PDF</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="premium-empty-state">
                        <div className="empty-icon-box">
                            <FaCreditCard />
                        </div>
                        <h2>No Transactions Yet</h2>
                        <p>Unlock premium learning content and track your investments here.</p>
                        <button className="browse-btn" onClick={() => window.location.href = '/courses'}>
                            Explore Courses <FaArrowRight />
                        </button>
                    </div>
                )}
            </div>

            <div className="payment-footer-note">
                <p>Need help with a payment? <a href="/contact">Contact Support</a></p>
            </div>
        </div>
    );
};

export default Payments;
