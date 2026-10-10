// import { Interview } from "../models/Interview.js";
// import { Recruiter } from "../models/Recruiter.js";
// import { Application } from "../models/Application.js";




// // CREATE INTERVIEW
// export const createInterview = async (req, res) => {
//   try {
//     const userId = req.user;

//     const recruiter = await Recruiter.findOne({ userId });

//     if (!recruiter) {
//       return res.status(404).json({
//         success: false,
//         message: "Recruiter profile not found",
//       });
//     }

    

//     const {
//       applicationId,
//       round,
//       interviewType,
//       scheduledAt,
//       duration,
//       meetingLink,
//       location,
//       interviewer,
//     } = req.body;

//     const application = await Application.findById(applicationId).populate(
//       "jobId",
//       "recruiterId"
//     );

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: "Application not found",
//       });
//     }

//     if (
//       application.jobId.recruiterId.toString() !==
//       recruiter._id.toString()
//     ) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "You are not authorized to schedule interview for this application",
//       });
//     }

//     if (
//       application.status !== "shortlisted" &&
//       application.status !== "interview"
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Interview can only be scheduled for shortlisted or interview-stage applications",
//       });
//     }

//     const interview = await Interview.create({
//       applicationId,
//       recruiterId: recruiter._id,
//       round,
//       interviewType,
//       scheduledAt,
//       duration,
//       meetingLink,
//       location,
//       interviewer,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Interview scheduled successfully",
//       interview,
//     });
//   } catch (error) {
//     console.error("Error in createInterview:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };


// export const updateInterview = async (req, res) => {
//   try {
//     const userId = req.user;
//     const { id } = req.params;

//     const recruiter = await Recruiter.findOne({ userId });

//     if (!recruiter) {
//       return res.status(404).json({
//         success: false,
//         message: "Recruiter profile not found",
//       });
//     }




//     const interview = await Interview.findOne({
//       _id: id,
//       recruiterId: recruiter._id,
//     });

//     if (!interview) {
//       return res.status(404).json({
//         success: false,
//         message: "Interview not found",
//       });
//     }

//     const allowedFields = [
//       "round",
//       "interviewType",
//       "scheduledAt",
//       "duration",
//       "meetingLink",
//       "location",
//       "interviewer",
//       "status",
//       "feedback",
//       "result",
//     ];

//     allowedFields.forEach((field) => {
//       if (req.body[field] !== undefined) {
//         interview[field] = req.body[field];
//       }
//     });

//     await interview.save();

//     return res.status(200).json({
//       success: true,
//       message: "Interview updated successfully",
//       interview,
//     });
//   } catch (error) {
//     console.error("Error in updateInterview:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };




// export const cancelInterview = async (req, res) => {
//   try {
//     const userId = req.user;
//     const { id } = req.params;

//     const recruiter = await Recruiter.findOne({ userId });

//     if (!recruiter) {
//       return res.status(404).json({
//         success: false,
//         message: "Recruiter profile not found",
//       });
//     }

//     const interview = await Interview.findOne({
//       _id: id,
//       recruiterId: recruiter._id,
//     });

//     if (!interview) {
//       return res.status(404).json({
//         success: false,
//         message: "Interview not found",
//       });
//     }

//     if (interview.status === "completed") {
//       return res.status(400).json({
//         success: false,
//         message: "Completed interview cannot be cancelled",
//       });
//     }

//     interview.status = "cancelled";

//     await interview.save();

//     return res.status(200).json({
//       success: true,
//       message: "Interview cancelled successfully",
//       interview,
//     });
//   } catch (error) {
//     console.error("Error in cancelInterview:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };





//   another 


import { Interview } from "../models/Interview.js";
import { Recruiter } from "../models/Recruiter.js";
import { Candidate } from "../models/Candidate.js";
import { Application } from "../models/Application.js";




