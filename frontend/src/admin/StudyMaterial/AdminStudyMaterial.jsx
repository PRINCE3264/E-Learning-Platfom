import React, { useState, useEffect } from "react";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import toast from "react-hot-toast";
import {
    MdFileUpload,
    MdDelete,
    MdEdit,
    MdDescription,
    MdTitle,
    MdFilePresent,
    MdSearch,
    MdAdd,
    MdClose
} from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";
import "./adminStudyMaterial.css";

const AdminStudyMaterial = ({ adminSidebarOpen }) => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [btnLoading, setBtnLoading] = useState(false);

    const fetchMaterials = async () => {
        try {
            const { data } = await axios.get(`${server}/api/materials`);
            setMaterials(data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch study materials");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || (!file && !editMode)) {
            toast.error("Title and PDF file are required");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (file) formData.append("pdf", file);

        setBtnLoading(true);
        try {
            if (editMode) {
                await axios.put(`${server}/api/materials/${currentId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Material updated successfully");
            } else {
                await axios.post(`${server}/api/materials/upload`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Material uploaded successfully");
            }
            setShowModal(false);
            resetForm();
            fetchMaterials();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setBtnLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this study material?")) {
            try {
                await axios.delete(`${server}/api/materials/${id}`);
                toast.success("Material deleted successfully");
                fetchMaterials();
            } catch (error) {
                toast.error("Failed to delete material");
            }
        }
    };

    const handleEdit = (material) => {
        setEditMode(true);
        setCurrentId(material._id);
        setTitle(material.title);
        setDescription(material.description);
        setFile(null);
        setShowModal(true);
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setFile(null);
        setEditMode(false);
        setCurrentId(null);
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    return (
        <Layout adminSidebarOpen={adminSidebarOpen}>
            <div className="admin-materials-container">
                <div className="materials-header-elite">
                    <div className="header-info">
                        <h1>Digital Library Management</h1>
                        <p>Curate and distribute high-fidelity study resources for the scholar network.</p>
                    </div>
                    <button className="add-material-btn" onClick={openAddModal}>
                        <MdAdd /> Upload Resource
                    </button>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="architect-spinner"></div>
                        <p>Syncing Library Database...</p>
                    </div>
                ) : (
                    <div className="materials-grid-elite">
                        {materials.length > 0 ? (
                            materials.map((m) => (
                                <div key={m._id} className="material-card-elite">
                                    <div className="card-top-icon">
                                        <FaFilePdf />
                                    </div>
                                    <div className="card-body-elite">
                                        <h3>{m.title}</h3>
                                        <p>{m.description || "No description provided."}</p>
                                        <div className="card-meta">
                                            <span>Uploaded: {new Date(m.uploadedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="card-actions-elite">
                                        <button className="edit-action" onClick={() => handleEdit(m)}>
                                            <MdEdit />
                                        </button>
                                        <button className="delete-action" onClick={() => handleDelete(m._id)}>
                                            <MdDelete />
                                        </button>
                                        <a href={`${server}${m.pdfUrl}`} target="_blank" rel="noreferrer" className="view-action">
                                            <MdFilePresent /> View
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-library">
                                <MdDescription className="empty-icon" />
                                <h3>The library is currently empty.</h3>
                                <p>Begin by uploading your first architectural resource.</p>
                            </div>
                        )}
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay-elite">
                        <div className="modal-content-elite">
                            <div className="modal-header-elite">
                                <h2>{editMode ? "Refine Resource" : "Upload New Resource"}</h2>
                                <button className="close-modal" onClick={() => setShowModal(false)}><MdClose /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="elite-form">
                                <div className="form-group-elite">
                                    <label><MdTitle /> Resource Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Advanced Quantum Mechanics Handbook"
                                        required
                                    />
                                </div>
                                <div className="form-group-elite">
                                    <label><MdDescription /> Brief Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Provide context for the scholars..."
                                        rows="3"
                                    ></textarea>
                                </div>
                                <div className="form-group-elite">
                                    <label><MdFileUpload /> PDF Document</label>
                                    <div className="file-input-wrapper">
                                        <input type="file" onChange={handleFileChange} accept="application/pdf" id="pdf-upload" />
                                        <label htmlFor="pdf-upload" className="file-label-elite">
                                            {file ? file.name : "Select PDF Document"}
                                        </label>
                                    </div>
                                    <p className="file-hint">Only high-fidelity PDF documents are permitted.</p>
                                </div>
                                <div className="modal-footer-elite">
                                    <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-submit-elite" disabled={btnLoading}>
                                        {btnLoading ? "Processing..." : (editMode ? "Commit Changes" : "Confirm Upload")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AdminStudyMaterial;
