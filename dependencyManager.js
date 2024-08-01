export default class DependencyManager {
  constructor() {
    this.dependencyGraph = new Map()
    this.inDegree = new Map()
  }

  addDependencies(ticket) {
    for (const dep of ticket.dependencies) {
      if (!this.dependencyGraph.has(dep)) {
        this.dependencyGraph.set(dep, [])
      }
      this.dependencyGraph.get(dep).push(ticket.id)
      this.inDegree.set(ticket.id, (this.inDegree.get(ticket.id) || 0) + 1)
    }
    if (!this.dependencyGraph.has(ticket.id)) {
      this.dependencyGraph.set(ticket.id, [])
    }
  }

  isTicketReady(ticketId) {
    return (this.inDegree.get(ticketId) || 0) === 0
  }

  markAsProcessed(ticketId) {
    this.inDegree.delete(ticketId)
  }

  getReadyTickets() {
    const readyTickets = []
    for (const [ticketId, degree] of this.inDegree.entries()) {
      if (degree === 0) {
        readyTickets.push(ticketId)
      }
    }
    return readyTickets
  }

  getDependentTickets(ticketId) {
    return this.dependencyGraph.get(ticketId) || []
  }

  showDependencyTree() {
    for (const [ticket, deps] of this.dependencyGraph.entries()) {
      console.log(`Ticket ${ticket} ${deps.length > 0 ? `-> ${deps.join(', ')}` : ''}`)
    }
    console.log('\n')
  }
}
