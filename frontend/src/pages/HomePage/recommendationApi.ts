import { fetchEvents, type Event } from "../EventPage/eventApi";

interface RecommendedEvent {
  eventId: number;
  title:string;
  score: number;
}



export async function fetchRecommendedEvents(signal?: AbortSignal): Promise<Event[]> {
  const response = await fetch('http://localhost:8080/api/recommendation/recommendations', {
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    throw new Error("Could not load event recommendations");
  }

  const recommendations = await response.json() as RecommendedEvent[];
  const events = await fetchEvents(signal);
  const eventsById = new Map(events.map((event) => [event.eventId, event]));

  return recommendations
    .map((recommendation) => eventsById.get(String(recommendation.eventId)))
    .filter((event): event is Event => event !== undefined);
}