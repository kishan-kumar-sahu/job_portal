
import {Job} from "../models/Job.js"

import {Recruiter} from "../models/Recruiter.js"

import {Company} from "../models/Company.js"



export const  createJob= async(req, res)=>{

      const userId = req.user

      const {  
    companyId,
      title,
      description,
      skills,
      experienceRequired,
      salary,
      location,
      jobType,
      workMode,
      openings,
      applicationDeadline,
      status,  }= req.body
           
  

     try {
    
    
    const recruiter = await Recruiter.findOne({ userId })

    if(!recruiter){
     return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

  // Check company exists
    const company = await Company.findOne({ _id: companyId, ownerUserId: userId });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found or it is not connected to your account.",
      });
    }

  const job = await Job.create({
      recruiterId: recruiter._id,
      companyId,
      title,
      description,
      skills,
      experienceRequired,
      salary,
      location,
      jobType,
      workMode,
      openings,
      applicationDeadline,
      status,
    });



    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
        
     } catch (error) {
       
        
         console.error("Error in createJob:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });


     }

}



export const getAllJobs = async (req, res) => {
  try {
    let filter = { status: "published" };
    if (req.role === "recruiter") {
      const recruiter = await Recruiter.findOne({ userId: req.user });
      if (!recruiter) return res.status(404).json({ success: false, message: "Recruiter profile not found." });
      filter = { recruiterId: recruiter._id };
    } else if (req.role === "admin") {
      filter = {};
    }
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .populate("companyId", "name logo industry website headquarters")
      .populate({ path: "recruiterId", select: "designation department recruiterType" });
    return res.status(200).json({ success: true, message: "Jobs fetched successfully", count: jobs.length, jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not fetch jobs." });
  }
};

    //  search  job through id 
export const  getJobById= async(req, res)=>{

       const {id}= req.params; 
     
      try {

          let jobs = await Job.findById(id).populate("companyId", "name logo industry website");
          if (jobs && req.role === "candidate" && jobs.status !== "published") jobs = null;
          if (jobs && req.role === "recruiter") {
            const recruiter = await Recruiter.findOne({ userId: req.user });
            if (!recruiter || String(jobs.recruiterId) !== String(recruiter._id)) jobs = null;
          }

         if(!jobs){

             return res.status(404).json({message: "jobs not found" , success: false})
         }  

      res.status(200).json({message: "Job fetched successfully", success: true , jobs} )

        
     } catch (err) {
      
        console.error("Error in getJobById:", err);
  
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });


     }
}

export const updateJob = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ userId: req.user });
    if (!recruiter && req.role !== "admin") return res.status(404).json({ success: false, message: "Recruiter profile not found." });
    const allowedFields = ["companyId", "title", "description", "skills", "experienceRequired", "salary", "location", "jobType", "workMode", "openings", "applicationDeadline", "status"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
    if (!Object.keys(updates).length) return res.status(400).json({ success: false, message: "No supported fields supplied." });
    if (updates.companyId) {
      const company = await Company.findOne({ _id: updates.companyId, ownerUserId: req.user });
      if (!company && req.role !== "admin") return res.status(403).json({ success: false, message: "You can only attach a company owned by your account." });
    }
    const filter = req.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, recruiterId: recruiter._id };
    const job = await Job.findOneAndUpdate(filter, updates, { returnDocument: "after", runValidators: true });
    if (!job) return res.status(404).json({ success: false, message: "Job not found or you do not have permission to edit it." });
    return res.status(200).json({ success: true, message: "Job updated successfully", job });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not update job." });
  }
};


// Delete Job



export const deleteJob = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    // Find logged-in recruiter
    const recruiter = await Recruiter.findOne({ userId });

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    // Delete only if job belongs to this recruiter
    const jobs = await Job.findOneAndDelete({
      _id: id,
      recruiterId: recruiter._id,
    });

    if (!jobs) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you are not authorized to delete it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      jobs
    });
  } catch (err) {
    console.error("Error in deleteJob:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};





