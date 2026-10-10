import { idOf, titleCase } from "../../utils/ui.js";
import { SectionHeader, EmptyBlock } from "../shared/PagePrimitives.jsx";

export default function ManageJobs({ jobs, onCreate, onEdit, onDelete }) {
  return (
    <div className="section-page">
      <SectionHeader
        eyebrow="RECRUITING"
        title="Manage job listings"
        description="Keep your roles organized and your hiring pipeline moving."
        action={
          <button className="btn btn-primary" onClick={onCreate}>
            ＋ Post a job
          </button>
        }
      />
      <div className="panel table-panel">
        <div className="table-toolbar">
          <strong>
            All listings <span className="table-count">{jobs.length}</span>
          </strong>
          <span className="table-muted">Synced with your workspace</span>
        </div>
        {jobs.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Work mode</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={idOf(job)}>
                    <td>
                      <div className="table-job">
                        <span className="company-mark">
                          {(job.companyId?.name || "C").slice(0, 1)}
                        </span>
                        <div>
                          <strong>{job.title}</strong>
                          <small>{job.companyId?.name || "Company"}</small>
                        </div>
                      </div>
                    </td>
                    <td>{job.location || "—"}</td>
                    <td>{titleCase(job.workMode || "on-site")}</td>
                    <td>
                      <span className={`status-tag ${job.status}`}>
                        {titleCase(job.status || "draft")}
                      </span>
                    </td>
                    <td>
                      <button
                        className="text-button"
                        onClick={() => onEdit(job)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-button danger-text"
                        onClick={() => onDelete(job)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyBlock
            icon="▤"
            title="No listings yet"
            text="Create your first role to start meeting candidates."
            action={
              <button className="btn btn-primary" onClick={onCreate}>
                Create a job
              </button>
            }
          />
        )}
      </div>
    </div>
  );
}
