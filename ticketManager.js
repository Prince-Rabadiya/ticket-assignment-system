import TicketAssignmentSystem from './ticketAssignmentSystem.js'
import Ticket from './ticket.js'
import Developer from './developer.js'

// Usage
const ticketSystem = new TicketAssignmentSystem()

// add tickets and developers
ticketSystem.addTicket(new Ticket(11, 'Python', 3, []))
ticketSystem.addTicket(new Ticket(22, 'Java', 3, [11]))
ticketSystem.addTicket(new Ticket(33, 'Python', 2, [11]))
ticketSystem.addTicket(new Ticket(44, 'Java', 1, []))
ticketSystem.addTicket(new Ticket(55, 'Java', 1, [11, 44]))

ticketSystem.addDeveloper(new Developer('A', ['Python', 'Java'], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]))
ticketSystem.addDeveloper(new Developer('B', ['Python', 'Java'], [1, 2, 3, 4, 5, 6]))
ticketSystem.addDeveloper(new Developer('C', ['Java'], [1, 2, 3, 4, 5, 6]))

// display ticket dependency tree
ticketSystem.showDependencyTree()

// assign tickets
ticketSystem.assignTickets()

// display ticket timeline
const developers = ticketSystem.developerRepository.getAllDevelopers()
let day = 1
const devIDs = []
for (const developer of developers.values()) {
  devIDs.push(developer.id)
}

console.log('\n\nTicket timeline (X-axis: Developer ID, Y-axis: Days)')
console.log('-'.repeat(20))
console.log(`     ${devIDs.join('   ')}`)

const maxDays = ticketSystem.getMaxDays()
while (day <= maxDays) {
  const todaysSchedule = []
  for (const developer of developers.values()) {
    todaysSchedule.push(developer.schedule.get(day) || '--')
  }
  console.log(`${day}    ${todaysSchedule.join('  ')}`)
  day++
}

console.log(`\nUnassigned tickets: ${Array.from(ticketSystem.ticketRepository.getAllTickets()).filter(ticket => ticket.assignee === null).map(ticket => ticket.id).join(', ')}`)
