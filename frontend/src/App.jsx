
import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import Footer from "./components/footer/Footer";
import About from "./pages/about/About";
import Account from "./pages/account/Account";
import { UserData } from "./context/UserContext";
import Loading from "./components/loading/Loading";
import Courses from "./pages/courses/Courses";
import CourseDescription from "./pages/coursedescription/CourseDescription";
import PaymentSuccess from "./pages/paymentsuccess/PaymentSuccess";
import Dashbord from "./pages/dashbord/Dashbord";
import CourseStudy from "./pages/coursestudy/CourseStudy";
import Lecture from "./pages/lecture/Lecture";
import AdminDashbord from "./admin/Dashboard/AdminDashbord";
import AdminCourses from "./admin/Courses/AdminCourses";
import AdminUsers from "./admin/Users/AdminUsers";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Quiz from "./pages/quiz/Quiz";
import AdminQuiz from "./admin/Quiz/AdminQuiz";
import Contact from "./pages/contact/Contact";
import Sidebar from "./admin/Utils/Sidebar";
import AdminInstructors from "./admin/Instructor/InstructorDashboard";
import AdminAnalytics from "./admin/Analytics/AnalyticsPage";
import ProgressPage from "./pages/progress/Progress";
import Payments from "./pages/payments/Payments";
import AdminPayments from "./admin/Payments/AdminPayments";
import Instructors from "./pages/instructors/Instructors";
import StudentAnalytics from "./pages/analytics/StudentAnalytics";
import AdminStudyMaterial from "./admin/StudyMaterial/AdminStudyMaterial";
import StudyMaterial from "./pages/studymaterial/StudyMaterial";

const App = () => {
  const { isAuth, user, loading } = UserData();
  const [adminSidebarOpen, setAdminSidebarOpen] = React.useState(false);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Header
            isAuth={isAuth}
            user={user}
            adminSidebarOpen={adminSidebarOpen}
            setAdminSidebarOpen={setAdminSidebarOpen}
          />
          <Routes>
            <Route path="/" element={<Home adminSidebarOpen={adminSidebarOpen} />} />
            <Route path="/about" element={<About adminSidebarOpen={adminSidebarOpen} />} />
            <Route path="/courses" element={<Courses adminSidebarOpen={adminSidebarOpen} />} />
            <Route path="/quiz" element={<Quiz adminSidebarOpen={adminSidebarOpen} />} />
            <Route path="/contact" element={<Contact adminSidebarOpen={adminSidebarOpen} />} />
            <Route path="/instructors" element={<Instructors adminSidebarOpen={adminSidebarOpen} />} />
            <Route path="/progress" element={isAuth ? <ProgressPage /> : <Login />} />
            <Route path="/payments" element={isAuth ? <Payments /> : <Login />} />
            <Route path="/study-material" element={isAuth ? <StudyMaterial /> : <Login />} />

            <Route
              path="/account"
              element={isAuth ? <Account user={user} /> : <Login />}
            />
            <Route
              path="/analytics"
              element={isAuth ? <StudentAnalytics adminSidebarOpen={adminSidebarOpen} /> : <Login />}
            />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route
              path="/register"
              element={isAuth ? <Home /> : <Register />}
            />
            <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
            <Route
              path="/forgot"
              element={isAuth ? <Home /> : <ForgotPassword />}
            />
            <Route
              path="/reset-password/:token"
              element={isAuth ? <Home /> : <ResetPassword />}
            />
            <Route
              path="/course/:id"
              element={isAuth ? <CourseDescription user={user} /> : <Login />}
            />
            <Route
              path="/payment-success/:id"
              element={isAuth ? <PaymentSuccess user={user} /> : <Login />}
            />
            <Route
              path="/:id/dashboard"
              element={isAuth ? <Dashbord user={user} adminSidebarOpen={adminSidebarOpen} /> : <Login />}
            />
            <Route
              path="/course/study/:id"
              element={isAuth ? <CourseStudy user={user} /> : <Login />}
            />
            <Route
              path="/lectures/:id"
              element={isAuth ? <Lecture user={user} /> : <Login />}
            />

            {/* ✅ fixed admin routes */}
            <Route
              path="/admin/dashboard"
              element={isAuth ? <AdminDashbord user={user} adminSidebarOpen={adminSidebarOpen} /> : <Login />}
            />
            <Route
              path="/admin/course"
              element={isAuth ? <AdminCourses user={user} adminSidebarOpen={adminSidebarOpen} /> : <Login />}
            />
            <Route
              path="/admin/quiz"
              element={isAuth ? <AdminQuiz user={user} adminSidebarOpen={adminSidebarOpen} /> : <Login />}
            />

            <Route
              path="/admin/users"
              element={isAuth ? <AdminUsers user={user} adminSidebarOpen={adminSidebarOpen} /> : <Login />}
            />
            <Route
              path="/admin/instructors"
              element={isAuth ? <AdminInstructors user={user} adminSidebarOpen={adminSidebarOpen} /> : <Login />}
            />
            <Route
              path="/admin/analytics"
              element={isAuth ? <AdminAnalytics user={user} adminSidebarOpen={adminSidebarOpen} /> : <Login />}
            />
            <Route
              path="/admin/payments"
              element={isAuth ? <AdminPayments user={user} adminSidebarOpen={adminSidebarOpen} /> : <Login />}
            />
            <Route
              path="/admin/study-material"
              element={isAuth ? <AdminStudyMaterial user={user} adminSidebarOpen={adminSidebarOpen} /> : <Login />}
            />
          </Routes>
          <Footer adminSidebarOpen={adminSidebarOpen} />
        </BrowserRouter>
      )}
    </>
  );
};

export default App;

