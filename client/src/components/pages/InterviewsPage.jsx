import { idOf, titleCase } from "../../utils/ui.js";
import { SectionHeader, EmptyBlock } from "../shared/PagePrimitives.jsx";

export default function InterviewsPage({ interviews, role, onUpdate }) {
  return (
    <div className="section-page">
      <SectionHeader
        eyebrow="YOUR CALENDAR"
        title="Interviews"
        description={
          role === "recruiter"
            ? "Manage upcoming candidate conversations."
            : "Keep track of the conversations that move you forward."
        }
      />
      <div className="interview-list">
        {interviews.map((item) => {
          const when = item.scheduledAt ? new Date(item.scheduledAt) : null;
          return (
            <article className="interview-card" key={idOf(item)}>
              <div className="calendar-tile">
                <span>
                  {when
                    ? when
                        .toLocaleDateString("en", { month: "short" })
                        .toUpperCase()
                    : "DATE"}
                </span>
                <strong>{when ? when.getDate() : "—"}</strong>
              </div>
              <div className="interview-copy">
                <span className="interview-round">
                  {titleCase(item.round || "technical")} round
                </span>
                <h3>{item.interviewer || "Interview conversation"}</h3>
                <p>
                  {when ? when.toLocaleString() : "Time to be confirmed"}{" "}
                  <span>·</span> {item.duration || 60} minutes
                </p>
                <div className="job-tags">
                  <span>{titleCase(item.interviewType || "online")}</span>
                  <span>{titleCase(item.status || "scheduled")}</span>
                </div>
              </div>
              {item.meetingLink && item.interviewType === "online" && (
                <a
                  className="btn btn-outline"
                  href={item.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Join meeting ↗
                </a>
              )}
              {role === "recruiter" &&
                ["scheduled", "rescheduled"].includes(item.status) && (
                  <div className="interview-actions">
                    <button
                      className="text-button"
                      onClick={() =>
                        onUpdate(item, {
                          status: "completed",
                          feedback: item.feedback || "Interview completed.",
                        })
                      }
                    >
                      Mark completed
                    </button>
                    <button
                      className="text-button danger-text"
                      onClick={() => onUpdate(item, { status: "cancelled" })}
                    >
                      Cancel
                    </button>
                  </div>
                )}
            </article>
          );
        })}
        {!interviews.length && (
          <EmptyBlock
            icon="◷"
            title="Your calendar is clear"
            text="Scheduled interviews will appear here as soon as they’re confirmed."
          />
        )}
      </div>
    </div>
  );
}
