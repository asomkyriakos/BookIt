Booking Logic

Input:
- user
- eventId
- ticketTypeId
- quantity

Checks:
1. event exists
2. ticket type exists
3. ticket type belongs to event
4. event status is PUBLISHED
5. quantity > 0
6. quantity <= ticketType.available

Actions:
1. create booking
2. set totalPrice = quantity * price
3. set status = CONFIRMED
4. decrease ticketType.available
5. save booking

Capacity Logic

Constraint:
sum(ticket_type.quantity) <= event.capacity