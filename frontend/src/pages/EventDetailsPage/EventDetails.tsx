import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../Auth/useAuth";
import { useFetchEvent } from "../../components/helper";
import EventMap from "../../OpenStreetMap/loadMap";

import DeleteButton from "../OrganiseEvent/DeleteEvent/DeleteButton";

export default function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const { event, error, isLoading } = useFetchEvent(eventId);
  const currentUserId = user?.id;
  const loadedEventId = event?.eventId;

  useEffect(() => {
    if (!currentUserId || !loadedEventId) return;

    const controller = new AbortController();
    

    return () => controller.abort();
  }, [currentUserId, loadedEventId]);

  if (isLoading) return <main className="page"><p className="page-message">Loading event...</p></main>;
  if (error) return <main className="page"><p className="page-message page-message--error">{error}</p></main>;
  if (!event) return <main className="page"><p className="page-message">Event not found.</p></main>;

  const canManage = (user?.role === "ORGANIZER" && user?.id === event.organizer?.id) || user?.role === "ADMIN";
  const eventType = [event.category, event.eventType].filter(Boolean).join(" · ");
  const cityAndCountry = [event.city, event.country].filter(Boolean).join(", ");
  const statusLabel = event.status && event.status !== "PUBLISHED"
    ? event.status.toLowerCase()
    : null;

  const organizerFullName = event.organizer ? [
    event.organizer?.firstName,
    event.organizer?.lastName,
  ].filter(Boolean).join(" ") : undefined;




  return (
    <main className="page page--narrow">
      <header className="page-header">
        <div>
          <h1>{event.title}</h1>
          {eventType ? <p>{eventType}</p> : null}
        </div>
      </header>

      <article className="panel event-details">
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
          </section>
        ) : null}
        <dl className="details-list">
          <div><dt>Organizer</dt><dd>{organizerFullName ?? "Not specified"}</dd></div>
          {event.venue ? <div><dt>Venue</dt><dd>{event.venue}</dd></div> : null}
          {event.address ? <div><dt>Address</dt><dd>{event.address}</dd></div> : null}
          {cityAndCountry ? <div><dt>City and country</dt><dd>{cityAndCountry}</dd></div> : null}
          <div><dt>Starts</dt><dd>{new Date(event.startDateTime).toLocaleString("en-GB")}</dd></div>
          <div><dt>Ends</dt><dd>{new Date(event.endDateTime).toLocaleString("en-GB")}</dd></div>
          {statusLabel ? <div><dt>Status</dt><dd className="event-status">{statusLabel}</dd></div> : null}
        </dl>

        {event.description ? <section><h2>About</h2><p>{event.description}</p></section> : null}

        <section>
          <h2>Tickets</h2>
          {event.ticketTypes.length > 0 ? (
            <ul className="ticket-list">
              {event.ticketTypes.map((ticketType) => (
                <li key={ticketType.id}>
                  {ticketType.name}: {Number(ticketType.price).toFixed(2)} € ({ticketType.available} available)
                </li>
              ))}
            </ul>
          ) : <p>No tickets available.</p>}
        </section>

        {event.geoLocation ? (
          <EventMap latitude={event.geoLocation.latitude} longitude={event.geoLocation.longitude} title={event.venue ?? ''} />
        ) : null}

        <div className="page-actions">
          <Link className="button button--secondary" to="/events">Back to events</Link>
          <Link className="button" to={`/booking/${event.eventId}`}>Book tickets</Link>
          {canManage ? (
            <>
              <Link className="button button--secondary" to={`/editEvent/${event.eventId}`}>Edit event</Link>
              <DeleteButton eventId={event.eventId} />
            </>
          ) : null}
        </div>
      </article>
    </main>
  );
}
