export function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="section-header">
      <div>
        <div className="eyebrow eyebrow-dark">
          <span className="eyebrow-dot" /> {eyebrow}
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <div className="section-header-action">{action}</div>}
    </div>
  );
}

export function EmptyBlock({ icon, title, text, action }) {
  return (
    <div className="panel empty-state">
      <span className="empty-illustration">{icon}</span>
      <strong>{title}</strong>
      <p>{text}</p>
      {action}
    </div>
  );
}
