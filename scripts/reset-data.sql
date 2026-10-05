-- Manually reset the local BookingPage development data.
--
-- This is destructive. Run it only against the local development database,
-- then restart the backend so Spring Boot reloads data.sql.

BEGIN;

TRUNCATE TABLE
    bookings,
    ticket_types,
    events,
    users
RESTART IDENTITY CASCADE;

COMMIT;
