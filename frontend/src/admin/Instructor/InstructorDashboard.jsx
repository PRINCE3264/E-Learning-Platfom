import React, { useState, useEffect } from "react";
import Layout from "../Utils/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import { UserData } from "../../context/UserContext";
import {
  MdPerson,
  MdLibraryBooks,
  MdStar,
  MdPeople,
  MdAddCircle,
  MdSearch,
  MdSettings,
  MdDownload,
  MdPrint,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdCheck,
  MdClose,
  MdChevronRight,
  MdAlternateEmail,
  MdGroups,
  MdAttachMoney,
  MdPersonAdd,
  MdBook,
  MdAdd,
  MdBlock
} from "react-icons/md";
import "./InstructorDashboard.css";

const InstructorDashboard = ({ user, adminSidebarOpen }) => {
  const { user: contextUser } = UserData();
  const currentUser = user || contextUser;

  if (currentUser && (currentUser.role !== "admin" && currentUser.mainrole !== "superadmin")) {
    return null;
  }
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    userId: '',
    bio: '',
    department: '',
    experience: '',
    specialization: '',
    linkedin: '',
    twitter: '',
    website: '',
    fee: ''
  });

  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const [stats, setStats] = useState({
    totalInstructors: 0,
    activeInstructors: 0,
    pendingInstructors: 0,
    totalCourses: 0,
    avgRating: 0,
    totalStudents: 0,
    totalCapital: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [instRes, statsRes, usersRes] = await Promise.all([
        axios.get(`${server}/api/instructor/all`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }),
        axios.get(`${server}/api/instructor/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }),
        axios.get(`${server}/api/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
      ]);

      setInstructors(instRes.data.instructors);
      setStats(prev => ({
        ...prev,
        ...statsRes.data.stats,
        totalCapital: instRes.data.instructors.reduce((acc, curr) => acc + (Number(curr.fee) || 0), 0)
      }));
      setUsers(usersRes.data.users);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [courses, setCourses] = useState([
    { id: 1, title: 'Advanced React Development', instructor: 'Dr. Sarah Johnson', students: 450, rating: 4.9, status: 'published' },
    { id: 2, title: 'Machine Learning Fundamentals', instructor: 'Prof. Michael Chen', students: 320, rating: 4.8, status: 'published' },
    { id: 3, title: 'Quantum Physics Basics', instructor: 'Dr. Emma Wilson', students: 280, rating: 4.95, status: 'draft' },
    { id: 4, title: 'Full Stack Web Development', instructor: 'Dr. Sarah Johnson', students: 520, rating: 4.7, status: 'published' },
  ]);

  const handleAddInstructor = () => {
    setIsEditMode(false);
    setFormData({
      userId: '',
      bio: '',
      department: '',
      experience: '',
      specialization: '',
      linkedin: '',
      twitter: '',
      website: '',
      fee: ''
    });
    setProfilePic(null);
    setProfilePicPreview(null);
    setShowModal(true);
  };

  const handleEditInstructor = (instructor) => {
    setIsEditMode(true);
    setSelectedInstructorId(instructor._id);
    setFormData({
      userId: instructor.user?._id || '',
      bio: instructor.bio || '',
      department: instructor.department || '',
      experience: instructor.experience || '',
      specialization: instructor.specialization || '',
      linkedin: instructor.socialLinks?.linkedin || '',
      twitter: instructor.socialLinks?.twitter || '',
      website: instructor.socialLinks?.website || '',
      fee: instructor.fee || ''
    });
    setProfilePic(null);
    setProfilePicPreview(instructor.user?.profilePicture ? `${server}/${instructor.user.profilePicture}` : null);
    setShowModal(true);
  };

  const handleViewInstructor = (instructor) => {
    setSelectedInstructor(instructor);
    setShowViewModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProfilePicPreview(reader.result);
      setProfilePic(file);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("userId", formData.userId);
    data.append("bio", formData.bio);
    data.append("department", formData.department);
    data.append("experience", formData.experience);
    data.append("specialization", formData.specialization);
    data.append("linkedin", formData.linkedin);
    data.append("twitter", formData.twitter);
    data.append("website", formData.website);
    data.append("fee", formData.fee);
    if (profilePic) data.append("file", profilePic);

    try {
      if (isEditMode) {
        await axios.put(`${server}/api/instructor/${selectedInstructorId}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        toast.success("Instructor Updated Successfully");
      } else {
        await axios.post(`${server}/api/instructor/new`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        toast.success("Instructor Registered Successfully");
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const { data } = await axios.put(`${server}/api/instructor/status/${id}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success(data.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteInstructor = async (id) => {
    if (window.confirm('Authorize termination of this instructor node?')) {
      try {
        await axios.delete(`${server}/api/instructor/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        toast.success('Instructor Node Terminated Successfully');
        fetchData();
      } catch (error) {
        toast.error("Failed to delete instructor");
      }
    }
  };

  return (
    <Layout adminSidebarOpen={adminSidebarOpen}>
      <div className="instructor-dashboard">



        <div className="users-header">
          <div className="header-left">
            <h1>Instructor Intelligence</h1>
            <div className="meta-info-bar">
              <span className="subtitle">Managing the architectural minds of our E-Learning platform</span>
              <span className="live-date">
                System Time: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <div className="header-right">
            <button className="add-user-trigger" onClick={handleAddInstructor}>
              <MdPersonAdd /> Add/Onboard Mentor
            </button>
          </div>
        </div>

        <div className="users-stats">
          <div className="user-stat-card total">
            <div className="user-stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>
              <MdPerson />
            </div>
            <div className="user-stat-content">
              <h3>{stats.totalInstructors}</h3>
              <p>Total Mentors</p>
              <span className="stat-detail">Global Network Presence</span>
            </div>
          </div>

          <div className="user-stat-card admins">
            <div className="user-stat-icon" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%)' }}>
              <MdLibraryBooks />
            </div>
            <div className="user-stat-content">
              <h3>{stats.totalCourses}</h3>
              <p>Provisioned Assets</p>
              <span className="stat-detail">Knowledge Base Density</span>
            </div>
          </div>

          <div className="user-stat-card active">
            <div className="user-stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}>
              <MdStar />
            </div>
            <div className="user-stat-content">
              <h3>{stats.avgRating}</h3>
              <p>Elite QoS</p>
              <span className="stat-detail">Pedagogical Excellence</span>
            </div>
          </div>

          <div className="user-stat-card enrollments">
            <div className="user-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}>
              <MdAttachMoney />
            </div>
            <div className="user-stat-content">
              <h3>₹{stats.totalCapital.toLocaleString()}</h3>
              <p>Capital Outlay</p>
              <span className="stat-detail">Projected Resource Value</span>
            </div>
          </div>
        </div>

        {/* Advanced Tab Controller */}
        <div className="tab-controller-elite">
          <button
            className={`tab-btn-premium ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <MdSettings className="t-icon" /> Operational Overview
          </button>
          <button
            className={`tab-btn-premium ${activeTab === 'instructors' ? 'active' : ''}`}
            onClick={() => setActiveTab('instructors')}
          >
            <MdGroups className="t-icon" /> Instructor Intelligence
          </button>
          <button
            className={`tab-btn-premium ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <MdLibraryBooks className="t-icon" /> Resource Provisioning
          </button>
        </div>

        {/* Main Content Area */}
        <div className="main-content-fluid">
          {/* Removed internal redundant sidebar */}

          {/* Content Area */}
          <div className="content-area">
            {/* Search and Filter Bar */}
            <div className="toolbar">
              <div className="search-box">
                <i className="fas fa-search-dollar"></i>
                <input
                  type="text"
                  placeholder="Advanced Node Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filters">
                <select className="filter-select">
                  <option>Compute Core</option>
                  <option>Algorithmic Labs</option>
                  <option>Nexus Division</option>
                </select>
                <button className="optimization-btn">
                  <MdSettings /> Optimization
                </button>
              </div>
            </div>

            {/* Instructors Table */}
            {activeTab === 'instructors' && (
              <div className="card">
                <div className="card-header">
                  <h2>Instructors List</h2>
                  <div className="card-actions">
                    <button className="btn-icon">
                      <MdDownload /> Export
                    </button>
                    <button className="btn-icon">
                      <MdPrint /> Print
                    </button>
                  </div>
                </div>
                <div className="table-responsive">
                  {loading ? (
                    <div className="loading-container">Loading Instructors...</div>
                  ) : (
                    <table className="instructors-table">
                      <thead>
                        <tr>
                          <th>Instructor Profile</th>
                          <th>Department Hub</th>
                          <th>Experience</th>
                          <th>Learners</th>
                          <th>Service Fee</th>
                          <th>QoS Rating</th>
                          <th>Status</th>
                          <th>Operational Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {instructors.filter(i =>
                          i.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map(instructor => (
                          <tr key={instructor._id}>
                            <td>
                              <div className="instructor-info">
                                <div className="avatars">
                                  {instructor.user?.profilePicture ? (
                                    <img src={`${server}/${instructor.user.profilePicture}`} alt={instructor.user.name} />
                                  ) : (
                                    instructor.user?.name?.charAt(0)
                                  )}
                                </div>
                                <div>
                                  <h4>{instructor.user?.name}</h4>
                                  <p className="u-handle">@{instructor.user?.username || instructor.user?.email?.split('@')[0]}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="dept-cell">
                                <strong>{instructor.department}</strong>
                                <span className="spec-tag">{instructor.specialization}</span>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-courses">
                                {instructor.experience} Years
                              </span>
                            </td>
                            <td>
                              <div className="learners-metric">
                                <strong>{instructor.totalStudents?.toLocaleString() || 0}</strong>
                                <span>Total Nodes</span>
                              </div>
                            </td>
                            <td className="fee-col">₹{instructor.fee?.toLocaleString() || 0}</td>
                            <td>
                              <div className="rating">
                                <span className="stars">
                                  {'★'.repeat(Math.round(instructor.rating || 0))}
                                  {'☆'.repeat(5 - Math.round(instructor.rating || 0))}
                                </span>
                                <span className="rating-number">{instructor.rating || 0} QoS</span>
                              </div>
                            </td>
                            <td>
                              <div className={`status-badge status-${instructor.status || 'active'}`}>
                                <span className="status-dot"></span>
                                {(instructor.status || 'Active').charAt(0).toUpperCase() + (instructor.status || 'Active').slice(1)}
                              </div>
                            </td>
                            <td>
                              <div className="actions-group-premium">
                                <button
                                  className="action-icon-btn view"
                                  title="View Intel Profile"
                                  onClick={() => handleViewInstructor(instructor)}
                                >
                                  <MdVisibility />
                                </button>
                                <button
                                  className="action-icon-btn promote"
                                  onClick={() => handleEditInstructor(instructor)}
                                  title="Refine Metadata"
                                >
                                  <MdEdit />
                                </button>
                                <button
                                  className="action-icon-btn delete"
                                  onClick={() => handleDeleteInstructor(instructor._id)}
                                  title="Terminate Node"
                                >
                                  <MdDelete />
                                </button>
                                <button
                                  className={`action-icon-btn status ${instructor.status === 'active' ? 'block' : 'unblock'}`}
                                  onClick={() => handleUpdateStatus(instructor._id, instructor.status === 'active' ? 'pending' : 'active')}
                                  title={instructor.status === 'active' ? "Suspend Instructor" : "Activate Instructor"}
                                >
                                  {instructor.status === 'active' ? <MdBlock /> : <MdCheck />}
                                </button>
                                <button
                                  className="action-icon-btn delete"
                                  onClick={() => handleDeleteInstructor(instructor._id)}
                                  title="Terminate Node"
                                >
                                  <MdDelete />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* Courses Grid View */}
            {activeTab === 'courses' && (
              <div className="card">
                <div className="card-header">
                  <h2>Course Management</h2>
                  <button className="btn-primary">
                    <MdAdd /> New Course
                  </button>
                </div>
                <div className="courses-grid">
                  {courses.map(course => (
                    <div className="course-card" key={course.id}>
                      <div className="course-header">
                        <div className="course-category">Programming</div>
                        <span className={`course-status status-${course.status}`}>
                          {course.status}
                        </span>
                      </div>
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-instructor">{course.instructor}</p>
                      <div className="course-stats">
                        <div className="stat">
                          <MdPeople />
                          <span>{course.students} students</span>
                        </div>
                        <div className="stat">
                          <MdStar />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                      <div className="course-actions">
                        <button className="btn-outline">Preview</button>
                        <button className="btn-primary">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="overview-grid">
                <div className="card card-chart">
                  <h3>Instructor Performance</h3>
                  <div className="chart-placeholder">
                    <div className="chart-bar" style={{ height: '80%' }}></div>
                    <div className="chart-bar" style={{ height: '95%' }}></div>
                    <div className="chart-bar" style={{ height: '70%' }}></div>
                    <div className="chart-bar" style={{ height: '60%' }}></div>
                  </div>
                </div>
                <div className="card">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-icon">
                        <MdPersonAdd />
                      </div>
                      <div className="activity-content">
                        <p>New instructor registered: <strong>Dr. Alex Turner</strong></p>
                        <span className="activity-time">2 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">
                        <MdBook />
                      </div>
                      <div className="activity-content">
                        <p>Course <strong>"AI Fundamentals"</strong> published</p>
                        <span className="activity-time">5 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Detail Modal */}
      {showViewModal && selectedInstructor && (
        <div className="elite-modal-overlay">
          <div className="elite-modal-content view-modal">
            <div className="modal-header">
              <h2>Mentor Intelligence Profile</h2>
              <button className="close-modal" onClick={() => setShowViewModal(false)}>&times;</button>
            </div>
            <div className="view-profile-body">
              <div className="profile-top">
                <div className="profile-avatar-large">
                  {selectedInstructor.user?.profilePicture ? (
                    <img src={`${server}/${selectedInstructor.user.profilePicture}`} alt="" />
                  ) : (
                    selectedInstructor.user?.name?.charAt(0)
                  )}
                </div>
                <div className="profile-main-meta">
                  <h3>{selectedInstructor.user?.name}</h3>
                  <p className="p-email">{selectedInstructor.user?.email}</p>
                  <span className="p-dept">{selectedInstructor.department} | {selectedInstructor.specialization}</span>
                </div>
              </div>

              <div className="profile-stats-grid">
                <div className="p-stat">
                  <label>Experience</label>
                  <span>{selectedInstructor.experience} Years</span>
                </div>
                <div className="p-stat">
                  <label>Service Fee</label>
                  <span className="p-fee">₹{selectedInstructor.fee || 0}</span>
                </div>
                <div className="p-stat">
                  <label>Learners</label>
                  <span>{selectedInstructor.totalStudents || 0}</span>
                </div>
                <div className="p-stat">
                  <label>QoS Rating</label>
                  <span>{selectedInstructor.rating || 0} / 5</span>
                </div>
              </div>

              <div className="profile-bio-section">
                <h4>Professional Background</h4>
                <p>{selectedInstructor.bio}</p>
              </div>

              <div className="profile-social-dock">
                {selectedInstructor.socialLinks?.linkedin && (
                  <a href={selectedInstructor.socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                )}
                {selectedInstructor.socialLinks?.twitter && (
                  <a href={selectedInstructor.socialLinks.twitter} target="_blank" rel="noreferrer">Twitter</a>
                )}
                {selectedInstructor.socialLinks?.website && (
                  <a href={selectedInstructor.socialLinks.website} target="_blank" rel="noreferrer">Portfolio</a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructor Modal */}
      {showModal && (
        <div className="elite-modal-overlay">
          <div className="elite-modal-content">
            <div className="modal-header">
              <div className="modal-title-box">
                <MdPersonAdd className="title-icon" />
                <div>
                  <h2>{isEditMode ? 'Refine Instructor Metadata' : 'Provision New Instructor'}</h2>
                  <p>Security Clearance Level: Admin/Superadmin</p>
                </div>
              </div>
              <button className="close-modal" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="elite-form">
              <div className="form-section-elite">
                <h4 className="section-divider">Profile Visualization</h4>
                <div className="profile-upload-container">
                  <div className="avatar-preview-box">
                    {profilePicPreview ? (
                      <img src={profilePicPreview} alt="Preview" />
                    ) : (
                      <div className="preview-placeholder">
                        <MdPersonAdd />
                      </div>
                    )}
                  </div>
                  <div className="upload-btn-wrapper">
                    <label className="btn-upload-elite">
                      Choose Profile Picture
                      <input type="file" onChange={handleImageChange} accept="image/*" />
                    </label>
                    <p>Supported: JPG, PNG, WEBP</p>
                  </div>
                </div>
              </div>

              <div className="form-section-elite">
                <h4 className="section-divider">Core Identity Assignment</h4>
                {!isEditMode ? (
                  <div className="form-group-elite">
                    <label>Target User Account</label>
                    <div className="elite-input-wrapper">
                      <MdPeople className="elite-field-icon" />
                      <select
                        value={formData.userId}
                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                        required
                      >
                        <option value="">Search for user...</option>
                        {users.map(u => (
                          <option key={u._id} value={u._id}>{u.name} (@{u.username || u.email.split('@')[0]})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="form-group-elite readonly">
                    <label>Active Identity Node</label>
                    <div className="elite-input-wrapper">
                      <MdCheck className="elite-field-icon" />
                      <input type="text" value={selectedInstructor?.user?.name || "Target Identified"} readOnly />
                    </div>
                  </div>
                )}
              </div>

              <div className="form-section-elite">
                <h4 className="section-divider">Expertise & Professional Fee</h4>
                <div className="form-row-elite">
                  <div className="form-group-elite">
                    <label>Department Hub</label>
                    <div className="elite-input-wrapper">
                      <MdSettings className="elite-field-icon" />
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="e.g. Artificial Intelligence"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group-elite">
                    <label>Experience (Years)</label>
                    <div className="elite-input-wrapper">
                      <MdLibraryBooks className="elite-field-icon" />
                      <input
                        type="number"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="e.g. 10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group-elite">
                  <label>Advanced Specialization</label>
                  <div className="elite-input-wrapper">
                    <MdStar className="elite-field-icon" />
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      placeholder="e.g. Neural Networks, React Architecture"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section-elite">
                <h4 className="section-divider">Financial & Professional Data</h4>
                <div className="form-group-elite">
                  <label>Professional Bio (Biography Protocol)</label>
                  <div className="elite-input-wrapper">
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Define the instructor's pedagogical background and mission..."
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="form-group-elite">
                  <label>Network Resource Fee (₹)</label>
                  <div className="elite-input-wrapper">
                    <MdAttachMoney className="elite-field-icon" />
                    <input
                      type="number"
                      value={formData.fee}
                      onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                      placeholder="e.g. 15000"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section-elite">
                <h4 className="section-divider">Universal Links</h4>
                <div className="form-row-elite">
                  <div className="elite-input-wrapper">
                    <input
                      type="text"
                      placeholder="LinkedIn URL"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    />
                  </div>
                  <div className="elite-input-wrapper">
                    <input
                      type="text"
                      placeholder="Twitter URL"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn-elite">
                {isEditMode ? 'AUTHORIZE METADATA REFINE' : 'EXECUTE MENTOR PROMOTION'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default InstructorDashboard;
