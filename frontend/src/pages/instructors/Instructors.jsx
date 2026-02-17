import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../main";
import "./instructors.css";
import { FaLinkedin, FaTwitter, FaGlobe, FaStar, FaUserGraduate } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";

import { UserData } from "../../context/UserContext";

const Instructors = ({ adminSidebarOpen }) => {
    const { user } = UserData();
    const isAdmin = user?.role === "admin" || user?.mainrole === "superadmin";
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const { data } = await axios.get(`${server}/api/instructor/active`);
                setInstructors(data.instructors);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching instructors:", error);
                setLoading(false);
            }
        };
        fetchInstructors();
    }, []);

    if (loading) return <div className="instructors-loading">Gathering our Elite Mentors...</div>;

    return (
        <div className={`instructors-page ${(isAdmin && adminSidebarOpen) ? 'admin-sidebar-active' : ''}`}>
            <section className="instructors-hero">
                <span className="badge">Learn from the Best Architects</span>
                <h1>Meet Our <span className="gradient-text">Elite Mentors</span></h1>
                <p>Our instructors are industry veterans, researchers, and world-class educators dedicated to your success.</p>
            </section>

            <div className="instructors-grid-user">
                {instructors.filter(i => i.status === 'active').length > 0 ? (
                    instructors.filter(i => i.status === 'active').map((inst, index) => (
                        <div
                            key={inst._id}
                            className="instructor-card-user"
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            <div className="card-image-box">
                                {inst.user?.profilePicture ? (
                                    <img src={`${server}/${inst.user.profilePicture}`} alt={inst.user.name} />
                                ) : (
                                    <div className="placeholder-avatar">
                                        <span>{inst.user?.name?.charAt(0)}</span>
                                    </div>
                                )}
                                <div className="experience-tag">{inst.experience}+ Years XP</div>
                            </div>

                            <div className="card-content-user">
                                <span className="dept-tag">{inst.department}</span>
                                <h2>{inst.user?.name}</h2>
                                <h4 className="specialization-text">{inst.specialization}</h4>

                                <p className="bio-teaser">{inst.bio}</p>

                                <div className="inst-stats-user">
                                    <div className="stat-item">
                                        <FaStar className="icon-star" />
                                        <span>{inst.rating} Rating</span>
                                    </div>
                                    <div className="stat-item">
                                        <MdAttachMoney className="icon-money" style={{ color: '#10b981', fontSize: '1.4rem' }} />
                                        <span>₹{inst.fee || 0} Fee</span>
                                    </div>
                                    <div className="stat-item">
                                        <FaUserGraduate className="icon-grad" />
                                        <span>{inst.totalStudents.toLocaleString()} Students</span>
                                    </div>
                                </div>

                                <div className="social-links-user">
                                    {inst.socialLinks?.linkedin && (
                                        <a href={inst.socialLinks.linkedin} title="LinkedIn" target="_blank" rel="noreferrer"><FaLinkedin /></a>
                                    )}
                                    {inst.socialLinks?.twitter && (
                                        <a href={inst.socialLinks.twitter} title="Twitter" target="_blank" rel="noreferrer"><FaTwitter /></a>
                                    )}
                                    {inst.socialLinks?.website && (
                                        <a href={inst.socialLinks.website} title="Portfolio" target="_blank" rel="noreferrer"><FaGlobe /></a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-instructors">No mentors found at the moment.</div>
                )}
            </div>
        </div>
    );
};

export default Instructors;
