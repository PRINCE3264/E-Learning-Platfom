

import React from "react";
import "./about.css";

/* ===== Instructor Data ===== */
const instructors = [
  {
    name: "John Doe",
    role: "Web Development Instructor",
    experience: "10 years",
    expertise: "React, Node.js, HTML/CSS",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Jane Smith",
    role: "Data Science Instructor",
    experience: "8 years",
    expertise: "Python, ML, Data Analysis",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Mike Johnson",
    role: "UI/UX Designer",
    experience: "7 years",
    expertise: "Figma, Adobe XD",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    name: "PRINCE VIDYARTHI",
    role: "Python Instructor",
    experience: "5 years",
    expertise: "Django, Flask, Data Science",
    image: "images/IMG-20241224-WA0130.jpg",
  },
];

/* ===== Platform Stats ===== */
const stats = [
  { number: "10,000+", label: "Students Enrolled", icon: "👨‍🎓" },
  { number: "500+", label: "Courses", icon: "📚" },
  { number: "50+", label: "Instructors", icon: "👨‍🏫" },
  { number: "98%", label: "Success Rate", icon: "🏆" },
];

/* ===== About Component ===== */
const About = () => {
  return (
    <div className="about-page">

      {/* ===== ABOUT INTRO ===== */}
      <section className="about-section">
        <h2>About Our Platform</h2>
        <p>
          We are a modern e-learning platform focused on skill-based education.
          Our goal is to make learning simple, affordable, and career oriented
          for students worldwide.
        </p>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats-section">
        {stats.map((stat, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon">{stat.icon}</div>
            <span className="stat-number">{stat.number}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* ===== WHY CHOOSE US (NEW FEATURE) ===== */}
      <section className="why-choose">
        <h3>Why Choose Us?</h3>
        <div className="choose-grid">
          <div className="choose-card">✅ Industry Ready Courses</div>
          <div className="choose-card">🎥 HD Video Content</div>
          <div className="choose-card">🧑‍🏫 Expert Mentors</div>
          <div className="choose-card">📜 Certificates</div>
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="mission-vision">
        <div className="mission-card">
          <h4>Our Mission</h4>
          <p>
            To provide accessible, high-quality education that empowers learners
            to build successful careers.
          </p>
        </div>

        <div className="vision-card">
          <h4>Our Vision</h4>
          <p>
            To become a global leader in online learning and transform education
            for the digital age.
          </p>
        </div>
      </section>

      {/* ===== INSTRUCTORS ===== */}
      <section className="instructors-section">
        <h3>Meet Our Instructors</h3>
        <div className="cards-container">
          {instructors.map((inst, i) => (
            <div className="card" key={i}>
              <img src={inst.image} alt={inst.name} />
              <h4>{inst.name}</h4>
              <p className="role">{inst.role}</p>
              <p className="experience">Experience: {inst.experience}</p>
              <p className="expertise">Expertise: {inst.expertise}</p>

              <div className="social-icons">
                <a href="#" className="social-icon">🐦</a>
                <a href="#" className="social-icon">💼</a>
                <a href="#" className="social-icon">💻</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA SECTION (NEW FEATURE) ===== */}
      {/* <section className="about-cta">
        <h3>Start Learning Today 🚀</h3>
        <p>Join thousands of students building real-world skills.</p>
        <a href="/courses" className="cta-btn">Explore Courses</a>
      </section> */}

    </div>
  );
};

export default About;
