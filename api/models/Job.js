import mongoose from "mongoose";



const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    experienceRequired: {
      type: Number,
      default: 0,
      min: 0,
    },

    salary: {
      min: {
        type: Number,
        min: 0,
      },
      max: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
        trim: true,
      },
    },

    location: {
      type: String,
      trim: true,
    },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "freelance"],
      default: "full-time",
    },

    workMode: {
      type: String,
      enum: ["on-site", "remote", "hybrid"],
      default: "on-site",
    },

    openings: {
      type: Number,
      default: 1,
      min: 1,
    },

    applicationDeadline: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model("Job", jobSchema);