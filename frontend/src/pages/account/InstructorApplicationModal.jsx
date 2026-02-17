import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../main";
import "./instructor-modal.css";

const InstructorApplicationModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        bio: "",
        department: "",
        experience: "",
        specialization: "",
        linkedin: "",
        twitter: "",
        website: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${server}/api/instructor/apply`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            toast.success(data.message);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Application failed");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="elite-modal-overlay">
            <div className="elite-modal-content">
                <div className="modal-header">
                    <h2>Apply to Join our Mentor Force</h2>
                    <button className="close-modal" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="elite-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Department</label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                placeholder="e.g. Data Science"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Experience (Years)</label>
                            <input
                                type="number"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                placeholder="e.g. 8"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Master Specialization</label>
                        <input
                            type="text"
                            value={formData.specialization}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            placeholder="e.g. Quantum Computing, Neural Networks"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Professional Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Describe your architectural journey as an educator..."
                            required
                        ></textarea>
                    </div>

                    <div className="social-links-section">
                        <h3>Global Connectivity (Optional)</h3>
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="LinkedIn URL"
                                value={formData.linkedin}
                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Twitter URL"
                                value={formData.twitter}
                                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Personal Portfolio/Website"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="submit-btn-elite" disabled={loading}>
                        {loading ? "Transmitting Application..." : "Execute Enrollment Request"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InstructorApplicationModal;