export const createInterview = async (req, res) => {
  try {
    const userId = req.user;

    // 1. Find logged-in recruiter
    const recruiter = await Recruiter.findOne({ userId });

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    const {
      applicationId,
      round,
      interviewType,
      scheduledAt,
      duration,
      meetingLink,
      location,
      interviewer,
    } = req.body;

    // 2. Required field check
    if (!applicationId || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "applicationId and scheduledAt are required",
      });
    }

    // 3. Check scheduled date
    if (new Date(scheduledAt) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Interview date must be in the future",
      });
    }

    // 4. Find application
    const application = await Application.findById(applicationId).populate(
      "jobId",
      "recruiterId title"
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // 5. Check associated job
    if (!application.jobId) {
      return res.status(404).json({
        success: false,
        message: "Job associated with this application not found",
      });
    }

    // 6. Check recruiter ownership
    if (
      application.jobId.recruiterId.toString() !==
      recruiter._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to schedule interview for this application",
      });
    }

    // 7. Interview can only be created for shortlisted/interview stage
    if (
      application.status !== "shortlisted" &&
      application.status !== "interview"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Interview can only be scheduled for shortlisted or interview-stage applications",
      });
    }

    // 8. Prevent duplicate active interview for same round
    const existingInterview = await Interview.findOne({
      applicationId,
      round,
      status: { $ne: "cancelled" },
    });

    if (existingInterview) {
      return res.status(409).json({
        success: false,
        message: `An active ${round} interview already exists for this application`,
      });
    }

    // 9. Create interview
    const interview = await Interview.create({
      applicationId,
      recruiterId: recruiter._id,
      round,
      interviewType,
      scheduledAt,
      duration,
      meetingLink,
      location,
      interviewer,
    });

    // 10. Automatically move application to interview stage
    if (application.status === "shortlisted") {
      application.status = "interview";
      await application.save();
    }

    return res.status(201).json({
      success: true,
      message: "Interview scheduled successfully",
      interview,
    });
  } catch (error) {
    console.error("Error in createInterview:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ===========
export const getRecruiterInterviews = async (req, res) => {
  try {
    const userId = req.user;

    // 1. Find logged-in recruiter
    const recruiter = await Recruiter.findOne({ userId });

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    // 2. Get recruiter's interviews
    const interviews = await Interview.find({
      recruiterId: recruiter._id,
    })
      .populate({
        path: "applicationId",
        populate: [
          {
            path: "candidateId",
            select: "userId resume skills experience education",
            populate: {
              path: "userId",
              select: "name email phone profileImage",
            },
          },
          {
            path: "jobId",
            select: "title location jobType workMode",
          },
        ],
      })
      .sort({ scheduledAt: 1 });

    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error("Error in getRecruiterInterviews:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



// GET MY INTERVIEWS
// Candidate only


export const getMyInterviews = async (req, res) => {
  try {
    const userId = req.user;

    // 1. Find candidate profile
    const candidate = await Candidate.findOne({ userId });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    // 2. Find candidate applications
    const applications = await Application.find({
      candidateId: candidate._id,
    }).select("_id");

    const applicationIds = applications.map(
      (application) => application._id
    );

    // 3. Find interviews for those applications
    const interviews = await Interview.find({
      applicationId: { $in: applicationIds },
    })
      .populate({
        path: "applicationId",
        populate: {
          path: "jobId",
          select: "title location jobType workMode",
        },
      })
      .populate({
        path: "recruiterId",
        select: "userId designation department",
        populate: {
          path: "userId",
          select: "name email profileImage",
        },
      })
      .sort({ scheduledAt: 1 });

    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error("Error in getMyInterviews:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};




export const updateInterview = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    // 1. Find logged-in recruiter
    const recruiter = await Recruiter.findOne({ userId });

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    // 2. Find interview owned by recruiter
    const interview = await Interview.findOne({
      _id: id,
      recruiterId: recruiter._id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    // 3. Prevent modification of completed interview
    if (
      interview.status === "completed" &&
      Object.keys(req.body).some(
        (field) => field !== "feedback" && field !== "result"
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Completed interview cannot be modified",
      });
    }

    // 4. Allowed fields
    const allowedFields = [
      "round",
      "interviewType",
      "scheduledAt",
      "duration",
      "meetingLink",
      "location",
      "interviewer",
      "status",
      "feedback",
      "result",
    ];

    // 5. Update only allowed fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        interview[field] = req.body[field];
      }
    });

    // 6. If rescheduled, make sure date is future
    if (
      req.body.scheduledAt &&
      new Date(req.body.scheduledAt) <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Interview date must be in the future",
      });
    }

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      interview,
    });
  } catch (error) {
    console.error("Error in updateInterview:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};