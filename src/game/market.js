import { RESOURCE } from "./constants"
import { defaultdict, randomFloat } from "./utils"

// Market Class
export default class Market {
  static fromJson(json) {
    const this_ = new Market()
    if (
      json === undefined ||
      json === null ||
      Object.entries(json).length === 0
    ) {
      return this_
    }
    for (const [resourceType, v] of Object.entries(json.resourcePrice)) {
      this_.resourcePrice[resourceType] = v
    }
    return this_
  }

  constructor() {
    this.resourcePrice = defaultdict(0)
    // TODO: trigger this based on the weather
    this.updateResourcePrice()
  }

  updateResourcePrice(currentWeather) {
    for (const [resourceType, resource] of Object.entries(RESOURCE)) {
      this.resourcePrice[resourceType] = randomFloat(
        resource.range[0] / 100,
        resource.range[1] / 100
      )
    }
  }

  calculateResourcePrice(resourceType) {
    return this.resourcePrice[resourceType]
  }
}
