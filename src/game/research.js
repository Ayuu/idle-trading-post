export default class Research {
  constructor(id, modifiers) {
    this.id = id
    // object { resourceType: number }
    this.modifiers = modifiers
    this.complete = false
  }
}

export class ReserachBuilding {
  constructor() {
    this.researchDone = {}
  }
}
