import { useState } from "react";
import { idOf, titleCase, money } from "../../utils/ui.js";
import { SectionHeader, EmptyBlock } from "../shared/PagePrimitives.jsx";

export default function JobsPage({
  savedOnly,
  jobs,
  search,
  setSearch,
  filterMode,
  setFilterMode,
  savedJobs,
  onSave,
  onSelect,
}) {
  return (
    <div className="section-page">
      <SectionHeader
        eyebrow={
          savedOnly
            ? "YOUR SHORTLIST"
            : search || filterMode !== "all"
              ? "OPPORTUNITY SEARCH"
              : "OPPORTUNITIES"
        }
        title={savedOnly ? "Saved jobs" : "Find your next role"}
        description={
          savedOnly
            ? "The roles you bookmarked, ready when you are."
            : "Explore roles that match your skills, interests, and ambition."
        }
      />
      <div className="job-searchbar">
        <span>⌕</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search roles, skills, companies or locations…"
        />
        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
        >
          <option value="all">All work modes</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="on-site">On-site</option>
        </select>
      </div>
      <div className="results-meta">
        <span>
          <strong>{jobs.length}</strong> opportunities found
        </span>
        <span>
          Recently listed <span className="sort-chevron">⌄</span>
        </span>
      </div>
      {jobs.length ? (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard
              key={idOf(job)}
              job={job}
              isSaved={savedJobs.includes(idOf(job))}
              onSave={() => onSave(job)}
              onClick={() => onSelect(job)}
            />
          ))}
        </div>
      ) : (
        <EmptyBlock
          icon="⌕"
          title="No roles found"
          text="Try another keyword or refresh to load current opportunities."
        />
      )}
    </div>
  );
}

function JobCard({ job, onClick, isSaved = false, onSave }) {
  const company = job.companyId?.name || job.company?.name || "Company";
  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="company-mark">{company.slice(0, 1).toUpperCase()}</div>
        <button
          className={`save-button ${isSaved ? "is-saved" : ""}`}
          title={isSaved ? "Remove saved job" : "Save job"}
          aria-label={isSaved ? "Remove saved job" : "Save job"}
          onClick={(e) => {
            e.stopPropagation();
            onSave?.();
          }}
        >
          {isSaved ? "♥" : "♡"}
        </button>
      </div>
      <div className="job-company">{company}</div>
      <h3>{job.title}</h3>
      <div className="job-location">
        ⌖ {job.location || "Location not specified"}
      </div>
      <div className="job-tags">
        <span>{titleCase(job.jobType || "full-time")}</span>
        <span>{titleCase(job.workMode || "on-site")}</span>
        <span>{Number(job.experienceRequired || 0)}+ yrs</span>
      </div>
      <div className="job-card-divider" />
      <div className="job-card-bottom">
        <div>
          <strong>{money(job.salary)}</strong>
          <small>Annual compensation</small>
        </div>
        <button
          className="round-arrow"
          onClick={() => onClick(job)}
          aria-label={`View ${job.title}`}
        >
          ↗
        </button>
      </div>
    </article>
  );
}

export function JobModal({
  job,
  onClose,
  onApply,
  onMatch,
  matchResult,
  matchBusy,
  coverLetter,
  setCoverLetter,
}) {
  const [resumeFile, setResumeFile] = useState(null);
  const matchScore = Math.max(
    0,
    Math.min(100, Number(matchResult?.matchScore || 0)),
  );
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card job-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <div className="company-mark company-mark-large">
          {(job.companyId?.name || "C").slice(0, 1).toUpperCase()}
        </div>
        <p className="job-company">{job.companyId?.name || "Company"}</p>
        <h2>{job.title}</h2>
        <div className="modal-job-meta">
          <span>⌖ {job.location || "Location flexible"}</span>
          <span>◷ {titleCase(job.jobType || "full-time")}</span>
          <span>✦ {titleCase(job.workMode || "on-site")}</span>
        </div>
        <div className="modal-salary">
          {money(job.salary)} <small>annual</small>
        </div>
        <h4>About the role</h4>
        <p className="job-description">{job.description}</p>
        <h4>Skills and experience</h4>
        <div className="skill-chips">
          {(job.skills || []).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
        <div className="match-box">
          <div className="match-box-head">
            <div>
              <span className="ai-badge">
                <span>✦</span> AI JOB MATCH
              </span>
              <h3>How well do you fit this role?</h3>
              <p>
                Upload your resume to score it against this job’s requirements.
              </p>
            </div>
          </div>
          <label className="match-file">
            <span>↑</span>
            <span>
              <strong>{resumeFile?.name || "Choose your resume"}</strong>
              <small>PDF or DOCX · maximum 5 MB</small>
            </span>
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            />
          </label>
          <button
            className="btn btn-outline btn-full"
            disabled={!resumeFile || matchBusy}
            onClick={() => onMatch(job, resumeFile)}
          >
            {matchBusy ? "Matching resume…" : "Calculate my job match"}{" "}
            <span>✦</span>
          </button>
          {matchResult && (
            <div className="match-result">
              <div className="match-score-row">
                <div
                  className="match-score-ring"
                  style={{ "--score": `${matchScore * 3.6}deg` }}
                >
                  <strong>{matchScore}</strong>
                  <small>/100</small>
                </div>
                <div>
                  <strong>{matchResult.job?.title || job.title}</strong>
                  <p>{matchResult.summary}</p>
                </div>
              </div>
              <h4>Matched skills</h4>
              <div className="skill-chips">
                {(matchResult.matchedSkills || []).map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
              <h4>Skills to strengthen</h4>
              <div className="skill-chips muted-chips">
                {(matchResult.missingSkills || []).map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
              {(matchResult.gaps || []).length > 0 && (
                <>
                  <h4>Potential gaps</h4>
                  <ul>
                    {matchResult.gaps.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </>
              )}
              <p className="match-recommendation">
                <strong>Next step:</strong> {matchResult.recommendation}
              </p>
              <small className="match-disclaimer">
                AI matching is an estimate to help you tailor your application,
                not a hiring decision.
              </small>
            </div>
          )}
        </div>
        <label className="modal-label">
          Cover letter <span>Optional</span>
          <textarea
            rows="4"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell the team why this role interests you…"
          />
        </label>
        <button
          className="btn btn-primary btn-full"
          onClick={() => onApply(job)}
        >
          Submit application <span>→</span>
        </button>
      </div>
    </div>
  );
}
