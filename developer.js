export default class Developer {
  constructor(id, qualifications, dailyAvailability) {
    this.id = id
    this.qualifications = qualifications
    this.dailyAvailability = dailyAvailability
    this.schedule = new Map()
  }
}
