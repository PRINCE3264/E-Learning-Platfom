



import React, { useEffect, useState } from "react";
import "./lecture.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import CommentSection from "../../components/comment/CommentSection";

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState({});
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [completedLec, setCompletedLec] = useState(0);
  const [lectLength, setLectLength] = useState(0);
  const [progress, setProgress] = useState([]);
  const [activeTab, setActiveTab] = useState("lectures");

  const token = localStorage.getItem("token");

  // Protect route
  useEffect(() => {
    if (user && user.role !== "admin" && !user.subscription.includes(params.id)) {
      navigate("/");
    }
  }, [user, params.id, navigate]);

  // Fetch all lectures
  const fetchLectures = async () => {
    try {
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLectures(data.lectures);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Error fetching lectures");
    }
  };

  // Fetch single lecture
  const fetchLecture = async (id) => {
    setLecLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLecture(data.lecture);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching lecture");
    } finally {
      setLecLoading(false);
    }
  };

  // Add lecture progress
  const addProgress = async (lectureId) => {
    try {
      const { data } = await axios.post(
        `${server}/api/user/progress`,
        { courseId: params.id, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(data.message);
      fetchProgress();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error updating progress");
    }
  };

  // Fetch progress
  const fetchProgress = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/user/progress?course=${params.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompleted(data.courseProgressPercentage || 0);
      setCompletedLec(data.completedLectures || 0);
      setLectLength(data.totalLectures || 0);
      setProgress([data.progress]);
    } catch (error) {
      console.error(error);
      // If progress doesn't exist, create automatically
      setCompleted(0);
      setCompletedLec(0);
      setLectLength(lectures.length || 0);
      setProgress([]);
    }
  };

  // Video change handler
  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setVideoPrev(reader.result);
      setVideo(file);
    };
  };

  // Submit new lecture (admin only)
  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("file", video);

    try {
      const { data } = await axios.post(`${server}/api/course/${params.id}`, myForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(data.message);
      setBtnLoading(false);
      setShow(false);
      fetchLectures();
      setTitle("");
      setDescription("");
      setVideo("");
      setVideoPrev("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding lecture");
      setBtnLoading(false);
    }
  };

  // Delete lecture (admin only)
  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lecture?")) return;
    try {
      const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.message);
      fetchLectures();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting lecture");
    }
  };

  useEffect(() => {
    fetchLectures();
    fetchProgress();
  }, [params.id]);

  // Time Tracking
  useEffect(() => {
    const interval = setInterval(() => {
      const updateTime = async () => {
        try {
          await axios.post(
            `${server}/api/course/time-spent`,
            {
              courseId: params.id,
              minutes: 1, // Add 1 minute
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.error("Error updating time spent:", error);
        }
      };

      // Only update if lecture is loaded and video exists (user is watching)
      if (!lecLoading && lecture.video) {
        updateTime();
      }
    }, 60000); // Every 60 seconds

    return () => clearInterval(interval);
  }, [params.id, lecture.video, lecLoading, token]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="progress">
            Lecture completed - {completedLec} out of {lectLength} <br />
            <progress value={completed} max={100}></progress> {completed.toFixed(2)} %
          </div>

          <div className="lecture-page">
            <div className="left">
              {lecLoading ? (
                <Loading />
              ) : lecture.video ? (
                <>
                  <video
                    src={`${server}/${lecture.video}`}
                    width="100%"
                    controls
                    controlsList="nodownload noremoteplayback"
                    disablePictureInPicture
                    disableRemotePlayback
                    autoPlay
                    onEnded={() => addProgress(lecture._id)}
                  />
                  <h1>{lecture.title}</h1>
                  <h3>{lecture.description}</h3>
                  <button
                    onClick={() => addProgress(lecture._id)}
                    className="common-btn"
                    style={{ marginTop: "10px", background: "#4caf50" }}
                  >
                    Mark as Completed
                  </button>
                </>
              ) : (
                <h1>Please Select a Lecture</h1>
              )}
            </div>


            <div className="right">
              {/* Tab Navigation */}
              <div className="lecture-tabs">
                <button
                  className={activeTab === "lectures" ? "active-tab" : ""}
                  onClick={() => setActiveTab("lectures")}
                >
                  Lectures
                </button>
                <button
                  className={activeTab === "comments" ? "active-tab" : ""}
                  onClick={() => setActiveTab("comments")}
                >
                  Discussion
                </button>
              </div>

              {activeTab === "lectures" && (
                <>
                  {user?.role === "admin" && (
                    <button className="common-btn" onClick={() => setShow(!show)}>
                      {show ? "Close" : "Add Lecture +"}
                    </button>
                  )}

                  {show && (
                    <div className="lecture-form">
                      <h2>Add Lecture</h2>
                      <form onSubmit={submitHandler}>
                        <label>Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        <label>Description</label>
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
                        <input type="file" onChange={changeVideoHandler} required />
                        {videoPrev && <video src={videoPrev} width={300} controls />}
                        <button disabled={btnLoading} type="submit" className="common-btn">
                          {btnLoading ? "Please Wait..." : "Add"}
                        </button>
                      </form>
                    </div>
                  )}

                  <div className="lectures-list">
                    {lectures.length > 0 ? (
                      lectures.map((e, i) => (
                        <React.Fragment key={e._id}>
                          <div
                            onClick={() => fetchLecture(e._id)}
                            className={`lecture-number ${lecture._id === e._id ? "active" : ""}`}
                          >
                            {i + 1}. {e.title}{" "}
                            {progress[0]?.completedLectures.includes(e._id) && (
                              <span style={{ background: "red", padding: "2px", borderRadius: "6px", color: "greenyellow" }}>
                                <TiTick />
                              </span>
                            )}
                          </div>
                          {user?.role === "admin" && (
                            <button className="common-btn" style={{ background: "red" }} onClick={() => deleteHandler(e._id)}>
                              Delete {e.title}
                            </button>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <p>No Lectures Yet!</p>
                    )}
                  </div>
                </>
              )}

              {activeTab === "comments" && (
                <div className="discussion-tab">
                  {lecture._id ? (
                    <CommentSection courseId={params.id} lectureId={lecture._id} />
                  ) : (
                    <p className="select-msg">Select a lecture to view discussion</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Lecture;
