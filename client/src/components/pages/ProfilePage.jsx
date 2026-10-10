import { initials, titleCase } from "../../utils/ui.js";
import { SectionHeader } from "../shared/PagePrimitives.jsx";

export default function ProfilePage({
  role,
  user,
  profile,
  recruiterProfile,
  onSubmit,
  busy,
}) {
  const current = role === "recruiter" ? recruiterProfile : profile;
  return (
    <div className="section-page">
      <SectionHeader
        eyebrow="YOUR DETAILS"
        title="Profile & preferences"
        description="Keep your details up to date so the right people can find you."
      />
      <form className="panel profile-panel" onSubmit={onSubmit}>
        <div className="profile-banner">
          <div className="avatar avatar-profile">{initials(user?.name)}</div>
          <div>
            <h2>{user?.name || "Your name"}</h2>
            <p>{user?.email}</p>
            <span className="role-chip">{titleCase(role)} account</span>
          </div>
        </div>
        {role === "recruiter" ? (
          <div className="form-grid">
            <label>
              Designation
              <input
                name="designation"
                defaultValue={current?.designation || ""}
                placeholder="Talent Acquisition Specialist"
              />
            </label>
            <label>
              Department
              <input
                name="department"
                defaultValue={current?.department || ""}
                placeholder="People & Culture"
              />
            </label>
            <label>
              Recruiter type
              <select
                name="recruiterType"
                defaultValue={current?.recruiterType || "internal"}
              >
                <option value="internal">Internal</option>
                <option value="agency">Agency</option>
                <option value="freelance">Freelance</option>
              </select>
            </label>
            <label>
              Phone
              <input
                name="phone"
                defaultValue={current?.phone || ""}
                placeholder="+91 98765 43210"
              />
            </label>
            <label className="span-2">
              Professional bio
              <textarea
                name="bio"
                rows="4"
                defaultValue={current?.bio || ""}
                placeholder="A little about your work and hiring focus…"
              />
            </label>
          </div>
        ) : (
          <div className="form-grid">
            <label>
              Phone
              <input
                name="phone"
                defaultValue={profile?.phone || ""}
                placeholder="+91 98765 43210"
              />
            </label>
            <label>
              Location
              <input
                name="location"
                defaultValue={profile?.location || ""}
                placeholder="City, country or remote"
              />
            </label>
            <label>
              Experience (years)
              <input
                type="number"
                min="0"
                step="0.1"
                name="experience"
                defaultValue={profile?.experience ?? 0}
              />
            </label>
            <label>
              Skills (comma separated)
              <input
                name="skills"
                defaultValue={(profile?.skills || []).join(", ")}
                placeholder="React, Node.js, MongoDB"
              />
            </label>
            <label>
              Resume URL
              <input
                name="resume"
                defaultValue={profile?.resume || ""}
                placeholder="https://…"
              />
            </label>
            <label>
              LinkedIn URL
              <input
                name="linkedin"
                defaultValue={profile?.linkedin || ""}
                placeholder="https://linkedin.com/in/…"
              />
            </label>
            <label>
              GitHub URL
              <input
                name="github"
                defaultValue={profile?.github || ""}
                placeholder="https://github.com/…"
              />
            </label>
            <label className="span-2">
              Professional summary
              <textarea
                name="bio"
                rows="4"
                defaultValue={profile?.bio || ""}
                placeholder="Describe what you do and the work you want to do next…"
              />
            </label>
          </div>
        )}
        <div className="form-actions">
          <span className="form-hint">
            {current
              ? "Your profile is connected to your account."
              : "Complete these details to create your profile."}
          </span>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : current ? "Save changes" : "Create profile"}{" "}
            <span>→</span>
          </button>
        </div>
      </form>
    </div>
  );
}
