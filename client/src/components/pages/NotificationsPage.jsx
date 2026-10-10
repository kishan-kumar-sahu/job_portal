import { idOf } from "../../utils/ui.js";
import { SectionHeader, EmptyBlock } from "../shared/PagePrimitives.jsx";

export default function NotificationsPage({ items, onRead, onReadAll }) {
  return (
    <div className="section-page">
      <SectionHeader
        eyebrow="STAY IN THE LOOP"
        title="Notifications"
        description="The updates that matter, all in one place."
        action={
          <button className="btn btn-outline" onClick={onReadAll}>
            ✓ Mark all as read
          </button>
        }
      />
      <div className="notification-list">
        {items.map((item) => (
          <article
            className={`notification-card ${item.isRead ? "read" : ""}`}
            key={idOf(item)}
          >
            <span className={`notification-symbol ${item.type}`}>
              {item.type === "interview"
                ? "◷"
                : item.type === "application"
                  ? "▤"
                  : "✦"}
            </span>
            <div className="notification-copy">
              <h3>{item.title}</h3>
              <p>{item.message}</p>
              <small>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString()
                  : "Recently"}
              </small>
            </div>
            {!item.isRead && (
              <button className="text-button" onClick={() => onRead(item)}>
                Mark read
              </button>
            )}
          </article>
        ))}
        {!items.length && (
          <EmptyBlock
            icon="♧"
            title="All quiet here"
            text="You’ll see application updates, interview alerts, and other important messages here."
          />
        )}
      </div>
    </div>
  );
}
