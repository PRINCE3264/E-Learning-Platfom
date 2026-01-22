


import React from "react";
import "./common.css";
import { Link } from "react-router-dom";
import { AiFillHome, AiOutlineLogout } from "react-icons/ai";
import { FaBook, FaUserAlt } from "react-icons/fa";
import { UserData } from "../../context/UserContext";
import { FaQuestionCircle, FaClipboardList, FaRegListAlt } from "react-icons/fa";

const Sidebar = () => {
  const { user } = UserData();

  // Wait until user data is loaded
  if (!user) return null;

  const mainRole = user.mainrole?.trim().toLowerCase();

  return (
    <div className="sidebar">
        <ul>
        <li>
          <Link to={"/admin/dashboard"}>
            <div className="icon">
              <AiFillHome />
            </div>
            <span>Home</span>
          </Link>
        </li>

        <li>
          <Link to={"/admin/course"}>
            <div className="icon">
              <FaBook />
            </div>
            <span>Courses</span>
          </Link>
        </li>

        
        {mainRole === "superadmin" && (
          <li>
            <Link to="/admin/users">
              <div className="icon">
                <FaUserAlt />
              </div>
              <span>Users</span>
            </Link>
          </li>
        )}
 <li>
          <Link to={"/admin/quiz"}>
            <div className="icon">
              <FaQuestionCircle />
            </div>
            <span>Quiz</span>
          </Link>
        </li>
       
        <li>
          <Link to={"/account"}>
            <div className="icon">
              <AiOutlineLogout />
            </div>
            <span>Logout</span>
          </Link>
        </li>
      </ul>  
    </div>
  );
};

export default Sidebar;

   

