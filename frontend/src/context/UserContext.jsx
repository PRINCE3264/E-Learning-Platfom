

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);


  // ================= LOGIN (FIXED) =================
  const loginUser = async (email, password, navigate) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/user/login`,
        { email, password }
      );

      // token save
      localStorage.setItem("token", data.token);

      // 🔥 MAIN FIX
      await fetchUser();   // <-- subscription yahin se aati hai

      setIsAuth(true);
      toast.success(data.message);

      navigate("/courses");
    } catch (error) {
      setIsAuth(false);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setBtnLoading(false);
    }
  };
  // 🔹 Register
  const registerUser = async (name, username, email, password, navigate) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, { name, username, email, password });
      toast.success(data.message);

      localStorage.setItem("activationToken", data.activationToken);
      setBtnLoading(false);
      navigate("/verify");
    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  // 🔹 Verify OTP
  const verifyOtp = async (otp, navigate) => {
    setBtnLoading(true);
    const activationToken = localStorage.getItem("activationToken");
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, { otp, activationToken });
      toast.success(data.message);
      localStorage.removeItem("activationToken");
      setBtnLoading(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
      setBtnLoading(false);
    }
  };



  // ================= FETCH USER (/me) =================
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await axios.get(
        `${server}/api/user/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ fresh user with subscription
      setUser(data.user);
      setIsAuth(true);
    } catch (error) {
      setUser(null);
      setIsAuth(false);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH ANALYTICS =================
  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get(`${server}/api/user/analytics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return data;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      return null;
    }
  };

  // ================= AUTO LOAD =================
  useEffect(() => {
    fetchUser();
  }, []);


  const [users, setUsers] = useState([]);

  // ================= ADMIN: FETCH USERS =================
  const fetchAllUsers = async () => {
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  // ================= ADMIN: UPDATE ROLE =================
  const updateUserRole = async (id) => {
    try {
      const { data } = await axios.put(`${server}/api/user/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success(data.message);
      fetchAllUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  // ================= ADMIN: UPDATE STATUS =================
  const updateUserStatus = async (id, status) => {
    try {
      const { data } = await axios.put(`${server}/api/user/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success(data.message);
      fetchAllUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // ================= ADMIN: DELETE USER =================
  const deleteAdminUser = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/api/user/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success(data.message);
      fetchAllUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  // ================= ADMIN: CREATE USER =================
  const createAdminUser = async (formData) => {
    try {
      const { data } = await axios.post(`${server}/api/user/new`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success(data.message);
      fetchAllUsers();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        users,
        isAuth,
        setIsAuth,
        btnLoading,
        loading,
        loginUser,
        registerUser,
        verifyOtp,
        fetchUser,
        fetchAnalytics,
        fetchAllUsers,
        updateUserRole,
        updateUserStatus,
        deleteAdminUser,
        createAdminUser,
        theme,
        toggleTheme,
        logoutUser: () => {
          localStorage.removeItem("token");
          setIsAuth(false);
          setUser(null);
          toast.success("Logged out successfully");
        },
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};
// 🔹 Custom hook
export const UserData = () => useContext(UserContext);








