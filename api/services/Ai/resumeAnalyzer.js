import "dotenv/config";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 45000,
});

export const analyzeResume = async (resumeText) => {
  if (!resumeText || !resumeText.trim()) {
    throw new Error("Resume text is required.");
  }

  const cleanedResumeText = resumeText
    .trim()
    .slice(0, 15000);

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",

    messages: [
      {
        role: "system",
        content: `
You are an AI Resume Analyzer for a professional job portal.

Analyze the candidate's resume carefully.

Rules:
- Use only information present in the resume.
- Never invent skills, experience, education, projects or achievements.
- Give a realistic score between 0 and 100.
- Identify technical and soft skills.
- Identify genuine strengths and weaknesses.
- Suggest practical skills that would improve the candidate's profile.
- Keep the analysis concise and useful.
        `,
      },
      {
        role: "user",
        content: `Analyze this resume:

${cleanedResumeText}`,
      },
    ],

    response_format: {
      type: "json_schema",

      json_schema: {
        name: "resume_analysis",

        strict: true,

        schema: {
          type: "object",

          properties: {
            score: {
              type: "number",
            },

            summary: {
              type: "string",
            },

            skills: {
              type: "array",
              items: {
                type: "string",
              },
            },

            experience: {
              type: "object",

              properties: {
                years: {
                  type: "number",
                },

                highlights: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },

              required: [
                "years",
                "highlights",
              ],

              additionalProperties: false,
            },

            education: {
              type: "array",
              items: {
                type: "string",
              },
            },

            strengths: {
              type: "array",
              items: {
                type: "string",
              },
            },

            weaknesses: {
              type: "array",
              items: {
                type: "string",
              },
            },

            missingSkills: {
              type: "array",
              items: {
                type: "string",
              },
            },

            suggestions: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },

          required: [
            "score",
            "summary",
            "skills",
            "experience",
            "education",
            "strengths",
            "weaknesses",
            "missingSkills",
            "suggestions",
          ],

          additionalProperties: false,
        },
      },
    },

    temperature: 0.2,
  });

  const result =
    response.choices[0]?.message?.content;

  if (!result) {
    throw new Error(
      "Groq returned an empty response."
    );
  }

  return JSON.parse(result);
};