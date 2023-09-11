// Equipment Class
class Equipment {
  constructor(id, type, effectiveness, requiredMaterials) {
    this.id = id
    this.type = type
    this.effectiveness = effectiveness
    this.requiredMaterials = requiredMaterials
  }

  hasRequiredMaterials(resources) {
    return Object.keys(this.requiredMaterials).every(
      (resource) => resources[resource] >= this.requiredMaterials[resource]
    )
  }

  hasBeenResearched(researchDone) {
    return researchDone.includes(this.id)
  }

  canBeCrafted(researchDone, resources) {
    return (
      this.hasRequiredMaterials(resources) &&
      this.hasBeenResearched(researchDone)
    )
  }

  addToBase(base, generatedAmount) {
    this.base[this.type][this.id] += generatedAmount
  }
}

export class Weapon extends Equipment {
  constructor(id, effectiveness, requiredMaterials) {
    super(id, "attack", effectiveness, requiredMaterials)
  }
}

export class Armor extends Equipment {
  constructor(id, effectiveness, requiredMaterials) {
    super(id, "defense", effectiveness, requiredMaterials)
  }
}

export class Shield extends Equipment {
  constructor(id, effectiveness, requiredMaterials) {
    super(id, "defense", effectiveness, requiredMaterials)
  }
}
