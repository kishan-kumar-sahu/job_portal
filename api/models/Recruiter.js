import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    designation: {
      type: String,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    recruiterType: {
      type: String,
      enum: ["internal", "agency", "freelance"],
      default: "internal",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    phone: {
      type: String,
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Recruiter = mongoose.model("Recruiter", recruiterSchema);