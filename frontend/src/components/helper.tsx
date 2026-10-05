import { useEffect, useState } from "react";
import { fetchEvent, type Event } from "../pages/EventPage/eventApi";

interface EventRequestState {
    eventId?: string;
    event: Event | null;
    error: string | null;
}

export function useFetchEvent(eventId?: string) {
    const [requestState, setRequestState] = useState<EventRequestState>({
        eventId: undefined,
        event: null,
        error: null,
    });

    useEffect(() => {
        if (!eventId) {
            return;
        }

        let cancelled = false;

        fetchEvent(eventId)
            .then((data: Event) => {
                if (!cancelled) {
                    setRequestState({ eventId, event: data, error: null });
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setRequestState({
                        eventId,
                        event: null,
                        error: 'Failed to fetch event details',
                    });
                }
            });

        return () => {
            cancelled = true;
        };
    }, [eventId]);

    if (!eventId) {
        return { event: null, error: 'Event not found', isLoading: false };
    }

    if (requestState.eventId !== eventId) {
        return { event: null, error: null, isLoading: true };
    }

    return {
        event: requestState.event,
        error: requestState.error,
        isLoading: false,
    };
}
