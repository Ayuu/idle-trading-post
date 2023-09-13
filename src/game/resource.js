export default class Resource {
  constructor(id, name, range, extras = {}) {
    const { climates = [], primaryBuyers = [] } = extras
    this.id = id
    this.name = name
    this.range = range
    // if anything below is specified, the resource will have a boost to its generation rate
    this.climates = climates
    this.primaryBuyers = primaryBuyers
  }
}
