import { useEffect, useState } from "react";
import EventGridCard from "./EventGridCard";
import { fetchEvents, type Event } from "./eventApi";

function normalizeText(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function matchesSearch(searchText: string, event: Event) {
  const terms = normalizeText(searchText).split(" ").filter(Boolean);
  const fields = [
    event.title,
    event.venue,
    event.city,
    event.category,
    event.eventType,
  ].filter((field): field is string => Boolean(field)).map(normalizeText);
  return terms.every((term) => fields.some((field) => field.includes(term)));
}

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetchEvents(controller.signal)
      .then(setEvents)
      .catch((loadError: unknown) => {
        if (!(loadError instanceof DOMException && loadError.name === "AbortError")) {
          setError("Could not load events.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const visibleEvents = search
    ? events.filter((event) => matchesSearch(search, event))
    : events;

  return (
    <>
      <div className="form-field search-form">
        <label htmlFor="event-search">Search events</label>
        <input
          id="event-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {isLoading ? <p className="page-message" aria-live="polite">Loading events...</p> : null}
      {error ? <p className="page-message page-message--error" role="alert">{error}</p> : null}
      {!isLoading && !error && visibleEvents.length === 0 ? <p className="page-message">No events found.</p> : null}
      {!isLoading && !error && visibleEvents.length > 0 ? (
        <div className="event-grid">
          {visibleEvents.map((event) => <EventGridCard key={event.eventId} event={event} />)}
        </div>
      ) : null}
    </>
  );
}
