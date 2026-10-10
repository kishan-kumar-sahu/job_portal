import express from "express";
import resumeUpload from "../Middleware/resumeUpload.js";
import { analyzeUploadedResume, matchUploadedResumeToJob, getSavedResumeAnalysis } from "../controllers/resumeController.js";
import { userAuth } from "../Middleware/userAuth.js";
import { requireRole } from "../Middleware/requireRole.js";
const router = express.Router();
const uploadResume = (req, res, next) => resumeUpload.single("resume")(req, res, (error) => {
  if (error) return res.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({ success: false, message: error.message || "Resume upload failed." });
  next();
});
router.get("/analysis", userAuth, requireRole("candidate", "admin"), getSavedResumeAnalysis);
router.post("/analyze", userAuth, requireRole("candidate", "admin"), uploadResume, analyzeUploadedResume);
router.post("/match/:jobId", userAuth, requireRole("candidate", "admin"), uploadResume, matchUploadedResumeToJob);
export default router;
