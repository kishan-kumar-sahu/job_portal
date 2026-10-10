import mongoose from  "mongoose";


const userSchema = new mongoose.Schema(
    
{

name:{
 type : String,
required: true,
trim: true,
},

 email:{
type: String,
required: true,
unique: true,
lowercase: true,
trim : true
 },

password: {
type: String,
required: true,
    },

 role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },  


 profileImage: {
      type: String,
      default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhTAjovkuBJ_pjl8exVwMY899hmCHViatuRt1tpKHkMw&s",
    },

     isActive: {
      type: Boolean,
      default: true,
    },


},

  {
    timestamps: true,
  }

)


 export const User= mongoose.model("User", userSchema)



