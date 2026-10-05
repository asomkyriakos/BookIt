# RElationships

Event
- organizer: ManyToOne -> User

TicketType
- event: ManyToOne -> Event

Booking
- user: ManyToOne -> User
- event: ManyToOne -> Event
- ticketType: ManyToOne -> TicketType

Message
- sender: ManyToOne -> User
- receiver: ManyToOne -> User
- event: ManyToOne -> Event
