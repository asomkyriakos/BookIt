# Roles and Flows

## 1. Visitor
### Permissions
- browse events
- search events
- view event details

### Restrictions
- cannot submit bookings
- cannot send messages
- cannot manage events

### Basic Flow
Welcome Page
-> Browse/Search Events
-> View Event Details
-> Login/Register if booking is needed

---

## 2. Participant
### Permissions
- browse/search events
- view event details
- submit bookings
- view own bookings
- send/receive messages

### Restrictions
- cannot create events
- cannot approve users
- cannot export data

### Basic Flow
Login
-> Search Events
-> View Event Details
-> Select Ticket Type
-> Submit Booking
-> View My Bookings
-> Use Messaging

---

## 3. Organizer
### Permissions
- create events
- edit events
- publish events
- cancel events
- delete events when allowed
- view bookings for owned events
- send messages to participants

### Restrictions
- cannot approve users
- cannot manage all users globally
- cannot export all event data as admin

### Basic Flow
Login
-> Create Event
-> Define Ticket Types
-> Publish Event
-> View Event Bookings
-> Manage Events
-> Send Messages

---

## 4. Admin
### Permissions
- view all users
- inspect user details
- approve registration requests
- reject registration requests
- export events in XML/JSON

### Restrictions
- not responsible for booking as organizer workflow
- does not act as normal participant for business logic

### Basic Flow
Login
-> View User List
-> Inspect User Details
-> Approve/Reject Registrations
-> Export Events