import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../Utils/Layout";
import { server } from "../../main";
import { MdPersonAdd, MdRefresh, MdSearch, MdFilterList, MdSort, MdDelete, MdSecurity, MdHistory, MdGroups, MdAdminPanelSettings, MdVerifiedUser, MdBlock, MdClose, MdMail, MdLock, MdFace, MdChevronLeft, MdChevronRight, MdAlternateEmail } from "react-icons/md";
import "./adminUsers.css";

import { UserData } from "../../context/UserContext";

const AdminUsers = ({ user, adminSidebarOpen }) => {

  const navigate = useNavigate();
  const {
    users,
    fetchAllUsers,
    updateUserRole,
    updateUserStatus,
    deleteAdminUser,
    createAdminUser
  } = UserData();

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // New user form state
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProfilePicPreview(reader.result);
      setProfilePic(file);
    };
  };

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // 🔹 Redirect non-admin/superadmin
  useEffect(() => {
    if (!user) return;
    const isSuperAdmin = user.mainrole?.trim().toLowerCase() === "superadmin";
    const isAdmin = user.role?.toLowerCase() === "admin";

    if (!isSuperAdmin && !isAdmin) {
      toast.error("Access denied: Admin only");
      navigate("/");
    }
  }, [user, navigate]);

  // 🔹 Fetch users via context
  const fetchUsers = async () => {
    setLoading(true);
    await fetchAllUsers();
    setLoading(false);
  };

  // 🔹 Filter and sort users
  useEffect(() => {
    let result = [...users];

    // Add formatted date for display
    result = result.map(u => ({
      ...u,
      role: u.role || 'user',
      status: u.status || 'active',
      registered: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A',
      registeredTime: u.createdAt ? new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
    }));

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(u =>
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.role?.toLowerCase().includes(term)
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter(u => u.role === roleFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "name":
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
          break;
        case "email":
          aValue = a.email?.toLowerCase() || "";
          bValue = b.email?.toLowerCase() || "";
          break;
        case "role":
          aValue = a.role?.toLowerCase() || "";
          bValue = b.role?.toLowerCase() || "";
          break;
        case "date":
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        default:
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [users, searchTerm, roleFilter, sortBy, sortOrder]);

  // 🔹 Update user role
  const handleUpdateRole = async (id) => {
    if (!window.confirm("Are you sure you want to update this user's role?")) return;
    setUpdatingUserId(id);
    await updateUserRole(id);
    setUpdatingUserId(null);
  };

  // 🔹 Toggle user status
  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    if (!window.confirm(`Are you sure you want to ${newStatus === "suspended" ? "suspend" : "activate"} this user?`)) return;
    await updateUserStatus(user._id, newStatus);
  };

  // 🔹 Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    const data = new FormData();
    data.append("name", newName);
    data.append("username", newUsername);
    data.append("email", newEmail);
    data.append("password", newPassword);
    data.append("role", newRole);
    if (profilePic) data.append("file", profilePic);

    const success = await createAdminUser(data);
    if (success) {
      setShowAddModal(false);
      resetForm();
    }
    setBtnLoading(false);
  };

  const resetForm = () => {
    setNewName("");
    setNewUsername("");
    setNewEmail("");
    setNewPassword("");
    setNewRole("user");
    setProfilePic(null);
    setProfilePicPreview(null);
  };

  // 🔹 Delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    await deleteAdminUser(userToDelete._id);
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // 🔹 Load users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // 🔹 Stats calculation - Precision Engine
  const stats = {
    total: users.length,
    superadmins: users.filter(u => u.mainrole?.toLowerCase() === "superadmin").length,
    admins: users.filter(u => u.role?.toLowerCase() === "admin" || u.mainrole?.toLowerCase() === "superadmin").length,
    users: users.filter(u => u.role?.toLowerCase() === "user" && u.mainrole?.toLowerCase() !== "superadmin").length,
    active: users.filter(u => u.status?.toLowerCase() === "active").length,
    suspended: users.filter(u => u.status?.toLowerCase() === "suspended").length,
    instructors: users.filter(u => u.role?.toLowerCase() === "instructor").length,
    totalEnrollments: users.reduce((acc, u) => acc + (u.subscription?.length || 0), 0)
  };

  // 🔹 Get unique roles for filter dropdown including mainrole
  const uniqueRoles = ["all", ...new Set([...users.map(u => u.role), ...users.map(u => u.mainrole)].filter(Boolean))];

  return (
    <Layout adminSidebarOpen={adminSidebarOpen}>
      <div className="admin-users-page">
        {/* Header */}
        <div className="users-header">
          <div className="header-left">
            <h1>User Management</h1>
            <div className="meta-info-bar">
              <span className="subtitle">Manage all users, roles, and permissions</span>
              <span className="live-date">System Date: {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
          <div className="header-right">
            <button className="export-btn" onClick={() => toast.success("Exporting system data...")}>
              <MdHistory /> Export Audit
            </button>
            <button className="add-user-trigger" onClick={() => setShowAddModal(true)}>
              <MdPersonAdd /> Onboard User
            </button>
            <button className="refresh-btn" onClick={fetchUsers} disabled={loading}>
              <MdRefresh className={loading ? "spin" : ""} /> Sync Database
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="users-stats">
          <div className="user-stat-card total">
            <div className="user-stat-icon"><MdGroups /></div>
            <div className="user-stat-content">
              <h3>{stats.total}</h3>
              <p>Network Strength</p>
            </div>
          </div>
          <div className="user-stat-card admins">
            <div className="user-stat-icon"><MdAdminPanelSettings /></div>
            <div className="user-stat-content">
              <h3>{stats.admins}</h3>
              <p>Administrators</p>
            </div>
            {stats.superadmins > 0 && (
              <span className="superadmin-mini-badge">+{stats.superadmins} Super</span>
            )}
          </div>

          <div className="user-stat-card active">
            <div className="user-stat-icon"><MdVerifiedUser /></div>
            <div className="user-stat-content">
              <h3>{stats.active}</h3>
              <p>Active Channels</p>
            </div>
          </div>
          <div className="user-stat-card enrollments">
            <div className="user-stat-icon"><MdHistory /></div>
            <div className="user-stat-content">
              <h3>{stats.totalEnrollments}</h3>
              <p>Network Enrollments</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="users-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label>Filter by Role:</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="role-filter"
              >
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>
                    {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="role">Role</option>
                <option value="date">Registration Date</option>
              </select>
            </div>

            <button
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-table-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Fetching Users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No match found</h3>
              <p>We couldn't find any users matching your current filters.</p>
            </div>
          ) : (
            <>
              <table className="users-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User Profile</th>
                    <th>Username</th>
                    <th>Email Address</th>
                    <th>Clearance</th>
                    <th>Security</th>
                    <th>Status</th>
                    <th>Enrollments</th>
                    <th>Reg. Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={user._id}>
                      <td className="user-id-text">{indexOfFirstUser + index + 1}</td>
                      <td>
                        <div className="name-cell">
                          <div className="user-avatar-circle">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="user-details">
                            <strong>{user.name || "Unknown User"}</strong>
                            <span className="user-id-text">ID: #{user._id?.substring(0, 6)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="user-username">@{user.username || user.name?.toLowerCase().replace(/\s/g, '_')}</td>
                      <td className="user-email">{user.email}</td>
                      <td>
                        <div className="role-stack">
                          <span className={`role-badge ${user.role}`}>
                            {user.role === 'admin' ? '👑 Admin' : user.role === 'instructor' ? '👨‍🏫 Instructor' : '👤 User'}
                          </span>
                          {user.mainrole === 'superadmin' && (
                            <span className="authority-tag super">SUPERADMIN</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="security-status">
                          <span className={`security-badge ${user.isVerified ? 'verified' : 'pending'}`}>
                            {user.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className={`status-indicator status-${user.status || "active"}`}>
                          <span className="dot"></span>
                          <span>{user.status === 'active' ? 'Active' : 'Suspended'}</span>
                        </div>
                      </td>
                      <td className="enrollment-cell">
                        <div className="enrollment-count">
                          <strong>{user.subscription?.length || 0}</strong>
                          <span>Courses</span>
                        </div>
                      </td>
                      <td className="registered-date">
                        <div className="date-stack">
                          <span className="main-date">{user.registered}</span>
                          <span className="sub-time">{user.registeredTime}</span>
                        </div>
                      </td>
                      <td>
                        <div className="actions-group-premium">
                          <button
                            className={`action-icon-btn promote ${user.role === 'admin' ? 'revoke' : ''}`}
                            onClick={() => handleUpdateRole(user._id)}
                            disabled={updatingUserId === user._id}
                            title={user.role === "admin" ? "Demote to User" : "Make Admin"}
                          >
                            {updatingUserId === user._id ? (
                              <MdRefresh className="spin" />
                            ) : user.role === "admin" ? (
                              <MdSecurity />
                            ) : (
                              <MdAdminPanelSettings />
                            )}
                          </button>

                          <button
                            className={`action-icon-btn status ${user.status === 'active' ? 'block' : 'unblock'}`}
                            onClick={() => handleToggleStatus(user)}
                            title={user.status === "active" ? "Suspend Account" : "Activate Account"}
                          >
                            {user.status === "active" ? <MdBlock /> : <MdVerifiedUser />}
                          </button>

                          <button
                            className="action-icon-btn delete"
                            onClick={() => {
                              setUserToDelete(user);
                              setShowDeleteModal(true);
                            }}
                            title="Delete User"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <MdChevronLeft /> Prev
                  </button>

                  <div className="page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                      <button
                        key={num}
                        className={`page-number ${currentPage === num ? "active" : ""}`}
                        onClick={() => setCurrentPage(num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next <MdChevronRight />
                  </button>

                  <div className="page-info">
                    Page {currentPage} of {totalPages} • Showing {currentUsers.length} of {filteredUsers.length} users
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Onboard User Modal - Elite Industrial Variant */}
      {showAddModal && (
        <div className="user-modal-overlay">
          <div className="user-form-modal elite-variant">
            <div className="modal-header-elite">
              <div className="header-main-content">
                <div className="header-brand-icon"><MdPersonAdd /></div>
                <div className="header-titles">
                  <h2>Digital Identity Provisioning</h2>
                  <p>Onboard a new node into the ecosystem mainframe.</p>
                </div>
              </div>
              <button className="close-elite-btn" onClick={() => { setShowAddModal(false); resetForm(); }}>
                <MdClose />
              </button>
            </div>

            <div className="modal-grid-layout">
              <form onSubmit={handleCreateUser} className="elite-onboarding-form">
                <div className="form-segment">
                  <label className="segment-indicator">01. Visual Identity</label>
                  <div className="profile-upload-mini">
                    <div className="preview-avatar-elite">
                      {profilePicPreview ? <img src={profilePicPreview} alt="Preview" /> : <MdFace />}
                    </div>
                    <label className="elite-upload-label">
                      Choose Digital Identity Avatar
                      <input type="file" onChange={handleImageChange} accept="image/*" />
                    </label>
                  </div>
                </div>

                <div className="form-segment">
                  <label className="segment-indicator">02. Core Identity</label>

                  <div className="form-group-elite">
                    <label><MdFace /> Legal Name</label>
                    <div className="elite-input-wrapper">
                      <MdFace className="elite-field-icon" />
                      <input
                        type="text"
                        placeholder="e.g. Alan Turing"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-elite">
                    <label><MdAlternateEmail /> System Username</label>
                    <div className="elite-input-wrapper">
                      <MdAlternateEmail className="elite-field-icon" />
                      <input
                        type="text"
                        placeholder="e.g. turing_01"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-elite">
                    <label><MdMail /> Network Address (Email)</label>
                    <div className="elite-input-wrapper">
                      <MdMail className="elite-field-icon" />
                      <input
                        type="email"
                        placeholder="identity@nexus.com"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-segment">
                  <label className="segment-indicator">02. Authorization Matrix</label>

                  <div className="form-group-elite">
                    <label><MdLock /> Primary Access Key</label>
                    <div className="elite-input-wrapper">
                      <MdLock className="elite-field-icon" />
                      <input
                        type="password"
                        placeholder="Generate secure key..."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-elite">
                    <label><MdAdminPanelSettings /> Clearance Level</label>
                    <div className="elite-input-wrapper">
                      <MdAdminPanelSettings className="elite-field-icon" />
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                      >
                        <option value="user">Standard Node (User)</option>
                        <option value="admin">System Administrator</option>
                        <option value="instructor">Field Instructor</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="elite-form-actions">
                  <button type="submit" disabled={btnLoading} className="elite-cta-primary">
                    {btnLoading ? (
                      <span className="sync-box"><MdRefresh className="spin" /> Syncing...</span>
                    ) : (
                      <>Execute Provisioning</>
                    )}
                  </button>
                  <button type="button" onClick={() => { setShowAddModal(false); resetForm(); }} className="elite-cta-secondary">
                    Abort Protocol
                  </button>
                </div>
              </form>

              <div className="identity-preview-panel">
                <div className="preview-label">Live Identity Snapshot</div>
                <div className="identity-card-wireframe">
                  <div className="wireframe-avatar">
                    {newName ? newName.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div className="wireframe-info">
                    <h4>{newName || "Awaiting Name..."}</h4>
                    <p>{newEmail || "Awaiting Email..."}</p>
                    <span className={`preview-role-badge ${newRole}`}>
                      {newRole.toUpperCase()}
                    </span>
                  </div>
                  <div className="wireframe-stats">
                    <div className="stat-node">
                      <label>Status</label>
                      <span>PRE-ACTIVE</span>
                    </div>
                    <div className="stat-node">
                      <label>Node Type</label>
                      <span>{newRole === 'admin' ? 'SYSTEM' : 'FIELD'}</span>
                    </div>
                  </div>
                </div>
                <div className="security-briefing">
                  <MdSecurity />
                  <p>Upon execution, the new identity will be encrypted and granted access to requested sectors.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="user-modal-overlay">
          <div className="user-form-modal delete-variant">
            <div className="modal-header-admin danger">
              <h2>
                <div className="header-icon-box danger-icon"><MdDelete /></div>
                <span>Termination Protocol</span>
              </h2>
              <button className="close-x-btn" onClick={() => setShowDeleteModal(false)}><MdClose /></button>
            </div>

            <div className="modal-body-admin">
              <p>Requested termination for identity: <strong>{userToDelete.name}</strong></p>
              <div className="critical-warning">
                <MdBlock /> <strong>CRITICAL:</strong> All associated data snapshots and access permissions will be permanently purged from the mainframe. This operation cannot be neutralized.
              </div>
            </div>

            <div className="modal-footer-admin">
              <button className="modal-btn-confirm delete-bg" onClick={handleDeleteUser}>
                Authorize Wipe
              </button>
              <button className="modal-btn-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminUsers;