// import React from "react";
// import "./header.css";
// import { Link } from "react-router-dom";

// const Header = ({ isAuth }) => {
//   return (
//     <header>
//       <div className="logo">E-Learning🖥️</div>

//       <div className="link">
//         <Link to={"/"}>Home</Link>
//         <Link to={"/courses"}>Courses</Link>
//          <Link to={"/quiz"}>Quiz</Link>
//         <Link to={"/about"}>About</Link>
//          <Link to={"/contact"}>Contact</Link>
//         {isAuth ? (
//           <Link to={"/account"}>Account</Link>
//         ) : (
//           <Link to={"/login"}>Login</Link>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;




import React, { useState } from "react";
import "./header.css";
import { Link, NavLink } from "react-router-dom";

const Header = ({ isAuth }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="logo">E-Learning</div>

      {/* Hamburger */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <div className={`link ${menuOpen ? "open" : ""}`}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/courses" onClick={() => setMenuOpen(false)}>Courses</NavLink>
        <NavLink to="/quiz" onClick={() => setMenuOpen(false)}>Quiz</NavLink>
        <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
        <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>

        {isAuth ? (
          <NavLink to="/account" onClick={() => setMenuOpen(false)}>
            Account
          </NavLink>
        ) : (
          <NavLink to="/login" onClick={() => setMenuOpen(false)}>
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
