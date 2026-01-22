



// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";
// import Layout from "../Utils/Layout";
// import { server } from "../../main";

// const AdminUsers = ({ user }) => {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingUserId, setUpdatingUserId] = useState(null);

//   // ✅ Axios instance with token
//   const axiosInstance = useMemo(() => {
//     const instance = axios.create({ baseURL: server });
//     instance.interceptors.request.use(
//       (config) => {
//         const token = localStorage.getItem("token");
//         if (token) config.headers.Authorization = `Bearer ${token}`;
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );
//     return instance;
//   }, []);

//   // 🔹 Redirect non-superadmin
//   useEffect(() => {
//     if (!user) return;
//     if (user.mainrole?.trim().toLowerCase() !== "superadmin") {
//       toast.error("Access denied: Superadmin only");
//       navigate("/");
//     }
//   }, [user, navigate]);

//   // 🔹 Fetch users
//   const fetchUsers = async () => {
//     if (!user || user.mainrole?.trim().toLowerCase() !== "superadmin") return;

//     setLoading(true);
//     try {
//       const { data } = await axiosInstance.get("/api/users"); // make sure backend route exists
//       setUsers(data.users || []);
//     } catch (error) {
//       console.error(error);
//       const msg = error.response?.data?.message || "Failed to fetch users";
//       toast.error(msg);

//       if (error.response?.status === 401) {
//         localStorage.removeItem("token");
//         navigate("/login");
//       } else if (error.response?.status === 403) {
//         navigate("/");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Update user role
//   const updateRole = async (id) => {
//     if (!window.confirm("Are you sure you want to update this user role?")) return;

//     setUpdatingUserId(id);
//     try {
//       const { data } = await axiosInstance.put(`/api/user/${id}`);
//       toast.success(data.message || "User role updated");
//       await fetchUsers();
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Failed to update role");
//     } finally {
//       setUpdatingUserId(null);
//     }
//   };

//   // 🔹 Load users on mount
//   useEffect(() => {
//     fetchUsers();
//   }, [user]);

//   return (
//     <Layout>
//       <div className="users">
//         <h1>All Users</h1>
//         {loading ? (
//           <p>Loading users...</p>
//         ) : users.length === 0 ? (
//           <p>No users found</p>
//         ) : (
//           <table border="1" className="users-table">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Role</th>
//                 <th>Update Role</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((u, i) => (
//                 <tr key={u._id}>
//                   <td>{i + 1}</td>
//                   <td>{u.name}</td>
//                   <td>{u.email}</td>
//                   <td>{u.role}</td>
//                   <td>
//                     <button
//                       className="common-btn"
//                       disabled={updatingUserId === u._id}
//                       onClick={() => updateRole(u._id)}
//                     >
//                       {updatingUserId === u._id ? "Updating..." : "Update Role"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </Layout>
//   );
// };

//  export default AdminUsers;


import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../Utils/Layout";
import { server } from "../../main";
import "./adminUsers.css";

