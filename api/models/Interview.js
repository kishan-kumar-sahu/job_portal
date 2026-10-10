

import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },

    round: {
      type: String,
      enum: [
        "screening",
        "technical",
        "hr",
        "managerial",
        "final",
      ],
      default: "technical",
    },

    interviewType: {
      type: String,
      enum: ["online", "offline", "phone"],
      default: "online",
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      default: 60,
      min: 15,
    },

    meetingLink: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    interviewer: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "scheduled",
        "rescheduled",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "scheduled",
    },

    feedback: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    result: {
      type: String,
      enum: ["pending", "passed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Interview = mongoose.model("Interview", interviewSchema);