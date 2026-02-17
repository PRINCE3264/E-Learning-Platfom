import React, { useState, useEffect } from "react";
import { MdDashboard } from "react-icons/md";
import "./account.css";
import { IoMdLogOut } from "react-icons/io";
import { FaUserEdit, FaSave, FaCamera, FaPhone, FaMapMarkerAlt, FaVenusMars, FaEnvelope } from "react-icons/fa";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Analytics from "./Analytics";
import InstructorApplicationModal from "./InstructorApplicationModal";

const Account = ({ user }) => {
  const { setIsAuth, setUser } = UserData();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [showInstructorModal, setShowInstructorModal] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setGender(user.gender || "");
    }
  }, [user]);

  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    toast.success("Logged Out");
    navigate("/login");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePicPreview(URL.createObjectURL(file));
    setProfilePic(file);
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("gender", gender);
    if (profilePic) formData.append("file", profilePic);

    try {
      const { data } = await axios.put(`${server}/api/user/update`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success(data.message);
      setUser(data.user); // Update context with new data
      setEditMode(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-container">
      {user && (
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-container">
              <div className="profile-avatar">
                {profilePicPreview || user.profilePicture ? (
                  <img
                    src={profilePicPreview || `${server}/${user.profilePicture}`}
                    alt={user.name}
                  />
                ) : (
                  <span>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
                )}
              </div>

              {editMode && (
                <div className="avatar-overlay">
                  <label htmlFor="file-upload" className="custom-file-upload">
                    <FaCamera size={24} />
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                </div>
              )}
            </div>
            <h2>{user.name}</h2>
            <p className="role-badge">{user.role}</p>
          </div>

          <div className="profile-content">
            {editMode ? (
              // EDIT FORM
              <form onSubmit={updateProfileHandler} className="profile-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address"
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn" disabled={loading}>
                    {loading ? "Saving..." : <><FaSave /> Save Changes</>}
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // VIEW MODE
              <div className="profile-details">
                <div className="detail-item">
                  <div className="detail-label">
                    <FaEnvelope className="detail-icon" />
                    <strong>Email</strong>
                  </div>
                  <span>{user.email}</span>
                </div>
                <div className="detail-item">
                  <div className="detail-label">
                    <FaPhone className="detail-icon" />
                    <strong>Phone</strong>
                  </div>
                  <span>{user.phone || "Not Added"}</span>
                </div>
                <div className="detail-item">
                  <div className="detail-label">
                    <FaMapMarkerAlt className="detail-icon" />
                    <strong>Address</strong>
                  </div>
                  <span>{user.address || "Not Added"}</span>
                </div>
                <div className="detail-item">
                  <div className="detail-label">
                    <FaVenusMars className="detail-icon" />
                    <strong>Gender</strong>
                  </div>
                  <span>{user.gender || "Not Added"}</span>
                </div>

                <button className="edit-profile-btn" onClick={() => setEditMode(true)}>
                  <FaUserEdit /> Edit Profile
                </button>
              </div>
            )}

            <div className="dashboard-actions">
              <button
                onClick={() => navigate(`/${user._id}/dashboard`)}
                className="common-btn dashboard-btn"
              >
                <MdDashboard /> User Dashboard
              </button>

              {user.role === "admin" && (
                <button
                  onClick={() => navigate(`/admin/dashboard`)}
                  className="common-btn admin-btn"
                >
                  <MdDashboard /> Admin Dashboard
                </button>
              )}

              {user.role === "user" && (
                <button
                  onClick={() => setShowInstructorModal(true)}
                  className="common-btn instructor-apply-btn"
                >
                  <FaUserEdit /> Join Mentor Force
                </button>
              )}

              <button onClick={logoutHandler} className="common-btn logout-btn">
                <IoMdLogOut /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <InstructorApplicationModal
        isOpen={showInstructorModal}
        onClose={() => setShowInstructorModal(false)}
      />
    </div>
  );
};

export default Account;


