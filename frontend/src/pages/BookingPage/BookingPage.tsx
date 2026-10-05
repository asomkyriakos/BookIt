import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/Button";
import { useFetchEvent } from "../../components/helper";

export default function Booking() {
  const { eventId } = useParams<{ eventId: string }>();
  const { event, error: eventError, isLoading } = useFetchEvent(eventId);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<number | null>(null);
  const [numberOfTickets, setNumberOfTickets] = useState(0);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedType = event?.ticketTypes.find((type) => type.id === selectedTicketTypeId);
  const maximumTickets = Math.min(selectedType?.available ?? 0, 50);

  async function handleBook(submitEvent: FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();
    setMessage(null);

    if (!selectedType) {
      setMessage({ type: "error", text: "Please select a ticket type." });
      return;
    }
    if (numberOfTickets < 1 || numberOfTickets > selectedType.available) {
      setMessage({ type: "error", text: "Please select an available number of tickets." });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:8080/api/Booking/createBooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ eventId: event?.eventId, ticketTypeId: selectedType.id, numberOfTickets }),
      });

      if (!response.ok) throw new Error("Failed to create booking.");
      const booking = await response.json();
      setMessage({ type: "success", text: `Your booking is ${String(booking.bookingStatus).toLowerCase()}.` });
      setSelectedTicketTypeId(null);
      setNumberOfTickets(0);
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Something went wrong." });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <main className="page page--narrow"><p className="page-message">Loading event...</p></main>;
  if (eventError) return <main className="page page--narrow"><p className="page-message page-message--error">{eventError}</p></main>;
  if (!event) return <main className="page page--narrow"><p className="page-message">Event not found.</p></main>;

  return (
    <main className="page page--narrow">
      <header className="page-header">
        <div><h1>Book tickets</h1><p>{event.title}</p></div>
      </header>

      <form className="panel form" onSubmit={handleBook}>
        <div className="form-field">
          <label htmlFor="ticket-type">Ticket type</label>
          <select
            id="ticket-type"
            value={selectedTicketTypeId ?? ""}
            onChange={(changeEvent) => {
              setSelectedTicketTypeId(changeEvent.target.value ? Number(changeEvent.target.value) : null);
              setNumberOfTickets(0);
            }}
          >
            <option value="">Select a ticket</option>
            {event.ticketTypes.map((type) => (
              <option key={type.id} value={type.id} disabled={type.available === 0}>
                {type.name} — {Number(type.price).toFixed(2)} €
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="ticket-quantity">Quantity</label>
          <select
            id="ticket-quantity"
            value={numberOfTickets || ""}
            disabled={!selectedType}
            onChange={(changeEvent) => setNumberOfTickets(Number(changeEvent.target.value))}
          >
            <option value="">Select quantity</option>
            {Array.from({ length: maximumTickets }, (_, index) => (
              <option key={index + 1} value={index + 1}>{index + 1}</option>
            ))}
          </select>
        </div>

        {message ? (
          <p className={`page-message page-message--${message.type}`} role={message.type === "error" ? "alert" : undefined}>
            {message.text}
          </p>
        ) : null}

        <div className="page-actions">
          <Link className="button button--secondary" to={`/events/${eventId}`}>Cancel</Link>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Booking..." : "Confirm booking"}</Button>
        </div>
      </form>
    </main>
  );
}
