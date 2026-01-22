import React, { useState } from 'react';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data
  const [instructors, setInstructors] = useState([
    { 
      id: 1, 
      name: 'Dr. Sarah Johnson', 
      email: 'sarah@university.edu', 
      courses: 12, 
      students: 2450, 
      rating: 4.9, 
      status: 'active',
      department: 'Computer Science',
      joinDate: '2022-03-15'
    },
    { 
      id: 2, 
      name: 'Prof. Michael Chen', 
      email: 'michael@university.edu', 
      courses: 8, 
      students: 1870, 
      rating: 4.8, 
      status: 'active',
      department: 'Mathematics',
      joinDate: '2021-08-22'
    },
    { 
      id: 3, 
      name: 'Dr. Emma Wilson', 
      email: 'emma@university.edu', 
      courses: 15, 
      students: 3120, 
      rating: 4.95, 
      status: 'active',
      department: 'Physics',
      joinDate: '2020-11-10'
    },
    { 
      id: 4, 
      name: 'Prof. David Brown', 
      email: 'david@university.edu', 
      courses: 6, 
      students: 980, 
      rating: 4.7, 
      status: 'pending',
      department: 'Engineering',
      joinDate: '2023-01-30'
    },
  ]);

  const [courses, setCourses] = useState([
    { id: 1, title: 'Advanced React Development', instructor: 'Dr. Sarah Johnson', students: 450, rating: 4.9, status: 'published' },
    { id: 2, title: 'Machine Learning Fundamentals', instructor: 'Prof. Michael Chen', students: 320, rating: 4.8, status: 'published' },
    { id: 3, title: 'Quantum Physics Basics', instructor: 'Dr. Emma Wilson', students: 280, rating: 4.95, status: 'draft' },
    { id: 4, title: 'Full Stack Web Development', instructor: 'Dr. Sarah Johnson', students: 520, rating: 4.7, status: 'published' },
  ]);

  const stats = {
    totalInstructors: 45,
    activeInstructors: 38,
    pendingInstructors: 7,
    totalCourses: 156,
    avgRating: 4.82,
    totalStudents: 25480
  };

  const handleAddInstructor = () => {
    // Logic to add new instructor
    alert('Add new instructor functionality');
  };

  const handleEditInstructor = (id) => {
    // Logic to edit instructor
    alert(`Edit instructor with ID: ${id}`);
  };

  const handleDeleteInstructor = (id) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      setInstructors(instructors.filter(instructor => instructor.id !== id));
    }
  };

  return (
    <div className="instructor-dashboard">
      {/* Header Section */}
      {/* <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <i className="fas fa-chalkboard-teacher"></i>
            Instructor Management
          </h1>
          <p className="dashboard-subtitle">Manage instructors, courses, and platform performance</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleAddInstructor}>
            <i className="fas fa-plus"></i> Add New Instructor
          </button>
          <div className="user-profile">
            <i className="fas fa-user-circle"></i>
          </div>
        </div>
      </header> */}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalInstructors}</h3>
            <p className="stat-label">Total Instructors</p>
            <span className="stat-trend positive">+12% this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <i className="fas fa-book-open"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalCourses}</h3>
            <p className="stat-label">Total Courses</p>
            <span className="stat-trend positive">+8% this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalStudents.toLocaleString()}</h3>
            <p className="stat-label">Total Students</p>
            <span className="stat-trend positive">+15% this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.avgRating}</h3>
            <p className="stat-label">Average Rating</p>
            <span className="stat-trend positive">+0.2 this month</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Left Sidebar */}
        <div className="sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-tachometer-alt"></i>
              Dashboard Overview
            </button>
            <button 
              className={`nav-item ${activeTab === 'instructors' ? 'active' : ''}`}
              onClick={() => setActiveTab('instructors')}
            >
              <i className="fas fa-chalkboard-teacher"></i>
              All Instructors
            </button>
            <button 
              className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <i className="fas fa-book"></i>
              Course Management
            </button>
            <button 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <i className="fas fa-chart-line"></i>
              Analytics
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <i className="fas fa-cog"></i>
              Settings
            </button>
          </nav>
          
          <div className="sidebar-footer">
            <div className="progress-card">
              <h4>Platform Growth</h4>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '78%' }}></div>
              </div>
              <p>78% of yearly target achieved</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Search and Filter Bar */}
          <div className="toolbar">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search instructors, courses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filters">
              <select className="filter-select">
                <option>All Departments</option>
                <option>Computer Science</option>
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Engineering</option>
              </select>
              <select className="filter-select">
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Inactive</option>
              </select>
              <button className="btn-secondary">
                <i className="fas fa-filter"></i> Filter
              </button>
            </div>
          </div>

          {/* Instructors Table */}
          {activeTab === 'instructors' && (
            <div className="card">
              <div className="card-header">
                <h2>Instructors List</h2>
                <div className="card-actions">
                  <button className="btn-icon">
                    <i className="fas fa-download"></i> Export
                  </button>
                  <button className="btn-icon">
                    <i className="fas fa-print"></i> Print
                  </button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="instructors-table">
                  <thead>
                    <tr>
                      <th>Instructor</th>
                      <th>Department</th>
                      <th>Courses</th>
                      <th>Students</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instructors.map(instructor => (
                      <tr key={instructor.id}>
                        <td>
                          <div className="instructor-info">
                            <div className="avatars">
                              {instructor.name.charAt(0)}
                            </div>
                            <div>
                              <h4>{instructor.name}</h4>
                              <p>{instructor.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>{instructor.department}</td>
                        <td>
                          <span className="badge badge-courses">
                            {instructor.courses} courses
                          </span>
                        </td>
                        <td>{instructor.students.toLocaleString()}</td>
                        <td>
                          <div className="rating">
                            <span className="stars">
                              {'★'.repeat(Math.floor(instructor.rating))}
                              {'☆'.repeat(5 - Math.floor(instructor.rating))}
                            </span>
                            <span className="rating-number">{instructor.rating}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge status-${instructor.status}`}>
                            {instructor.status.charAt(0).toUpperCase() + instructor.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-action edit"
                              onClick={() => handleEditInstructor(instructor.id)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn-action delete"
                              onClick={() => handleDeleteInstructor(instructor.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                            <button className="btn-action view">
                              <i className="fas fa-eye"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Courses Grid View */}
          {activeTab === 'courses' && (
            <div className="card">
              <div className="card-header">
                <h2>Course Management</h2>
                <button className="btn-primary">
                  <i className="fas fa-plus"></i> New Course
                </button>
              </div>
              <div className="courses-grid">
                {courses.map(course => (
                  <div className="course-card" key={course.id}>
                    <div className="course-header">
                      <div className="course-category">Programming</div>
                      <span className={`course-status status-${course.status}`}>
                        {course.status}
                      </span>
                    </div>
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-instructor">{course.instructor}</p>
                    <div className="course-stats">
                      <div className="stat">
                        <i className="fas fa-users"></i>
                        <span>{course.students} students</span>
                      </div>
                      <div className="stat">
                        <i className="fas fa-star"></i>
                        <span>{course.rating}</span>
                      </div>
                    </div>
                    <div className="course-actions">
                      <button className="btn-outline">Preview</button>
                      <button className="btn-primary">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-grid">
              <div className="card card-chart">
                <h3>Instructor Performance</h3>
                <div className="chart-placeholder">
                  <div className="chart-bar" style={{ height: '80%' }}></div>
                  <div className="chart-bar" style={{ height: '95%' }}></div>
                  <div className="chart-bar" style={{ height: '70%' }}></div>
                  <div className="chart-bar" style={{ height: '60%' }}></div>
                </div>
              </div>
              <div className="card">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <div className="activity-content">
                      <p>New instructor registered: <strong>Dr. Alex Turner</strong></p>
                      <span className="activity-time">2 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">
                      <i className="fas fa-book"></i>
                    </div>
                    <div className="activity-content">
                      <p>Course <strong>"AI Fundamentals"</strong> published</p>
                      <span className="activity-time">5 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
