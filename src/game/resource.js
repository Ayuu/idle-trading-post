export default class Resource {
  constructor(id, extras = {}) {
    const { climates = [], primaryBuyers = [] } = extras
    this.id = id
    // if anything below is specified, the resource will have a boost to its generation rate
    this.climates = climates
    this.primaryBuyers = primaryBuyers
  }

  addToBase(base, generatedAmount) {
    base.resources[this.id] += generatedAmount
  }
}
