import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDb from "./DB/db.js";
import userRouter from "./Routes/userRouter.js";
import candidateRouter from "./Routes/candidateRouter.js";
import recruiterRouter from "./Routes/RecruiterRouter.js";
import companyRouter from "./Routes/companyRouter.js";
import jobRouter from "./Routes/jobRouter.js";
import applicationRouter from "./Routes/applicationRouter.js";
import interviewRouter from "./Routes/interviewRouter.js";
import notificationRouter from "./Routes/notificationRouter.js";
import resumeRouter from "./Routes/resumeRouter.js";

const app = express();
const port = Number(process.env.PORT || 3000);
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({
  origin: allowedOrigin,
  allowedHeaders: ["Content-Type", "Auth", "Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => res.status(200).json({ success: true, service: "OrbitHire API", status: "healthy" }));
app.get("/api/health", (req, res) => res.status(200).json({ success: true, status: "healthy", timestamp: new Date().toISOString() }));

app.use("/api/user", userRouter);
app.use("/api/candidate", candidateRouter);
app.use("/api/recruiter", recruiterRouter);
app.use("/api/company", companyRouter);
app.use("/api/job", jobRouter);
app.use("/api/application", applicationRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/resumes", resumeRouter);

app.use((req, res) => res.status(404).json({ success: false, message: "API endpoint not found." }));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  return res.status(500).json({ success: false, message: "Unexpected server error." });
});

connectDb()
  .then(() => {
    app.listen(port, () => {});
  })
  .catch(() => {
    process.exitCode = 1;
  });

export default app;
