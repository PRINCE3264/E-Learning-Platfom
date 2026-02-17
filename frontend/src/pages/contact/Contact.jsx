
import React, { useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaBook,
  FaMapMarkerAlt,
  FaGlobe,
  FaPaperPlane,
  FaPhoneAlt,
  FaMapMarkedAlt,
  FaCommentAlt,
  FaBuilding
} from "react-icons/fa";
import { UserData } from "../../context/UserContext";
import "./Contact.css";

const Contact = ({ adminSidebarOpen }) => {
  const { user } = UserData();
  const isAdmin = user?.role === "admin" || user?.mainrole === "superadmin";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    state: "",
    domain: "",
    address: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/contact",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setSuccessMsg("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          course: "",
          state: "",
          domain: "",
          address: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("AxiosError:", error);
      setErrorMsg(
        error.response?.data?.error || "Failed to send message. Try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`contact-container ${(isAdmin && adminSidebarOpen) ? 'admin-sidebar-active' : ''}`}>
      <div className="contact-wrapper">
        <div className="contact-header">
          <h2>Get in Touch</h2>
          <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">
                <FaPhoneAlt />
              </div>
              <div className="info-text">
                <h3>Call Us</h3>
                <p>+91 123 456 7890</p>
                <p>Mon - Sat, 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaEnvelope />
              </div>
              <div className="info-text">
                <h3>Email Us</h3>
                <p>support@elearning.com</p>
                <p>info@elearning.com</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaMapMarkedAlt />
              </div>
              <div className="info-text">
                <h3>Our Location</h3>
                <p>123 Learning Street, Knowledge Hub</p>
                <p>New Delhi, India - 110001</p>
              </div>
            </div>

            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.916719623811!2d77.21175647576569!3d28.5872895ec050631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2f90240974b%3A0xc368a529367d30f1!2sKnowledge%20Hub!5e0!3m2!1sen!2sin!4v1707990000000!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              ></iframe>
            </div>
          </div>

          <div className="contact-form-container">
            {successMsg && (
              <div className="success-banner">
                <FaPaperPlane className="icon" /> {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="error-banner">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="advanced-form">
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <FaBook className="input-icon" />
                <input
                  type="text"
                  name="course"
                  placeholder="Course Name"
                  value={formData.course}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <FaGlobe className="input-icon" />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <FaBuilding className="input-icon" />
                <input
                  type="text"
                  name="domain"
                  placeholder="Domain (e.g. Web Dev)"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <FaMapMarkerAlt className="input-icon" />
                <input
                  type="text"
                  name="address"
                  placeholder="Your Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group full-width">
                <FaCommentAlt className="input-icon textarea-icon" />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span className="loader"></span>
                ) : (
                  <>
                    Send Message <FaPaperPlane className="btn-icon" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
