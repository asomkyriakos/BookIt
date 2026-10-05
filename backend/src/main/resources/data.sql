-- Development seed data for BookingPage.
--
-- Spring Boot loads this file after Hibernate has created or updated the tables.
-- The inserts are safe to run more than once: existing primary keys are left
-- unchanged. To reload a completely clean dataset, run scripts/reset-data.sql
-- and then restart the backend.
--
-- All demo accounts use the password: password123

BEGIN;

-- Users

INSERT INTO users
    (id, first_name, last_name, email, password, phone_number, address, tin, role, status)
VALUES
    (
        1,
        'Admin',
        'User',
        'admin@example.com',
        '$2b$10$SIA5M4DVaChSpA7MHO2AEeWl/B8ZvKGsQw9VHgDlBCs80tCd.myDC',
        '+30 210 000 0001',
        '1 Admin Street, Athens',
        '100000001',
        'ADMIN',
        'APPROVED'
    ),
    (
        2,
        'Olivia',
        'Papadopoulos',
        'organizer@example.com',
        '$2b$10$SIA5M4DVaChSpA7MHO2AEeWl/B8ZvKGsQw9VHgDlBCs80tCd.myDC',
        '+30 210 000 0002',
        '25 Event Avenue, Athens',
        '100000002',
        'ORGANIZER',
        'APPROVED'
    ),
    (
        3,
        'Nikos',
        'Georgiou',
        'nikos@example.com',
        '$2b$10$SIA5M4DVaChSpA7MHO2AEeWl/B8ZvKGsQw9VHgDlBCs80tCd.myDC',
        '+30 210 000 0003',
        '9 Ermou Street, Athens',
        '100000003',
        'USER',
        'APPROVED'
    ),
    (
        4,
        'Maria',
        'Ioannou',
        'maria@example.com',
        '$2b$10$SIA5M4DVaChSpA7MHO2AEeWl/B8ZvKGsQw9VHgDlBCs80tCd.myDC',
        '+30 210 000 0004',
        '14 Tsimiski Street, Thessaloniki',
        '100000004',
        'USER',
        'PENDING'
    )
ON CONFLICT (id) DO NOTHING;

-- Events
--
-- Relative dates keep the events in the future whenever the clean dataset is
-- loaded. Restarting without a reset does not move existing event dates.

INSERT INTO events
    (
        id,
        title,
        category,
        event_type,
        venue,
        address,
        city,
        country,
        latitude,
        longitude,
        start_date_time,
        end_date_time,
        capacity,
        status,
        description,
        organizer_id
    )
VALUES
    (
        1,
        'Athens Tech Summit',
        'Technology',
        'Conference',
        'Megaron Athens International Conference Centre',
        'Vasilissis Sofias Avenue',
        'Athens',
        'Greece',
        37.9814,
        23.7548,
        (CURRENT_DATE + 30) + TIME '09:00',
        (CURRENT_DATE + 30) + TIME '18:00',
        350,
        'PUBLISHED',
        'A technology conference with talks, workshops and networking.',
        2
    ),
    (
        2,
        'Thessaloniki Food Walk',
        'Food',
        'Tour',
        'Modiano Market',
        'Vasileos Irakleiou 33',
        'Thessaloniki',
        'Greece',
        40.6359,
        22.9424,
        (CURRENT_DATE + 14) + TIME '18:30',
        (CURRENT_DATE + 14) + TIME '22:00',
        60,
        'PUBLISHED',
        'A guided tasting route through local food vendors.',
        2
    ),
    (
        3,
        'Online Product Design Workshop',
        'Design',
        'Workshop',
        'Online',
        'Remote',
        'Online',
        'Greece',
        NULL,
        NULL,
        (CURRENT_DATE + 45) + TIME '11:00',
        (CURRENT_DATE + 45) + TIME '15:00',
        120,
        'DRAFT',
        'An online workshop about product design and prototyping.',
        2
    )
ON CONFLICT (id) DO NOTHING;

-- Ticket types
--
-- Pending bookings reserve availability; cancelled bookings do not.

INSERT INTO ticket_types
    (id, name, price, quantity, available, event_id)
VALUES
    (1, 'General Admission', 49.00, 250, 248, 1),
    (2, 'Student',           19.00,  70,  69, 1),
    (3, 'VIP',              129.00,  30,  30, 1),
    (4, 'Standard Tasting',  35.00,  50,  48, 2),
    (5, 'Premium Tasting',   55.00,  10,  10, 2),
    (6, 'Remote Seat',       25.00, 120, 120, 3)
ON CONFLICT (id) DO NOTHING;

-- Bookings

INSERT INTO bookings
    (
        id,
        attendee_id,
        event_id,
        ticket_type_id,
        time,
        number_of_tickets,
        total_cost,
        booking_status
    )
VALUES
    (
        1,
        3,
        1,
        1,
        CURRENT_TIMESTAMP - INTERVAL '3 days',
        2,
        98.00,
        'CONFIRMED'
    ),
    (
        2,
        4,
        1,
        2,
        CURRENT_TIMESTAMP - INTERVAL '2 days',
        1,
        19.00,
        'PENDING'
    ),
    (
        3,
        3,
        2,
        4,
        CURRENT_TIMESTAMP - INTERVAL '1 day',
        2,
        70.00,
        'CONFIRMED'
    ),
    (
        4,
        4,
        2,
        5,
        CURRENT_TIMESTAMP - INTERVAL '12 hours',
        1,
        55.00,
        'CANCELLED'
    )
ON CONFLICT (id) DO NOTHING;

-- Advance each identity sequence beyond both the seed rows and any local rows.

SELECT setval(
    pg_get_serial_sequence('users', 'id'),
    COALESCE((SELECT MAX(id) FROM users), 1),
    true
);

SELECT setval(
    pg_get_serial_sequence('events', 'id'),
    COALESCE((SELECT MAX(id) FROM events), 1),
    true
);

SELECT setval(
    pg_get_serial_sequence('ticket_types', 'id'),
    COALESCE((SELECT MAX(id) FROM ticket_types), 1),
    true
);

SELECT setval(
    pg_get_serial_sequence('bookings', 'id'),
    COALESCE((SELECT MAX(id) FROM bookings), 1),
    true
);

COMMIT;
