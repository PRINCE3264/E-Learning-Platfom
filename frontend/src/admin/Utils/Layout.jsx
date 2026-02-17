import React from "react";
import Sidebar from "./Sidebar";
import "./common.css";

const Layout = ({ children, adminSidebarOpen }) => {
  return (
    <div className={`dashboard-admin ${adminSidebarOpen ? "" : "sidebar-closed"}`}>
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
