import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const userAuth = async (req, res, next) => {
  try {
    const token = req.header("Auth") || req.header("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) {
      return res.status(401).json({ success: false, message: "Authentication required. Please sign in." });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: "Authentication is not configured on the server." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user || user.isActive === false) {
      return res.status(401).json({ success: false, message: "Your account is unavailable. Please sign in again." });
    }
    req.user = user._id;
    req.currentUser = user;
    req.role = user.role || decoded.role || "candidate";
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Your session is invalid or expired. Please sign in again." });
  }
};
