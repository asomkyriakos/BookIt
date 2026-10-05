export interface EventMedia {
  id: number;
  imageUrl: string;
}

export interface EventFormData {
  title: string;
  category: string;
  eventType: string;
  venue: string;
  address: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  startDateTime: string;
  endDateTime: string;
  capacity: string;
  description: string;
  media:EventMedia[];
}

export type EventStatus = "DRAFT" | "PUBLISHED" | "COMPLETED" | "CANCELLED";

export const emptyEventFormData: EventFormData = {
  title: "",
  category: "",
  eventType: "",
  venue: "",
  address: "",
  city: "",
  country: "",
  latitude: null,
  longitude: null,
  startDateTime: "",
  endDateTime: "",
  capacity: "1",
  description: "",
  media: []
};

export function getScheduleError(startDateTime: string, endDateTime: string) {
  if (new Date(endDateTime) <= new Date(startDateTime)) {
    return "End time must be after the start time.";
  }

  return null;
}
