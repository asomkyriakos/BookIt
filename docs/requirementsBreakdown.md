# Requirements Breakdown

## Project Goal
Development of a web application for event management and electronic ticket reservations.

## Core Functional Areas

### 1. Authentication
The system must allow users to:
- register
- log in
- access the application securely

A newly registered user should remain pending until approved by the administrator.

### 2. User Management
The administrator must be able to:
- view the list of users
- inspect user details
- approve or reject registration requests

### 3. Event Management
An organizer must be able to:
- create a new event
- edit event details
- publish an event
- cancel an event
- delete an event under allowed conditions

### 4. Ticket Management
For each event, the organizer must define:
- total event capacity
- one or more ticket types
- quantity and price per ticket type

The system must ensure that ticket quantities do not exceed event capacity.

### 5. Event Search and Browsing
Users and visitors must be able to:
- browse events
- search by category
- search by title
- search by description
- filter by date range
- filter by ticket price
- filter by location

### 6. Booking System
A participant must be able to:
- view event details
- choose a ticket type
- select number of tickets
- submit a booking

The system must check:
- ticket availability
- event status
- total capacity constraints

### 7. Messaging
After a booking, organizer and participant must be able to:
- exchange messages
- view inbox/sent messages
- detect unread messages
- delete messages

### 8. Export
The administrator must be able to export events in:
- XML
- JSON

### 9. Recommendation System
The application must provide event recommendations based on:
- booking history
- viewed events

The recommendation algorithm must use Biased Matrix Factorization.