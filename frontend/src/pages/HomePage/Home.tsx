
import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/useAuth.ts";
import EventGridCard from "../EventPage/EventGridCard.tsx";
import type { Event } from "../EventPage/eventApi.ts";
import { fetchRecommendedEvents } from "./recommendationApi.ts";

export function Home() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Event[]>([]);
  const [recommendationsError, setRecommendationsError] = useState(false);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();
    fetchRecommendedEvents(controller.signal)
      .then(setRecommendations)
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setRecommendationsError(true);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setRecommendationsLoading(false);
        }
      });


    return () => controller.abort();
  }, [user]);

  

    return (
      <main className="page page--narrow">
        <section><h1> Welcome {user?.role.toLowerCase()} ,{user?.firstName} {user?.lastName}</h1></section>
        <section
          className="recommendations"
          aria-labelledby="recommendations-title"
        >
          <h2 id="recommendations-title">Recommended for you</h2>

          {recommendationsLoading ? (
            <p className="muted" aria-live="polite">
              Loading recommendations...
            </p>
          ) : recommendationsError ? (
            <p className="muted" role="alert">
              Recommendations are not available right now. You can still browse all events.
            </p>
          ) : recommendations.length > 0 ? (
            <div className="event-grid">
              {recommendations.map((event) => (
                <EventGridCard
                  key={event.eventId}
                  event={event}
                />
              ))}
            </div>
          ) : (
            <p className="muted">
              No personalised recommendations are available yet.
            </p>
          )}
        </section>
      </main>);
  }