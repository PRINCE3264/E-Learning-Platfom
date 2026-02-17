
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import Testimonials from "../../components/testimonials/Testimonials";

/* ===== HERO SLIDES (IMAGE + CONTENT) ===== */
const slides = [
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    title: "Learn Anytime, Anywhere",
    subtitle: "Upgrade your skills with expert-led online courses designed for modern industry needs.",
    btn1: "Explore Courses",
    // btn2: "Join Free",
  },
  {
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
    title: "Build Your Tech Career",
    subtitle: "Master Web Development, Data Science & Programming with hands-on real-world projects.",
    btn1: "Start Learning",
    // btn2: "View Programs",
  },
  {
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    title: "Industry Ready Skills",
    subtitle: "Get trained by top professionals and earn certifications recognized globally by tech giants.",
    btn1: "Browse Courses",
    // btn2: "Get Certified",
  },
  {
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    title: "Learn From Experts",
    subtitle: "Join a community of 50,000+ learners mentored by elite instructors from the tech industry.",
    btn1: "Meet Instructors",
    // btn2: "Join Today",
  },
  {
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    title: "Your Future Starts Here",
    subtitle: "Transform your career path with modern skills, interview prep, and placement assistance.",
    btn1: "Get Started",
    // btn2: "Free Trial",
  },
];

import { UserData } from "../../context/UserContext";

const Home = ({ adminSidebarOpen }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = UserData();
  const isAdmin = user?.role === "admin" || user?.mainrole === "superadmin";

  /* ===== AUTO SLIDE CHANGE (4 SECONDS PER USER REQUEST) ===== */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`home-container ${(isAdmin && adminSidebarOpen) ? 'admin-sidebar-active' : ''}`}>

      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-overlay">
              <div className="hero-content">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>

                <div className="hero-buttons">
                  <button
                    onClick={() => navigate("/courses")}
                    className="common-btn"
                  >
                    {slide.btn1}
                  </button>

                  {slide.btn2 && (
                    <button
                      onClick={() => navigate("/signup")}
                      className="outline-btn"
                    >
                      {slide.btn2}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ===== SLIDE NAVIGATION DOTS ===== */}
        <div className="hero-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={index === currentSlide ? "dot active" : "dot"}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features" id="why-choose-us">
        <div className="section-header">
          <h2 className="section-title">Why Elevate Your Career with Us?</h2>
          <p className="section-subtitle">
            We provide an elite learning ecosystem designed to bridge the gap between academic theory and high-tier industry practice.
          </p>
        </div>

        <div className="feature-grid">
          {[
            { icon: "🎓", title: "Elite Mentorship", desc: "Learn directly from senior engineers and architects working at FAANG and top unicorns." },
            { icon: "🚀", title: "Project-Based Labs", desc: "Go beyond tutorials. Build production-grade applications with real-world complexities." },
            { icon: "📜", title: "Global Certification", desc: "Earn industry-recognized certificates that add massive value to your professional portfolio." },
            { icon: "💻", title: "Lifetime Community", desc: "Join an exclusive network of high-achievers. Access course updates and community support forever." },
            { icon: "🤖", title: "AI Learning Paths", desc: "Get personalized curriculum recommendations powered by our proprietary AI skill assessment." },
            { icon: "📝", title: "Mock Interviews", desc: "Sharpen your skills with realistic technical and behavioral interview drills with industry experts." },
            { icon: "⚡", title: "Accelerated Growth", desc: "Our condensed bootcamps are designed to make you industry-ready in record time." },
            { icon: "📞", title: "24/7 Expert Help", desc: "Get your doubts resolved instantly by our dedicated TA support team across all time zones." }
          ].map((feature, i) => (
            <div
              className="feature-card"
              key={i}
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div className="icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ELITE MENTORS SECTION ===== */}
      <section className="home-instructors">
        <div className="section-header">
          <span className="badge">Knowledge Architects</span>
          <h2 className="section-title">Learn from <span className="gradient-text">Elite Mentors</span></h2>
          <p className="section-subtitle">
            Connect with industry veterans from FAANG, top startups, and research labs.
            Real world expertise, delivered live to your screen.
          </p>
        </div>

        <div className="mentor-carousel-home">
          {/* We'll fetch and map active instructors here or use a teaser grid */}
          <div className="mentor-teaser-grid">
            {[1, 2, 3].map((m) => (
              <div key={m} className="mentor-teaser-card">
                <div className="mentor-avatar-glow">
                  <div className="avatar-placeholder">M</div>
                </div>
                <h3>Mentor Node 0{m}</h3>
                <span className="mentor-spec">Architectural Lead</span>
                <p>Guiding learners through complex technical landscapes with precision.</p>
                <button className="view-mentor-btn" onClick={() => navigate("/instructors")}>
                  View Profile
                </button>
              </div>
            ))}
          </div>
          <div className="carousel-action-home">
            <button className="explore-all-btn" onClick={() => navigate("/instructors")}>
              Explore All Mentors <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <Testimonials />
    </div>
  );
};

export default Home;
