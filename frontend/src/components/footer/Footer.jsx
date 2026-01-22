// import React from "react";
// import "./footer.css";
// import {
//   AiFillFacebook,
//   AiFillTwitterSquare,
//   AiFillInstagram,
// } from "react-icons/ai";

// const Footer = () => {
//   return (
//     <footer>
//       <div className="footer-content">
//         <p>
//           &copy; 2024 Your E-Learning Platform. All rights reserved. <br /> Made
//           with ❤️ <a href="">PRINCE VIDYARTHI</a>
//         </p>
//         <div className="social-links">
//           <a href="">
//             <AiFillFacebook />
//           </a>
//           <a href="">
//             <AiFillTwitterSquare />
//           </a>
//           <a href="">
//             <AiFillInstagram />
//           </a>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;




import React from "react";
import "./footer.css";
import {
  AiFillFacebook,
  AiFillTwitterSquare,
  AiFillInstagram,
  AiFillLinkedin,
  AiOutlineMail,
} from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* ABOUT */}
        <div className="footer-box">
          <h2 className="footer-logo">E-Learning 🖥️</h2>
          <p>
            Learn new skills anytime, anywhere with our expert-led courses,
            quizzes, and certifications. Upgrade your career with us.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-box">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/quiz">Quiz</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div className="footer-box">
          <h3>Support</h3>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div className="footer-box">
          <h3>Newsletter</h3>
          <p>Subscribe to get latest updates & offers.</p>
          <div className="newsletter">
            <input type="email" placeholder="Enter your email" />
            <button><AiOutlineMail /></button>
          </div>

          <div className="social-links">
            <a href="#"><AiFillFacebook /></a>
            <a href="#"><AiFillTwitterSquare /></a>
            <a href="#"><AiFillInstagram /></a>
            <a href="#"><AiFillLinkedin /></a>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>
          © 2024 E-Learning Platform | Made with ❤️ by{" "}
          <span>Prince Vidyarthi</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