const AdminUsers = ({ user }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // ✅ Axios instance with token
  const axiosInstance = useMemo(() => {
    const instance = axios.create({ baseURL: server });
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );
    return instance;
  }, []);

  // 🔹 Redirect non-superadmin
  useEffect(() => {
    if (!user) return;
    if (user.mainrole?.trim().toLowerCase() !== "superadmin") {
      toast.error("Access denied: Superadmin only");
      navigate("/");
    }
  }, [user, navigate]);

  // 🔹 Fetch users
  const fetchUsers = async () => {
    if (!user || user.mainrole?.trim().toLowerCase() !== "superadmin") return;

    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/users");
      const formattedUsers = data.users?.map(user => ({
        ...user,
        role: user.role || 'user',
        status: user.status || 'active',
        registered: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
        lastActive: user.lastActive || 'N/A'
      })) || [];
      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
    } catch (error) {
      console.error("Fetch error:", error);
      const msg = error.response?.data?.message || "Failed to fetch users";
      toast.error(msg);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 403) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filter and sort users
  useEffect(() => {
    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter(user => user.role === roleFilter);
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
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, searchTerm, roleFilter, sortBy, sortOrder]);

  // 🔹 Update user role
  const updateRole = async (id) => {
    if (!window.confirm("Are you sure you want to update this user's role?")) return;

    setUpdatingUserId(id);
    try {
      const userToUpdate = users.find(u => u._id === id);
      const newRole = userToUpdate.role === "admin" ? "user" : "admin";
      
      const { data } = await axiosInstance.put(`/api/user/${id}`, { role: newRole });
      toast.success(data.message || "User role updated successfully");
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // 🔹 Toggle user status (active/suspended)
  const toggleStatus = async (id) => {
    const userToToggle = users.find(u => u._id === id);
    const newStatus = userToToggle.status === "active" ? "suspended" : "active";
    
    if (!window.confirm(`Are you sure you want to ${newStatus === "suspended" ? "suspend" : "activate"} this user?`)) return;

    try {
      const { data } = await axiosInstance.put(`/api/user/${id}/status`, { status: newStatus });
      toast.success(data.message || `User ${newStatus} successfully`);
      await fetchUsers();
    } catch (error) {
      console.error("Status toggle error:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // 🔹 Delete user
  const deleteUser = async (id) => {
    if (!userToDelete) return;

    try {
      const { data } = await axiosInstance.delete(`/api/user/${id}`);
      toast.success(data.message || "User deleted successfully");
      await fetchUsers();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  // 🔹 Load users on mount
  useEffect(() => {
    fetchUsers();
  }, [user]);

  // 🔹 Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // 🔹 Stats calculation
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === "admin").length,
    users: users.filter(u => u.role === "user").length,
    active: users.filter(u => u.status === "active").length,
    suspended: users.filter(u => u.status === "suspended").length,
    instructors: users.filter(u => u.role === "instructor").length,
  };

  // 🔹 Get unique roles for filter dropdown
  const uniqueRoles = ["all", ...new Set(users.map(u => u.role).filter(Boolean))];

  return (
    <Layout>
      <div className="admin-users-page">
        {/* Header */}
        <div className="users-header">
          <div className="header-left">
            <h1>User Management</h1>
            <p className="subtitle">Manage all users, roles, and permissions</p>
          </div>
          <div className="header-right">
            <button className="refresh-btn" onClick={fetchUsers} disabled={loading}>
              {loading ? "Refreshing..." : "🔄 Refresh"}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="users-stats">
          <div className="stat-card total">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.total}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card admins">
            <div className="stat-icon">👑</div>
            <div className="stat-content">
              <h3>{stats.admins}</h3>
              <p>Admins</p>
            </div>
          </div>
          <div className="stat-card users">
            <div className="stat-icon">👤</div>
            <div className="stat-content">
              <h3>{stats.users}</h3>
              <p>Regular Users</p>
            </div>
          </div>
          <div className="stat-card active">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.active}</h3>
              <p>Active Users</p>
            </div>
          </div>
          <div className="stat-card instructors">
            <div className="stat-icon">👨‍🏫</div>
            <div className="stat-content">
              <h3>{stats.instructors}</h3>
              <p>Instructors</p>
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
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <h3>No users found</h3>
              <p>{searchTerm || roleFilter !== "all" ? "Try adjusting your filters" : "No users in the system yet"}</p>
            </div>
          ) : (
            <>
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={user._id} className={user.status === "suspended" ? "suspended" : ""}>
                      <td className="user-id">{indexOfFirstUser + index + 1}</td>
                      <td className="user-name">
                        <div className="name-cell">
                          <div className="user-avatar">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <strong>{user.name || "N/A"}</strong>
                            <div className="user-id-small">ID: {user._id?.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="user-email">{user.email || "N/A"}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role || "user"}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status || "active"}`}>
                          {user.status || "active"}
                        </span>
                      </td>
                      <td className="registered-date">{user.registered}</td>
                      <td className="actions-cell">
                        <div className="actions-group">
                          <button
                            className={`action-btn ${user.role === "admin" ? "revoke-btn" : "promote-btn"}`}
                            onClick={() => updateRole(user._id)}
                            disabled={updatingUserId === user._id}
                            title={user.role === "admin" ? "Revoke Admin" : "Make Admin"}
                          >
                            {updatingUserId === user._id ? (
                              "Updating..."
                            ) : user.role === "admin" ? (
                              "👑 Revoke Admin"
                            ) : (
                              "👑 Make Admin"
                            )}
                          </button>

                          <button
                            className={`action-btn ${user.status === "active" ? "suspend-btn" : "activate-btn"}`}
                            onClick={() => toggleStatus(user._id)}
                            title={user.status === "active" ? "Suspend User" : "Activate User"}
                          >
                            {user.status === "active" ? "⏸️ Suspend" : "▶️ Activate"}
                          </button>

                          <button
                            className="action-btn delete-btn"
                            onClick={() => {
                              setUserToDelete(user);
                              setShowDeleteModal(true);
                            }}
                            title="Delete User"
                          >
                            🗑️ Delete
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
                    ← Previous
                  </button>

                  <div className="page-numbers">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      if (pageNum > 0 && pageNum <= totalPages) {
                        return (
                          <button
                            key={pageNum}
                            className={`page-number ${currentPage === pageNum ? "active" : ""}`}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next →
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>⚠️ Confirm Delete</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete user <strong>{userToDelete.name}</strong> ({userToDelete.email})?
              </p>
              <p className="warning-text">This action cannot be undone. All user data will be permanently deleted.</p>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="modal-btn delete-confirm-btn" onClick={() => deleteUser(userToDelete._id)}>
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminUsers;