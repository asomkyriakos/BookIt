import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import EventFormFields from "../EventFormFields";
import {
  emptyEventFormData,
  getScheduleError,
  type EventFormData,
  type EventStatus,
} from "../eventForm";

interface TicketDraft {
  key: string;
  name: string;
  price: string;
  quantity: string;
}

type TicketField = "name" | "price" | "quantity";

function createTicketDraft(): TicketDraft {
  return {
    key: crypto.randomUUID(),
    name: "",
    price: "0",
    quantity: "1",
  };
}

export default function CreateEvent() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [submittingStatus, setSubmittingStatus] =
    useState<EventStatus | null>(null);

  const [eventData, setEventData] =
    useState<EventFormData>(() => ({ ...emptyEventFormData }));

  const [ticketTypes, setTicketTypes] =
    useState<TicketDraft[]>(() => [createTicketDraft()]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  function addTicketType() {
    setTicketTypes((current) => [
      ...current,
      createTicketDraft(),
    ]);
  }

  function updateTicketType(
    index: number,
    field: TicketField,
    value: string
  ) {
    setTicketTypes((current) =>
      current.map((ticket, ticketIndex) =>
        ticketIndex === index
          ? { ...ticket, [field]: value }
          : ticket
      )
    );
  }

  function removeTicketType(index: number) {
    setTicketTypes((current) =>
      current.filter(
        (_, ticketIndex) => ticketIndex !== index
      )
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");

    const scheduleError = getScheduleError(
      eventData.startDateTime,
      eventData.endDateTime
    );

    if (scheduleError) {
      setMessage(scheduleError);
      return;
    }

    const capacity = Number(eventData.capacity);

    const totalTickets = ticketTypes.reduce(
      (sum, ticket) => sum + Number(ticket.quantity),
      0
    );

    if (totalTickets > capacity) {
      setMessage(
        "Total ticket quantity cannot exceed event capacity."
      );
      return;
    }

    const submitter = (
      event.nativeEvent as SubmitEvent
    ).submitter as HTMLButtonElement | null;

    const status: EventStatus =
      submitter?.value === "PUBLISHED"
        ? "PUBLISHED"
        : "DRAFT";

    const data = {
      ...eventData,
      capacity,
      status,

      ticketTypes: ticketTypes.map(
        ({ name, price, quantity }) => ({
          name,
          price: Number(price),
          quantity: Number(quantity),
        })
      ),
    };

    try {
      setSubmittingStatus(status);

      
      const formData = new FormData();

      
      formData.append(
        "event",
        new Blob(
          [JSON.stringify(data)],
          {
            type: "application/json",
          }
        )
      );

      
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(
        "http://localhost:8080/api/events/createEvent",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create event.");
      }

      navigate("/events");

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not create event."
      );
    } finally {
      setSubmittingStatus(null);
    }
  }

  return (
    <main className="page page--narrow">

      <header className="page-header">
        <div>
          <h1>Create event</h1>
          <p>Enter the event and ticket details.</p>
        </div>
      </header>

      <form
        className="panel form"
        onSubmit={handleSubmit}
      >

        <EventFormFields
          idPrefix="event"
          value={eventData}
          onChange={setEventData}
        />

        {/* Event images */}
        <div className="form-field">
          <label htmlFor="event-images">
            Event images
          </label>

          <input
            id="event-images"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={(event) =>
              setSelectedFiles(
                event.target.files
                  ? Array.from(event.target.files)
                  : []
              )
            }
          />
        </div>

        <fieldset>
          <legend>Ticket types</legend>

          {ticketTypes.map((ticket, index) => (
            <div
              className="ticket-form"
              key={ticket.key}
            >

              <div className="form-field">
                <label htmlFor={`ticket-name-${index}`}>
                  Name
                </label>

                <input
                  id={`ticket-name-${index}`}
                  value={ticket.name}
                  onChange={(event) =>
                    updateTicketType(
                      index,
                      "name",
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor={`ticket-price-${index}`}>
                  Price (€)
                </label>

                <input
                  id={`ticket-price-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={ticket.price}
                  onChange={(event) =>
                    updateTicketType(
                      index,
                      "price",
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor={`ticket-quantity-${index}`}>
                  Quantity
                </label>

                <input
                  id={`ticket-quantity-${index}`}
                  type="number"
                  min="1"
                  value={ticket.quantity}
                  onChange={(event) =>
                    updateTicketType(
                      index,
                      "quantity",
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              {ticketTypes.length > 1 ? (
                <Button
                  variant="secondary"
                  onClick={() =>
                    removeTicketType(index)
                  }
                >
                  Remove
                </Button>
              ) : null}

            </div>
          ))}

          <Button
            variant="secondary"
            onClick={addTicketType}
          >
            Add ticket type
          </Button>

        </fieldset>

        {message ? (
          <p
            className="page-message page-message--error"
            role="alert"
          >
            {message}
          </p>
        ) : null}

        <div className="page-actions">

          <Link
            className="button button--secondary"
            to="/events"
          >
            Cancel
          </Link>

          <Button
            type="submit"
            variant="secondary"
            value="DRAFT"
            disabled={submittingStatus !== null}
          >
            {submittingStatus === "DRAFT"
              ? "Saving..."
              : "Save as draft"}
          </Button>

          <Button
            type="submit"
            value="PUBLISHED"
            disabled={submittingStatus !== null}
          >
            {submittingStatus === "PUBLISHED"
              ? "Publishing..."
              : "Publish"}
          </Button>

        </div>

      </form>
    </main>
  );
}