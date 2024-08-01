export default class TicketRepository {
  constructor() {
    this.tickets = new Map()
  }

  addTicket(ticket) {
    this.tickets.set(ticket.id, ticket)
  }

  getTicket(ticketId) {
    return this.tickets.get(ticketId)
  }

  getAllTickets() {
    return this.tickets.values()
  }
}
