import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

export const RegisterUser = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const role = ["candidate", "recruiter"].includes(req.body.role) ? req.body.role : "candidate";
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ success: false, message: "An account with this email already exists." });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role });
    return res.status(201).json({ success: true, message: "Account created successfully.", user: publicUser(user) });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: "An account with this email already exists." });
    return res.status(500).json({ success: false, message: "Could not create your account." });
  }
};

export const LoginUser = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required." });
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    if (user.isActive === false) return res.status(403).json({ success: false, message: "This account has been disabled. Contact support." });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).json({ success: true, message: "Login successful.", token, user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not sign in. Please try again." });
  }
};
