import { Application } from "../models/Application.js";
import { Candidate } from "../models/Candidate.js";
import { Job } from "../models/Job.js";
import { Recruiter } from "../models/Recruiter.js";
import { Notification } from "../models/Notification.js";




// Create Application
export const createApplication = async (req, res) => {
  try {
    const userId = req.user;

    // Find candidate using logged-in user
    const candidate = await Candidate.findOne({ userId });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const { jobId, resume, coverLetter } = req.body;

    // Check job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Only published jobs can receive applications
    if (job.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "Applications are not open for this job",
      });
    }

    // Check application deadline


    if (
      job.applicationDeadline &&
      new Date() > new Date(job.applicationDeadline)
    ) {
      return res.status(400).json({
        success: false,
        message: "Application deadline has passed",
      });
    }

    // Check duplicate application

    const existingApplication = await Application.findOne({
      candidateId: candidate._id,
      jobId,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Create application
    const application = await Application.create({
      candidateId: candidate._id,
      jobId,
      resume: resume || candidate.resume,
      coverLetter,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (err) {
    console.error("Error in createApplication:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


// Get My Applications
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user;

    const candidate = await Candidate.findOne({ userId });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found.",
      });
    }

    const applications = await Application.find({
      candidateId: candidate._id,
    })
      .populate(
        "jobId",
        "title description skills salary location jobType workMode status applicationDeadline"
      )
      .populate("candidateId", "userId resume");

    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      count: applications.length,
      applications,
    });
  } catch (err) {
    console.error("Error in getMyApplications:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


// Withdraw Application
export const withdrawApplication = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    const candidate = await Candidate.findOne({ userId });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const application = await Application.findOne({
      _id: id,
      candidateId: candidate._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      application.status === "selected" ||
      application.status === "rejected"
    ) {
      return res.status(400).json({
        success: false,
        message: "This application cannot be withdrawn",
      });
    }

    application.status = "withdrawn";

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
      application,
    });
  } catch (error) {
    console.error("Error in withdrawApplication:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};




      // for recruiter 

// Recruiter: list applications for jobs owned by the signed-in recruiter.
export const getRecruiterApplications = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ userId: req.user });
    if (!recruiter) return res.status(404).json({ success: false, message: "Recruiter profile not found." });
    const jobs = await Job.find({ recruiterId: recruiter._id }).select("_id title companyId");
    const jobIds = jobs.map((job) => job._id);
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .populate({ path: "jobId", select: "title location jobType workMode salary companyId", populate: { path: "companyId", select: "name logo" } })
      .populate({ path: "candidateId", select: "userId resume skills experience education location", populate: { path: "userId", select: "name email profileImage" } });
    return res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not load applicants." });
  }
};

// Get Application By ID
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("jobId", "title description skills salary location jobType workMode status recruiterId")
      .populate({ path: "candidateId", select: "userId resume skills experience education", populate: { path: "userId", select: "name email profileImage" } });
    if (!application) return res.status(404).json({ success: false, message: "Application not found." });
    const isCandidateOwner = String(application.candidateId?.userId?._id || application.candidateId?.userId) === String(req.user);
    let isRecruiterOwner = false;
    if (req.role === "recruiter" && application.jobId?.recruiterId) {
      const recruiter = await Recruiter.findOne({ userId: req.user }).select("_id");
      isRecruiterOwner = Boolean(recruiter && String(application.jobId.recruiterId) === String(recruiter._id));
    }
    if (!isCandidateOwner && !isRecruiterOwner && req.role !== "admin") return res.status(403).json({ success: false, message: "You are not authorized to view this application." });
    return res.status(200).json({ success: true, application });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not load application." });
  }
};

   

// Update Application Status - Recruiter
export const updateApplicationStatus = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;
    const { status, recruiterNote } = req.body;

    const recruiter = await Recruiter.findOne({ userId });

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    const application = await Application.findById(id)
      .populate("jobId", "recruiterId title")
      .populate("candidateId", "userId");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Make sure recruiter owns the job
    if (
      application.jobId.recruiterId.toString() !== recruiter._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this application",
      });
    }

    const allowedStatuses = [
      "applied",
      "shortlisted",
      "interview",
      "selected",
      "rejected",
      "withdrawn",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    application.status = status;

    if (recruiterNote !== undefined) {
      application.recruiterNote = recruiterNote;
    }

    await application.save();
    if (application.candidateId?.userId) {
      const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
      await Notification.create({
        userId: application.candidateId.userId,
        type: "application",
        title: `Application ${statusLabel}`,
        message: `Your application for ${application.jobId.title} is now ${status}.`,
        relatedId: application._id,
      });
    }
    return res.status(200).json({ success: true, message: "Application status updated successfully", application });
  } catch (error) {
    console.error("Error in updateApplicationStatus:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// Delete Application
export const deleteApplication = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    const candidate = await Candidate.findOne({ userId });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const application = await Application.findOneAndDelete({
      _id: id,
      candidateId: candidate._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (err) {
    console.error("Error in deleteApplication:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

