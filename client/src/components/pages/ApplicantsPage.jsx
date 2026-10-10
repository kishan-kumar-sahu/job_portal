import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext.jsx";
import { idOf, initials, titleCase } from "../../utils/ui.js";
import { SectionHeader, EmptyBlock } from "../shared/PagePrimitives.jsx";

export default function ApplicantsPage({ jobs, applications }) {
  const api = useContext(AppContext);

  const [updating, setUpdating] = useState("");
  const [localApps, setLocalApps] = useState(applications);
  const [scheduleFor, setScheduleFor] = useState("");
  const [scheduleDraft, setScheduleDraft] = useState({
    round: "technical",
    interviewType: "online",
    scheduledAt: "",
    duration: 60,
    meetingLink: "",
    interviewer: "",
  });
  const [actionMessage, setActionMessage] = useState("");
  useEffect(() => setLocalApps(applications), [applications]); // eslint-disable-line react-hooks/set-state-in-effect
  const changeStatus = async (application, status) => {
    const id = idOf(application);
    setUpdating(id);
    setActionMessage("");
    try {
      const result = await api.applications.updateStatus(id, { status });
      setLocalApps((old) =>
        old.map((item) =>
          idOf(item) === id
            ? { ...item, status: result.application?.status || status }
            : item,
        ),
      );
      setActionMessage(`Application moved to ${titleCase(status)}.`);
    } catch (error) {
      setActionMessage(error.message || "Could not update application.");
    } finally {
      setUpdating("");
    }
  };

  const scheduleInterview = async (event, application) => {
    event.preventDefault();
    setUpdating(idOf(application));
    setActionMessage("");
    try {
      const payload = {
        ...scheduleDraft,
        applicationId: idOf(application),
        scheduledAt: new Date(scheduleDraft.scheduledAt).toISOString(),
        duration: Number(scheduleDraft.duration),
      };
      const result = await api.interviews.create(payload);
      setActionMessage(result.message || "Interview scheduled successfully.");
      setScheduleFor("");
      setScheduleDraft({
        round: "technical",
        interviewType: "online",
        scheduledAt: "",
        duration: 60,
        meetingLink: "",
        interviewer: "",
      });
    } catch (error) {
      setActionMessage(error.message || "Could not schedule interview.");
    } finally {
      setUpdating("");
    }
  };
  return (
    <div className="section-page">
      <SectionHeader
        eyebrow="TALENT PIPELINE"
        title="Applicants"
        description="Review candidates, progress applications, and schedule interviews."
      />
      {actionMessage && (
        <div className="alert alert-info">
          <span>✓</span>
          <div>{actionMessage}</div>
          <button onClick={() => setActionMessage("")}>×</button>
        </div>
      )}
      <div className="panel table-panel">
        <div className="table-toolbar">
          <strong>
            Applications <span className="table-count">{localApps.length}</span>
          </strong>
          <span className="table-muted">{jobs.length} job listings</span>
        </div>
        {localApps.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Role</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Interview</th>
                </tr>
              </thead>
              <tbody>
                {localApps.map((app) => {
                  const candidate = app.candidateId || {};
                  const person = candidate.userId || {};
                  return (
                    <tr key={idOf(app)}>
                      <td>
                        <div className="table-job">
                          <span className="company-mark">
                            {initials(person.name || "Candidate")}
                          </span>
                          <div>
                            <strong>{person.name || "Candidate"}</strong>
                            <small>{person.email || "Email unavailable"}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{app.jobId?.title || "Job"}</strong>
                        <small style={{ display: "block", marginTop: 4 }}>
                          {app.jobId?.companyId?.name || "Company"}
                        </small>
                      </td>
                      <td>{Number(candidate.experience || 0)} yrs</td>
                      <td>
                        <span className={`status-tag ${app.status}`}>
                          {titleCase(app.status || "applied")}
                        </span>
                      </td>
                      <td>
                        <select
                          aria-label="Update application status"
                          disabled={updating === idOf(app)}
                          value={app.status || "applied"}
                          onChange={(e) => changeStatus(app, e.target.value)}
                        >
                          {[
                            "applied",
                            "shortlisted",
                            "interview",
                            "selected",
                            "rejected",
                          ].map((status) => (
                            <option key={status} value={status}>
                              {titleCase(status)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="text-button"
                          disabled={
                            !["shortlisted", "interview"].includes(app.status)
                          }
                          onClick={() => {
                            setScheduleFor(
                              scheduleFor === idOf(app) ? "" : idOf(app),
                            );
                            setActionMessage("");
                          }}
                        >
                          ＋ Schedule
                        </button>
                        {scheduleFor === idOf(app) && (
                          <form
                            className="schedule-inline"
                            onSubmit={(e) => scheduleInterview(e, app)}
                          >
                            <label>
                              Round
                              <select
                                value={scheduleDraft.round}
                                onChange={(e) =>
                                  setScheduleDraft((v) => ({
                                    ...v,
                                    round: e.target.value,
                                  }))
                                }
                              >
                                {[
                                  "screening",
                                  "technical",
                                  "hr",
                                  "managerial",
                                  "final",
                                ].map((x) => (
                                  <option key={x}>{x}</option>
                                ))}
                              </select>
                            </label>
                            <label>
                              Date & time
                              <input
                                type="datetime-local"
                                required
                                value={scheduleDraft.scheduledAt}
                                onChange={(e) =>
                                  setScheduleDraft((v) => ({
                                    ...v,
                                    scheduledAt: e.target.value,
                                  }))
                                }
                              />
                            </label>
                            <label>
                              Format
                              <select
                                value={scheduleDraft.interviewType}
                                onChange={(e) =>
                                  setScheduleDraft((v) => ({
                                    ...v,
                                    interviewType: e.target.value,
                                  }))
                                }
                              >
                                <option value="online">Online</option>
                                <option value="phone">Phone</option>
                                <option value="offline">In person</option>
                              </select>
                            </label>
                            <label>
                              Duration (minutes)
                              <input
                                type="number"
                                min="15"
                                value={scheduleDraft.duration}
                                onChange={(e) =>
                                  setScheduleDraft((v) => ({
                                    ...v,
                                    duration: e.target.value,
                                  }))
                                }
                              />
                            </label>
                            <label>
                              Interviewer
                              <input
                                value={scheduleDraft.interviewer}
                                onChange={(e) =>
                                  setScheduleDraft((v) => ({
                                    ...v,
                                    interviewer: e.target.value,
                                  }))
                                }
                                placeholder="Interviewer name"
                              />
                            </label>
                            <label>
                              Meeting link / location
                              <input
                                value={scheduleDraft.meetingLink}
                                onChange={(e) =>
                                  setScheduleDraft((v) => ({
                                    ...v,
                                    meetingLink: e.target.value,
                                  }))
                                }
                                placeholder="https://… or room details"
                              />
                            </label>
                            <button
                              className="btn btn-primary btn-full"
                              disabled={updating === idOf(app)}
                            >
                              {updating === idOf(app)
                                ? "Scheduling…"
                                : "Confirm interview"}
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyBlock
            icon="♙"
            title="No applications yet"
            text="When candidates apply to your published jobs, their profiles will appear here."
          />
        )}
      </div>
    </div>
  );
}
