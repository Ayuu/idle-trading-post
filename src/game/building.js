import Scaffold from "./scaffold"

export class IdleBuilding extends Scaffold {
  constructor(id, materials, timeToBuild, generatedItems, generationRate) {
    super(id, materials, timeToBuild)
    this.generationRate = generationRate
    this.generatedItems = Object.entries(generatedItems)
  }

  generateRate() {
    return this.generationRate / (this.modifiers["rate"] || 1)
  }

  willGenerate(addLevel = 0) {
    const resourceGenerated = {}
    for (const [key, amount] of this.generatedItems) {
      resourceGenerated[key] =
        Math.floor(amount * (this.modifiers[key] + 1)) * (this.level + addLevel)
    }
    return Object.entries(resourceGenerated)
  }

  update(base, deltaTime) {
    super.update(base, deltaTime)

    if (this.level === 0) {
      return
    }

    const rate = this.generateRate()
    let iteration = Math.floor(this.elapsedTime / rate)
    if (iteration <= 0) {
      return
    }
    this.elapsedTime = this.elapsedTime % rate
    this.willGenerate().forEach(([key, amount]) => {
      base.resources[key] +=
        (iteration > 1
          ? amount * 0.5 * (1 + this.modifiers["idleRate"])
          : amount) * iteration
    })
  }
}

export class Building extends Scaffold {
  constructor(id, materials, generatedItems, consumedResources = {}) {
    super(id, materials)
    this.generatedItems = Object.entries(generatedItems)
    this.consumedResources = Object.entries(consumedResources)
    if (this.consumedResources.length === 0) {
      throw new Error("Consumed resources cannot be empty.")
    }
  }

  computeMaxResource(base) {
    // return the maximum amount of resource that can be generated based on:
    // if base has enough resource
    let currentAmount = 0
    let newAmount = -1

    const baseResources = JSON.parse(JSON.stringify(base.resources))

    while (currentAmount !== newAmount) {
      currentAmount = newAmount
      for (const [key, amount] in this.consumedResources) {
        if (bbaseResources[key] < amount) {
          break
        }
        baseResources[key] -= amount
      }
      newAmount += 1
    }
    return currentAmount
  }

  create(base, amount) {
    const maxIteration = Math.min(amount, this.computeMaxResource(base))
    for (const [key, value] in this.consumedResources) {
      base.resources[key] -= value * maxIteration
    }
    for (const [key, amount] in this.generatedItems) {
      // get modifiers for this resource
      const modifier = 1 + this.modifiers[key]
      base.resources[key] +=
        Math.floor(amount * maxIteration * modifier) * this.level
    }
  }
}
