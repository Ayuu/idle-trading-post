import { defaultdict } from "./utils"

export default class Scaffold {
  constructor(id, materials, timeToBuild) {
    this.id = id
    if (!materials) {
      throw new Error("Materials cannot be empty.")
    }
    this.materials = materials
    this.level = 0
    this.modifiers = defaultdict(0)

    this.timeToBuild = timeToBuild
    this.buildStartTime = null

    this.elapsedTime = 0
  }

  updateModifier(modifierName, newModifier) {
    this.modifiers[modifierName] = newModifier
  }

  build(base) {
    if (!this.checkResourcesForNextLevel(base)) {
      return undefined
    }

    const materials = this.getResourcesNeededForNextLevel()
    for (const [resourceKey, resourceAmount] of materials) {
      base.resources[resourceKey] -= resourceAmount
    }
    this.buildStartTime = new Date()
    return this
  }

  getTimeRequiredToBuild() {
    if (this.level < this.materials.length) {
      return this.timeToBuild ** (this.level + 1)
    }
    return 0
  }

  getResourcesNeededForNextLevel() {
    if (this.level < this.materials.length) {
      return Object.entries(this.materials[this.level])
    }
    return []
  }

  checkResourcesForNextLevel(base) {
    const materials = this.materials[this.level]
    for (const [resource, amount] of Object.entries(materials)) {
      if (base.resources[resource] < amount) {
        return false
      }
    }
    return true
  }

  upgrade(base) {
    if (this.level < this.materials.length) {
      return this.build(base)
    }

    return false
  }

  update(base, deltaTime) {
    this.elapsedTime += deltaTime / 1000
    if (this.buildStartTime) {
      if (this.elapsedTime >= this.getTimeRequiredToBuild()) {
        this.buildStartTime = null
        this.level += 1
        this.elapsedTime = Math.max(
          this.elapsedTime - this.getTimeRequiredToBuild(),
          0
        )
      }
    }
  }

  create(base, amount) {}
}
