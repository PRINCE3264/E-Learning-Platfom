// import axios from "axios";

// const API_URL = "http://localhost:5000/api/quiz";

// // Fetch all quiz questions
// export const getQuizzes = async () => {
//   const res = await axios.get(API_URL);
//   return res.data;
// };

// // Submit quiz answers
// export const submitQuiz = async (userEmail, answers) => {
//   const res = await axios.post(`${API_URL}/submit`, { userEmail, answers });
//   return res.data;
// };


import axios from "axios";

const API_URL = "http://localhost:5000/api/quiz";

// Fetch all quiz questions
export const getQuizzes = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error.response?.data || error.message);
    throw error;
  }
};

// Submit quiz answers
export const submitQuiz = async (userEmail, answers) => {
  try {
    const res = await axios.post(`${API_URL}/submit`, {
      userEmail,
      answers,
    });
    return res.data;
  } catch (error) {
    console.error("Error submitting quiz:", error.response?.data || error.message);

    // 🔹 Always return backend message if exists
    return error.response?.data || { success: false, message: "Server error" };
  }
};
