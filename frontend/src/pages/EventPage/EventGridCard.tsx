import { Link } from "react-router-dom";
import type { Event } from "./eventApi";

export default function EventGridCard({ event }: { event: Event }) {
  const eventType = [event.category, event.eventType].filter(Boolean).join(" · ");
  const location = [event.venue, event.city].filter(Boolean).join(" · ");
  const statusLabel = event.status && event.status !== "PUBLISHED"
    ? event.status.toLowerCase()
    : null;

  return (
    <Link className="event-card" to={`/events/${event.eventId}`}>
      <h2>{event.title}</h2>
      {event.media?.length > 0 ? (
          <section className="event-images">
            {event.media.map((media) => (
              <img
                key={media.id}
                src={`http://localhost:8080${media.imageUrl}`}
                alt={event.title}
                className="event-cover"
              />
            ))}
            </section>):null}
      {location ? <p>{location}</p> : null}
      {eventType ? <p className="event-card__type">{eventType}</p> : null}
      <time dateTime={event.startDateTime}>
        {new Date(event.startDateTime).toLocaleString("en-GB")}
      </time>
      {statusLabel ? <span className="event-card__status">{statusLabel}</span> : null}
    </Link>
  );
}
