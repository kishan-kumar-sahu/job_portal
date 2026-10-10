# OrbitHire — SaaS Job Portal

OrbitHire is a React + Express + MongoDB job portal with candidate and recruiter workspaces, applications, interviews, notifications, saved jobs, resume analysis, and AI resume-to-job matching powered by Groq.

## Project structure

```text
orbithire_saas/
├── api/       Express API + MongoDB/Mongoose + Groq
├── client/    React + Vite frontend
└── README.md
```

## Requirements

- Node.js 20.19+ or 22.12+
- MongoDB running locally or a MongoDB connection string
- A Groq API key for AI Resume Analysis and Job Match

## Setup

### 1. Configure backend

```powershell
cd api
Copy-Item .env.example .env
npm install
```

Edit `api/.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/job_portal
JWT_SECRET=use-a-long-random-secret-value
GROQ_API_KEY=your-groq-api-key
CLIENT_ORIGIN=http://localhost:5173
```

Start the API:

```powershell
npm run dev
```

Health check: `http://localhost:3000/api/health`

### 2. Configure frontend

Open a second terminal:

```powershell
cd client
Copy-Item .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

## Core workflows

### Candidate

1. Register with the Candidate role. A candidate profile is created automatically.
2. Explore published jobs and save/unsave opportunities.
3. Open a job and upload a PDF/DOCX resume to calculate an AI job match score, matched skills, missing skills, strengths, and gaps.
4. Apply to a job and track application status.
5. Use Resume AI to analyze a resume and save the latest general analysis on the candidate profile.
6. Review interviews and notifications; sign out from the avatar or sidebar sign-out action.

### Recruiter

1. Register with the Recruiter role. A recruiter profile is created automatically.
2. Post a job. Enter a new company name or use a company ID owned by the signed-in account.
3. Edit/delete owned job listings.
4. Review applications, change application status, and schedule interviews for shortlisted candidates.
5. Mark interviews completed or cancel scheduled interviews.
6. Update recruiter profile details and review notifications.

## API details

- Authenticated requests use the existing `Auth: <JWT>` header. The API also accepts `Authorization: Bearer <JWT>` for compatibility.
- `POST /api/resumes/analyze` — multipart form-data field `resume`; returns and stores general resume analysis when a candidate profile exists.
- `GET /api/resumes/analysis` — returns the saved resume analysis and recent job matches.
- `POST /api/resumes/match/:jobId` — multipart form-data field `resume`; compares the uploaded resume to the selected published job.
- `GET /api/candidate/saved-jobs` and `PATCH /api/candidate/saved-jobs/:jobId` — list/toggle saved jobs.
- `GET /api/application/recruiter/all` — recruiter-owned applications.

## Session and security notes

- Logout is client-side token removal because the current authentication mechanism uses stateless JWTs. Expired/invalid sessions are cleared automatically after a 401 response.
- Password hashes are not included in register/login responses or populated profile data.
- Resume uploads are limited to one PDF/DOCX file up to 5 MB. Resume matching is advisory and should not be used as the sole hiring decision.
- The company schema now tracks its owner user. Existing Company documents created before this field was introduced may need an owner assigned before they can be used to create new jobs.
- Never commit `.env` files. Use `.env.example` only as a template.

## Verification

Backend JavaScript syntax and frontend ESLint/JSX parsing were checked while preparing this archive. A production Vite build could not be run in the preparation environment because the provided installed Vite/Rolldown dependencies were missing their platform-specific native binding. Run `npm install` and `npm run build` in your own environment to perform the final production build.
