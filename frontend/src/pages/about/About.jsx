import React from "react";
import "./about.css";
import { FaGraduationCap, FaBook, FaChalkboardTeacher, FaTrophy, FaCheckCircle, FaRocket, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

/* ===== Instructor Data ===== */
const instructors = [
  {
    name: "John Doe",
    role: "Web Development Lead",
    experience: "10+ years",
    expertise: "React, Node.js, Cloud Architect",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Jane Smith",
    role: "Data Science Expert",
    experience: "8 years",
    expertise: "Python, AI/ML, Big Data",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Mike Johnson",
    role: "UI/UX Creative Director",
    experience: "7 years",
    expertise: "Figma, Design Systems, UX Research",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    name: "Prince Vidyarthi",
    role: "Python & Data Science Specialist",
    experience: "5+ years",
    expertise: "Python, Django, AI/ML, Data Science",
    image: "images/IMG-20241224-WA0130.jpg",
  },
];

/* ===== Platform Stats ===== */
const stats = [
  { number: "15,000+", label: "Active Students", icon: <FaGraduationCap /> },
  { number: "600+", label: "Premium Courses", icon: <FaBook /> },
  { number: "75+", label: "Expert Mentors", icon: <FaChalkboardTeacher /> },
  { number: "99%", label: "Satisfaction Rate", icon: <FaTrophy /> },
];

import { UserData } from "../../context/UserContext";

const About = ({ adminSidebarOpen }) => {
  const { user } = UserData();
  const isAdmin = user?.role === "admin" || user?.mainrole === "superadmin";

  return (
    <div className={`about-page ${(isAdmin && adminSidebarOpen) ? 'admin-sidebar-active' : ''}`}>
      {/* ===== HERO SECTION ===== */}
      <section className="about-heros">
        <div className="heros-content">
          <span className="badge">Welcome to the Future of Learning</span>
          <h1>Empowering Minds Through <span className="gradient-text">Elite Education</span></h1>
          <p>
            We're not just a platform; we're a launchpad for your career. Our mission is to democratize high-end technical education, making it accessible, affordable, and industrial-grade for everyone.
          </p>
          <div className="heros-stats">
            {stats.map((stat, i) => (
              <div className="heros-stat-item" key={i}>
                <div className="stat-icon-wrapper">{stat.icon}</div>
                <div className="stat-info">
                  <span className="h-stat-number">{stat.number}</span>
                  <span className="h-stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VALUE PROPOSITION ===== */}
      <section className="value-proposition">
        <div className="section-header">
          <h2>Why Elevate Your Skills With Us?</h2>
          <p>Designed by industry experts to get you hired.</p>
        </div>
        <div className="value-grid">
          {[
            {
              title: "Industry-Ready Curriculum",
              desc: "Our courses are built in collaboration with top tech giants to ensure you learn what matters.",
            },
            {
              title: "Interactive HD Content",
              desc: "Engage with high-bitrate video lessons, interactive quizzes, and hands-on projects.",
            },
            {
              title: "Direct Mentor Access",
              desc: "Never get stuck. Our mentors provide 24/7 support through dedicated community channels.",
            },
            {
              title: "Verified Certification",
              desc: "Earn certificates recognized globally by recruiters and industry leaders.",
            }
          ].map((item, i) => (
            <div
              className="value-card"
              key={i}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <FaCheckCircle className="v-icon" />
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="vision-mission-container">
        <div className="vm-card mission">
          <div className="vm-icon"><FaRocket /></div>
          <h3>Our Mission</h3>
          <p>To provide accessible, high-quality education that empowers every learner to break through their career ceilings and build a future they're proud of.</p>
        </div>
        <div className="vm-card vision">
          <div className="vm-icon"><FaTrophy /></div>
          <h3>Our Vision</h3>
          <p>To become the world's most trusted partner in digital transformation for learners, closing the skills gap for the next generation of pioneers.</p>
        </div>
      </section>

      {/* ===== INSTRUCTORS ===== */}
      <section className="instructors-premium">
        <div className="section-header">
          <h2>Meet the Architects of Your Success</h2>
          <p>Learn from the experts who have mastered their crafts in the industry.</p>
        </div>
        <div className="instructor-grid">
          {instructors.map((inst, i) => (
            <div
              className="instructor-card"
              key={i}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="image-wrapper">
                <img src={inst.image} alt="Instructor Profile" />
                <div className="social-overlay">
                  <a href="#" className="s-icon" aria-label="Twitter"><FaTwitter /></a>
                  <a href="#" className="s-icon" aria-label="LinkedIn"><FaLinkedin /></a>
                  <a href="#" className="s-icon" aria-label="GitHub"><FaGithub /></a>
                </div>
              </div>
              <div className="instructor-info">
                <h4>{inst.name}</h4>
                <p className="role-tag">{inst.role}</p>
                <div className="instructor-details">
                  <span><strong>Exp:</strong> {inst.experience}</span>
                  <p><strong>Focus:</strong> {inst.expertise}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="about-cta">
        <div className="cta-glass">
          <h2>Ready to Ignite Your Potential? 🚀</h2>
          <p>Join over 15,000 students and start your journey toward professional excellence today.</p>
          <div className="cta-buttons">
            <a href="/courses" className="btn-primary">Explore All Courses</a>
            <a href="/register" className="btn-secondary">Join Now</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
