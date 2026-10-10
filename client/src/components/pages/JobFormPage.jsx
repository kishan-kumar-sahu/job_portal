import { SectionHeader } from "../shared/PagePrimitives.jsx";

export default function JobForm({
  jobForm,
  setJobForm,
  onSubmit,
  busy,
  editing = false,
}) {
  const update = (key, value) =>
    setJobForm((old) => ({ ...old, [key]: value }));
  return (
    <div className="section-page">
      <SectionHeader
        eyebrow={editing ? "UPDATE OPPORTUNITY" : "NEW OPPORTUNITY"}
        title={editing ? "Edit job listing" : "Post a job"}
        description="A clear role description helps the right people find you."
      />
      <form className="panel job-form" onSubmit={onSubmit}>
        <div className="form-section-title">
          <span>01</span>
          <div>
            <h3>Role details</h3>
            <p>Start with the essentials.</p>
          </div>
        </div>
        <div className="form-grid">
          <label>
            Job title *
            <input
              required
              value={jobForm.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
            />
          </label>
          <label>
            Existing Company ID
            <input
              value={jobForm.companyId}
              onChange={(e) => update("companyId", e.target.value)}
              placeholder="Paste ID if company already exists"
            />
          </label>
          <label>
            Or create a company
            <input
              value={jobForm.companyName}
              onChange={(e) => update("companyName", e.target.value)}
              placeholder="Company name"
            />
          </label>
          <label className="span-2">
            Description *
            <textarea
              required
              rows="5"
              value={jobForm.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="What will this person work on? What does success look like?"
            />
          </label>
          <label>
            Skills (comma separated)
            <input
              value={jobForm.skills}
              onChange={(e) => update("skills", e.target.value)}
              placeholder="React, JavaScript, APIs"
            />
          </label>
          <label>
            Experience required (years)
            <input
              type="number"
              min="0"
              value={jobForm.experienceRequired}
              onChange={(e) => update("experienceRequired", e.target.value)}
            />
          </label>
          <label>
            Location
            <input
              value={jobForm.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Remote / City"
            />
          </label>
          <label>
            Job type
            <select
              value={jobForm.jobType}
              onChange={(e) => update("jobType", e.target.value)}
            >
              {[
                "full-time",
                "part-time",
                "contract",
                "internship",
                "freelance",
              ].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label>
            Work mode
            <select
              value={jobForm.workMode}
              onChange={(e) => update("workMode", e.target.value)}
            >
              {["remote", "hybrid", "on-site"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label>
            Openings
            <input
              type="number"
              min="1"
              value={jobForm.openings}
              onChange={(e) => update("openings", e.target.value)}
            />
          </label>
          <label>
            Minimum salary (₹ / year)
            <input
              type="number"
              min="0"
              value={jobForm.salaryMin}
              onChange={(e) => update("salaryMin", e.target.value)}
              placeholder="e.g. 600000"
            />
          </label>
          <label>
            Maximum salary (₹ / year)
            <input
              type="number"
              min="0"
              value={jobForm.salaryMax}
              onChange={(e) => update("salaryMax", e.target.value)}
              placeholder="e.g. 1000000"
            />
          </label>
          <label>
            Application deadline
            <input
              type="date"
              value={jobForm.applicationDeadline}
              onChange={(e) => update("applicationDeadline", e.target.value)}
            />
          </label>
          <label>
            Listing status
            <select
              value={jobForm.status}
              onChange={(e) => update("status", e.target.value)}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
        </div>
        <div className="form-actions">
          <span className="form-hint">
            Required fields are marked with *. Use an existing company ID or
            enter a new company name.
          </span>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : editing ? "Save changes" : "Publish listing"}{" "}
            <span>→</span>
          </button>
        </div>
      </form>
    </div>
  );
}
