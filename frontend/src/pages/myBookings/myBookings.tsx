import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchEvents, type Event } from "../EventPage/eventApi";
import { fetchBookings, type Booking } from "./bookingApi";
import { useAuth } from "../../Auth/useAuth";

interface BookingRow extends Booking {
  event: Event | null;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });
const currencyFormatter = new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR" });

function formatDate(value?: string) {
  if (!value) return "Unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unavailable" : dateFormatter.format(date);
}

export default function MyBookingsPage() {

  const { user } = useAuth();

  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([fetchBookings(controller.signal), fetchEvents(controller.signal)])
      .then(([bookingData, events]) => {
        const eventByTicketType = new Map<number, Event>();
        events.forEach((event) => event.ticketTypes.forEach((ticket) => eventByTicketType.set(ticket.id, event)));
        setBookings(bookingData.map((booking) => ({ ...booking, event: eventByTicketType.get(booking.ticketType.id) ?? null })));
      })
      .catch((loadError: unknown) => {
        if (!(loadError instanceof DOMException && loadError.name === "AbortError")) {
          setError(loadError instanceof Error ? loadError.message : "Could not load bookings.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <main className="page">
      <header className="page-header"><div><h1>My bookings</h1><p>Your ticket reservations.</p></div></header>
      {isLoading ? <p className="page-message">Loading bookings...</p> : null}
      {error ? <p className="page-message page-message--error" role="alert">{error}</p> : null}
      {!isLoading && !error && bookings.length === 0 ? (
        <section className="page-message"><p>No bookings yet.</p><Link className="button" to="/events">Browse events</Link></section>
      ) : null}
      {!isLoading && !error && bookings.length > 0 ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th scope="col">Event</th><th scope="col">Date</th><th scope="col">Ticket</th><th scope="col">Quantity</th><th scope="col">Total</th><th scope="col">Status</th></tr></thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <th scope="row">{booking.event ? <Link to={`/events/${booking.event.eventId}`}>{booking.event.title}</Link> : "Unavailable"}</th>
                  <td>{formatDate(booking.event?.startDateTime)}</td>
                  <td>{booking.ticketType.name}</td>
                  <td>{booking.numberOfTickets}</td>
                  <td>{currencyFormatter.format(booking.totalCost)}</td>
                  <td className={`status status--${booking.bookingStatus.toLowerCase()}`}>{booking.bookingStatus.toLowerCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {user?.role === "ORGANIZER" ? (
            <Link className="button button--primary" to="/organiserBookings">
              Requests
            </Link>
          ) : null}
        </div>
      ) : null}
    </main>
  );
}
