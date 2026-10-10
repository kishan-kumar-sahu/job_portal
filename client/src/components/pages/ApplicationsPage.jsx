import { idOf, titleCase } from "../../utils/ui.js";
import { SectionHeader, EmptyBlock } from "../shared/PagePrimitives.jsx";

export default function ApplicationsPage({ applications, onWithdraw }) {
  return (
    <div className="section-page">
      <SectionHeader
        eyebrow="YOUR JOB SEARCH"
        title="My applications"
        description="Track every opportunity from first click to final decision."
      />
      <div className="application-list">
        {applications.map((app) => (
          <article className="application-card" key={idOf(app)}>
            <div className="company-mark">
              {(app.jobId?.title || "J").slice(0, 1)}
            </div>
            <div className="application-main">
              <h3>{app.jobId?.title || "Job application"}</h3>
              <p>
                {app.jobId?.location || "Location not specified"} <span>·</span>{" "}
                {titleCase(app.jobId?.jobType || "full-time")}
              </p>
              <small>
                Applied{" "}
                {app.createdAt
                  ? new Date(app.createdAt).toLocaleDateString()
                  : "recently"}
              </small>
            </div>
            <div className="application-status">
              <span className={`status-tag ${app.status}`}>
                {titleCase(app.status || "applied")}
              </span>
              {!["selected", "rejected", "withdrawn"].includes(app.status) && (
                <button
                  className="text-button danger-text"
                  onClick={() => onWithdraw(app)}
                >
                  Withdraw
                </button>
              )}
            </div>
          </article>
        ))}
        {!applications.length && (
          <EmptyBlock
            icon="▤"
            title="Your story starts with one application"
            text="Find a role that excites you and send your first application."
          />
        )}
      </div>
    </div>
  );
}
