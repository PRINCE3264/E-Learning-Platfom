

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import Testimonials from "../../components/testimonials/Testimonials";

/* ===== HERO SLIDES (IMAGE + CONTENT) ===== */
const slides = [
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    title: "Learn Anytime, Anywhere",
    subtitle: "Upgrade your skills with expert-led online courses",
    btn1: "Explore Courses",
    btn2: "Join Free",
  },
  {
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
    title: "Build Your Tech Career",
    subtitle: "Web Development, Data Science & Programming",
    btn1: "Start Learning",
    btn2: "View Programs",
  },
  {
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    title: "Industry Ready Skills",
    subtitle: "Hands-on projects with real-world experience",
    btn1: "Browse Courses",
    btn2: "Get Certified",
  },
  {
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    title: "Learn From Experts",
    subtitle: "Top instructors from the tech industry",
    btn1: "Meet Instructors",
    btn2: "Join Today",
  },
  {
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    title: "Your Future Starts Here",
    subtitle: "Transform your career with modern skills",
    btn1: "Get Started",
    btn2: "Free Trial",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  /* ===== AUTO SLIDE CHANGE ===== */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">

      {/* ===== HERO SECTION ===== */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${slides[currentSlide].image})`,
        }}
      >
        <div className="overlay">
          <h1>{slides[currentSlide].title}</h1>
          <p>{slides[currentSlide].subtitle}</p>

          <div className="hero-buttons">
            <button
              onClick={() => navigate("/courses")}
              className="common-btn"
            >
              {slides[currentSlide].btn1}
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="outline-btn"
            >
              {slides[currentSlide].btn2}
            </button>
          </div>
        </div>

        {/* ===== SLIDE DOTS ===== */}
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
      <section className="features">
        <h2 className="section-title">Why Choose Us</h2>
        <p className="section-subtitle">
          Learn from industry experts with job-ready skills
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon">🎓</div>
            <h3>Expert Instructors</h3>
            <p>Learn from professionals working in top companies.</p>
          </div>

          <div className="feature-card">
            <div className="icon">📚</div>
            <h3>Industry Courses</h3>
            <p>Courses designed as per real industry requirements.</p>
          </div>

          <div className="feature-card">
            <div className="icon">📜</div>
            <h3>Certification</h3>
            <p>Verified certificates to boost your resume.</p>
          </div>

          <div className="feature-card">
            <div className="icon">💻</div>
            <h3>Lifetime Access</h3>
            <p>Unlimited access anytime, anywhere.</p>
          </div>


          <div className="feature-card">
            <div className="icon">🤖</div>
            <h3>AI-Based Learning</h3>
            <p>
              Smart learning paths powered by AI to match your skill level.
            </p>
          </div>
          <div className="feature-card">
            <div className="icon">📝</div>
            <h3>Practice & Assessments</h3>
            <p>
              Quizzes, assignments, and coding practice to test your knowledge.
            </p>
          </div>
          <div className="feature-card">
            <div className="icon">🚀</div>
            <h3>Career Focused</h3>
            <p>Projects + interview preparation included.</p>
          </div>

          <div className="feature-card">
            <div className="icon">📞</div>
            <h3>24/7 Support</h3>
            <p>Dedicated support whenever you need help.</p>
           
          </div>
        </div>






      </section>

      {/* ===== TESTIMONIALS ===== */}
      <Testimonials />
    </div>
  );
};

export default Home;
