import TicketRepository from './ticketRepository.js'
import DeveloperRepository from './developerRepository.js'
import DependencyManager from './dependencyManager.js'

export default class TicketAssignmentSystem {
  constructor() {
    this.ticketRepository = new TicketRepository()
    this.developerRepository = new DeveloperRepository()
    this.dependencyManager = new DependencyManager()
    this.maxDays = null
  }

  addTicket(ticket) {
    this.ticketRepository.addTicket(ticket)
    this.dependencyManager.addDependencies(ticket)
  }

  addDeveloper(developer) {
    this.developerRepository.addDeveloper(developer)
  }

  showDependencyTree() {
    this.dependencyManager.showDependencyTree()
  }

  getMaxDays() {
    if (this.maxDays) return this.maxDays
    let maxDays = 0
    for (const developer of this.developerRepository.getAllDevelopers().values()) {
      maxDays = Math.max(maxDays, developer.dailyAvailability[developer.dailyAvailability.length - 1] || 0)
    }
    this.maxDays = maxDays
    return maxDays
  }

  assignTickets() {
    const availableDevelopers = Array.from(this.developerRepository.getAllDevelopers().values()).sort((a, b) => a.qualifications.length - b.qualifications.length)
    let readyTickets = Array.from(this.ticketRepository.getAllTickets()).filter(ticket => this.dependencyManager.isTicketReady(ticket.id)).map(ticket => ticket.id)
    
    let dayCounter = 1
    const maxDays = this.getMaxDays()
    
    let ticketsToBeProcessedOnNextIteration = readyTickets

    while ((ticketsToBeProcessedOnNextIteration.length > 0 || this.dependencyManager.inDegree.size > 0) && dayCounter <= maxDays) {
      readyTickets = ticketsToBeProcessedOnNextIteration
      ticketsToBeProcessedOnNextIteration = []

      while (readyTickets.length > 0) {
        readyTickets.sort((a, b) => this.ticketRepository.getTicket(b).estimatedTime - this.ticketRepository.getTicket(a).estimatedTime)
        const ticketId = readyTickets.shift()
        const ticket = this.ticketRepository.getTicket(ticketId)
        const ticketEstimatedRange = [...this.range(dayCounter, dayCounter + ticket.estimatedTime - 1)]

        for (const developer of availableDevelopers) {
          if (developer.qualifications.includes(ticket.requiredQualification) &&
            this.checkDeveloperAvailablity(developer.dailyAvailability, ticketEstimatedRange)) {
            for (const day of ticketEstimatedRange) {
              developer.schedule.set(day, ticket.id)
            }
            ticket.assignee = developer.id
            ticket.startDay = dayCounter
            ticket.endDay = dayCounter + ticket.estimatedTime - 1
            developer.dailyAvailability = developer.dailyAvailability.filter(element => !ticketEstimatedRange.includes(element))
            break
          }
        }

        if (ticket.assignee === null) {
          console.log(`Ticket ${ticketId} cannot be assigned for days ${ticketEstimatedRange}.${this.dependencyManager.getDependentTickets(ticket.id).length > 0 ? ` Other dependent tickets ${this.dependencyManager.getDependentTickets(ticket.id)} will not be assigned.` : ''}`)
          ticketsToBeProcessedOnNextIteration.push(ticket.id)
        } else {
          console.log(`Ticket ${ticketId} assigned to Developer ${ticket.assignee} for days ${ticketEstimatedRange}.`)
        }
      }

      for (const otherTicketId of this.dependencyManager.inDegree.keys()) {
        let isReady = true
        for (const parentTicketId of this.ticketRepository.getTicket(otherTicketId).dependencies) {
          const parentEndDay = this.ticketRepository.getTicket(parentTicketId).endDay
          if (!(parentEndDay && (parentEndDay <= dayCounter))) isReady = false
        }
        if (isReady) {
          this.dependencyManager.markAsProcessed(otherTicketId)
          ticketsToBeProcessedOnNextIteration.push(otherTicketId)
        }
      }
      dayCounter++
    }
  }

  *range(start, end, step = 1) {
    for (let i = start; i <= end; i += step) {
      yield i
    }
  }

  checkDeveloperAvailablity(arr, numbers) {
    const set = new Set(arr)
    return numbers.every(num => set.has(num))
  }
}