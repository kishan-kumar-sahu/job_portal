import "dotenv/config";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY, timeout: 45000 });

export const matchResumeToJob = async ({ resumeText, job }) => {
  if (!resumeText?.trim()) throw new Error("Resume text is required.");
  const jobContext = {
    title: job.title,
    description: job.description,
    requiredSkills: job.skills || [],
    experienceRequired: Number(job.experienceRequired || 0),
    jobType: job.jobType,
    workMode: job.workMode,
    location: job.location,
  };
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.1,
    messages: [
      { role: "system", content: "You are a fair resume-to-job matching engine. Compare only evidence in the resume with the job requirements. Never infer protected traits or penalize age, gender, ethnicity, religion, disability, or other protected characteristics. Do not invent qualifications. Return an evidence-based score from 0 to 100. Explain fit and gaps clearly. A score is decision support, not a hiring decision." },
      { role: "user", content: `JOB REQUIREMENTS (JSON):
${JSON.stringify(jobContext)}

RESUME TEXT:
${resumeText.trim().slice(0, 14000)}` },
    ],
    response_format: { type: "json_schema", json_schema: { name: "job_match", strict: true, schema: {
      type: "object", additionalProperties: false,
      properties: {
        matchScore: { type: "number" },
        summary: { type: "string" },
        matchedSkills: { type: "array", items: { type: "string" } },
        missingSkills: { type: "array", items: { type: "string" } },
        strengths: { type: "array", items: { type: "string" } },
        gaps: { type: "array", items: { type: "string" } },
        recommendation: { type: "string" },
      },
      required: ["matchScore", "summary", "matchedSkills", "missingSkills", "strengths", "gaps", "recommendation"],
    } } },
  });
  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("AI matching returned an empty response.");
  const parsed = JSON.parse(content);
  parsed.matchScore = Math.max(0, Math.min(100, Math.round(Number(parsed.matchScore) || 0)));
  return parsed;
};
