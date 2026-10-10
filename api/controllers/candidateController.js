import {Candidate } from "../models/Candidate.js"
import {User} from "../models/user.js"
import { Job } from "../models/Job.js"


export const createCandidateProfile = async (req, res) => {
  try {
    const userId = req.user;

    // Check if candidate profile already exists
    const existingCandidate = await Candidate.findOne({
     userId
    });

    if (existingCandidate) {
      return res.status(409).json({
        message: "Candidate profile already exists",
      });
    }

    const {phone,location,bio,skills,experience,education,resume,linkedin,github} = req.body;

    const candidate = await Candidate.create({
     userId,
      phone,
      location,
      bio,
      skills,
      experience,
      education,
      resume,
      linkedin,
      github,
    });

    return res.status(201).json({
      message: "Candidate profile created successfully",
      candidate,
    });
  } catch (err) {
    console.error("createCandidateProfile error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};




// export  const getMyCandidateProfile= async(req,res)=>{

//       try{
         
//             const userId= req.user;

//             console.log("current", userId)
           
//         const getMyCandidateProfile=  await Candidate.findOne()

//           console.log("getMyCandidateProfile", getMyCandidateProfile)  


//     }catch(err){

//     }
// }


export const getMyCandidateProfile = async (req, res) => {
  try {
    const userId = req.user;


    const candidate = await Candidate.findOne({
      userId
    }).populate("userId", "name email role profileImage")

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate profile not found",
      });
    }



    return res.status(200).json({
      message: "Candidate profile fetched successfully",
      candidate,
    });

  } catch (err) {
    console.error("getMyCandidateProfile error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const updateCandidateProfile= async(req,res)=>{

      try{

       const userId= req.user 

   const allowedFields = ["phone", "location", "bio", "skills", "experience", "education", "resume", "linkedin", "github"];
   const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
   if (!Object.keys(updates).length) return res.status(400).json({ success: false, message: "No supported profile fields supplied." });
   const candidate = await Candidate.findOneAndUpdate({ userId }, updates, { returnDocument: "after", runValidators: true }).populate("userId", "name email role profileImage")



   if(!candidate){
     return res.status(404).json({
        message: "Candidate not found",
      });
   }

res.status(200).json({
      success: true,
      message: "Candidate profile updated successfully",
      candidate,
    });

    }catch(err){
     res.status(500).json({
      success: false,
      message: err.message,
    });
  
    }

    
}




export const deleteCandidateProfile= async(req,res)=>{
   
    const userId= req.user

   const  candidate =await Candidate.findOneAndDelete({userId});

    if(! candidate){
       return res.json({message: "candidate not found", success: false})
    }


    res.status(200).json({message: "candidate Deleted successfully", success: true})
      try{

    }catch(err){

     console.log("something went wrong", err) 
    }

}




export const getSavedJobs = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user }).populate({ path: "savedJobs", populate: { path: "companyId", select: "name logo" } });
    if (!candidate) return res.status(404).json({ success: false, message: "Candidate profile not found." });
    return res.status(200).json({ success: true, savedJobs: candidate.savedJobs || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not load saved jobs." });
  }
};

export const toggleSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findOne({ _id: jobId, status: "published" });
    if (!job) return res.status(404).json({ success: false, message: "Published job not found." });
    const candidate = await Candidate.findOne({ userId: req.user });
    if (!candidate) return res.status(404).json({ success: false, message: "Candidate profile not found." });
    const existing = candidate.savedJobs.some((id) => String(id) === String(jobId));
    if (existing) candidate.savedJobs = candidate.savedJobs.filter((id) => String(id) !== String(jobId));
    else candidate.savedJobs.push(job._id);
    await candidate.save();
    return res.status(200).json({ success: true, saved: !existing, savedJobs: candidate.savedJobs.map(String), message: existing ? "Job removed from saved jobs." : "Job saved successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not update saved jobs." });
  }
};
