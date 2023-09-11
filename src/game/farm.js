import Scaffold from "./scaffold"
import { defaultdict } from "./utils"

export default class Farm extends Scaffold {
  constructor(materials) {
    super(materials)
    this.animals = defaultdict(0)
  }

  addAnimal(animal, amount) {
    this.animals[animal.id] += amount
  }

  removeAnimal(animal, qty) {
    const quantityKilled = Math.max(
      0,
      Math.min(this.animals[animal.id] - qty, this.animals[animal.id])
    )
    if (quantityKilled > 0) {
      this.animals[animal.id] -= quantityKilled
      const resourcesGenerated = Object.entries(animal.onDeath())
      for (const [resourceKey, resourceAmount] of resourcesGenerated) {
        this.base.resources[resourceKey] += resourceAmount * quantityKilled
      }
    }
  }

  generate(base, deltaTime) {
    for (const [animalKey, amount] of Object.entries(this.animals)) {
      const animal = ANIMAL[animalKey]
      const resourcesGenerated = animal.generate(
        deltaTime,
        this.modifiers[animalKey]
      )
      for (const [resourceKey, resourceAmount] of resourcesGenerated) {
        base.resources[resourceKey] += resourceAmount * amount
      }
    }
  }
}

export class Animal {
  constructor(
    id,
    generateRate,
    resourcesConsumed,
    generatedResources,
    generatedOnDeath
  ) {
    this.id = id
    this.resourcesConsumed = Object.entries(resourcesConsumed)
    this.generatedResources = Object.entries(generatedResources)
    this.generateRate = generateRate
    this.generatedOnDeath = generatedOnDeath
  }

  consume(base) {
    if (this.consumedResources.length > 0) {
      // check if we have all the required resource to generate the new resource
      for (const [key, value] of this.consumedResources) {
        if (base.resources[key] < value) {
          return false
        }
      }
    }
    return true
  }

  generate(deltaTime, base, modifiers) {
    let actualGenerationRate = this.generationRate
    for (const modifier of Object.values(modifiers)) {
      actualGenerationRate *= modifier
    }

    const iteration = deltaTime / actualGenerationRate
    const generatedResources = defaultdict(0)
    while (iteration > 0 && this.consume(base)) {
      iteration--

      for (const [resourceKey, resourceAmount] of this.generatedResources) {
        generatedResources[resourceKey] += resourceAmount
      }
    }
    return generatedResources
  }
}
