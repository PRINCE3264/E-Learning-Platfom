

import React, { useState, useEffect } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import "./admincourses.css";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import { MdLibraryBooks, MdAddCircle, MdCloudUpload, MdAccessTime, MdAttachMoney, MdPerson, MdSearch, MdTitle, MdDescription, MdCategory, MdClose, MdLayers } from "react-icons/md";

const categories = [
  "Web Development",
  "App Development",
  "Game Development",
  "Data Science",
  "Artificial Intelligence",
];

const AdminCourses = ({ user, adminSidebarOpen }) => {
  const navigate = useNavigate();
  const { courses, fetchCourses } = CourseData();

  // Redirect non-admin users
  useEffect(() => {
    if (!user) return navigate("/login");
    if (user.role !== "admin") return navigate("/");
  }, [user, navigate]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const [showFormModal, setShowFormModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState("");

  const editHandler = (course) => {
    setIsEdit(true);
    setEditId(course._id);
    setTitle(course.title);
    setDescription(course.description);
    setCategory(course.category);
    setPrice(course.price);
    setCreatedBy(course.createdBy);
    setDuration(course.duration);
    setImagePrev(`${server}/${course.image}`);
    setImage("");
    setShowFormModal(true);
  };

  const openAddModal = () => {
    setIsEdit(false);
    resetForm();
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    resetForm();
  };

  const cancelEdit = () => {
    setShowFormModal(false);
    resetForm();
  };

  // Image preview handler
  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  // Form submit handler
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isEdit && !image) return toast.error("Please select a course image");
    if (!title || !description || !category || !price || !createdBy || !duration) {
      return toast.error("Please fill all fields");
    }

    setBtnLoading(true);

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("category", category);
    myForm.append("price", price);
    myForm.append("createdBy", createdBy);
    myForm.append("duration", duration);
    if (image) myForm.append("file", image);

    try {
      if (isEdit) {
        // Update endpoint
        await axios.put(`${server}/api/course/${editId}`, myForm, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Course updated successfully");
      } else {
        // Add endpoint
        await axios.post(`${server}/api/course/new`, myForm, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Course created successfully");
      }

      await fetchCourses();
      closeFormModal();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setBtnLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setPrice("");
    setCreatedBy("");
    setDuration("");
    setImage("");
    setImagePrev("");
    setEditId("");
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout adminSidebarOpen={adminSidebarOpen}>
      <div className="admin-courses-main-wrapper">
        {/* Page Header */}
        <div className="admin-page-header">
          <div className="header-info">
            <h1>
              <MdLibraryBooks className="header-icon" />
              Course Management
            </h1>
            <p>Design and deploy educational content with ease.</p>
          </div>
          <div className="header-stats">
            <div className="mini-stat">
              <span>{courses?.length || 0}</span>
              <label>Active Courses</label>
            </div>
          </div>
        </div>

        <div className="course-management-content">
          <div className="management-toolbar">
            <div className="toolbar-left">
              <div className="search-box-admin">
                <MdSearch className="search-icon-inside" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-box-admin">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <button className="add-course-btn" onClick={openAddModal}>
              <MdAddCircle /> New Course
            </button>
          </div>

          <div className="course-list-section full-width">
            <div className="section-header">
              <h2>Inventory Overview</h2>
            </div>
            <div className="courses-grid-view">
              {filteredCourses && filteredCourses.length > 0 ? (
                filteredCourses.map((e) => (
                  <CourseCard
                    key={e._id}
                    course={e}
                    onEdit={editHandler}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <MdLibraryBooks size={48} />
                  <p>No courses found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Form */}
        {showFormModal && (
          <div className="course-modal-overlay">
            <div className="course-form-modal elite-variant">
              <div className="modal-header-elite">
                <div className="header-main-content">
                  <div className="header-brand-icon">
                    {isEdit ? <MdLayers /> : <MdAddCircle />}
                  </div>
                  <div className="header-titles">
                    <h2>{isEdit ? "Asset Refinement" : "Course Provisioning"}</h2>
                    <p>{isEdit ? "Modifying existing educational infrastructure." : "Deploying new educational nodes to the ecosystem."}</p>
                  </div>
                </div>
                <button className="close-elite-btn" onClick={closeFormModal}>
                  <MdClose />
                </button>
              </div>

              <div className="modal-grid-layout">
                <form onSubmit={submitHandler} className="elite-onboarding-form">
                  <div className="form-segment">
                    <label className="segment-indicator">01. Core Identity</label>
                    <div className="form-group-elite">
                      <label><MdTitle /> Designation</label>
                      <div className="elite-input-wrapper">
                        <MdTitle className="elite-field-icon" />
                        <input
                          type="text"
                          placeholder="e.g. Master React in 30 Days"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group-elite">
                      <label><MdDescription /> Brief Overview</label>
                      <div className="elite-input-wrapper">
                        <MdDescription className="elite-field-icon" style={{ top: '15px' }} />
                        <textarea
                          placeholder="Describe the course goals..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                          rows="3"
                          style={{ paddingLeft: '50px', paddingTop: '12px' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-segment">
                    <label className="segment-indicator">02. Logistics Matrix</label>
                    <div className="elite-horizontal-stack">
                      <div className="form-group-elite">
                        <label><MdAttachMoney /> Value (₹)</label>
                        <div className="elite-input-wrapper">
                          <MdAttachMoney className="elite-field-icon" />
                          <input
                            type="number"
                            placeholder="999"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group-elite">
                        <label><MdAccessTime /> Effort (H)</label>
                        <div className="elite-input-wrapper">
                          <MdAccessTime className="elite-field-icon" />
                          <input
                            type="number"
                            placeholder="20"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group-elite">
                      <label><MdCategory /> Sector</label>
                      <div className="elite-input-wrapper">
                        <MdCategory className="elite-field-icon" />
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                        >
                          <option value="">Choose Sector</option>
                          {categories.map((cat) => (
                            <option value={cat} key={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group-elite">
                      <label><MdPerson /> Lead Authority</label>
                      <div className="elite-input-wrapper">
                        <MdPerson className="elite-field-icon" />
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={createdBy}
                          onChange={(e) => setCreatedBy(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="elite-form-actions">
                    <button type="submit" disabled={btnLoading} className="elite-cta-primary">
                      {btnLoading ? (
                        <span className="sync-box"><MdCloudUpload className="spin" /> Syncing...</span>
                      ) : (
                        <>{isEdit ? "Update Assets" : "Execute Provision"}</>
                      )}
                    </button>
                    <button type="button" onClick={cancelEdit} className="elite-cta-secondary">
                      Abort Protocol
                    </button>
                  </div>
                </form>

                <div className="identity-preview-panel">
                  <div className="preview-label">Asset Vision Preview</div>
                  <div className="identity-card-wireframe">
                    <div className="wireframe-avatar" style={{ borderRadius: '18px', width: '100%', height: '140px' }}>
                      {imagePrev ? (
                        <img src={imagePrev} alt="Course Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px' }} />
                      ) : (
                        <MdCloudUpload style={{ fontSize: '40px' }} />
                      )}
                    </div>
                    <div className="wireframe-info">
                      <h4>{title || "Awaiting Title..."}</h4>
                      <p>{category || "Awaiting Sector..."}</p>
                      <span className={`preview-role-badge active`}>
                        ₹{price || "0"}
                      </span>
                    </div>
                    <div className="wireframe-stats">
                      <div className="stat-node">
                        <label>Effort</label>
                        <span>{duration || "0"} HRS</span>
                      </div>
                      <div className="stat-node">
                        <label>Asset Status</label>
                        <span>{isEdit ? "SYNCED" : "PRE-DEPLOY"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group-elite" style={{ marginTop: 'auto' }}>
                    <div className="advanced-file-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={changeImageHandler}
                        required={!isEdit}
                        id="course-img-upload-elite"
                      />
                      <label htmlFor="course-img-upload-elite" className="file-zone" style={{ padding: '20px 10px' }}>
                        <MdCloudUpload className="zone-icon" style={{ fontSize: '24px' }} />
                        <span className="main-text" style={{ fontSize: '13px' }}>{image ? image.name : "Modify Asset"}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminCourses;

