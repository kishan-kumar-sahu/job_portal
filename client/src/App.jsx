import { useContext, useEffect, useMemo, useState } from "react";
import AppContext from "./context/AppContext.jsx";
import AuthScreen from "./components/pages/LoginPage.jsx";
import Dashboard from "./components/pages/DashboardPage.jsx";
import JobsPage, { JobModal } from "./components/pages/JobsPage.jsx";
import ManageJobs from "./components/pages/ManageJobsPage.jsx";
import JobForm from "./components/pages/JobFormPage.jsx";
import ApplicationsPage from "./components/pages/ApplicationsPage.jsx";
import ApplicantsPage from "./components/pages/ApplicantsPage.jsx";
import ResumePage from "./components/pages/ResumePage.jsx";
import InterviewsPage from "./components/pages/InterviewsPage.jsx";
import NotificationsPage from "./components/pages/NotificationsPage.jsx";
import ProfilePage from "./components/pages/ProfilePage.jsx";
import { initials, idOf } from "./utils/ui.js";

const navCandidate = [
  ["Overview", "⌂"], ["Explore jobs", "⌕"], ["Saved jobs", "♡"], ["My applications", "▤"],
  ["Resume AI", "✦"], ["Interviews", "◷"], ["Notifications", "♧"], ["My profile", "◉"],
];
const navRecruiter = [
  ["Overview", "⌂"], ["Manage jobs", "▤"], ["Post a job", "+"],
  ["Applicants", "♙"], ["Interviews", "◷"], ["Notifications", "♧"], ["My profile", "◉"],
];

