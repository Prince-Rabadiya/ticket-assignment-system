export default class Ticket {
  constructor(id, requiredQualification, estimatedTime, dependencies = []) {
    this.id = id
    this.requiredQualification = requiredQualification
    this.estimatedTime = estimatedTime
    this.dependencies = dependencies
    this.assignee = null
    this.startDay = null
    this.endDay = null
  }
}
