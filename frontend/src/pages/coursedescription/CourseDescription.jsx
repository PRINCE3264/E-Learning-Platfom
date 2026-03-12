
import React, { useEffect, useState, useMemo } from "react";
import "./coursedescription.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";

const CourseDescription = ({ user, adminSidebarOpen }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { fetchUser } = UserData();
  const { fetchCourse, course, fetchCourses, fetchMyCourses } = CourseData();

  useEffect(() => {
    fetchCourse(id);
  }, [id]);

  // ✅ SAFE + MEMOIZED ENROLL CHECK
  const isEnrolled = useMemo(() => {
    if (!user || !course) return false;
    return (
      user.role === "admin" ||
      user.subscription?.some(
        (cid) => {
          const courseId = course._id?.toString() || course._id;
          const subscriptionId = cid?._id?.toString() || cid?.toString();
          return subscriptionId === courseId;
        }
      )
    );
  }, [user, course]);

  // 💳 CHECKOUT
  const checkoutHandler = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { order },
      } = await axios.post(
        `${server}/api/course/checkout/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const options = {
        key: "rzp_test_RGlPdevCgkpRiA",
        amount: order.amount,
        currency: "INR",
        name: "E-Learning Platform",
        description: "Upgrade your skills",
        order_id: order.id,

        handler: async function (response) {
          try {
            const { data } = await axios.post(
              `${server}/api/verification/${id}`,
              response,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            // 🔥🔥 CRITICAL FIX 🔥🔥
            await fetchUser();       
            await fetchCourses();
            await fetchMyCourses();

            toast.success(data.message);

            setTimeout(() => {
              navigate(`/course/study/${id}`);
            }, 300);
          } catch (err) {
            toast.error("Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        theme: { color: "#8a4baf" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Checkout failed");
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      {course && (
        <div className="course-description">
          <div className="course-header">
            <img
              src={`${server}/${course.image}`}
              alt={course.title}
              className="course-images"
            />

            <div className="course-info">
              <h2>{course.title}</h2>

              <div className="course-meta">
                <span>👨‍🏫 {course.createdBy}</span>
                <span>⏱ {course.duration} weeks</span>
                <span>🎯 Beginner</span>
              </div>

              <div className="course-rating">
                ⭐⭐⭐⭐⭐ <span>(4.8)</span>
              </div>

              <div className="price-box">
                <span className="price">₹{course.price}</span>
                <span className="discount">20% OFF</span>
              </div>
            </div>
          </div>

          <p className="course-desc">{course.description}</p>

          {/* ✅ ACTION */}
          {isEnrolled ? (
            <button
              className="common-btn sticky-btn"
              onClick={() => navigate(`/course/study/${course._id}`)}
            >
              ▶ Start Learning
            </button>
          ) : (
            <button
              className="common-btn sticky-btn"
              onClick={checkoutHandler}
            >
              💳 Buy Now
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default CourseDescription;
