import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../../components/Button";
import { fetchEvent } from "../../EventPage/eventApi";
import EventFormFields from "../EventFormFields";
import {
  emptyEventFormData,
  getScheduleError,
  type EventFormData,
  type EventStatus,
} from "../eventForm";

interface Feedback {
  text: string;
  type: "error" | "success";
}

function toDateTimeInput(value?: string | null) {
  return value ? value.slice(0, 16) : "";
}

export default function EditEvent() {
  const { eventId } = useParams();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventData, setEventData] = useState<EventFormData>(() => ({ ...emptyEventFormData }));
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<EventStatus>("DRAFT");

  useEffect(() => {
    const controller = new AbortController();

    if (!eventId) {
      setFeedback({ text: "Could not load event.", type: "error" });
      setIsLoading(false);
      return () => controller.abort();
    }

    fetchEvent(eventId, controller.signal)
      .then((data) => {
        setEventData({
          title: data.title ?? "",
          category: data.category ?? "",
          eventType: data.eventType ?? "",
          venue: data.venue ?? "",
          address: data.address ?? "",
          city: data.city ?? "",
          country: data.country ?? "",
          latitude: data.geoLocation?.latitude ?? null,
          longitude: data.geoLocation?.longitude ?? null,
          startDateTime: toDateTimeInput(data.startDateTime),
          endDateTime: toDateTimeInput(data.endDateTime),
          capacity: String(data.capacity ?? 1),
          description: data.description ?? "",
          media: data.media ?? []


        });
        setStatus((data.status as EventStatus | undefined) ?? "DRAFT");
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setFeedback({ text: "Could not load event.", type: "error" });
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [eventId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const scheduleError = getScheduleError(eventData.startDateTime, eventData.endDateTime);
    if (scheduleError) {
      setFeedback({ text: scheduleError, type: "error" });
      return;
    }

    setIsSubmitting(true);

    try {

      const formData = new FormData();
      const eventToUpdate = {
        id: Number(eventId),
        ...eventData,
        status,
      };

      formData.append(
        "event",
        new Blob(
          [JSON.stringify(eventToUpdate)],
          {
            type: "application/json",
          }
        )
      );

      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
      const response = await fetch("http://localhost:8080/api/events/editEvent", {
        method: "PATCH",
        credentials: "include",
        body: formData
      });

      if (!response.ok) throw new Error("Failed to update event.");
      setFeedback({ text: "Event updated successfully.", type: "success" });
    } catch (error) {
      setFeedback({
        text: error instanceof Error ? error.message : "Could not update event.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <main className="page page--narrow"><p className="page-message">Loading event...</p></main>;

  return (
    <main className="page page--narrow">
      <header className="page-header"><div><h1>Edit event</h1></div></header>
      <form className="panel form" onSubmit={handleSubmit}>
        <EventFormFields idPrefix="edit" value={eventData} onChange={setEventData} />
        <div className="form-field">
          <label htmlFor="edit-status">Status</label>
          <select id="edit-status" value={status} onChange={(event) => setStatus(event.target.value as EventStatus)}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="edit-images">Event images</label>

          <input
            id="edit-images"
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
        {feedback ? <p className={`page-message page-message--${feedback.type}`} role="status">{feedback.text}</p> : null}
        <div className="page-actions"><Link className="button button--secondary" to={`/events/${eventId}`}>Cancel</Link><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save changes"}</Button></div>
      </form>
    </main>
  );
}
