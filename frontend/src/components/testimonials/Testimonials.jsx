import React from "react";
import "./testimonials.css";

const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      name: "PRINCE VIDYARTHI",
      position: "Full Stack Web Development Student",
      message:
        "This platform helped me gain real-world skills. The courses are well structured and easy to follow.",
     // image: "https://randomuser.me/api/portraits/men/32.jpg",
      image:"images/IMG-20241224-WA0130.jpg"
    },

    {
      id: 2,
      name: "Jyoti Chaubey",
      position: "Flutter App Developer",
      message:
        "The instructors explain concepts clearly. I feel confident applying for jobs now.",
      image: "images/1000107628.jpg",
    },
    {
      id: 3,
      name: "Rahul Kumar",
      position: "Full Stack .Net Java Devloper",
      message:
        "Hands-on projects and lifetime access make this platform truly valuable.",
      image: "https://randomuser.me/api/portraits/men/65.jpg",
    },
  ];

  return (
    <section className="testimonials">
      {/* ===== HEADER ===== */}
      <h2 className="title">What Our Students Say</h2>
      <p className="subtitle">
        Real feedback from learners who transformed their careers
      </p>

      {/* ===== CARDS ===== */}
      <div className="testimonial-cards">
        {testimonialsData.map((t, index) => (
          <div
            className="testimonial-card"
            key={t.id}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div className="avatar">
              <img src={t.image} alt={t.name} />
            </div>

            <p className="message">“{t.message}”</p>

            <h4>{t.name}</h4>
            <span>{t.position}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
