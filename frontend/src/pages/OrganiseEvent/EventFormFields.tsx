import type { EventFormData } from "./eventForm";
import EventLocationPicker from "./EventLocationPicker";

interface EventFormFieldsProps {
  idPrefix: string;
  value: EventFormData;
  onChange: (value: EventFormData) => void;
}

export default function EventFormFields({ idPrefix, value, onChange }: EventFormFieldsProps) {
  function updateField(field: keyof EventFormData, fieldValue: string) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <>
      <div className="form-field">
        <label htmlFor={`${idPrefix}-title`}>Title</label>
        <input
          id={`${idPrefix}-title`}
          value={value.title}
          onChange={(event) => updateField("title", event.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor={`${idPrefix}-category`}>Category</label>
          <input
            id={`${idPrefix}-category`}
            value={value.category}
            onChange={(event) => updateField("category", event.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor={`${idPrefix}-type`}>Event type</label>
          <input
            id={`${idPrefix}-type`}
            value={value.eventType}
            onChange={(event) => updateField("eventType", event.target.value)}
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor={`${idPrefix}-description`}>Description</label>
        <textarea
          id={`${idPrefix}-description`}
          value={value.description}
          onChange={(event) => updateField("description", event.target.value)}
          rows={4}
        />
      </div>

      <div className="form-field">
        <label htmlFor={`${idPrefix}-venue`}>Venue</label>
        <input
          id={`${idPrefix}-venue`}
          value={value.venue}
          onChange={(event) => updateField("venue", event.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor={`${idPrefix}-address`}>Address</label>
        <input
          id={`${idPrefix}-address`}
          value={value.address}
          onChange={(event) => updateField("address", event.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor={`${idPrefix}-city`}>City</label>
          <input
            id={`${idPrefix}-city`}
            value={value.city}
            onChange={(event) => updateField("city", event.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor={`${idPrefix}-country`}>Country</label>
          <input
            id={`${idPrefix}-country`}
            value={value.country}
            onChange={(event) => updateField("country", event.target.value)}
          />
        </div>
      </div>

      <EventLocationPicker
        idPrefix={idPrefix}
        address={[value.venue, value.address, value.city, value.country]
          .map((part) => part.trim())
          .filter(Boolean)
          .join(", ")}
        latitude={value.latitude}
        longitude={value.longitude}
        onLocationChange={({ latitude, longitude }) => onChange({ ...value, latitude, longitude })}
        onLocationSelect={({ address, city, country, latitude, longitude }) => onChange({
          ...value,
          address,
          city,
          country,
          latitude,
          longitude,
        })}
      />

      <div className="form-row">
        <div className="form-field">
          <label htmlFor={`${idPrefix}-start`}>Starts</label>
          <input
            id={`${idPrefix}-start`}
            type="datetime-local"
            value={value.startDateTime}
            onChange={(event) => updateField("startDateTime", event.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor={`${idPrefix}-end`}>Ends</label>
          <input
            id={`${idPrefix}-end`}
            type="datetime-local"
            value={value.endDateTime}
            onChange={(event) => updateField("endDateTime", event.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor={`${idPrefix}-capacity`}>Capacity</label>
        <input
          id={`${idPrefix}-capacity`}
          type="number"
          min="1"
          value={value.capacity}
          onChange={(event) => updateField("capacity", event.target.value)}
          required
        />
        <small className="field-hint">Total ticket quantity cannot exceed the event capacity.</small>
      </div>
    </>
  );
}
