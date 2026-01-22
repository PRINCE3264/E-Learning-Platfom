
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";

// ================= CONTEXT =================
const CourseContext = createContext();

// ================= PROVIDER =================
export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [myCourses, setMyCourses] = useState([]);

  const [loading, setLoading] = useState({
    courses: false,
    course: false,
    myCourses: false,
  });

  // ================= FETCH ALL COURSES =================
  const fetchCourses = async () => {
    try {
      setLoading((prev) => ({ ...prev, courses: true }));

      const { data } = await axios.get(`${server}/api/course/all`);
      setCourses(data?.courses || []);
    } catch (error) {
      console.error("❌ fetchCourses error:", error.message);
      setCourses([]);
    } finally {
      setLoading((prev) => ({ ...prev, courses: false }));
    }
  };

  // ================= FETCH SINGLE COURSE =================
  const fetchCourse = async (id) => {
    try {
      setLoading((prev) => ({ ...prev, course: true }));

      const { data } = await axios.get(`${server}/api/course/${id}`);
      setCourse(data?.course || null);
    } catch (error) {
      console.error("❌ fetchCourse error:", error.message);
      setCourse(null);
    } finally {
      setLoading((prev) => ({ ...prev, course: false }));
    }
  };

  // ================= FETCH MY COURSES =================
  const fetchMyCourses = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMyCourses([]);
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, myCourses: true }));

      const { data } = await axios.get(`${server}/api/mycourse`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMyCourses(data?.courses || []);
    } catch (error) {
      console.error("❌ fetchMyCourses error:", error.message);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
      }

      setMyCourses([]);
    } finally {
      setLoading((prev) => ({ ...prev, myCourses: false }));
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchCourses();

    if (localStorage.getItem("token")) {
      fetchMyCourses();
    }
  }, []);

  return (
    <CourseContext.Provider
      value={{
        courses,
        course,
        myCourses,
        loading,
        fetchCourses,
        fetchCourse,
        fetchMyCourses,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

// ================= HOOK =================
export const CourseData = () => useContext(CourseContext);
