

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
  const registerUser = async (name, email, password, navigate) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, { name, email, password });
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

  // ================= AUTO LOAD =================
  useEffect(() => {
    fetchUser();
  }, []);


  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        btnLoading,
        loading,
        loginUser,
        registerUser,
        verifyOtp,
        fetchUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

// 🔹 Custom hook
export const UserData = () => useContext(UserContext);




// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { server } from "../main";
// import toast, { Toaster } from "react-hot-toast";

// // ================= CONTEXT =================
// const UserContext = createContext();

// // ================= PROVIDER =================
// export const UserContextProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuth, setIsAuth] = useState(false);
//   const [btnLoading, setBtnLoading] = useState(false);
//   const [loading, setLoading] = useState(true);

//   /*
//     🔑 IMPORTANT CONCEPT
//     -------------------
//     ❌ Login ke response se `setUser(data.user)` kabhi mat karo
//     ✅ Hamesha `/me` API se fresh user lao (fetchUser)

//     Ye hi fix hai:
//     - pehle se purchase course
//     - login ke baad bhi "Study" show na hone ka
//   */

//   // ================= LOGIN =================
//   const loginUser = async (email, password, navigate) => {
//     setBtnLoading(true);
//     try {
//       const { data } = await axios.post(
//         `${server}/api/user/login`,
//         { email, password }
//       );

//       // ✅ Token save
//       localStorage.setItem("token", data.token);

//       // 🔥🔥 MAIN FIX 🔥🔥
//       await fetchUser(); // <-- fresh user + subscription

//       setIsAuth(true);
//       toast.success(data.message);

//       navigate("/courses"); // redirect after login
//     } catch (error) {
//       setIsAuth(false);
//       toast.error(error.response?.data?.message || "Login failed");
//     } finally {
//       setBtnLoading(false);
//     }
//   };

//   // ================= REGISTER =================
//   const registerUser = async (name, email, password, navigate) => {
//     setBtnLoading(true);
//     try {
//       const { data } = await axios.post(
//         `${server}/api/user/register`,
//         { name, email, password }
//       );

//       toast.success(data.message);
//       localStorage.setItem("activationToken", data.activationToken);
//       navigate("/verify");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Registration failed");
//     } finally {
//       setBtnLoading(false);
//     }
//   };

//   // ================= VERIFY OTP =================
//   const verifyOtp = async (otp, navigate) => {
//     setBtnLoading(true);
//     try {
//       const activationToken = localStorage.getItem("activationToken");

//       const { data } = await axios.post(
//         `${server}/api/user/verify`,
//         { otp, activationToken }
//       );

//       toast.success(data.message);
//       localStorage.removeItem("activationToken");
//       navigate("/login");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "OTP verification failed");
//     } finally {
//       setBtnLoading(false);
//     }
//   };

//   // ================= FETCH USER (/me) =================
//   const fetchUser = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       const { data } = await axios.get(
//         `${server}/api/user/me`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // ✅ Fresh & trusted user data
//       setUser(data.user);
//       setIsAuth(true);
//     } catch (error) {
//       console.error("fetchUser error:", error.response?.data || error.message);
//       setUser(null);
//       setIsAuth(false);
//       localStorage.removeItem("token");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= AUTO LOAD USER =================
//   useEffect(() => {
//     fetchUser(); // page refresh / direct open safety
//   }, []);




//   return (
//     <UserContext.Provider
//       value={{
//         user,
//         isAuth,
//         btnLoading,
//         loading,
//         loginUser,
//         registerUser,
//         verifyOtp,
//         fetchUser,
//       }}
//     >
//       {children}
//       <Toaster />
//     </UserContext.Provider>
//   );
// };

// // ================= CUSTOM HOOK =================
// export const UserData = () => useContext(UserContext);