function App() {
  const api = useContext(AppContext);


  const [page, setPage] = useState("Overview");
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [recruiterProfile, setRecruiterProfile] = useState(null);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobMatch, setJobMatch] = useState(null);
  const [matchBusy, setMatchBusy] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [jobForm, setJobForm] = useState({ title: "", description: "", companyId: "", companyName: "", skills: "", experienceRequired: 0, salaryMin: "", salaryMax: "", location: "Remote", jobType: "full-time", workMode: "remote", openings: 1, applicationDeadline: "", status: "published" });
  const [editingJob, setEditingJob] = useState(null);


  
  const isLoggedIn = api.isAuthenticated;
  const role = api.user?.role || "candidate";
  const navItems = role === "recruiter" ? navRecruiter : navCandidate;
  const visibleJobs = useMemo(() => jobs.filter((job) => {
    const query = search.toLowerCase();
    const matches = `${job.title || ""} ${job.description || ""} ${(job.skills || []).join(" ")} ${job.location || ""} ${job.companyId?.name || ""}`.toLowerCase().includes(query);
    const modeMatch = filterMode === "all" || job.workMode === filterMode;
    const savedMatch = page !== "Saved jobs" || savedJobs.includes(idOf(job));
    return matches && modeMatch && savedMatch && (role === "recruiter" || job.status === "published");
  }), [jobs, search, filterMode, role, page, savedJobs]);

  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(""), 3600); };
  const loadPageData = async (target = page) => {
    if (!isLoggedIn) return;
    setBusy(true); setError("");
    try {
      if (target === "Overview" || target === "Explore jobs" || target === "Saved jobs" || target === "Manage jobs" || target === "Post a job") {
        try {
          const result = await api.jobs.list();
          setJobs(result.jobs || result.data?.jobs || []);
        } catch (e) { if (target !== "Overview") throw e; }
      }
      if (["Overview", "My applications"].includes(target) && role === "candidate") {
        try { const result = await api.applications.mine(); setApplications(result.applications || []); } catch (e) { if (target !== "Overview") throw e; }
      }
      if (target === "Applicants" && role === "recruiter") {
        const result = await api.applications.recruiter();
        setApplications(result.applications || []);
      }
      if (target === "Interviews" || target === "Overview") {
        try {
          const result = role === "recruiter" ? await api.interviews.recruiter() : await api.interviews.mine();
          setInterviews(result.interviews || []);
        } catch (e) { if (target !== "Overview") throw e; }
      }
      if (target === "Notifications" || target === "Overview") {
        try { const result = await api.notifications.mine(); setNotifications(result.notifications || []); } catch (e) { if (target !== "Overview") throw e; }
      }
      if (["Explore jobs", "Saved jobs", "Overview"].includes(target) && role === "candidate") {
        try { const result = await api.candidate.savedJobs(); setSavedJobs((result.savedJobs || []).map((job) => idOf(job))); } catch (e) { if (target !== "Overview") setError(e.message); }
      }
      if (target === "Resume AI") {
        try { const result = await api.resume.saved(); if (result.data?.analysis) setAnalysis(result.data.analysis); } catch (e) { if (!String(e.message).toLowerCase().includes("candidate profile not found")) setError(e.message); }
      }
      if (target === "My profile" || target === "Overview") {
        try {
          if (role === "recruiter") {
            const result = await api.recruiter.profile();
            setRecruiterProfile(result.recruiterProfile || result.recruiter || null);
          } else {
            const result = await api.candidate.profile();
            setProfile(result.candidate || null);
          }
        } catch (e) { if (target !== "Overview") setError(e.message); }
      }
    } catch (e) { setError(e.message || "Could not load this section."); }
    finally { setBusy(false); }
  };

  useEffect(() => { if (isLoggedIn) loadPageData(page); }, [isLoggedIn, page, role]); // eslint-disable-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect

  const handleToggleSavedJob = async (job) => {
    try {
      const result = await api.candidate.toggleSavedJob(idOf(job));
      setSavedJobs(result.savedJobs || []);
      notify(result.message || (result.saved ? "Job saved." : "Job removed from saved jobs."));
    } catch (e) { notify(e.message || "Could not update saved jobs."); }
  };

  const handleApply = async (job) => {
    if (!isLoggedIn) { setSelectedJob(null); return; }
    try {
      const result = await api.applications.apply({ jobId: idOf(job), coverLetter });
      setCoverLetter(""); setSelectedJob(null); notify(result.message || "Application submitted."); loadPageData("My applications");
    } catch (e) { notify(e.message || "Could not submit application."); }
  };

  const handleResume = async (event) => {
    event.preventDefault();
    if (!resumeFile) { notify("Choose a PDF or DOCX resume first."); return; }
    setBusy(true); setError(""); setAnalysis(null);
    try {
      const result = await api.resume.analyze(resumeFile);
      setAnalysis(result.data?.analysis || result.analysis || null);
      if (!result.data?.analysis && !result.analysis) throw new Error("The analyzer returned no analysis.");
      notify("Resume analysis complete.");
    } catch (e) { setError(e.message || "Resume analysis failed."); }
    finally { setBusy(false); }
  };

  const handleJobMatch = async (job, file) => {
    if (!file) { notify("Choose a PDF or DOCX resume first."); return; }
    setMatchBusy(true); setError(""); setJobMatch(null);
    try {
      const result = await api.resume.match(idOf(job), file);
      setJobMatch({ ...(result.data?.match || {}), job: result.data?.job, fileName: file.name });
      notify("Job match analysis complete.");
    } catch (e) { setError(e.message || "Could not match resume to this job."); }
    finally { setMatchBusy(false); }
  };

  const handleCreateJob = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      let companyId = jobForm.companyId.trim();
      if (!companyId && jobForm.companyName.trim()) {
        const companyResult = await api.companies.create({ name: jobForm.companyName.trim(), industry: "Information Technology" });
        companyId = idOf(companyResult.company);
      }
      if (!companyId) throw new Error("Enter an existing Company ID or provide a company name to create one.");
      const payload = {
        ...jobForm,
        companyId,
        skills: jobForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
        experienceRequired: Number(jobForm.experienceRequired || 0),
        salary: { min: jobForm.salaryMin ? Number(jobForm.salaryMin) : undefined, max: jobForm.salaryMax ? Number(jobForm.salaryMax) : undefined, currency: "INR" },
        openings: Number(jobForm.openings || 1),
        applicationDeadline: jobForm.applicationDeadline || undefined,
      };
      delete payload.salaryMin; delete payload.salaryMax; delete payload.companyName;
      const result = editingJob ? await api.jobs.update(editingJob, payload) : await api.jobs.create(payload);
      notify(result.message || (editingJob ? "Job updated." : "Job created."));
      setEditingJob(null);
      setPage("Manage jobs"); loadPageData("Manage jobs");
    } catch (e) { setError(e.message || "Could not create job."); }
    finally { setBusy(false); }
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      if (role === "recruiter") {
        if (recruiterProfile?._id) { const result = await api.recruiter.update(recruiterProfile._id, data); setRecruiterProfile(result.recruiter || result.updateRecruiterProfile || null); notify(result.message || "Profile updated."); }
        else { const result = await api.recruiter.create(data); setRecruiterProfile(result.recruiter || null); notify(result.message || "Profile created."); }
      } else {
        const payload = { ...data, experience: Number(data.experience || 0), skills: data.skills.split(",").map((s) => s.trim()).filter(Boolean) };
        if (profile?._id) { const result = await api.candidate.update(api.user?._id, payload); setProfile(result.candidate || null); notify(result.message || "Profile updated."); }
        else { const result = await api.candidate.create(payload); setProfile(result.candidate || null); notify(result.message || "Profile created."); }
      }
      loadPageData("My profile");
    } catch (e) { setError(e.message || "Could not save profile."); }
    finally { setBusy(false); }
  };

  const withdraw = async (application) => {
    try { const result = await api.applications.withdraw(idOf(application)); notify(result.message || "Application withdrawn."); loadPageData("My applications"); }
    catch (e) { notify(e.message || "Could not withdraw application."); }
  };
  const markRead = async (item) => {
    try { await api.notifications.read(idOf(item)); setNotifications((prev) => prev.map((n) => idOf(n) === idOf(item) ? { ...n, isRead: true } : n)); }
    catch (e) { notify(e.message); }
  };

  if (!isLoggedIn) {
    return <AuthScreen onAuthenticated={() => setPage("Overview")} onNotify={notify} />;
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">o</span><span>orbit<span className="brand-light">hire</span></span><span className="beta">BETA</span></div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav">
          {navItems.map(([label, icon]) => (
            <button key={label} className={`nav-item ${page === label ? "active" : ""}`} onClick={() => { setPage(label); setSelectedJob(null); setError(""); }}>
              <span className="nav-icon">{icon}</span><span>{label}</span>
              {label === "Notifications" && unreadCount > 0 && <span className="nav-count">{unreadCount}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-help"><div className="help-orb">✦</div><strong>Your next move starts here.</strong><p>Make your profile stand out with AI-powered insights.</p><button onClick={() => setPage(role === "recruiter" ? "Post a job" : "Resume AI")}>Explore tools <span>↗</span></button></div>
        <div className="sidebar-user">
          <div className="avatar">{initials(api.user?.name)}</div>
          <div className="sidebar-user-copy"><strong>{api.user?.name || "Workspace user"}</strong><span>{role === "recruiter" ? "Recruiter workspace" : "Candidate workspace"}</span></div>
          <button className="icon-button logout-btn" title="Sign out" onClick={api.logout}>↪</button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{page}</strong></div>
          <div className="topbar-actions">
            <div className="status-pill"><span className="status-dot" /> All systems ready</div>
            <button className="top-icon" aria-label="Notifications" onClick={() => setPage("Notifications")}>♧{unreadCount > 0 && <i />}</button>
            <button className="avatar avatar-small profile-logout" title="Sign out" aria-label="Sign out" onClick={api.logout}>{initials(api.user?.name)}</button>
          </div>
        </header>

        <div className="page-content">
          {error && <div className="alert alert-error"><span>!</span><div>{error}</div><button onClick={() => setError("")}>×</button></div>}
          {busy && <div className="loading-line"><span /> Syncing workspace data…</div>}
          {page === "Overview" && <Dashboard role={role} user={api.user} jobs={jobs} applications={applications} interviews={interviews} notifications={notifications} savedJobs={savedJobs} profile={profile} onNavigate={setPage} onRefresh={() => loadPageData("Overview")} />}
          {(page === "Explore jobs" || page === "Saved jobs") && <JobsPage savedOnly={page === "Saved jobs"} jobs={visibleJobs} search={search} setSearch={setSearch} filterMode={filterMode} setFilterMode={setFilterMode} savedJobs={savedJobs} onSave={handleToggleSavedJob} onSelect={(job) => { setSelectedJob(job); setJobMatch(null); }} />}
          {page === "Manage jobs" && <ManageJobs jobs={jobs} onCreate={() => { setEditingJob(null); setJobForm({ title: "", description: "", companyId: "", companyName: "", skills: "", experienceRequired: 0, salaryMin: "", salaryMax: "", location: "Remote", jobType: "full-time", workMode: "remote", openings: 1, applicationDeadline: "", status: "published" }); setPage("Post a job"); }} onEdit={(job) => { setEditingJob(idOf(job)); setJobForm({ title: job.title || "", description: job.description || "", companyId: idOf(job.companyId), companyName: "", skills: (job.skills || []).join(", "), experienceRequired: job.experienceRequired || 0, salaryMin: job.salary?.min || "", salaryMax: job.salary?.max || "", location: job.location || "", jobType: job.jobType || "full-time", workMode: job.workMode || "on-site", openings: job.openings || 1, applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().slice(0,10) : "", status: job.status || "draft" }); setPage("Post a job"); }} onDelete={async (job) => { try { await api.jobs.remove(idOf(job)); notify("Job deleted."); loadPageData("Manage jobs"); } catch (e) { notify(e.message); } }} />}
          {page === "Post a job" && <JobForm jobForm={jobForm} setJobForm={setJobForm} onSubmit={handleCreateJob} busy={busy} editing={Boolean(editingJob)} />}
          {page === "My applications" && <ApplicationsPage applications={applications} onWithdraw={withdraw} />}
          {page === "Applicants" && <ApplicantsPage jobs={jobs} applications={applications} />}
          {page === "Resume AI" && <ResumePage file={resumeFile} setFile={setResumeFile} onSubmit={handleResume} analysis={analysis} busy={busy} />}
          {page === "Interviews" && <InterviewsPage interviews={interviews} role={role} onUpdate={async (item, changes) => { try { const result = await api.interviews.update(idOf(item), changes); notify(result.message || "Interview updated."); loadPageData("Interviews"); } catch (e) { notify(e.message || "Could not update interview."); } }} />}
          {page === "Notifications" && <NotificationsPage items={notifications} onRead={markRead} onReadAll={async () => { try { await api.notifications.readAll(); setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true }))); } catch (e) { notify(e.message); } }} />}
          {page === "My profile" && <ProfilePage role={role} user={api.user} profile={profile} recruiterProfile={recruiterProfile} onSubmit={handleSaveProfile} busy={busy} />}
        </div>
        <footer className="page-footer"><span>© 2026 OrbitHire</span><span>Built for your next chapter <span className="footer-spark">✦</span></span></footer>
      </main>

      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} onApply={handleApply} onMatch={handleJobMatch} matchResult={jobMatch} matchBusy={matchBusy} coverLetter={coverLetter} setCoverLetter={setCoverLetter} />}
      {toast && <div className="toast"><span>✓</span>{toast}</div>}
    </div>
  );
}


export default App;
