
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Please Login" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token using the same secret as used in login
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from DB (exclude password)
    const user = await User.findById(decodedData._id).select("-password");
    if (!user) {
      return res.status(403).json({ message: "User not found. Please Login" });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    console.error("isAuth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token. Please Login again." });
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if (
      !req.user ||
      (req.user.role !== "admin" && req.user.mainrole !== "superadmin")
    ) {
      return res.status(403).json({ message: "You are not admin" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
