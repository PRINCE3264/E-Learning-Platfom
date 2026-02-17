import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../../main";
import { FaFilePdf, FaDownload, FaEye, FaSearch } from "react-icons/fa";
import { MdDescription, MdAccessTime, MdLibraryBooks } from "react-icons/md";
import "./studyMaterial.css";

const StudyMaterial = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const { data } = await axios.get(`${server}/api/materials`);
                setMaterials(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch materials", error);
                setLoading(false);
            }
        };
        fetchMaterials();
    }, []);

    const filteredMaterials = materials.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.description && m.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="study-material-page">
            {/* ===== HERO SECTION (About Style) ===== */}
            <section className="about-heros material-hero-custom">
                <div className="heros-content">
                    <span className="badge">Central Knowledge Mainframe</span>
                    <h1>Empower Your Journey with <span className="gradient-text">Elite Resources</span></h1>
                    <p>
                        High-fidelity architectural study materials curated specifically for the next generation of industry pioneers. Locate, view, and internalize foundational information.
                    </p>

                    <div className="search-bar-wrap">
                        <div className="search-bar-material">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Locate specific knowledge resource..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <div className="material-container">
                {loading ? (
                    <div className="material-loading">
                        <div className="architect-spinner"></div>
                        <p>Accessing Central Knowledge Base...</p>
                    </div>
                ) : (
                    <div className="materials-grid-user">
                        {filteredMaterials.length > 0 ? (
                            filteredMaterials.map((m, i) => (
                                <div
                                    key={m._id}
                                    className="resource-card-user fadeInUp"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    <div className="resource-icon-wrapper">
                                        <div className="resource-icon">
                                            <FaFilePdf />
                                        </div>
                                        <span className="pdf-badge">DOC-PDF</span>
                                    </div>

                                    <div className="resource-content-elite">
                                        <div className="resource-header">
                                            <h3>{m.title}</h3>
                                            <div className="meta-row">
                                                <MdAccessTime />
                                                <span>{new Date(m.uploadedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <p className="description-text">
                                            {m.description || "Foundational knowledge resource for specialized study and industrial skill acquisition."}
                                        </p>

                                        <div className="resource-footer-elite">
                                            <a href={`${server}${m.pdfUrl}`} target="_blank" rel="noreferrer" className="btn-view-user">
                                                <FaEye /> View Resource
                                            </a>
                                            <a href={`${server}${m.pdfUrl}`} download className="btn-download-user">
                                                <FaDownload />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-materials fadeInUp">
                                <MdLibraryBooks className="empty-icon-user" />
                                <h3>No matching resources found.</h3>
                                <p>Try adjusting your search criteria or explore other knowledge nodes.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyMaterial;
