import { Building, IdleBuilding } from "./building.js"
import Cargo from "./cargo.js"
import { EQUIPMENT, IDLE_BUILDING } from "./constants.js"
import { defaultdict, generateLocation } from "./utils.js"

// Base Class
export default class Base {
  static fromJson(json) {
    const {
      buildings,
      researches,
      resources,
      attack,
      defense,
      ...baseData
    } = json
    const base = new Base()
    Object.assign(base, baseData)
    for (let [key, value] of Object.entries(resources)) {
      base.resources[key] = value
    }
    for (let [key, value] of Object.entries(attack)) {
      base.attack[key] = value
    }
    for (let [key, value] of Object.entries(defense)) {
      base.defense[key] = value
    }
    base.buildings = {}
    for (const [buildingType, b] of Object.entries(buildings)) {
      const { modifiers, materials, ...buildingData } = b
      const building = new IdleBuilding(...IDLE_BUILDING[buildingType])
      for (let [key, value] of Object.entries(modifiers)) {
        building.modifiers[key] = value
      }
      Object.assign(building, buildingData)
      if (building.buildStartTime) {
        building.buildStartTime = new Date(building.buildStartTime)
      }
      base.buildings[buildingType] = building
    }
    base.researches = {}
    // for (const [researchType, researchData] of Object.entries(researches)) {
    //   const research = new Research()
    //   Object.assign(research, researchData)
    //   base.researches[researchType] = research
    // }
    if (baseData.lastSync) {
      base.lastSync = new Date(baseData.lastSync)
    }
    return base
  }

  constructor(climate, name, region, protectionDuration = 0) {
    this.id = `${Math.floor(Date.now() / 1000)}`
    this.name = name
    this.region = region
    // convert protectionDuration from days to seconds
    this.protectionDuration = protectionDuration * 24 * 60 * 60
    this.climate = climate
    this.location = generateLocation()
    this.buildings = {}
    this.resources = defaultdict(0)
    this.researches = {}
    this.attack = defaultdict(0)
    this.sumAtk = 0
    this.defense = defaultdict(0)
    this.sumDef = 0
    this.lastSync = new Date()
  }

  craftEquipment(equipmentType) {
    const equipment = EQUIPMENT[equipmentType]
    if (equipment.canBeCrafted(this.researches, this.resources)) {
      for (let i = 0; i < equipment.requiredMaterials.length; i++) {
        this.resources[equipment.requiredMaterials[i]] -=
          equipment.requiredAmounts[i]
      }
      if (equipmentType === "weapon") {
        this.attack[equipment.id] += 1
        this.sumAtk += equipment.effectiveness
      } else if (equipmentType === "defense") {
        this.defense[equipment.id] += 1
        this.sumDef += equipment.effectiveness
      }
    }
  }

  canBeInvaded() {
    return this.protectionDuration >= 0
  }

  computeBattle(invaders) {
    return this.sumDef > 0
  }

  upgradeBuilding(building) {
    const buildingType = building.id
    if (!this.buildings[buildingType]) {
      this.buildings[buildingType] = building
    }
    this.buildings[buildingType].build(this)
  }

  update(deltaTime) {
    for (const [buildingType, building] of Object.entries(this.buildings)) {
      building.update(this, deltaTime)
    }
    this.protectionDuration = Math.max(
      this.protectionDuration,
      this.protectionDuration - deltaTime,
      0
    )
  }

  generateResources(deltaTime) {
    for (const building of this.buildings) {
      building.generate(base, deltaTime)
    }
  }

  transportResources(destinationBase, resources, transportationTime) {
    const risk = this.calculateResourceLossRisk()
    const cargo = new Cargo(resources, transportationTime, risk)
    // Implement resource transportation logic using the Cargo object
    // TODO: add the Cargo in the game state so we can track it between bases.
  }

  calculateResourceLossRisk() {
    // Calculate the risk of resource loss based on various factors
    // Return the calculated risk
  }
}
