export default class DeveloperRepository {
  constructor() {
    this.developers = new Map()
  }

  addDeveloper(developer) {
    this.developers.set(developer.id, developer)
  }

  getDeveloper(developerId) {
    return this.developers.get(developerId)
  }

  getAllDevelopers() {
    return this.developers
  }
}
