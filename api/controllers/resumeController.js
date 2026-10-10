import { parseResume } from "../utils/resumeParser.js";
import { analyzeResume } from "../services/Ai/resumeAnalyzer.js";
import { matchResumeToJob } from "../services/Ai/jobMatcher.js";
import { Candidate } from "../models/Candidate.js";
import { Job } from "../models/Job.js";

const uploadedResume = async (req, res) => {
  if (!req.file) {
    const error = new Error("Resume file is required.");
    error.status = 400;
    throw error;
  }
  return parseResume(req.file.buffer, req.file.originalname);
};

export const analyzeUploadedResume = async (req, res) => {
  try {
    const { text, fileType } = await uploadedResume(req, res);
    const analysis = await analyzeResume(text);
    const candidate = await Candidate.findOne({ userId: req.user });
    if (candidate) {
      candidate.resumeAnalysis = { ...analysis, fileType, analyzedAt: new Date() };
      await candidate.save();
    }
    return res.status(200).json({ success: true, message: "Resume analyzed successfully.", data: { fileType, analysis, saved: Boolean(candidate) } });
  } catch (error) {
    const status = error.status || (error.message?.includes("Only PDF") || error.message?.includes("Unsupported resume") ? 400 : 502);
    return res.status(status).json({ success: false, message: status === 502 ? "Resume analysis service failed." : error.message, error: error.message });
  }
};

export const matchUploadedResumeToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { text, fileType } = await uploadedResume(req, res);
    const job = await Job.findById(jobId).populate("companyId", "name logo");
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    if (job.status !== "published") return res.status(400).json({ success: false, message: "Only published jobs can be matched." });
    const match = await matchResumeToJob({ resumeText: text, job });
    const candidate = await Candidate.findOne({ userId: req.user });
    if (candidate) {
      candidate.jobMatchHistory = (candidate.jobMatchHistory || []).filter((item) => String(item.jobId) !== String(job._id));
      candidate.jobMatchHistory.unshift({ jobId: job._id, matchScore: match.matchScore, matchedSkills: match.matchedSkills, missingSkills: match.missingSkills, strengths: match.strengths, gaps: match.gaps, recommendation: match.recommendation, analyzedAt: new Date() });
      candidate.jobMatchHistory = candidate.jobMatchHistory.slice(0, 10);
      await candidate.save();
    }
    return res.status(200).json({ success: true, message: "Resume matched to job successfully.", data: { job: { _id: job._id, title: job.title, company: job.companyId?.name || "Company" }, fileType, match, saved: Boolean(candidate) } });
  } catch (error) {
    const status = error.status || (error.message?.includes("Only PDF") || error.message?.includes("Unsupported resume") ? 400 : 502);
    return res.status(status).json({ success: false, message: status === 502 ? "Job matching service failed." : error.message, error: error.message });
  }
};


export const getSavedResumeAnalysis = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user }).select("resumeAnalysis jobMatchHistory");
    if (!candidate) return res.status(404).json({ success: false, message: "Candidate profile not found. Complete your candidate profile first." });
    return res.status(200).json({ success: true, data: { analysis: candidate.resumeAnalysis || null, jobMatches: candidate.jobMatchHistory || [] } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not load saved resume analysis." });
  }
};
