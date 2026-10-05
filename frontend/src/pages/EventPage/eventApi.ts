export interface Event {
  eventId: string;
  title: string;
  category: string;
  eventType: string;
  venue?: string;
  address: string;
  city?: string;
  country?: string;
  geoLocation: { latitude: number; longitude: number } | null;
  startDateTime: string;
  endDateTime: string;
  capacity: number;
  ticketTypes: TicketType[];
  status?: string;
  description?: string;
  organizer?:  {firstName: string; lastName:string; id:number;}
  media: Media[];

}

interface TicketType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  available: number;
}



interface Media{
  id:number;
  imageUrl: string;
}

interface BackendEvent {
  id: number;
  title: string;
  category: string;
  eventType: string;
  venue?: string;
  address: string;
  city?: string;
  country?: string;
  latitude: number | null;
  longitude: number | null;
  startDateTime: string;
  endDateTime: string;
  capacity: number;
  status?: string;
  description?: string;
  organizer?: {
    firstName?: string;
    lastName?: string;
    id?: number;
  } | null;
  ticketTypes?: TicketType[];
  media:Media[]
}


function toEvent(event: BackendEvent): Event {

  const hasCoordinates = typeof event.latitude === "number"
    && typeof event.longitude === "number";

  return {
    eventId: String(event.id),
    title: event.title,
    category: event.category,
    eventType: event.eventType,
    venue: event.venue,
    address: event.address,
    city: event.city,
    country: event.country,
    geoLocation: hasCoordinates
      ? { latitude: event.latitude as number, longitude: event.longitude as number }
      : null,
    startDateTime: event.startDateTime,
    endDateTime: event.endDateTime,
    capacity: event.capacity,
    status: event.status,
    description: event.description,
    organizer: event.organizer ? {
      firstName:event.organizer?.firstName as string,
      lastName:event.organizer?.lastName as string,
      id:event.organizer?.id as number} : undefined ,
    ticketTypes: event.ticketTypes ?? [],
    media:event.media
  };
}

async function fetchJson<T>(
  url: string,
  signal?: AbortSignal
): Promise<T> {
  const response = await fetch(url, {
    signal,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

export async function fetchEvents(
  signal?: AbortSignal
): Promise<Event[]> {
  const events = await fetchJson<BackendEvent[]>(
    "http://localhost:8080/api/events",
    signal
  );

  return events.map(toEvent);
}

export async function fetchEvent(
  eventId: string,
  signal?: AbortSignal
): Promise<Event> {
  const event = await fetchJson<BackendEvent>(
    `http://localhost:8080/api/events/${eventId}`,
    signal
  );

  return toEvent(event);
}