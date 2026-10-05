
# Entities Draft

User
- id: Long
- username: String (unique)
- passwordHash: String
- firstName: String
- lastName: String
- email: String
- phone: String
- address: String
- city: String
- country: String
- latitude: Double
- longitude: Double
- afm: String
- role: Role
- status: UserStatus
- createdAt: LocalDateTime

User Entity Design

Fields:
- id (PK)
- username (unique, required)
- passwordHash (required)
- firstName (required)
- lastName (required)
- email (required)
- phone
- address
- city
- country
- latitude
- longitude
- afm
- role (enum)
- status (enum)
- createdAt

Constraints:
- username unique
- status default = PENDING
- role required

Event
- id: Long
- organizer: User
- title: String
- eventType: String
- venue: String
- address: String
- city: String
- country: String
- latitude: Double
- longitude: Double
- startDatetime: LocalDateTime
- endDatetime: LocalDateTime
- capacity: Integer
- status: EventStatus
- description: String
- createdAt: LocalDateTime
- updatedAt: LocalDateTime

EventStatus
-DRAFT
-PUBLISHED
-CANCELLED
-COMPLETED

Event Entity Design

Fields:
- id (PK)
- organizer (FK → User)
- title (required)
- eventType (required)
- venue (required)
- address
- city (required)
- country (required)
- latitude
- longitude
- startDatetime (required)
- endDatetime (required)
- capacity (required)
- status (enum)
- description
- createdAt
- updatedAt

Constraints:
- capacity ≥ 0
- status controls booking behavior
- delete only if draft or no bookings

TicketType
- id: Long
- event: Event
- name: String
- price: Double
- quantity: Integer
- available: Integer

Constraints:
- sum(quantity) ≤ event.capacity
- booking cannot exceed available

Booking
- id: Long
- user: User
- event: Event
- ticketType: TicketType
- quantity: Integer
- totalPrice: Double
- status: BookingStatus
- createdAt: LocalDateTime

BookingStatus
- CONFIRMED
- CANCELLED

Rules:
- quantity ≤ available
- event must be PUBLISHED
- available decreases on booking
- available increases on cancel
- booking is never deleted, only cancelled

Message
- id: Long
- sender: User
- receiver: User
- event: Event
- subject: String
- body: String
- isRead: Boolean
- senderDeleted: Boolean
- receiverDeleted: Boolean
- createdAt: LocalDateTime

