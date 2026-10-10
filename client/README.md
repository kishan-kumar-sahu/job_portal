# OrbitHire Client

React + Vite frontend for the OrbitHire Job Portal.

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Set `VITE_API_URL` in `.env` to your API base URL (default: `http://localhost:3000`). For full setup, backend configuration, API details, and feature workflows, see `../README.md`.

## Frontend structure

```text
src/
├── components/
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── JobsPage.jsx
│   │   ├── ManageJobsPage.jsx
│   │   ├── JobFormPage.jsx
│   │   ├── ApplicationsPage.jsx
│   │   ├── ApplicantsPage.jsx
│   │   ├── ResumePage.jsx
│   │   ├── InterviewsPage.jsx
│   │   ├── NotificationsPage.jsx
│   │   └── ProfilePage.jsx
│   └── shared/
│       └── PagePrimitives.jsx
├── context/
├── utils/
│   └── ui.js
├── App.jsx
└── main.jsx
```

`App.jsx` remains the workspace coordinator and keeps the existing state and page navigation. Each page's UI is placed in its own component file. The login/register flow has been moved into `LoginPage.jsx`; API requests still use the existing API Context. The backend code has not been modified by this refactor.
