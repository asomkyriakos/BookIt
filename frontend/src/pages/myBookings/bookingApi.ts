export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface Booking {
  id: number;
  time: string;
  numberOfTickets: number;
  totalCost: number;
  bookingStatus: BookingStatus;
  attendee: {
    id: number;
    firstName: string;
    lastName: string;
  };
  ticketType: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    available: number;
  };
}

export async function fetchBookings(signal?: AbortSignal): Promise<Booking[]> {
  const response = await fetch("http://localhost:8080/api/Booking/myBookings", {
    method: "GET",
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? "Please log in to view your bookings."
        : "Could not load your bookings."
    );
  }

  return response.json();
}

export async function fetchOrganiserBookings(signal?: AbortSignal): Promise<Booking[]> {
  const response = await fetch("http://localhost:8080/api/Booking/organiserBookings", {
    method: "GET",
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? "Please log in to view your event bookings."
        : "Could not load event bookings."
    );
  }

  return response.json();
}


export async function fetchBooking(id: string, signal?: AbortSignal): Promise<Booking> {
  const response = await fetch(`http://localhost:8080/api/Booking/${id}`, {
    method: "GET",
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    throw new Error("Could not load the booking.");
  }

  return response.json();
}

export async function updateBookingStatus(
  bookingId: number,
  bookingStatus: BookingStatus,
): Promise<Booking> {
  const response = await fetch(
    `http://localhost:8080/api/Booking/${bookingId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(bookingStatus),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update booking status");
  }

  return response.json() as Promise<Booking>;
}
