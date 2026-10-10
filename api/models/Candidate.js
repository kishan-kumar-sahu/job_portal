import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
      trim: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    experience: {
      type: Number,
      default: 0,
    },

    education: [
      {
        degree: {
          type: String,
          trim: true,
        },
        institution: {
          type: String,
          trim: true,
        },
        fieldOfStudy: {
          type: String,
          trim: true,
        },
        startYear: Number,
        endYear: Number,
      },
    ],

    resume: {
      type: String,
      trim: true,
    },

    linkedin: {
      type: String,
      trim: true,
    },

    github: {
      type: String,
      trim: true,
    },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    resumeAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: undefined,
    },
    jobMatchHistory: [{
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
      matchScore: { type: Number, min: 0, max: 100, required: true },
      matchedSkills: [{ type: String }],
      missingSkills: [{ type: String }],
      strengths: [{ type: String }],
      gaps: [{ type: String }],
      recommendation: { type: String },
      analyzedAt: { type: Date, default: Date.now },
    }],
  },
  {
    timestamps: true,
  }
);

export const Candidate = mongoose.model("Candidate", candidateSchema);

