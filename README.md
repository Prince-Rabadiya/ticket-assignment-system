# ticket-assignment-system
An automated system to assign tickets to available developers

# Usage
Add tickets and developers in ticketManager.js file as shown in example and run `node ticketManager.js`.

## Example
`
const ticketSystem = new TicketAssignmentSystem()

// add tickets and developers
ticketSystem.addTicket(new Ticket(11, 'Python', 3, []))
ticketSystem.addTicket(new Ticket(22, 'Java', 3, [11])) // new Ticket(id, technology, estimatedDays, dependencies)

ticketSystem.addDeveloper(new Developer('A', ['Python', 'Java'], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])) // new Developer(id, techStack, availabilityForDays)
`
