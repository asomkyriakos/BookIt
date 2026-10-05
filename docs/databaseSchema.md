# Database Schema (Draft)

This document describes the initial relational database schema for the Event Booking Platform.

The goal of the schema is to support:

- user registration and approval
- event creation and management
- ticket types and event capacity
- booking system
- messaging between users
- event recommendations
- event media storage

---

# Tables

## 1. users

Stores all registered users of the platform.

Columns:

- id (PK)
- username (unique)
- password_hash
- first_name
- last_name
- email
- phone
- address
- city
- country
- latitude
- longitude
- afm
- role
- status
- created_at

Notes:

role can be:
- PARTICIPANT
- ORGANIZER
- ADMIN

status can be:
- PENDING
- APPROVED
- REJECTED

---

## 2. events

Stores events created by organizers.

Columns:

- id (PK)
- organizer_id (FK → users.id)
- title
- description
- venue
- address
- city
- country
- latitude
- longitude
- capacity
- start_datetime
- end_datetime
- status
- created_at
- updated_at

Notes:

status can be:
- DRAFT
- PUBLISHED
- CANCELLED

---

## 3. ticket_types

Defines ticket categories for each event.

Columns:

- id (PK)
- event_id (FK → events.id)
- name
- price
- quantity
- available

Example ticket types:

- General Admission
- Student Ticket
- VIP Ticket

---

## 4. bookings

Stores ticket reservations made by participants.

Columns:

- id (PK)
- event_id (FK → events.id)
- user_id (FK → users.id)
- ticket_type_id (FK → ticket_types.id)
- quantity
- total_price
- booking_status
- created_at

booking_status can be:
- CONFIRMED
- CANCELLED


---

## 5. messages

Stores messages between organizers and participants.

Columns:

- id (PK)
- sender_id (FK → users.id)
- receiver_id (FK → users.id)
- event_id (FK → events.id)
- subject
- body
- is_read
- sender_deleted
- receiver_deleted
- created_at

---

## 6. event_media

Stores images related to events.

Columns:

- id (PK)
- event_id (FK → events.id)
- media_url


---

## 7. event_views

Stores events viewed by users.

Columns:

- id (PK)
- user_id (FK → users.id)
- event_id (FK → events.id)
- viewed_at