import {Recruiter }  from "../models/Recruiter.js"




export const createRecruiterProfile =async (req,res)=>{

 const userId = req.user;

  const {designation, department,  recruiterType, bio, phone } = req.body;

 try {

   const existingRecruiter= await  Recruiter.findOne({userId}) 


   if(existingRecruiter){

     return res.status(409).json({ success: false, message: "Recruiter profile already exists",})
   }


 const recruiter=  await  Recruiter.create({
         userId,
        designation,
         department, 
          recruiterType, 
          bio,
           phone

 })


   return res.status(201).json({
      success: true,
      message: "Recruiter profile created successfully",
       recruiter,
    });

    
 } catch (error) {
    
 }

}


export const getMyRecruiterProfile = async(req,res)=>{

      const userId= req.user;

    try {

      const recruiterProfile= await  Recruiter.findOne({ userId}).populate("userId", "name email role profileImage")

   if(!recruiterProfile){

     return res.json({message: "profile does not exist", success: false})
   }


   res.json({ message: "Profile", success: true, recruiterProfile })

        
    } catch (err) {
       
       console.log("Recruiter Profile error", err)
    }
}




export const updateRecruiterProfile = async (req,res)=>{


      const {id}= req.params

        // const userId= req.user

    const allowedFields = ["designation", "department", "recruiterType", "bio", "phone"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
    if (!Object.keys(updates).length) return res.status(400).json({ success: false, message: "No supported recruiter profile fields supplied." });
    try {
 const updateRecruiterProfile = await Recruiter.findOneAndUpdate({ _id: id, userId: req.user }, updates, { returnDocument: "after", runValidators: true }).populate("userId", "name email role profileImage")

   if(!updateRecruiterProfile){
    
 return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });

   }

   res.status(200).json({
      success: true,
      message: "Recruiter updated successfully",
      updateRecruiterProfile,
    });

        
    } catch (err) {
        console.log(err)
      return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,


    });
    }
}


export const deleteRecruiterProfile = async(req,res)=>{

const  {id} = req.params;


     try {

 const recruiterProfile= await Recruiter.findOneAndDelete({ _id: id, userId: req.user })

 if(!recruiterProfile){
   return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
 }

       res.status(200).json({
      success: true,
      message: "Recruiter profile deleted successfully",
    recruiterProfile
    });   
     } catch (err) {
       console.log(err ) 
     }
}