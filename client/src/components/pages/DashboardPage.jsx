import { idOf } from "../../utils/ui.js";

export default function Dashboard({
  role,
  user,
  jobs,
  applications,
  interviews,
  notifications,
  savedJobs = [],
  profile,
  onNavigate,
  onRefresh,
}) {
  const candidate = role !== "recruiter";
  const unread = notifications.filter((n) => !n.isRead).length;
  const profileFields = [
    profile?.phone,
    profile?.location,
    profile?.bio,
    profile?.skills?.length,
    profile?.resume,
    profile?.linkedin,
    profile?.github,
  ];
  const profileStrength = profile
    ? Math.round(
        (profileFields.filter(Boolean).length / profileFields.length) * 100,
      )
    : 0;
  const cards = candidate
    ? [
        {
          label: "Applications sent",
          value: applications.length,
          icon: "▤",
          color: "lavender",
          change: "Your journey in motion",
        },
        {
          label: "Interviews",
          value: interviews.length,
          icon: "◷",
          color: "mint",
          change: "Keep your calendar ready",
        },
        {
          label: "Saved opportunities",
          value: savedJobs.length,
          icon: "♡",
          color: "peach",
          change: "Your shortlisted roles",
        },
        {
          label: "Profile strength",
          value: `${profileStrength}%`,
          icon: "◉",
          color: "blue",
          change:
            profileStrength >= 80
              ? "Profile looking strong"
              : "Add details to stand out",
        },
      ]
    : [
        {
          label: "Active job posts",
          value: jobs.filter((j) => j.status === "published").length,
          icon: "▤",
          color: "lavender",
          change: "Visible to candidates",
        },
        {
          label: "Total job posts",
          value: jobs.length,
          icon: "✦",
          color: "mint",
          change: "Across your workspace",
        },
        {
          label: "Interviews",
          value: interviews.length,
          icon: "◷",
          color: "peach",
          change: "Upcoming conversations",
        },
        {
          label: "Unread alerts",
          value: unread,
          icon: "♧",
          color: "blue",
          change: "Stay in the loop",
        },
      ];
  return (
    <div className="dashboard-page">
      <section className="welcome-row">
        <div>
          <div className="eyebrow eyebrow-dark">
            <span className="eyebrow-dot" /> YOUR WORKSPACE
          </div>
          <h1>
            Good afternoon, {user?.name?.split(" ")[0] || "there"}{" "}
            <span className="wave">✦</span>
          </h1>
          <p>
            {candidate
              ? "Your next opportunity is out there. Let’s make today count."
              : "A great hire starts with a great experience. Let’s get moving."}
          </p>
        </div>
        <button className="btn btn-outline" onClick={onRefresh}>
          ↻ Refresh data
        </button>
      </section>
      <section className="hero-banner">
        <div className="hero-banner-copy">
          <div className="banner-kicker">
            <span>✦</span>{" "}
            {candidate ? "YOUR NEXT CHAPTER" : "HIRING, MADE HUMAN"}
          </div>
          <h2>
            {candidate ? (
              <>
                Your potential deserves
                <br />
                the <em>right opportunity.</em>
              </>
            ) : (
              <>
                Meet the people who
                <br />
                will <em>move you forward.</em>
              </>
            )}
          </h2>
          <p>
            {candidate
              ? "Discover meaningful roles and get AI-powered feedback on your resume."
              : "Create a role, build your pipeline, and make every candidate interaction count."}
          </p>
          <div className="hero-actions">
            <button
              className="btn btn-white"
              onClick={() =>
                onNavigate(candidate ? "Explore jobs" : "Post a job")
              }
            >
              {candidate ? "Explore open roles" : "Post a new job"}{" "}
              <span>↗</span>
            </button>
            <button
              className="text-button light-text"
              onClick={() =>
                onNavigate(candidate ? "Resume AI" : "Manage jobs")
              }
            >
              {candidate ? "Improve my resume" : "Manage listings"}{" "}
              <span>→</span>
            </button>
          </div>
        </div>
        <div className="hero-art">
          <div className="orbit-ring ring-a" />
          <div className="orbit-ring ring-b" />
          <div className="hero-star">✦</div>
          <div className="hero-card hero-card-top">
            <span className="mini-icon">↗</span>
            <div>
              <strong>
                {candidate ? "New possibilities" : "Pipeline health"}
              </strong>
              <small>
                {candidate
                  ? "A fresh start, every day"
                  : "Your hiring, at a glance"}
              </small>
            </div>
          </div>
          <div className="hero-card hero-card-bottom">
            <div className="avatar mini-avatar">OH</div>
            <div>
              <strong>
                {candidate ? "Career momentum" : "Better matches"}
              </strong>
              <small>
                {candidate ? "One step at a time" : "Quality over quantity"}
              </small>
            </div>
            <span className="green-check">✓</span>
          </div>
        </div>
      </section>
      <section className="metric-grid">
        {cards.map((card) => (
          <div className="metric-card" key={card.label}>
            <div className="metric-top">
              <span>{card.label}</span>
              <span className={`metric-icon ${card.color}`}>{card.icon}</span>
            </div>
            <strong className="metric-value">{card.value}</strong>
            <div className="metric-foot">
              <span className="metric-dot" />
              {card.change}
            </div>
          </div>
        ))}
      </section>
      <section className="dashboard-columns">
        <div className="panel recent-panel">
          <div className="panel-heading">
            <div>
              <h3>
                {candidate ? "Recommended next steps" : "Hiring shortcuts"}
              </h3>
              <p>
                {candidate
                  ? "Small actions that build momentum."
                  : "Get the basics in place, then scale up."}
              </p>
            </div>
            <span className="panel-icon">✦</span>
          </div>
          <div className="action-list">
            {(candidate
              ? [
                  [
                    "01",
                    "Explore roles that fit you",
                    "Browse opportunities based on your interests.",
                    "Explore jobs",
                    "↗",
                  ],
                  [
                    "02",
                    "Get resume feedback",
                    "Understand your strengths and skill gaps.",
                    "Resume AI",
                    "✦",
                  ],
                  [
                    "03",
                    "Keep your profile current",
                    "Help recruiters get to know you.",
                    "My profile",
                    "→",
                  ],
                ]
              : [
                  [
                    "01",
                    "Create your first listing",
                    "Tell candidates what makes this role special.",
                    "Post a job",
                    "+",
                  ],
                  [
                    "02",
                    "Review your job listings",
                    "Keep your openings clear and up to date.",
                    "Manage jobs",
                    "→",
                  ],
                  [
                    "03",
                    "Check your interview calendar",
                    "Keep candidate conversations on track.",
                    "Interviews",
                    "◷",
                  ],
                ]
            ).map(([n, title, desc, action, icon]) => (
              <button
                className="action-row"
                key={n}
                onClick={() => onNavigate(action)}
              >
                <span className="action-number">{n}</span>
                <span className="action-copy">
                  <strong>{title}</strong>
                  <small>{desc}</small>
                </span>
                <span className="action-arrow">{icon}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <h3>Recent activity</h3>
              <p>A little progress goes a long way.</p>
            </div>
            <button
              className="tiny-link"
              onClick={() => onNavigate("Notifications")}
            >
              View all →
            </button>
          </div>
          {notifications.length ? (
            <div className="activity-list">
              {notifications.slice(0, 4).map((n) => (
                <div className="activity-item" key={idOf(n)}>
                  <span
                    className={`activity-icon ${n.isRead ? "" : "activity-unread"}`}
                  >
                    {n.type === "interview"
                      ? "◷"
                      : n.type === "application"
                        ? "▤"
                        : "✦"}
                  </span>
                  <div>
                    <strong>{n.title}</strong>
                    <p>{n.message}</p>
                    <small>
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleDateString()
                        : "Recently"}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state compact">
              <span className="empty-illustration">✦</span>
              <strong>Nothing new just yet</strong>
              <p>Your important updates will show up here.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
